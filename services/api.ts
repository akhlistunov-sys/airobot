import { SystemStatus, Signal, MarketContext } from './types'

// Mock данные для демонстрации (без бэкенда)
export const api = {
  getStatus: async (): Promise<SystemStatus> => {
    // Возвращаем mock данные
    return {
      status: "ONLINE",
      uptime_seconds: 86400,
      trading_sessions: 42,
      total_trades: 1560,
      virtual_portfolio_value: 1250000,
      virtual_return_percentage: 8.5,
      total_profit: 156000,
      last_trading_time: new Date().toISOString(),
      hybrid_mode: true,
      tracked_tickers: ["SBER", "GAZP", "LKOH", "YNDX", "VTBR", "ROSN", "MGNT"]
    }
  },

  getMarketContext: async (): Promise<MarketContext[]> => {
    return [
      {
        ticker: "SBER",
        price: 280.5,
        indicators: {
          rsi: 65.3,
          macd: 1.2,
          volume_spike: true,
          trend: "up"
        }
      },
      {
        ticker: "GAZP",
        price: 165.8,
        indicators: {
          rsi: 42.1,
          macd: -0.3,
          volume_spike: false,
          trend: "sideways"
        }
      },
      {
        ticker: "LKOH",
        price: 7250.0,
        indicators: {
          rsi: 72.8,
          macd: 2.1,
          volume_spike: true,
          trend: "up"
        }
      }
    ]
  },

  executeTrade: async (signal: Signal, price: number): Promise<any> => {
    console.log("Mock trade execution:", signal, price)
    return { success: true, message: "Trade simulated" }
  },

  getTechnicalSignals: async (): Promise<any> => {
    return { signals: [] }
  }
}
