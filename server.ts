import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenAI({ 
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const chat = genAI.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are Lumina AI, a sophisticated and helpful AI assistant. You are knowledgeable, friendly, and concise. Format your responses using Markdown.',
        },
        history: history || [],
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } catch (error: any) {
      console.error('Chat Error:', error);
      let friendlyMessage = 'An unexpected error occurred.';
      if (error.message?.includes('429') || error.message?.includes('QUOTA')) {
        friendlyMessage = 'Rate limit reached. Please wait a moment before trying again.';
      } else if (error.message?.includes('API_KEY')) {
        friendlyMessage = 'API Configuration error. Check your environment keys.';
      }
      res.status(500).json({ error: friendlyMessage });
    }
  });

  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '1:1' } = req.body;
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });

      let imageData = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          break;
        }
      }

      if (imageData) {
        res.json({ url: `data:image/png;base64,${imageData}` });
      } else {
        res.status(500).json({ error: 'No image was generated. Please try a different prompt.' });
      }
    } catch (error: any) {
      console.error('Image Gen Error:', error);
      let friendlyMessage = 'Failed to generate image.';
      if (error.message?.includes('429') || error.message?.includes('QUOTA')) {
        friendlyMessage = 'Generation quota reached. Please wait 30-60 seconds for the engine to reset.';
      } else if (error.message?.includes('SAFETY')) {
        friendlyMessage = 'This prompt was flagged by safety filters. Please try another description.';
      }
      res.status(500).json({ error: friendlyMessage });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
