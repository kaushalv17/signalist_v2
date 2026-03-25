// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { href: '/',          label: 'Dashboard' },
  { href: '/search',    label: 'Search' },      // Opens SearchCommand modal
  { href: '/watchlist', label: 'Watchlist' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sign-up form options
// ─────────────────────────────────────────────────────────────────────────────
export const INVESTMENT_GOALS: { value: string; label: string }[] = [
  { value: 'Growth',       label: 'Growth'       },
  { value: 'Income',       label: 'Income'        },
  { value: 'Balanced',     label: 'Balanced'      },
  { value: 'Conservative', label: 'Conservative'  },
];

export const RISK_TOLERANCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Low',    label: 'Low'    },
  { value: 'Medium', label: 'Medium' },
  { value: 'High',   label: 'High'   },
];

export const PREFERRED_INDUSTRIES: { value: string; label: string }[] = [
  { value: 'Technology',     label: 'Technology'     },
  { value: 'Healthcare',     label: 'Healthcare'     },
  { value: 'Finance',        label: 'Finance'        },
  { value: 'Energy',         label: 'Energy'         },
  { value: 'Consumer Goods', label: 'Consumer Goods' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Alert form options
// ─────────────────────────────────────────────────────────────────────────────
export const ALERT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'upper', label: 'Upper (price rises above)' },
  { value: 'lower', label: 'Lower (price falls below)' },
];

export const CONDITION_OPTIONS: { value: string; label: string }[] = [
  { value: 'greater', label: 'Greater than (>)' },
  { value: 'less',    label: 'Less than (<)'    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Popular symbols used for default search results
// ─────────────────────────────────────────────────────────────────────────────
export const POPULAR_STOCK_SYMBOLS = [
  // Mega-cap tech
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'ORCL', 'CRM',
  // Growth tech
  'ADBE', 'INTC', 'AMD', 'PYPL', 'UBER', 'SPOT', 'SQ', 'SHOP', 'ROKU',
  // Cloud & SaaS
  'SNOW', 'PLTR', 'DDOG', 'CRWD', 'NET', 'OKTA', 'TWLO', 'ZM',
  // Consumer / delivery
  'DASH', 'ABNB', 'PINS', 'SNAP',
  // International
  'BABA', 'JD', 'PDD', 'SE', 'GRAB',
];

// ─────────────────────────────────────────────────────────────────────────────
// Watchlist table headers
// ─────────────────────────────────────────────────────────────────────────────
export const WATCHLIST_TABLE_HEADER = [
  'Company', 'Symbol', 'Price', 'Change', 'Market Cap', 'P/E Ratio', 'Alert', 'Action',
];

// ─────────────────────────────────────────────────────────────────────────────
// TradingView widget configs
// FIX: isTransparent must be boolean true, not the string 'true'
// ─────────────────────────────────────────────────────────────────────────────
const TV_SCRIPT = 'https://s3.tradingview.com/external-embedding/embed-widget-';
export const TRADINGVIEW_SCRIPT_BASE = TV_SCRIPT;

export const MARKET_OVERVIEW_WIDGET_CONFIG = {
  colorTheme:                        'dark',
  dateRange:                         '12M',
  locale:                            'en',
  isTransparent:                     true,          // ← was string 'true' in original
  showFloatingTooltip:               true,
  plotLineColorGrowing:              '#0FEDBE',
  plotLineColorFalling:              '#FF495B',
  gridLineColor:                     'rgba(0,0,0,0)',
  scaleFontColor:                    '#9095A1',
  belowLineFillColorGrowing:         'rgba(15,237,190,0.08)',
  belowLineFillColorFalling:         'rgba(255,73,91,0.08)',
  belowLineFillColorGrowingBottom:   'rgba(15,237,190,0)',
  belowLineFillColorFallingBottom:   'rgba(255,73,91,0)',
  symbolActiveColor:                 'rgba(15,237,190,0.05)',
  backgroundColor:                   '#141414',
  width:                             '100%',
  height:                            600,
  showSymbolLogo:                    true,
  showChart:                         true,
  tabs: [
    {
      title: 'Financial',
      symbols: [
        { s: 'NYSE:JPM',  d: 'JPMorgan Chase'       },
        { s: 'NYSE:WFC',  d: 'Wells Fargo'           },
        { s: 'NYSE:BAC',  d: 'Bank of America'       },
        { s: 'NYSE:C',    d: 'Citigroup'             },
        { s: 'NYSE:MA',   d: 'Mastercard'            },
        { s: 'NYSE:V',    d: 'Visa'                  },
      ],
    },
    {
      title: 'Technology',
      symbols: [
        { s: 'NASDAQ:AAPL',  d: 'Apple'     },
        { s: 'NASDAQ:MSFT',  d: 'Microsoft' },
        { s: 'NASDAQ:GOOGL', d: 'Alphabet'  },
        { s: 'NASDAQ:NVDA',  d: 'NVIDIA'    },
        { s: 'NASDAQ:META',  d: 'Meta'      },
        { s: 'NASDAQ:AMZN',  d: 'Amazon'    },
      ],
    },
    {
      title: 'Services',
      symbols: [
        { s: 'NASDAQ:NFLX', d: 'Netflix'   },
        { s: 'NYSE:UBER',   d: 'Uber'      },
        { s: 'NASDAQ:ABNB', d: 'Airbnb'    },
        { s: 'NYSE:WMT',    d: 'Walmart'   },
        { s: 'NASDAQ:AMZN', d: 'Amazon'    },
      ],
    },
  ],
};

export const HEATMAP_WIDGET_CONFIG = {
  dataSource:       'SPX500',
  blockSize:        'market_cap_basic',
  blockColor:       'change',
  grouping:         'sector',
  isTransparent:    true,
  locale:           'en',
  colorTheme:       'dark',
  isZoomEnabled:    true,
  hasSymbolTooltip: true,
  hasTopBar:        false,
  isMonoSize:       false,
  width:            '100%',
  height:           600,
};

export const TOP_STORIES_WIDGET_CONFIG = {
  displayMode:   'regular',
  feedMode:      'market',
  colorTheme:    'dark',
  isTransparent: true,
  locale:        'en',
  market:        'stock',
  width:         '100%',
  height:        600,
};

export const MARKET_DATA_WIDGET_CONFIG = {
  title:         'Stocks',
  width:         '100%',
  height:        600,
  locale:        'en',
  showSymbolLogo: true,
  colorTheme:    'dark',
  isTransparent: false,
  backgroundColor: '#141414',
  symbolsGroups: [
    {
      name: 'Technology',
      symbols: [
        { name: 'NASDAQ:AAPL',  displayName: 'Apple'     },
        { name: 'NASDAQ:MSFT',  displayName: 'Microsoft' },
        { name: 'NASDAQ:GOOGL', displayName: 'Alphabet'  },
        { name: 'NASDAQ:NVDA',  displayName: 'NVIDIA'    },
        { name: 'NASDAQ:META',  displayName: 'Meta'      },
        { name: 'NASDAQ:AMZN',  displayName: 'Amazon'    },
      ],
    },
    {
      name: 'Financial',
      symbols: [
        { name: 'NYSE:JPM', displayName: 'JPMorgan'    },
        { name: 'NYSE:BAC', displayName: 'Bank of America' },
        { name: 'NYSE:MA',  displayName: 'Mastercard'  },
        { name: 'NYSE:V',   displayName: 'Visa'        },
      ],
    },
  ],
};

// Per-symbol widget config factories
export const SYMBOL_INFO_WIDGET_CONFIG = (symbol: string) => ({
  symbol:        symbol.toUpperCase(),
  colorTheme:    'dark',
  isTransparent: true,
  locale:        'en',
  width:         '100%',
  height:        170,
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string) => ({
  symbol:             symbol.toUpperCase(),
  theme:              'dark',
  style:              1,
  interval:           'D',
  locale:             'en',
  backgroundColor:    '#141414',
  gridColor:          '#212328',
  allow_symbol_change: false,
  hide_side_toolbar:  true,
  hide_top_toolbar:   false,
  save_image:         false,
  withdateranges:     false,
  width:              '100%',
  height:             600,
});

export const BASELINE_WIDGET_CONFIG = (symbol: string) => ({
  symbol:             symbol.toUpperCase(),
  theme:              'dark',
  style:              10,
  interval:           'D',
  locale:             'en',
  backgroundColor:    '#141414',
  gridColor:          '#212328',
  allow_symbol_change: false,
  hide_side_toolbar:  true,
  save_image:         false,
  withdateranges:     false,
  width:              '100%',
  height:             600,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (symbol: string) => ({
  symbol:        symbol.toUpperCase(),
  colorTheme:    'dark',
  isTransparent: true,          // ← fixed: boolean not string
  locale:        'en',
  interval:      '1h',
  width:         '100%',
  height:        400,
});

export const COMPANY_PROFILE_WIDGET_CONFIG = (symbol: string) => ({
  symbol:        symbol.toUpperCase(),
  colorTheme:    'dark',
  isTransparent: true,
  locale:        'en',
  width:         '100%',
  height:        440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (symbol: string) => ({
  symbol:        symbol.toUpperCase(),
  colorTheme:    'dark',
  isTransparent: true,
  locale:        'en',
  displayMode:   'regular',
  width:         '100%',
  height:        464,
});
