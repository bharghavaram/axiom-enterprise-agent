
import React from 'react';

interface WorkflowDiagramProps {
  mermaidCode: string;
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ mermaidCode }) => {
  const extractNodes = (code: string) => {
    const lines = code.split('\n');
    return lines.filter(l => l.includes('-->') || l.includes('->'));
  };

  const nodes = extractNodes(mermaidCode);

  return (
    <div className="w-full bg-slate-950/60 backdrop-blur-md rounded-xl border border-slate-800/60 p-8 shadow-2xl relative overflow-hidden group">
      {/* Circuit line effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-colors"></div>
      
      <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <h3 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">Architecture_Map</h3>
        </div>
        <div className="font-mono text-[9px] text-slate-600 tracking-tighter">RENDER_MODE: VECTOR_SVG</div>
      </div>
      
      <div className="relative min-h-[300px] flex flex-col items-center gap-4 py-4">
        {nodes.length > 0 ? (
          nodes.map((n, i) => {
            const parts = n.split(/-->|->/);
            const from = parts[0].trim().replace(/\[|\]/g, '');
            const to = parts[1].trim().replace(/\[|\]/g, '');
            
            return (
              <React.Fragment key={i}>
                <div className="relative flex flex-col items-center">
                  <div className="px-8 py-3 rounded-md bg-slate-900/80 border border-slate-800 text-slate-200 text-[11px] font-mono font-bold uppercase tracking-widest shadow-lg hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-default z-10 min-w-[200px] text-center">
                    {from}
                  </div>
                  {i < nodes.length - 1 && (
                    <div className="flex flex-col items-center my-4">
                      <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
                      <div className="w-2 h-2 rounded-full border border-blue-500 -mt-1 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  )}
                </div>
                {i === nodes.length - 1 && (
                   <div className="flex flex-col items-center mt-4">
                      <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
                      <div className="w-2 h-2 rounded-full border border-blue-500 -mt-1 animate-ping"></div>
                       <div className="mt-4 px-8 py-3 rounded-md bg-blue-900/20 border border-blue-500/40 text-blue-400 text-[11px] font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                        {to}
                      </div>
                    </div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div className="text-slate-600 font-mono text-xs py-12 animate-pulse">[ COMPILING_ARCH_FLOW... ]</div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800/50">
        <details className="cursor-pointer group/details">
          <summary className="text-[9px] font-mono text-slate-600 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-2">
            <span className="text-blue-500 group-open/details:rotate-90 transition-transform">▸</span>
            View_Source_Logic
          </summary>
          <pre className="mt-4 p-4 bg-black/80 rounded border border-slate-800 text-[10px] text-emerald-500 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            {mermaidCode}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
