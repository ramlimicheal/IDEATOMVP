import React, { useState } from 'react';
import { Rocket, Trash2, AlertTriangle, X } from 'lucide-react';
import Background from './components/Background';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import ScoreCard from './components/ScoreCard';
import PrdSection from './components/PrdSection';
import { geminiService } from './services/geminiService';
import { PROMPTS } from './services/prompts';
import { AgentResult, ValidationScores, AgentId } from './types';

const INITIAL_AGENTS: AgentResult[] = [
  { id: 'parser', name: 'Idea Parser Agent', description: 'Extracts core components & value proposition', icon: '🧠', status: 'pending', output: '' },
  { id: 'market', name: 'Market Research Agent', description: 'Analyzes market size, trends & opportunities (Google Search)', icon: '📊', status: 'pending', output: '' },
  { id: 'competitor', name: 'Competitor Analysis Agent', description: 'Identifies competitors & market gaps (Google Search)', icon: '🎯', status: 'pending', output: '' },
  { id: 'platform', name: 'Platform Strategy Agent', description: 'Recommends optimal delivery platform & tech stack', icon: '⚡', status: 'pending', output: '' },
  { id: 'validation', name: 'Validation Scoring Agent', description: 'Calculates viability, market, competition & feasibility scores', icon: '✅', status: 'pending', output: '' },
  { id: 'prd', name: 'PRD Generator Agent', description: 'Creates comprehensive product requirements document', icon: '📝', status: 'pending', output: '' },
];

function App() {
  const [idea, setIdea] = useState('');
  const [agents, setAgents] = useState<AgentResult[]>(INITIAL_AGENTS);
  const [scores, setScores] = useState<ValidationScores | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prdContent, setPrdContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateAgent = (id: AgentId, updates: Partial<AgentResult>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const runPipeline = async () => {
    if (!idea.trim()) {
      setErrorMessage('Please enter and describe your product idea first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setScores(null);
    setPrdContent('');
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: 'pending', output: '' })));

    let currentAgentId: AgentId = 'parser';

    try {
      // 1. Parser (Gemini 3.8 Flash - Fast Idea Structuring)
      currentAgentId = 'parser';
      updateAgent('parser', { status: 'active' });
      const parserRes = await geminiService.runAgent(
        "You are an expert product strategist.", 
        PROMPTS.parser(idea), 
        false
      );
      updateAgent('parser', { status: 'completed', output: parserRes.text });

      // 2. Market (Gemini 3.8 Flash - Grounded Search)
      currentAgentId = 'market';
      updateAgent('market', { status: 'active' });
      const marketRes = await geminiService.runAgent(
        "You are a market research analyst with access to real-time search data.", 
        PROMPTS.market(idea, parserRes.text), 
        true
      );
      updateAgent('market', { status: 'completed', output: marketRes.text, sources: marketRes.sources });

      // 3. Competitor (Gemini 3.8 Flash - Grounded Search)
      currentAgentId = 'competitor';
      updateAgent('competitor', { status: 'active' });
      const compRes = await geminiService.runAgent(
        "You are a competitive intelligence analyst with access to real-time search data.", 
        PROMPTS.competitor(idea, parserRes.text), 
        true
      );
      updateAgent('competitor', { status: 'completed', output: compRes.text, sources: compRes.sources });

      // 4. Platform (Gemini 3.8 Flash - Technical Strategy)
      currentAgentId = 'platform';
      updateAgent('platform', { status: 'active' });
      const platformRes = await geminiService.runAgent(
        "You are a technical product strategist and software architect.", 
        PROMPTS.platform(parserRes.text, marketRes.text, compRes.text), 
        false
      );
      updateAgent('platform', { status: 'completed', output: platformRes.text });

      // 5. Validation (Gemini 3.8 Flash - Viability Assessment)
      currentAgentId = 'validation';
      updateAgent('validation', { status: 'active' });
      const allAnalysis = JSON.stringify({ 
        parsed: parserRes.text, 
        market: marketRes.text, 
        competitor: compRes.text, 
        platform: platformRes.text 
      });
      const validationRes = await geminiService.runAgent(
        "You are a startup validation expert and venture analyst.", 
        PROMPTS.validation(allAnalysis), 
        false
      );
      updateAgent('validation', { status: 'completed', output: validationRes.text });
      
      const parsedScores = geminiService.parseScores(validationRes.text);
      setScores(parsedScores);

      // 6. PRD (Gemini 3.8 Flash - Comprehensive Specification)
      currentAgentId = 'prd';
      updateAgent('prd', { status: 'active' });
      const prdRes = await geminiService.runAgent(
        "You are a principal product manager.", 
        PROMPTS.prd(idea, allAnalysis), 
        false
      );
      updateAgent('prd', { status: 'completed', output: prdRes.text });
      setPrdContent(prdRes.text);

    } catch (error: any) {
      console.error('Validation pipeline error:', error);
      const message = error?.message || 'An error occurred during the validation process.';
      setErrorMessage(message);
      updateAgent(currentAgentId, { 
        status: 'error', 
        output: `Error during processing: ${message}` 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setIdea('');
    setAgents(INITIAL_AGENTS);
    setScores(null);
    setPrdContent('');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-[#00f5d4] selection:text-[#050507]">
      <Background />
      
      <div className="relative z-10 max-w-[1600px] mx-auto p-10">
        <Header />

        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 flex items-start justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-white/50 hover:text-white transition-colors p-1"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Panel - Input */}
          <div className="flex flex-col gap-6">
            
            {/* Idea Input */}
            <div className="flex-1 bg-[#0d0d14] border border-white/10 rounded-3xl p-8 flex flex-col h-full min-h-[600px]">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">Your Idea</h2>
                <span className="px-3 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[#00f5d4] text-[10px] font-mono uppercase tracking-widest">Input</span>
              </div>
              
              <div className="flex items-center gap-2 mb-6 text-white/50 text-sm">
                <span className="text-xl">💡</span>
                <span className="font-medium">Describe your product idea</span>
              </div>

              <textarea 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={`Describe your micro-SaaS idea here...

Example:
"Recall AI" - We just had a one-hour meeting, and nobody knows who is supposed to do what. Meeting notes are a waste of time...

Target Audience: Remote teams, agencies.
Value Prop: Automated accountability.`}
                className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 text-base leading-relaxed text-white/90 placeholder-white/20 focus:outline-none focus:border-[#9b5de5] focus:ring-1 focus:ring-[#9b5de5]/50 resize-none transition-all font-sans"
              />
              
              <div className="flex justify-end mt-4 mb-6">
                <span className="text-xs font-mono text-white/30">{idea.length} / 5000 characters</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={runPipeline}
                  disabled={isProcessing || !idea.trim()}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#00f5d4] via-[#9b5de5] to-[#f15bb5] text-[#050507] font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_10px_40px_rgba(0,245,212,0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <Rocket className={`w-5 h-5 ${isProcessing ? 'animate-bounce' : ''}`} />
                  {isProcessing ? 'Validating Idea...' : 'Validate Idea'}
                </button>
                <button 
                  onClick={clearAll}
                  disabled={isProcessing}
                  title="Clear idea and reset"
                  className="px-6 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Pipeline */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold">Validation Pipeline</h2>
              <span className="px-3 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[#00f5d4] text-[10px] font-mono uppercase tracking-widest">6 Agents</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
               <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/10">Gemini 3.8 Flash</span>
               <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50 border border-white/10">Google Search Grounding</span>
               <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50 border border-white/10">Multi-Agent Workflow</span>
            </div>

            {scores && <ScoreCard scores={scores} />}

            <div className="flex flex-col gap-4">
              {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            {prdContent && <PrdSection content={prdContent} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
