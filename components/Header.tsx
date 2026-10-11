import React from 'react';
import { Lightbulb } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-12 pb-8 border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f5d4] via-[#9b5de5] to-[#f15bb5] flex items-center justify-center shadow-[0_0_40px_rgba(0,245,212,0.3)]">
          <span className="text-2xl font-bold text-white">i2</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#00f5d4] via-[#9b5de5] to-[#f15bb5] bg-clip-text text-transparent">
            Idea2MVP
          </h1>
          <span className="text-xs text-white/40 font-mono tracking-[0.2em] uppercase">Road to $2M</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 rounded-xl border bg-white/5 border-green-500/20 transition-colors duration-300">
        <div className="w-2 h-2 rounded-full bg-[#00f5a0] shadow-[0_0_10px_#00f5a0] animate-pulse"></div>
        <span className="text-sm font-mono text-white/70">
          Systems Online
        </span>
      </div>
    </header>
  );
};

export default Header;