import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'emerald' | 'rose' | 'violet';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon, 
  trend,
  color = 'default' 
}) => {
  const colorClasses = {
    default: 'border-slate-800 bg-slate-900/50 text-slate-100',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    rose: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
    violet: 'border-violet-500/20 bg-violet-500/5 text-violet-400',
  };

  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className={`glass-panel rounded-xl p-5 border ${colorClasses[color]} relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/10`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        {icon && <span className={`text-xl opacity-80 ${color === 'default' ? 'text-slate-500' : ''}`}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {subValue && (
          <span className={`text-xs font-medium ${trend ? trendColor : 'text-slate-500'}`}>
            {subValue}
          </span>
        )}
      </div>
      {color !== 'default' && (
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-20 bg-${color}-500 pointer-events-none`}></div>
      )}
    </div>
  );
};