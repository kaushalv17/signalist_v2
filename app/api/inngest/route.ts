import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import {
  sendSignUpEmail,
  sendDailyNewsSummary,
  checkPriceAlerts,
} from '@/lib/inngest/functions';

// Inngest's serve() creates GET, POST, and PUT handlers.
// GET  — Inngest introspects the registered functions
// POST — Inngest delivers events to function handlers
// PUT  — Inngest syncs function definitions in production
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendSignUpEmail,
    sendDailyNewsSummary,
    checkPriceAlerts,     // ← new: real-time price alert checker
  ],
  // Signing key is read automatically from INNGEST_SIGNING_KEY env var
});
