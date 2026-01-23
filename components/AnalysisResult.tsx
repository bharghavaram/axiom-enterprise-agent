
import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType, Comment, UserPresence } from '../types';
import WorkflowDiagram from './WorkflowDiagram';
import CollaborationPanel from './CollaborationPanel';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
  comments: Comment[];
  onAddComment: (text: string, targetId: string) => void;
  presence: UserPresence[];
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  result, 
  onReset, 
  comments, 
  onAddComment,
  presence 
}) => {
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState('global');

  const openThread = (id: string) => {
    setActiveThreadId(id);
    setIsCollabOpen(true);
  };

  const getCommentCount = (id: string) => comments.filter(c => c.targetId === id).length;

  return (
    <div className="relative">
      <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 transition-all ${isCollabOpen ? 'mr-80' : ''}`}>
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-500 text-sm font-semibold uppercase tracking-widest mb-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               Analysis Complete
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">{result.projectName}</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">{result.summary}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openThread('global')}
              className="px-6 py-2.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-lg font-medium border border-blue-500/20 transition-all flex items-center gap-2"
            >
              <div className="relative">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                {comments.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
              </div>
              Discussion
            </button>
            <button 
              onClick={onReset}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700 transition-all"
            >
              New Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <div className="relative">
               <WorkflowDiagram mermaidCode={result.workflowMermaid} />
               <button 
                 onClick={() => openThread('workflow')}
                 className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-800"
                 title="Comment on flow"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
               </button>
            </div>

            {/* Requirements Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Requirement Catalog</h2>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded uppercase">BA Agent Output</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.requirements.map((req) => (
                      <tr key={req.id} className="hover:bg-white/5 transition-colors group/row">
                        <td className="px-6 py-4 font-mono text-blue-400">{req.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-200">{req.title}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{req.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            req.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            req.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <button 
                            onClick={() => openThread(req.id)}
                            className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all flex items-center gap-2"
                           >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                            {getCommentCount(req.id) > 0 && <span className="text-[10px] font-bold">{getCommentCount(req.id)}</span>}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-white mb-6">WBS & Tasks</h2>
              <div className="space-y-4">
                {result.tasks.map((task, idx) => (
                  <div key={task.id} className="relative pl-8 pb-4 group/task">
                    <div className="absolute left-0 top-[2px] w-[22px] h-[22px] rounded-full border-2 border-slate-800 bg-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover/task:border-blue-600 transition-all">
                      {idx + 1}
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-200">{task.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Duration: {task.duration}</p>
                      </div>
                      <button 
                        onClick={() => openThread(task.id)}
                        className="opacity-0 group-hover/task:opacity-100 p-1.5 hover:bg-slate-800 rounded text-slate-500 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Risk Matrix
              </h2>
              <div className="space-y-4">
                {result.risks.map((risk, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-300 uppercase">{risk.category}</span>
                      <span className="text-[10px] text-amber-500 font-bold bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/20">{risk.impact}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">"{risk.mitigation}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6 shadow-sm">
               <h2 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                Agent Critic Report
              </h2>
              <p className="text-sm text-indigo-200 leading-relaxed italic">"{result.criticFeedback}"</p>
            </div>
          </div>
        </div>
      </div>

      <CollaborationPanel 
        isOpen={isCollabOpen} 
        onClose={() => setIsCollabOpen(false)}
        comments={comments}
        onAddComment={onAddComment}
        presence={presence}
        activeTargetId={activeThreadId}
      />
    </div>
  );
};

export default AnalysisResult;
