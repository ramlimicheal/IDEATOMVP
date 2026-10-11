import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { AgentResult } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface AgentCardProps {
  agent: AgentResult;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = () => {
    switch (agent.status) {
      case 'completed': return 'text-[#00f5a0] bg-[#00f5a0]/10 border-[#00f5a0]/20';
      case 'active': return 'text-[#00f5d4] bg-[#00f5d4]/10 border-[#00f5d4]/20';
      case 'error': return 'text-[#ff6b6b] bg-[#ff6b6b]/10 border-[#ff6b6b]/20';
      default: return 'text-white/40 bg-white/5 border-white/5';
    }
  };

  const isCompleted = agent.status === 'completed';
  const isActive = agent.status === 'active';

  // Auto-expand when completed or active
  React.useEffect(() => {
    if (isCompleted || isActive) {
      setIsExpanded(true);
    }
  }, [isCompleted, isActive]);

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-500
        ${isActive ? 'border-[#00f5d4] shadow-[0_0_30px_rgba(0,245,212,0.1)]' : 'border-white/10 bg-[#0d0d14]'}
        ${isCompleted ? 'border-[#00f5a0]/50' : ''}
      `}
    >
      {/* Active Progress Bar */}
      {isActive && (
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#00f5d4] via-[#9b5de5] to-[#f15bb5] animate-progress origin-left"></div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5`}>
              {agent.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
              <p className="text-xs text-white/50">{agent.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2 border ${getStatusColor()}`}>
              {isActive && <Loader2 className="w-3 h-3 animate-spin" />}
              {isCompleted && <CheckCircle2 className="w-3 h-3" />}
              {agent.status === 'error' && <AlertCircle className="w-3 h-3" />}
              <span>{agent.status}</span>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
          </div>
        </div>

        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr] mt-0'}`}>
          <div className="overflow-hidden">
            <div className="bg-[#0a0a0f] rounded-xl p-6 border border-white/5">
              {agent.output ? (
                <>
                  <MarkdownRenderer content={agent.output} />
                  {agent.sources && agent.sources.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <h4 className="text-xs font-mono text-white/40 uppercase mb-3">Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.sources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[#00f5d4] hover:text-[#00f5a0] bg-[#00f5d4]/5 hover:bg-[#00f5d4]/10 px-3 py-1.5 rounded-full transition-colors border border-[#00f5d4]/20"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{source.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-white/30 italic text-sm">Waiting for input...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 20s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default AgentCard;
