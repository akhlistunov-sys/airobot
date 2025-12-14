import React from 'react';
import { Signal } from '../types';
import { ArrowUpRight, ArrowDownRight, Activity, Zap, Newspaper } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const isBuy = signal.action === 'BUY';
  const isSell = signal.action === 'SELL';
  
  const borderColor = isBuy ? 'border-emerald-500/30' : isSell ? 'border-rose-500/30' : 'border-slate-700';
  const bgColor = isBuy ? 'bg-emerald-500/5' : isSell ? 'bg-rose-500/5' : 'bg-slate-800/50';
  const textColor = isBuy ? 'text-emerald-400' : isSell ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4 mb-3 transition-all hover:scale-[1.01]`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${isBuy ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
            {isBuy ? <ArrowUpRight className="w-5 h-5 text-emerald-400" /> : <ArrowDownRight className="w-5 h-5 text-rose-400" />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{signal.ticker}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBuy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {signal.action}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs text-slate-500 font-mono">{new Date(signal.timestamp).toLocaleTimeString()}</span>
           <div className="flex items-center gap-1 mt-1">
             {signal.ai_provider === 'technical' ? <Activity className="w-3 h-3 text-violet-400" /> : <Newspaper className="w-3 h-3 text-blue-400" />}
             <span className="text-[10px] uppercase text-slate-400">{signal.ai_provider}</span>
           </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 mb-3 line-clamp-2">
        {signal.reason}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Confidence</span>
            <span className="text-sm font-mono text-slate-200">{(signal.confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Impact</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-sm font-mono text-slate-200">{signal.impact_score}/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};