import { ValidationScores } from "../types";

export interface AgentRunResult {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export class GeminiService {
  async runAgent(
    systemInstruction: string,
    prompt: string,
    useSearch: boolean = false,
    _model: string = 'gemini-3.8-flash'
  ): Promise<AgentRunResult> {
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction,
          prompt,
          useSearch,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMessage = typeof errData.error === 'string' ? errData.error : JSON.stringify(errData.error);
          }
        } catch {
          // Fall back to status text
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return {
        text: data.text || "No output generated.",
        sources: Array.isArray(data.sources) ? data.sources : [],
      };
    } catch (error: any) {
      console.error("Agent run failed:", error);
      throw new Error(error.message || "Agent execution failed");
    }
  }

  parseScores(text: string): ValidationScores {
    // Expected format in text: SCORES: overall=XX, market=XX, competition=XX, feasibility=XX
    const regex = /SCORES:\s*overall=(\d+),\s*market=(\d+),\s*competition=(\d+),\s*feasibility=(\d+)/i;
    const match = text.match(regex);

    if (match) {
      return {
        overall: Math.min(100, Math.max(0, parseInt(match[1], 10))),
        market: Math.min(100, Math.max(0, parseInt(match[2], 10))),
        competition: Math.min(100, Math.max(0, parseInt(match[3], 10))),
        feasibility: Math.min(100, Math.max(0, parseInt(match[4], 10))),
      };
    }

    // Secondary flexible search for individual score lines
    const extractScore = (keyword: string, fallback: number): number => {
      const re = new RegExp(`${keyword}[^\\d]{0,25}(\\d{1,3})`, 'i');
      const m = text.match(re);
      if (m) {
        const val = parseInt(m[1], 10);
        if (!isNaN(val) && val >= 0 && val <= 100) return val;
      }
      return fallback;
    };

    const overall = extractScore('overall', 75);
    const market = extractScore('market', 72);
    const competition = extractScore('competition', 68);
    const feasibility = extractScore('feasibility', 80);

    return { overall, market, competition, feasibility };
  }
}

export const geminiService = new GeminiService();
