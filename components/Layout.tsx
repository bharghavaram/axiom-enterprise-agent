
import React from 'react';
import { AppView } from '../types';
import MatrixBackground from './MatrixBackground';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-300 relative overflow-hidden">
      {/* Background Layer */}
      <MatrixBackground />
      
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 flex flex-col bg-[#0b0f1a]/80 backdrop-blur-xl z-20 hidden md:flex">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse">
            A
          </div>
          <span className="text-xl font-bold tracking-widest text-white">AXIOM</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => onViewChange('DASHBOARD')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeView === 'DASHBOARD' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'hover:bg-slate-800/50 hover:translate-x-1'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Dashboard
          </button>
          
          <button 
            onClick={() => onViewChange('HISTORY')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeView === 'HISTORY' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'hover:bg-slate-800/50 hover:translate-x-1'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            History
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800/50 space-y-3">
           <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter px-4">System Nodes</div>
           <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-md flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <span className="text-emerald-500/80 text-[10px] font-mono">ENCRYPTED_LINK_ACTIVE</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-20">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#0b0f1a]/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">Kernel</span>
            <span className="text-slate-800">/</span>
            <span className="text-blue-400 font-mono text-xs tracking-tighter">
              {activeView === 'DASHBOARD' ? 'ORCHESTRATOR.SYS' : activeView === 'ANALYSIS' ? 'LIVE_STREAM.OUT' : 'ARCHIVE.LOG'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500">
               USR_ID: 0x821...FF
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800 shadow-[0_0_10px_rgba(37,99,235,0.3)]">
              JD
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
