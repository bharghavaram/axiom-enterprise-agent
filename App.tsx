
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AnalysisResult from './components/AnalysisResult';
import { AppView, AnalysisResult as AnalysisResultType, HistoryItem, Comment, UserPresence } from './types';
import { analyzeBusinessDocument } from './services/geminiService';

// Random User Generator for Demo
const MOCK_USERS: UserPresence[] = [
  { id: 'u1', name: 'Lead Dev', color: 'bg-indigo-600' },
  { id: 'u2', name: 'Senior PM', color: 'bg-emerald-600' },
  { id: 'u3', name: 'Arch Agent', color: 'bg-blue-600' },
];

const MY_USER: UserPresence = {
  id: 'me-' + Math.random().toString(36).substr(2, 4),
  name: 'Me (Collaborator)',
  color: 'bg-purple-600',
  isMe: true
};

interface AppError {
  code: string;
  title: string;
  message: string;
  retryable: boolean;
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResultType | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<AppError | null>(null);
  const [lastContent, setLastContent] = useState<string>('');
  
  // Collaboration State
  const [comments, setComments] = useState<Comment[]>([]);
  const [presence, setPresence] = useState<UserPresence[]>([MY_USER]);

  // Real-time synchronization via BroadcastChannel
  const collabChannel = useMemo(() => new BroadcastChannel('axiom_collab_v1'), []);

  useEffect(() => {
    collabChannel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'NEW_COMMENT') {
        setComments(prev => [...prev, payload]);
      } else if (type === 'USER_JOINED') {
        setPresence(prev => {
          if (prev.find(p => p.id === payload.id)) return prev;
          return [...prev, payload];
        });
        collabChannel.postMessage({ type: 'SYNC_PRESENCE', payload: MY_USER });
      } else if (type === 'SYNC_PRESENCE') {
        setPresence(prev => {
          if (prev.find(p => p.id === payload.id)) return prev;
          return [...prev, payload];
        });
      }
    };

    collabChannel.postMessage({ type: 'USER_JOINED', payload: MY_USER });

    const timer = setTimeout(() => {
      const mockComment: Comment = {
        id: 'agent-' + Date.now(),
        targetId: 'global',
        author: 'AXIOM Agent Critic',
        text: 'Reviewing current structure. Dependencies seem optimized for 12-week delivery.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        authorColor: 'bg-blue-500'
      };
      setComments(prev => [...prev, mockComment]);
    }, 5000);

    return () => {
      clearTimeout(timer);
      collabChannel.close();
    };
  }, [collabChannel]);

  const handleAddComment = useCallback((text: string, targetId: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      targetId,
      author: MY_USER.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorColor: MY_USER.color
    };
    
    setComments(prev => [...prev, newComment]);
    collabChannel.postMessage({ type: 'NEW_COMMENT', payload: newComment });
  }, [collabChannel]);

  const handleAnalyze = async (content: string) => {
    setLastContent(content);
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeBusinessDocument(content);
      setCurrentResult(result);
      setView('ANALYSIS');
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        name: result.projectName,
        date: new Date().toLocaleString(),
        result: result
      };
      setHistory(prev => [newItem, ...prev]);
      setComments([]);
    } catch (err: any) {
      const errorCode = err.message;
      let appError: AppError;

      switch (errorCode) {
        case 'RATE_LIMIT_EXCEEDED':
          appError = {
            code: '429',
            title: 'Node Saturation',
            message: 'Orchestration rate limits reached. The system is processing too many concurrent requests. Please wait 60 seconds for buffer clearance.',
            retryable: true
          };
          break;
        case 'SERVICE_OVERLOADED':
          appError = {
            code: '503',
            title: 'Cluster Instability',
            message: 'The analysis cluster is currently under heavy load or performing maintenance. Intelligence nodes are re-balancing.',
            retryable: true
          };
          break;
        case 'CONTENT_BLOCKED':
          appError = {
            code: 'SAFETY',
            title: 'Kernel Panic: Content Violation',
            message: 'The input document contains elements that triggered our safety protocols. Analysis aborted to maintain system integrity.',
            retryable: false
          };
          break;
        case 'INVALID_INPUT':
          appError = {
            code: '400',
            title: 'Syntax Error in Stream',
            message: 'The provided document is malformed or too large for the current buffer. Check your input formatting.',
            retryable: false
          };
          break;
        default:
          appError = {
            code: 'ERR_UNKNOWN',
            title: 'Uplink Error',
            message: 'An unexpected disconnection occurred between the frontend and the intelligence core.',
            retryable: true
          };
      }
      setError(appError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setView('DASHBOARD');
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setCurrentResult(item.result);
    setView('ANALYSIS');
  };

  return (
    <Layout activeView={view} onViewChange={setView}>
      {error && (
        <div className="max-w-4xl mx-auto mb-10 p-6 bg-red-950/20 border border-red-900/40 rounded-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-600/10 rounded-lg border border-red-500/20">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-mono font-black text-red-500 uppercase tracking-tighter">[{error.code}] {error.title}</h3>
                <button onClick={() => setError(null)} className="text-red-500/40 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <p className="text-sm text-slate-400 font-mono leading-relaxed mb-4">{error.message}</p>
              {error.retryable && (
                <button 
                  onClick={() => handleAnalyze(lastContent)}
                  className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded font-mono text-xs uppercase tracking-widest transition-all"
                >
                  Force_Re-sync_Nodes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'DASHBOARD' && (
        <Dashboard onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      )}

      {view === 'ANALYSIS' && currentResult && !isAnalyzing && (
        <AnalysisResult 
          result={currentResult} 
          onReset={handleReset} 
          comments={comments}
          onAddComment={handleAddComment}
          presence={presence}
        />
      )}

      {view === 'ANALYSIS' && isAnalyzing && (
        <div className="h-full flex flex-col items-center justify-center space-y-8 py-20 animate-in fade-in duration-700">
           <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-500 text-xs font-mono">BOOT</div>
           </div>
           <div className="text-center space-y-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Initializing Neural Agents</h2>
              <div className="flex gap-2 justify-center">
                 <span className="px-3 py-1 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full text-[10px] font-mono font-bold animate-pulse">PLANNER_ACTIVE</span>
                 <span className="px-3 py-1 bg-slate-900 text-slate-700 border border-slate-800 rounded-full text-[10px] font-mono font-bold">CRITIC_SLEEP</span>
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]"></div>
                 </div>
                 <p className="text-slate-600 text-[9px] font-mono uppercase tracking-widest">Compiling Workflow Archetypes...</p>
              </div>
           </div>
        </div>
      )}

      {view === 'HISTORY' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Kernel Archive</h1>
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{history.length} Analysis Records</div>
           </div>

           {history.length === 0 ? (
             <div className="bg-slate-950/40 border border-slate-800/40 border-dashed rounded-2xl p-20 text-center backdrop-blur-sm">
                <h3 className="text-sm font-mono text-slate-600 uppercase tracking-widest">Buffer Empty</h3>
                <button 
                  onClick={() => setView('DASHBOARD')}
                  className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Create_Source_Stream
                </button>
             </div>
           ) : (
             <div className="grid gap-4">
               {history.map((item) => (
                 <button 
                   key={item.id}
                   onClick={() => handleLoadFromHistory(item)}
                   className="w-full text-left p-6 bg-slate-900/40 border border-slate-800/40 rounded-xl hover:border-blue-500/30 hover:bg-blue-900/5 transition-all flex items-center justify-between group backdrop-blur-sm"
                 >
                   <div className="space-y-1">
                      <h3 className="font-mono text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-wider">{item.name}</h3>
                      <p className="text-[10px] text-slate-600 font-mono lowercase tracking-tighter">TIMESTAMP: {item.date}</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <div className="text-[9px] text-slate-700 font-bold uppercase tracking-tighter">Stream</div>
                         <div className="text-emerald-500/80 text-[10px] font-mono font-bold">STABLE</div>
                      </div>
                      <svg className="w-5 h-5 text-slate-700 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </div>
                 </button>
               ))}
             </div>
           )}
        </div>
      )}
    </Layout>
  );
};

export default App;
