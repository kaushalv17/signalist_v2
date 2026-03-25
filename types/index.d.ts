// =============================================================
// SIGNALIST — Global TypeScript Declarations
// =============================================================

// ─── Auth & User ─────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

// ─── Stocks & Finnhub ────────────────────────────────────────
interface FinnhubSearchResult {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

interface FinnhubSearchResponse {
  count: number;
  result: FinnhubSearchResult[];
}

interface StockWithWatchlistStatus {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
}

interface StockQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // prev close
  t: number;   // timestamp
}

interface StockProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

// ─── News ────────────────────────────────────────────────────
interface RawNewsArticle {
  id: number;
  headline?: string;
  summary?: string;
  source?: string;
  url?: string;
  datetime?: number;
  image?: string;
  category?: string;
  related?: string;
}

interface MarketNewsArticle {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  image: string;
  category: string;
  related: string;
}

// ─── Watchlist ───────────────────────────────────────────────
interface WatchlistEntry {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: string;
}

interface WatchlistWithQuote extends WatchlistEntry {
  price?: number;
  change?: number;
  changePercent?: number;
  marketCap?: number;
  peRatio?: number;
}

// ─── Alerts ──────────────────────────────────────────────────
interface Alert {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  alertType: 'upper' | 'lower';
  condition: 'greater' | 'less';
  threshold: number;
  triggered: boolean;
  isActive: boolean;
  createdAt: string;
}

interface CreateAlertPayload {
  symbol: string;
  company: string;
  alertType: 'upper' | 'lower';
  condition: 'greater' | 'less';
  threshold: number;
}

// ─── Shared component prop interfaces ────────────────────────
// Note: form components (InputField, SelectField) use full generics
// over FieldValues — see their own files for the typed props.

interface FooterLinkProps {
  text: string;
  linkText: string;
  href: string;
}

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  showTrashIcon?: boolean;
  type?: 'button' | 'icon';
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

interface SearchCommandProps {
  renderAs?: 'button' | 'text';
  label?: string;
  initialStocks: StockWithWatchlistStatus[];
}

// ─── Page Props ──────────────────────────────────────────────
interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

// ─── Server Action Results ───────────────────────────────────
interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
