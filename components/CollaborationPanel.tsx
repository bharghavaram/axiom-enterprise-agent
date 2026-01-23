
import React, { useState, useEffect, useRef } from 'react';
import { Comment, UserPresence } from '../types';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string, targetId: string) => void;
  presence: UserPresence[];
  activeTargetId: string; // The specific requirement/task we are discussing
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  isOpen, 
  onClose, 
  comments, 
  onAddComment, 
  presence,
  activeTargetId 
}) => {
  const [newComment, setNewComment] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredComments = activeTargetId === 'global' 
    ? comments 
    : comments.filter(c => c.targetId === activeTargetId || c.targetId === 'global');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredComments, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#0b0f1a]/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">Discussion</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            {activeTargetId === 'global' ? 'Global Feed' : `Thread: ${activeTargetId}`}
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="flex -space-x-2">
          {presence.map(u => (
            <div 
              key={u.id} 
              title={u.name}
              className={`w-8 h-8 rounded-full border-2 border-[#0b0f1a] flex items-center justify-center text-[10px] font-bold text-white ${u.color} shadow-lg`}
            >
              {u.name.charAt(0)}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-[#0b0f1a] bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">
            +
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            <p className="text-xs text-slate-500">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          filteredComments.map(comment => (
            <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold ${comment.authorColor.replace('bg-', 'text-')}`}>{comment.author}</span>
                <span className="text-[9px] text-slate-600">{comment.timestamp}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed shadow-sm">
                {comment.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (newComment.trim()) {
              onAddComment(newComment, activeTargetId);
              setNewComment('');
            }
          }}
          className="relative"
        >
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your feedback..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-12"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollaborationPanel;
