export interface ValidationScores {
  overall: number;
  market: number;
  competition: number;
  feasibility: number;
}

export interface AgentResult {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  output: string;
  sources?: Array<{ title: string; uri: string }>;
}

export type AgentId = 'parser' | 'market' | 'competitor' | 'platform' | 'validation' | 'prd';

export interface AnalysisContext {
  parsed?: string;
  market?: string;
  competitor?: string;
  platform?: string;
  validation?: string;
  scores?: ValidationScores;
}
