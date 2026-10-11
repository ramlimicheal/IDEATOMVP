import React from 'react';
import { Copy, Download, FileText } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface PrdSectionProps {
  content: string;
}

const PrdSection: React.FC<PrdSectionProps> = ({ content }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('PRD copied to clipboard!'); // Simple alert for now, could be toast
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRD-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!content) return null;

  return (
    <div className="bg-[#0d0d14] border border-white/10 rounded-3xl p-8 mt-12 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#9b5de5]" />
          <h2 className="text-xl font-bold text-white">Product Requirements Document</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-[#00f5d4] hover:bg-[#00f5d4]/10 transition-all text-sm font-medium"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f5d4] to-[#9b5de5] text-[#050507] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0f] rounded-2xl p-8 max-h-[600px] overflow-y-auto border border-white/5 custom-scrollbar">
        <MarkdownRenderer content={content} />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PrdSection;
