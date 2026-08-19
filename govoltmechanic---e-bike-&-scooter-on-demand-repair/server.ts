import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure JSON limit to allow base64 image uploads
  app.use(express.json({ limit: '35mb' }));
  app.use(express.urlencoded({ limit: '35mb', extended: true }));

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
        model: 'gemini-3.7-flash',
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

  // =========================================================================
  // VEO VIDEO GENERATION (IMAGE TO VIDEO ANIMATION) ENDPOINTS
  // =========================================================================

  // 1. Start Video Generation
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { prompt, imageBase64, mimeType = 'image/jpeg', aspectRatio = '16:9', resolution = '720p', model = 'veo-3.1-fast-generate-preview' } = req.body;

      const ai = getGeminiClient();

      const videoConfig: any = {
        numberOfVideos: 1,
        resolution: resolution === '1080p' ? '1080p' : '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      };

      const payload: any = {
        model: model || 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Smooth cinematic dynamic camera movement animating this image with realistic motion',
        config: videoConfig,
      };

      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
        payload.image = {
          imageBytes: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        };
      }

      console.log(`[VEO API] Triggering Video Generation with model ${payload.model}, aspect ${aspectRatio}...`);
      const operation = await ai.models.generateVideos(payload);

      return res.json({
        operationName: operation.name,
        aspectRatio,
        resolution,
      });
    } catch (error: any) {
      console.error('Veo generateVideos error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to trigger video generation',
      });
    }
  });

  // 2. Poll Video Status
  app.post('/api/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const ai = getGeminiClient();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });

      return res.json({
        done: Boolean(updated.done),
        error: updated.error ? updated.error.message || 'Video generation failed' : null,
      });
    } catch (error: any) {
      console.error('Veo video-status error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to poll video generation operation',
      });
    }
  });

  // 3. Download / Stream Completed Video
  app.post('/api/video-download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY missing' });
      }

      const ai = getGeminiClient();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });

      if (updated.error) {
        return res.status(500).json({ error: updated.error.message || 'Video generation failed' });
      }

      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ error: 'Video URI not found on completed operation' });
      }

      console.log(`[VEO API] Streaming video from Google Cloud Storage URI for operation ${operationName}...`);

      const videoRes = await fetch(uri, {
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({ error: `Failed to fetch video stream (${videoRes.statusText})` });
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'inline; filename="veo-animated-video.mp4"');

      // Pipe WebStream to Express response
      if (videoRes.body) {
        const reader = videoRes.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              break;
            }
            res.write(value);
          }
        };
        await pump();
      } else {
        const buffer = await videoRes.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error('Veo video-download error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          error: error.message || 'Failed to download and stream generated video',
        });
      }
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
