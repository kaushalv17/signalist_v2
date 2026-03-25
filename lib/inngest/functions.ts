import { inngest } from './client';
import { connectToDatabase } from '@/database/mongoose';
import { getNews } from '@/lib/actions/finnhub.actions';
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions';
import { getAllUsersForNewsEmail } from '@/lib/actions/user.actions';

// ─────────────────────────────────────────────────────────────────────────────
// 1. WELCOME EMAIL — triggered when a new user registers
// ─────────────────────────────────────────────────────────────────────────────
export const sendSignUpEmail = inngest.createFunction(
  {
    id: 'send-sign-up-email',
    name: 'Send Welcome Email on Sign Up',
    retries: 3,
  },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    const { email, name, investmentGoals, riskTolerance, preferredIndustry } =
      event.data as {
        email: string;
        name: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
      };

    await step.run('log-new-user', async () => {
      // Replace with your email provider (Resend, SendGrid, etc.)
      console.log(`[Inngest] Welcome email queued for ${email} (${name})`);
      console.log(
        `  Preferences → Goals: ${investmentGoals}, Risk: ${riskTolerance}, Industry: ${preferredIndustry}`
      );
    });

    return { sent: true, email };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. DAILY NEWS DIGEST — cron every morning at 8 AM UTC
// ─────────────────────────────────────────────────────────────────────────────
export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: 'send-daily-news-summary',
    name: 'Send Daily Market News Summary',
    retries: 2,
    concurrency: { limit: 5 },
  },
  { cron: '0 8 * * *' },
  async ({ step }) => {
    const users = await step.run('fetch-all-users', () =>
      getAllUsersForNewsEmail()
    );

    for (const user of users) {
      await step.run(`send-digest-${user.id}`, async () => {
        const symbols = await getWatchlistSymbolsByEmail(user.email);
        const articles = await getNews(symbols.length > 0 ? symbols : undefined);

        if (articles.length === 0) {
          console.log(`[Inngest] No news for ${user.email} — skipping`);
          return;
        }

        // Replace with your email provider SDK call
        console.log(`[Inngest] Digest for ${user.email}:`);
        articles.forEach((a, i) =>
          console.log(`  ${i + 1}. ${a.headline} (${a.source})`)
        );
      });
    }

    return { processed: users.length };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. ALERT CHECKER — every 5 min during NYSE hours Mon–Fri
// ─────────────────────────────────────────────────────────────────────────────
export const checkPriceAlerts = inngest.createFunction(
  {
    id: 'check-price-alerts',
    name: 'Check Price Alerts',
    retries: 1,
    concurrency: { limit: 1 },
  },
  { cron: '*/5 14-21 * * 1-5' },
  async ({ step }) => {
    // Dynamic imports keep the module tree clean and avoid circular dependencies
    const { AlertModel } = await import('@/database/models/alert.model');
    const { getStockQuote } = await import('@/lib/actions/finnhub.actions');

    const alerts = await step.run('fetch-active-alerts', async () => {
      // FIX: connectToDatabase was used but never imported in the original version
      await connectToDatabase();
      return AlertModel.find({ isActive: true, triggered: false }).lean();
    });

    if (alerts.length === 0) return { checked: 0 };

    // Group by symbol — one quote call per symbol instead of one per alert
    const bySymbol = new Map<string, typeof alerts>();
    for (const alert of alerts) {
      const existing = bySymbol.get(alert.symbol) ?? [];
      existing.push(alert);
      bySymbol.set(alert.symbol, existing);
    }

    let triggered = 0;

    for (const [symbol, symbolAlerts] of bySymbol) {
      await step.run(`check-${symbol}`, async () => {
        const quote = await getStockQuote(symbol);
        if (!quote || quote.c <= 0) return;

        const currentPrice = quote.c;

        for (const alert of symbolAlerts) {
          const shouldTrigger =
            alert.condition === 'greater'
              ? currentPrice > alert.threshold
              : currentPrice < alert.threshold;

          if (shouldTrigger) {
            await AlertModel.updateOne(
              { _id: alert._id },
              { $set: { triggered: true, triggeredAt: new Date() } }
            );
            // Replace with Resend / Twilio / push notification
            console.log(
              `[Inngest] 🔔 Alert fired for ${alert.userId}: ${symbol} @ $${currentPrice} (threshold $${alert.threshold})`
            );
            triggered++;
          }
        }
      });
    }

    return { checked: alerts.length, triggered };
  }
);
