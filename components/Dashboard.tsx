
import React, { useState } from 'react';

interface DashboardProps {
  onAnalyze: (content: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_DOCS = [
  { 
    title: "Project_Omega.srs", 
    desc: "Detailed specs for migrating a monolithic commerce engine to microservices.",
    content: "Our goal is to migrate from a legacy Magento instance to a React/Node microservices architecture. Key features: SSR with Next.js, Stripe integration, inventory sync with ERP, and high-availability multi-region hosting. Timeline target: 6 months."
  },
  { 
    title: "SupplyChain_AI.prop", 
    desc: "Proposal for integrating predictive demand forecasting using Python and TensorFlow.",
    content: "Integrating predictive forecasting for logistics. We need data pipelines from SAP, a training environment for models, and a dashboard for route optimization. Security and high performance are paramount."
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onAnalyze, isAnalyzing }) => {
  const [inputText, setInputText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAnalyze(inputText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        onAnalyze(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 relative">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
          AXIOM <span className="text-blue-500 animate-pulse">INTELLIGENCE</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-mono lowercase tracking-tighter">
          // multi-agent orchestration for enterprise workflow logic
        </p>
      </div>

      {/* Main Action Area */}
      <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest">Input_Buffer</label>
            <span className="text-[9px] text-slate-600 font-mono">CHAR_COUNT: {inputText.length}</span>
          </div>
          
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="[ READY FOR INPUT ]"
            className="w-full h-48 bg-slate-950/80 border border-slate-800 rounded-xl p-6 text-slate-300 font-mono text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all resize-none custom-scrollbar shadow-inner"
            disabled={isAnalyzing}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="relative group/file">
               <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileUpload}
                accept=".txt,.md"
                disabled={isAnalyzing}
              />
              <label 
                htmlFor="file-upload" 
                className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-blue-400 cursor-pointer transition-colors"
              >
                <span className="text-blue-500">>>></span> IMPORT_LOCAL_SOURCE
              </label>
            </div>

            <button 
              type="submit"
              disabled={isAnalyzing || !inputText.trim()}
              className={`px-12 py-4 rounded-xl font-black uppercase tracking-tighter text-sm flex items-center gap-3 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.1)] ${
                isAnalyzing || !inputText.trim() 
                ? 'bg-slate-900/50 text-slate-700 cursor-not-allowed border border-slate-800' 
                : 'bg-blue-600 hover:bg-blue-500 text-white border-t border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.3)]'
              }`}
            >
              {isAnalyzing ? "SYTEM_BOOT..." : "RUN_ORCHESTRATION"}
            </button>
          </div>
        </form>
      </div>

      {/* Blueprint Grid */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-[0.3em] text-center">Available_Blueprints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_DOCS.map((doc, idx) => (
            <button 
              key={idx}
              onClick={() => onAnalyze(doc.content)}
              disabled={isAnalyzing}
              className="group text-left p-6 bg-slate-900/40 border border-slate-800/40 rounded-xl hover:border-blue-600/30 hover:bg-blue-900/10 transition-all backdrop-blur-sm"
            >
              <h4 className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                {doc.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                {doc.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
