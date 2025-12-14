import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { SystemStatus, Signal, MarketContext } from '../types';
import { StatCard } from './StatCard';
import { SignalCard } from './SignalCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Play, Activity, Wallet, TrendingUp, RefreshCw, Cpu, ShieldCheck, AlertCircle, Loader2, Zap, TrendingDown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [signals, setSignals] = useState<Signal[]>([
    {
      ticker: "SBER",
      action: "BUY",
      reason: "Technical analysis shows strong momentum with RSI at 68 and volume spike detected",
      confidence: 0.82,
      impact_score: 8,
      ai_provider: 'gemini-2.5-flash',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      ticker: "GAZP",
      action: "SELL",
      reason: "MACD divergence suggests trend reversal, profit taking recommended",
      confidence: 0.76,
      impact_score: 7,
      ai_provider: 'technical',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      ticker: "LKOH",
      action: "BUY",
      reason: "Breakout above resistance level with increasing volume",
      confidence: 0.89,
      impact_score: 9,
      ai_provider: 'gemini-2.5-flash',
      timestamp: new Date(Date.now() - 10800000).toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    setError(null);
    
    try {
      const statusData = await api.getStatus();
      setStatus(statusData);
    } catch (err) {
      console.error("Dashboard update failed", err);
      setError("Demo mode: Using mock data");
      // Fallback mock data
      setStatus({
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
      });
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      // Auto-refresh with mock data updates
      setStatus(prev => prev ? {
        ...prev,
        virtual_portfolio_value: prev.virtual_portfolio_value + Math.random() * 1000 - 500,
        total_profit: prev.total_profit + Math.random() * 100 - 50
      } : prev);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const runAITradingCycle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock AI analysis - simulate thinking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get mock market data
      const marketData = await api.getMarketContext();
      
      // Generate mock signal based on market data
      const randomTicker = marketData[Math.floor(Math.random() * marketData.length)].ticker;
      const actions: Array<'BUY' | 'SELL' | 'HOLD'> = ['BUY', 'SELL', 'HOLD'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const aiProviders: Array<'gemini-2.5-flash' | 'technical'> = ['gemini-2.5-flash', 'technical'];
      const randomProvider = aiProviders[Math.floor(Math.random() * aiProviders.length)];
      
      const reasons = {
        BUY: [
          "Strong bullish momentum with RSI below 30 (oversold)",
          "Breakout above key resistance level with high volume",
          "MACD bullish crossover confirmed",
          "Institutional accumulation detected"
        ],
        SELL: [
          "RSI above 70 indicates overbought conditions",
          "Support level broken with increased selling pressure",
          "MACD bearish divergence detected",
          "Profit-taking after strong rally"
        ],
        HOLD: [
          "Market consolidation phase, waiting for clearer direction",
          "Mixed signals from technical indicators",
          "Low volatility suggests waiting for catalyst",
          "Position sizing optimal, no adjustment needed"
        ]
      };
      
      const newSignal: Signal = {
        ticker: randomTicker,
        action: randomAction,
        reason: reasons[randomAction][Math.floor(Math.random() * reasons[randomAction].length)],
        confidence: Math.random() * 0.3 + 0.65, // 0.65-0.95
        impact_score: Math.floor(Math.random() * 6) + 5, // 5-10
        ai_provider: randomProvider,
        timestamp: new Date().toISOString()
      };

      // Add new signal to list
      setSignals(prev => [newSignal, ...prev].slice(0, 10));
      
      // Mock trade execution
      await api.executeTrade(newSignal, marketData.find(m => m.ticker === randomTicker)?.price || 0);
      
      // Update portfolio with mock profit/loss
      const profitChange = randomAction === 'BUY' ? Math.random() * 5000 : 
                          randomAction === 'SELL' ? Math.random() * -3000 : 0;
      
      setStatus(prev => prev ? {
        ...prev,
        total_trades: prev.total_trades + 1,
        total_profit: prev.total_profit + profitChange,
        virtual_portfolio_value: prev.virtual_portfolio_value + profitChange,
        virtual_return_percentage: ((prev.virtual_portfolio_value + profitChange) / 1000000 - 1) * 100
      } : prev);

    } catch (e) {
      console.error("AI Trading Cycle Failed", e);
      setError("Demo mode: Mock analysis complete");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data Generator
  const generateChartData = () => {
    const baseValue = 1000000;
    const currentVal = status?.virtual_portfolio_value || baseValue;
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    
    let val = baseValue;
    for (let i = 0; i < 7; i++) {
      if (i === 6) {
        val = currentVal;
      } else {
        const progress = i / 6;
        const noise = (Math.random() - 0.5) * 20000;
        val = baseValue + (currentVal - baseValue) * progress + noise;
      }
      data.push({
        name: days[i],
        value: Math.round(val)
      });
    }
    return data;
  };

  const chartData = React.useMemo(() => generateChartData(), [status?.virtual_portfolio_value]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            NeuroTrader AI Dashboard
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Status: <span className="text-slate-200 font-mono">{status?.status || 'LOADING...'}</span>
            </p>
            <span className="text-xs bg-violet-500/20 px-2 py-0.5 rounded text-violet-300 border border-violet-500/30">
              DEMO MODE
            </span>
            {error && (
              <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded">
                <AlertCircle className="w-3 h-3" /> {error}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchData()}
            className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh Data"
            disabled={refreshing}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={runAITradingCycle}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              loading 
                ? 'bg-slate-700 text-slate-400 cursor-wait' 
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/30'
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
            {loading ? 'AI Analyzing...' : 'Analyze Market'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Portfolio Value" 
          value={`${(status?.virtual_portfolio_value || 0).toLocaleString('ru-RU')} ₽`} 
          subValue={`${(status?.virtual_return_percentage || 0) > 0 ? '+' : ''}${(status?.virtual_return_percentage || 0).toFixed(2)}%`}
          trend={status?.virtual_return_percentage && status.virtual_return_percentage >= 0 ? 'up' : 'down'}
          color={status?.virtual_return_percentage && status.virtual_return_percentage >= 0 ? 'emerald' : 'rose'}
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Profit" 
          value={`${(status?.total_profit || 0).toLocaleString('ru-RU')} ₽`}
          subValue={`${(status?.total_profit || 0) > 0 ? '+' : ''}${((status?.total_profit || 0) / 10000).toFixed(1)}%`}
          trend={status?.total_profit && status.total_profit >= 0 ? 'up' : 'down'}
          color="violet"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Trades" 
          value={status?.total_trades || 0}
          subValue={`Sessions: ${status?.trading_sessions || 0}`}
          icon={<Activity className="w-5 h-5" />}
        />
         <StatCard 
          label="AI Model" 
          value="Gemini 2.5 Flash"
          subValue="Hybrid Mode"
          color="default"
          icon={<Cpu className="w-5 h-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Portfolio Performance (Last 7 Days)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155', 
                      color: '#f1f5f9',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} ₽`, 'Value']}
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                    dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
              <span>Start: 1,000,000 ₽</span>
              <span className="text-emerald-400 font-medium">
                Current: {(status?.virtual_portfolio_value || 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-xl border border-slate-800">
               <h3 className="text-md font-semibold mb-4 text-slate-300 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-400" />
                 Risk Management
               </h3>
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 text-sm">Stop Loss</span>
                     <span className="text-rose-400 font-mono font-bold">1.5%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                     <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full w-[25%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 text-sm">Take Profit</span>
                     <span className="text-emerald-400 font-mono font-bold">6.0%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                     <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full w-[60%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-400 text-sm">Max Drawdown</span>
                     <span className="text-amber-400 font-mono font-bold">3.2%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                     <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-[32%]"></div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-slate-800">
               <h3 className="text-md font-semibold mb-4 text-slate-300 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-violet-400" />
                 Active Tickers
               </h3>
               <div className="flex flex-wrap gap-2">
                 {status?.tracked_tickers?.map(t => (
                   <span 
                     key={t} 
                     className={`px-3 py-1.5 rounded text-sm font-mono transition-all hover:scale-105 cursor-default ${
                       t === 'SBER' || t === 'LKOH' 
                         ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
                         : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500'
                     }`}
                   >
                     {t}
                   </span>
                 )) || (
                   <div className="w-full text-center py-4">
                     <div className="animate-pulse text-slate-500">Scanning market...</div>
                   </div>
                 )}
               </div>
               <div className="mt-4 pt-4 border-t border-slate-700/50">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Market Status:</span>
                   <span className="text-emerald-400 font-medium">ACTIVE</span>
                 </div>
                 <div className="flex justify-between text-sm mt-2">
                   <span className="text-slate-400">Last Scan:</span>
                   <span className="text-slate-300">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Live Signals Feed */}
        <div className="lg:col-span-1">
          <div className="glass-panel h-full rounded-xl border border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <h3 className="font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
                Live AI Signals
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-violet-500/20 px-2 py-1 rounded text-violet-300 border border-violet-500/30">
                  Gemini AI
                </span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">
                  {signals.length} signals
                </span>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 scrollbar-hide">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-violet-500/30 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-4 text-violet-300 font-medium">AI Processing Market Data</p>
                  <p className="text-sm text-slate-500 mt-1">Gemini analyzing indicators...</p>
                </div>
              ) : signals.length > 0 ? (
                <div className="space-y-3">
                  {signals.map((signal, idx) => (
                    <SignalCard key={idx} signal={signal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                  <Activity className="w-12 h-12 mb-3 opacity-20 animate-pulse" />
                  <p className="font-medium text-slate-400">Awaiting Market Signals</p>
                  <p className="text-xs mt-1 text-slate-600">Click "Analyze Market" to generate AI signals</p>
                  <button 
                    onClick={runAITradingCycle}
                    className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                  >
                    Generate Demo Signals
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Signal Frequency:</span>
                <span className="text-slate-300 font-mono">~15min</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-slate-400">Avg Confidence:</span>
                <span className="text-emerald-400 font-mono">78.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
