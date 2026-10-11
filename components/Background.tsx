import React from 'react';

const Background: React.FC = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#050507]">
        {/* Orbs */}
        <div className="absolute rounded-full blur-[100px] opacity-30 animate-float w-[600px] h-[600px] bg-[#00f5d4] -top-[200px] -right-[200px]" style={{ animationDuration: '20s' }}></div>
        <div className="absolute rounded-full blur-[100px] opacity-30 animate-float w-[500px] h-[500px] bg-[#9b5de5] -bottom-[150px] -left-[150px]" style={{ animationDuration: '23s', animationDelay: '-7s' }}></div>
        <div className="absolute rounded-full blur-[100px] opacity-15 animate-float w-[400px] h-[400px] bg-[#f15bb5] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '25s', animationDelay: '-14s' }}></div>
      </div>
      
      {/* Grid Overlay */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none -z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <style>{`
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -30px) scale(1.05); }
            50% { transform: translate(-20px, 20px) scale(0.95); }
            75% { transform: translate(-30px, -20px) scale(1.02); }
        }
        .animate-float {
            animation-name: float;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
        }
      `}</style>
    </>
  );
};

export default Background;
