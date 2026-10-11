import React from 'react';
import { ValidationScores } from '../types';

interface ScoreCardProps {
  scores: ValidationScores;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ scores }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#00f5a0]';
    if (score >= 60) return 'text-[#ffd93d]';
    return 'text-[#ff6b6b]';
  };

  return (
    <div className="bg-gradient-to-br from-[#00f5d4]/10 to-[#9b5de5]/10 border border-[#00f5d4]/30 rounded-2xl p-8 mb-8 animate-fade-in relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f5d4]/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="text-sm font-mono text-white/60 uppercase tracking-widest mb-2">Overall Viability</div>
        <div className="text-7xl font-bold bg-gradient-to-r from-[#00f5d4] via-[#9b5de5] to-[#f15bb5] bg-clip-text text-transparent mb-8">
          {scores.overall}
        </div>

        <div className="grid grid-cols-3 w-full gap-4 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${getScoreColor(scores.market)}`}>{scores.market}</span>
            <span className="text-[10px] font-mono text-white/40 uppercase mt-1 tracking-wider">Market</span>
          </div>
          <div className="flex flex-col items-center border-l border-r border-white/5 px-4">
            <span className={`text-2xl font-bold ${getScoreColor(scores.competition)}`}>{scores.competition}</span>
            <span className="text-[10px] font-mono text-white/40 uppercase mt-1 tracking-wider">Competition</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${getScoreColor(scores.feasibility)}`}>{scores.feasibility}</span>
            <span className="text-[10px] font-mono text-white/40 uppercase mt-1 tracking-wider">Feasibility</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
