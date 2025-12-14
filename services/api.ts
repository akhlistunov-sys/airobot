import { SystemStatus, Signal, MarketContext } from '../types';

// In production, this would be your Render backend URL.
const API_BASE = 'http://localhost:10000'; // Or empty string if proxied

export const api = {
  /**
   * Fetches the current system status from /status
   */
  getStatus: async (): Promise<SystemStatus> => {
    try {
      const res = await fetch(`${API_BASE}/status`, { 
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn("Backend offline, returning offline state");
      return {
        status: "OFFLINE",
        uptime_seconds: 0,
        trading_sessions: 0,
        total_trades: 0,
        virtual_portfolio_value: 0,
        virtual_return_percentage: 0,
        total_profit: 0,
        last_trading_time: new Date().toISOString(),
        hybrid_mode: true,
        tracked_tickers: []
      };
    }
  },

  /**
   * Fetches technical market data for the AI to analyze
   */
  getMarketContext: async (): Promise<MarketContext[]> => {
    try {
      const res = await fetch(`${API_BASE}/market_context`);
      if (!res.ok) throw new Error('Failed to fetch market context');
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Executes a trade decision on the backend
   */
  executeTrade: async (signal: Signal, price: number): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/execute_trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: signal.ticker,
          action: signal.action,
          confidence: signal.confidence,
          price: price
        })
      });
      return await res.json();
    } catch (error) {
      console.error("Trade execution failed", error);
      return null;
    }
  },

  getTechnicalSignals: async (): Promise<any> => {
     // Deprecated in favor of live AI generation, keeping for interface compatibility if needed
     return { signals: [] };
  }
};
