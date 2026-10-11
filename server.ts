import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function formatErrorMessage(error: any): string {
  if (!error) return 'Agent execution failed';
  const raw = error.message || String(error);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) return parsed.error.message;
  } catch {
    // not JSON
  }
  return raw;
}

app.post('/api/agent', async (req, res) => {
  try {
    const { systemInstruction, prompt, useSearch } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server environment.',
      });
    }

    const config: Record<string, any> = {
      temperature: 0.7,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    let response: any = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config,
        });
        break;
      } catch (err: any) {
        const msg = String(err?.message || '');
        // If search tool fails due to quota/rate limit, fall back to generation without search
        if (config.tools && (msg.includes('quota') || msg.includes('Quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429'))) {
          console.warn('Google Search tool quota exceeded, falling back to direct model knowledge...');
          delete config.tools;
          continue;
        }

        const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand');
        if (isTransient && attempts < maxAttempts) {
          console.warn(`Transient error on attempt ${attempts}, retrying in ${attempts * 1500}ms...`);
          await new Promise((r) => setTimeout(r, attempts * 1500));
        } else {
          throw err;
        }
      }
    }

    const text = response?.text || 'No output generated.';

    let sources: Array<{ title: string; uri: string }> = [];
    const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
      sources = chunks
        .filter((c: any) => c && c.web)
        .map((c: any) => ({
          title: c.web.title || c.web.uri || 'Web Source',
          uri: c.web.uri || '',
        }))
        .filter((s: { uri: string }) => Boolean(s.uri));
    }

    return res.json({ text, sources });
  } catch (error: any) {
    console.error('Agent execution failed on server:', error);
    const message = formatErrorMessage(error);
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
