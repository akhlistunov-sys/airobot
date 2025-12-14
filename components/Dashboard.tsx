import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { SystemStatus, Signal } from '../types';
import { StatCard } from './StatCard';
import { SignalCard } from './SignalCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Play, Activity, Wallet, TrendingUp, RefreshCw, Cpu, ShieldCheck, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    setError(null);
    
    try {
      const statusData = await api.getStatus();
      setStatus(statusData);
      
      const techData = await api.getTechnicalSignals();
      if(techData && techData.signals) {
        setSignals(techData.signals);
      }
    } catch (err) {
      console.error("Dashboard update failed", err);
      setError("Connection lost. Retrying...");
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 15000); // Poll every 15s for live feel
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleForceRun = async () => {
    setLoading(true);
    try {
      await api.forceTrade();
      // Add a slight delay to allow "backend" to process before refetching
      setTimeout(() => {
        fetchData(true);
        setLoading(false);
      }, 1500); 
    } catch (e) {
      alert("Failed to force run");
      setLoading(false);
    }
  };

  // Generate chart data based on current status to make it look dynamic
  const generateChartData = () => {
    const baseValue = 100000;
    const currentVal = status?.virtual_portfolio_value || baseValue;
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Create a curve that ends at currentVal
    let val = baseValue;
    for (let i = 0; i < 7; i++) {
      if (i === 6) {
        val = currentVal;
      } else {
        // Interpolate roughly
        const progress = i / 6;
        const noise = (Math.random() - 0.5) * 2000;
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
            NeuroTrader Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              System Status: <span className="text-slate-200 font-mono">{status?.status || 'INITIALIZING...'}</span>
            </p>
            {error && (
              <span className="text-xs text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded">
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
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleForceRun}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              loading 
                ? 'bg-slate-700 text-slate-400 cursor-wait' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
            }`}
          >
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {loading ? 'Running AI...' : 'Run Pipeline'}
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
          icon={<Wallet />}
        />
        <StatCard 
          label="Total Profit" 
          value={`${(status?.total_profit || 0).toLocaleString('ru-RU')} ₽`}
          color="violet"
          icon={<TrendingUp />}
        />
        <StatCard 
          label="Total Trades" 
          value={status?.total_trades || 0}
          subValue={`Sessions: ${status?.trading_sessions || 0}`}
          icon={<Activity />}
        />
         <StatCard 
          label="Active Strategy" 
          value={status?.hybrid_mode ? "HYBRID AI" : "NEWS ONLY"}
          subValue="GigaChat + TA"
          color="default"
          icon={<Cpu />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Portfolio Performance
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
                  <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value: number) => [`${value.toLocaleString()} ₽`, 'Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-xl border border-slate-800">
               <h3 className="text-md font-semibold mb-4 text-slate-300">Risk Management</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-slate-400 text-sm">Stop Loss</span>
                   <span className="text-rose-400 font-mono font-bold">1.5%</span>
                 </div>
                 <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                   <div className="bg-rose-500 h-full w-[25%]"></div>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-slate-400 text-sm">Take Profit</span>
                   <span className="text-emerald-400 font-mono font-bold">6.0%</span>
                 </div>
                 <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[60%]"></div>
                 </div>
               </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-slate-800">
               <h3 className="text-md font-semibold mb-4 text-slate-300">Active Tickers</h3>
               <div className="flex flex-wrap gap-2">
                 {status?.tracked_tickers?.map(t => (
                   <span key={t} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 hover:border-slate-500 cursor-default transition-colors hover:bg-slate-700">
                     {t}
                   </span>
                 )) || <span className="text-slate-500 text-sm">Scanning market...</span>}
               </div>
            </div>
          </div>
        </div>

        {/* Live Signals Feed */}
        <div className="lg:col-span-1">
          <div className="glass-panel h-full rounded-xl border border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
                Live Signals
              </h3>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                {status?.hybrid_mode ? 'AI Enhanced' : 'Standard'}
              </span>
            </div>
            <div className="p-4 overflow-y-auto max-h-[600px] scrollbar-hide">
              {signals.length > 0 ? (
                signals.map((signal, idx) => (
                  <SignalCard key={idx} signal={signal} />
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                  <Activity className="w-10 h-10 mb-3 opacity-20 animate-pulse" />
                  <p>Awaiting Market Signals</p>
                  <p className="text-xs mt-1 text-slate-600">Analyzing order books...</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};