export interface Trade {
  timestamp: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  ticker: string;
  price: number;
  size: number;
  profit?: number;
  reason?: string;
  ai_provider?: string;
  strategy?: string;
}

export interface MarketContext {
  ticker: string;
  price: number;
  indicators: {
    rsi: number;
    macd: number;
    volume_spike: boolean;
    trend: string;
  };
}

export interface Signal {
  action: 'BUY' | 'SELL' | 'HOLD';
  ticker: string;
  reason: string;
  confidence: number;
  impact_score: number;
  event_type?: string;
  ai_provider: string; // 'gemini-2.5-flash' | 'gigachat' | 'technical'
  timestamp: string;
}

export interface PortfolioStats {
  total_value: number;
  total_profit: number;
  total_return_pct: number;
  daily_profit: number;
  total_trades: number;
  positions: Position[];
  chart_labels: string[];
  chart_values: number[];
}

export interface Position {
  ticker: string;
  action: string;
  size: number;
  avg_price: number;
  current_pnl: number;
  portfolio_share: number;
}

export interface SystemStatus {
  status: string;
  uptime_seconds: number;
  trading_sessions: number;
  total_trades: number;
  virtual_portfolio_value: number;
  virtual_return_percentage: number;
  total_profit: number;
  last_trading_time: string;
  hybrid_mode: boolean;
  tracked_tickers: string[];
}

export enum Tab {
  DASHBOARD = 'dashboard',
  TRADES = 'trades',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings'
}
