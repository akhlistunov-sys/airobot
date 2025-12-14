import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LayoutDashboard, History, Settings, PieChart, Menu, X } from 'lucide-react';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold">Module Under Construction</h2>
            <p>This feature will be available in NeuroTrader v2.1</p>
          </div>
        );
    }
  };

  const NavItem = ({ tab, icon, label }: { tab: Tab; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-indigo-300 border border-indigo-500/30' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-950 flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">N</div>
            <span className="text-lg font-bold text-slate-100">NeuroTrader</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400">
            <X />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem tab={Tab.DASHBOARD} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem tab={Tab.TRADES} icon={<History size={20} />} label="Trade History" />
          <NavItem tab={Tab.ANALYTICS} icon={<PieChart size={20} />} label="Analytics" />
          <NavItem tab={Tab.SETTINGS} icon={<Settings size={20} />} label="Settings" />
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">Engine Status</p>
              <p className="text-sm font-bold text-emerald-400">OPERATIONAL</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <header className="md:hidden p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
          <span className="font-bold text-slate-200">NeuroTrader</span>
          <button onClick={() => setMobileMenuOpen(true)} className="text-slate-300">
            <Menu />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default App;
