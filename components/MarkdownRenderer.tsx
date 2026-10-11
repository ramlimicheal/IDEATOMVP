import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-white/70">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-[#00f5d4] mt-5 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-medium text-white/90 mt-4 mb-2" {...props} />,
          strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-3 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-3 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          p: ({node, ...props}) => <p className="leading-relaxed mb-4" {...props} />,
          code: ({node, ...props}) => <code className="bg-white/10 rounded px-1.5 py-0.5 font-mono text-xs text-[#f15bb5]" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
