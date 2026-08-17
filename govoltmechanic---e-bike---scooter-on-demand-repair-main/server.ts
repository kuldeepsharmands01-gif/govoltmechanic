import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to initialize Gemini Client lazily
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route for Grounded E-Bike / Scooter Troubleshooting
  app.post('/api/troubleshoot', async (req, res) => {
    try {
      const { query, vehicleModel } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query text is required' });
      }

      const ai = getGeminiClient();

      const prompt = `You are a certified master EV technician specializing in Indian & Global E-bikes and E-scooters (e.g. Ather 450X, Ola S1 Pro, Revolt RV400, TVS iQube, Bajaj Chetak, Hero Vida, Super73, Ninebot, etc.).
The user asks: "${query}" regarding vehicle: "${vehicleModel || 'General E-Bike / E-Scooter'}".

Provide a grounded troubleshooting guide in raw JSON format with these exact keys:
1. "summary": A clear 1-2 sentence explanation of the probable root cause.
2. "severity": "low" | "medium" | "critical"
3. "steps": An array of 3 to 5 clear actionable steps, where each step is an object { "title": "...", "detail": "..." }
4. "toolsNeeded": Array of strings (e.g., ["T25 Torx Wrench", "Digital Multimeter", "Contact Cleaner"])
5. "safetyWarning": A string containing high-voltage battery or brake safety warnings.
6. "recommendedService": "DIY Fixable" or "Requires Professional Technician"

Perform web search grounding to search official service manuals, active forum solutions, and technical service bulletins where applicable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      // Extract search citations/urls
      const citations = groundingChunks
        .filter((chunk) => chunk.web)
        .map((chunk) => ({
          title: chunk.web?.title || 'Web Reference',
          uri: chunk.web?.uri || '#',
        }));

      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch {
        parsedData = {
          summary: text,
          severity: 'medium',
          steps: [{ title: 'General Inspection', detail: text }],
          toolsNeeded: ['Standard EV Toolkit', 'Multimeter'],
          safetyWarning: 'Always disconnect the main battery isolation switch before performing electrical maintenance.',
          recommendedService: 'Requires Professional Technician',
        };
      }

      return res.json({
        ...parsedData,
        citations,
      });
    } catch (error: any) {
      console.error('Troubleshoot API Error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to process troubleshooting request',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
