import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required. Please attach a Gemini API key in Settings > Secrets.');
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON parsing with generous payload size for base64 image/audio
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Create & Edit Images using gemini-3.1-flash-image-preview
  app.post('/api/gemini/image', async (req, res) => {
    try {
      const { prompt, imageBase64, mimeType = 'image/png', aspectRatio = '1:1', imageSize = '1K' } = req.body;

      if (!prompt && !imageBase64) {
        return res.status(400).json({ error: 'Prompt or image is required' });
      }

      const ai = getGenAI();
      const parts: any[] = [];

      // If user uploaded an image to edit:
      if (imageBase64) {
        // Remove data URL prefix if present
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType,
          },
        });
      }

      if (prompt) {
        parts.push({ text: prompt });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '1:1',
            imageSize: (imageSize as any) || '1K',
          },
        },
      });

      let generatedImageUrl: string | null = null;
      let generatedText = '';

      const candidateParts = response.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part.inlineData?.data) {
          const type = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${type};base64,${part.inlineData.data}`;
        } else if (part.text) {
          generatedText += part.text;
        }
      }

      if (!generatedImageUrl) {
        return res.status(502).json({
          error: 'Model did not return image data',
          details: generatedText || 'No image part returned',
        });
      }

      res.json({
        imageUrl: generatedImageUrl,
        text: generatedText,
        aspectRatio,
        model: 'gemini-3.1-flash-image-preview',
      });
    } catch (err: any) {
      console.error('Error generating/editing image:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate/edit image',
      });
    }
  });

  // 2. Video Generation (Text to Video & Image to Video Animation) using veo-3.1-fast-generate-preview
  // Step 1: Start operation
  app.post('/api/gemini/video/start', async (req, res) => {
    try {
      const {
        prompt,
        imageBase64,
        mimeType = 'image/png',
        aspectRatio = '16:9',
      } = req.body;

      if (!prompt && !imageBase64) {
        return res.status(400).json({ error: 'A text prompt or starting image is required' });
      }

      const ai = getGenAI();
      const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

      const config: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: validAspectRatio,
      };

      const params: any = {
        model: 'veo-3.1-fast-generate-preview',
        config,
      };

      if (prompt) {
        params.prompt = prompt;
      }

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        params.image = {
          imageBytes: cleanBase64,
          mimeType,
        };
      }

      const operation = await ai.models.generateVideos(params);

      res.json({
        operationName: operation.name,
        aspectRatio: validAspectRatio,
        model: 'veo-3.1-fast-generate-preview',
      });
    } catch (err: any) {
      console.error('Error starting video generation:', err);
      res.status(500).json({
        error: err.message || 'Failed to start video generation',
      });
    }
  });

  // Step 2: Poll operation status
  app.post('/api/gemini/video/status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const ai = getGenAI();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });

      res.json({
        done: Boolean(updated.done),
        error: updated.error || null,
        hasVideo: Boolean(updated.response?.generatedVideos?.[0]?.video?.uri),
      });
    } catch (err: any) {
      console.error('Error checking video status:', err);
      res.status(500).json({
        error: err.message || 'Failed to check video status',
      });
    }
  });

  // Step 3: Download video and stream back to browser
  app.post('/api/gemini/video/download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = getGenAI();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

      if (!uri) {
        return res.status(404).json({ error: 'Video URI not available in completed operation' });
      }

      const videoRes = await fetch(uri, {
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({
          error: `Failed to fetch generated video: ${videoRes.statusText}`,
        });
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'inline; filename="eventmaker-video.mp4"');

      if (!videoRes.body) {
        return res.status(500).json({ error: 'No video stream received' });
      }

      await videoRes.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
        })
      );
    } catch (err: any) {
      console.error('Error downloading video:', err);
      if (!res.headersSent) {
        res.status(500).json({
          error: err.message || 'Failed to download video',
        });
      }
    }
  });

  // 3. Music Generation using lyria-3-clip-preview (clip up to 30s) or lyria-3-pro-preview (full track)
  app.post('/api/gemini/music', async (req, res) => {
    try {
      const {
        prompt,
        model = 'lyria-3-clip-preview',
        imageBase64,
        mimeType = 'image/jpeg',
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Music prompt is required' });
      }

      const ai = getGenAI();
      const validModel =
        model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

      let contentsPayload: any = prompt;
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contentsPayload = {
          parts: [
            { text: prompt },
            { inlineData: { data: cleanBase64, mimeType } },
          ],
        };
      }

      const response = await ai.models.generateContentStream({
        model: validModel,
        contents: contentsPayload,
      });

      let audioBase64 = '';
      let lyrics = '';
      let detectedMimeType = 'audio/wav';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              detectedMimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (!audioBase64) {
        return res.status(502).json({
          error: 'No audio returned by Lyria music model',
          lyrics,
        });
      }

      res.json({
        audioBase64,
        mimeType: detectedMimeType,
        lyrics,
        model: validModel,
      });
    } catch (err: any) {
      console.error('Error generating music:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate music track',
      });
    }
  });

  // 4. Multi-turn Gemini Chatbot with specific roles & models
  // Models: gemini-3.1-pro-preview (complex tasks), gemini-3.5-flash (general), gemini-3.1-flash-lite (fast)
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        model = 'gemini-3.5-flash',
        systemInstruction = 'You are the expert AA Event Maker AI Wedding and Event Consultant. Provide structured, actionable, and warm recommendations for invitations, rundown, RSVP, budgeting, and ceremonies.',
      } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGenAI();

      // Normalize model name
      let validModel = 'gemini-3.5-flash';
      if (model === 'gemini-3.1-pro-preview' || model === 'pro') {
        validModel = 'gemini-3.1-pro-preview';
      } else if (model === 'gemini-3.1-flash-lite' || model === 'fast' || model === 'lite') {
        validModel = 'gemini-3.1-flash-lite';
      } else if (model === 'gemini-3.5-flash' || model === 'general') {
        validModel = 'gemini-3.5-flash';
      }

      // Format contents array for multi-turn history
      const contents: any[] = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text) {
            contents.push({
              role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Add the new user turn
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: validModel,
        contents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || 'Tidak ada respons dari asisten AI.';

      res.json({
        reply,
        modelUsed: validModel,
      });
    } catch (err: any) {
      console.error('Error in Gemini chat:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate response from Gemini chatbot',
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v5, wildcard SPA fallback uses '*all'
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AA Event Maker Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
