import { SystemStatus, Signal } from '../types';

// In production, this would be your Render backend URL.
// For now, it defaults to relative path (proxy) or empty.
const API_BASE = ''; 

// --- Simulation State for Demo Mode ---
// This ensures the numbers change realistically if the backend is offline
let mockState = {
  portfolioValue: 100000,
  startValue: 100000,
  trades: 14,
  startTime: Date.now() - 3600 * 4 * 1000 // 4 hours ago
};

// Helper to vary numbers slightly for "live" feel
const vary = (val: number, pct: number) => {
  const change = val * (Math.random() * pct * 2 - pct);
  return val + change;
};

export const api = {
  /**
   * Fetches the current system status from /status
   * Falls back to simulation if backend is unreachable
   */
  getStatus: async (): Promise<SystemStatus> => {
    try {
      const res = await fetch(`${API_BASE}/status`, { 
        headers: { 'Accept': 'application/json' }
      });
      
      // Check for HTML response (common 404/500 issue)
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        throw new Error("Received non-JSON response from server");
      }

      if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn("Backend offline or unreachable, using Simulation Mode:", error);
      
      // Update simulation state
      mockState.portfolioValue = vary(mockState.portfolioValue, 0.0015); // 0.15% fluctuation
      const totalProfit = mockState.portfolioValue - mockState.startValue;
      const returnPct = (totalProfit / mockState.startValue) * 100;

      return {
        status: "SIMULATION MODE",
        uptime_seconds: Math.floor((Date.now() - mockState.startTime) / 1000),
        trading_sessions: Math.floor((Date.now() - mockState.startTime) / (1000 * 60 * 30)),
        total_trades: mockState.trades,
        virtual_portfolio_value: mockState.portfolioValue,
        virtual_return_percentage: returnPct,
        total_profit: totalProfit,
        last_trading_time: new Date().toISOString(),
        hybrid_mode: true,
        tracked_tickers: ["SBER", "GAZP", "LKOH", "YNDX", "ROSN", "NVTK"]
      };
    }
  },

  /**
   * Triggers a forced trading session via /force
   */
  forceTrade: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/force`, { method: 'POST' });
      if (!res.ok) throw new Error('Force trade failed');
      return await res.json();
    } catch (error) {
      console.warn("Force trade simulation");
      mockState.trades += 1;
      // Simulate a small impact on portfolio from the "trade"
      mockState.portfolioValue = vary(mockState.portfolioValue, 0.005);
      
      return { 
        status: "success", 
        message: "Simulation: Trade logic executed successfully",
        details: "Analyzed 6 tickers, generated 1 signal" 
      };
    }
  },

  /**
   * Fetches technical analysis signals via /test_technical
   */
  getTechnicalSignals: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/test_technical`);
      if (!res.ok) throw new Error('Signals fetch failed');
      const data = await res.json();
      return data;
    } catch (error) {
      // Return realistic mock signals
      const tickers = ['SBER', 'LKOH', 'VTBR', 'YNDX'];
      const actions = ['BUY', 'SELL', 'HOLD'] as const;
      const providers = ['technical', 'gigachat', 'hybrid'];
      
      const mockSignals: Signal[] = Array.from({ length: 3 }).map((_, i) => ({
        ticker: tickers[Math.floor(Math.random() * tickers.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        reason: "Simulated signal based on RSI and MACD convergence analysis.",
        confidence: 0.65 + Math.random() * 0.3,
        impact_score: Math.floor(Math.random() * 8) + 2,
        ai_provider: providers[Math.floor(Math.random() * providers.length)],
        timestamp: new Date(Date.now() - i * 1000 * 60 * 15).toISOString()
      }));

      return { signals: mockSignals };
    }
  },

  /**
   * Fetches detailed stats via /stats
   */
  getStats: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error('Stats fetch failed');
      return await res.json();
    } catch (error) {
      return null;
    }
  }
};