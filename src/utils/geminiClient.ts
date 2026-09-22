/**
 * Client-side interface to call the server-side Gemini & Veo & Lyria endpoints.
 * Never calls @google/genai directly from browser.
 */

export interface ImageGenerationOptions {
  prompt?: string;
  imageBase64?: string;
  mimeType?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  imageSize?: '512px' | '1K' | '2K';
}

export interface ImageGenerationResult {
  imageUrl: string;
  text?: string;
  aspectRatio: string;
  model: string;
}

export interface VideoStartOptions {
  prompt?: string;
  imageBase64?: string;
  mimeType?: string;
  aspectRatio?: '16:9' | '9:16';
}

export interface VideoStatusResult {
  done: boolean;
  error?: any;
  hasVideo: boolean;
}

export interface MusicGenerationOptions {
  prompt: string;
  model?: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  imageBase64?: string;
}

export interface MusicGenerationResult {
  audioUrl: string;
  lyrics?: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export interface ChatOptions {
  message: string;
  history: Array<{ role: 'user' | 'model'; text: string }>;
  model?: 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';
  systemInstruction?: string;
}

export async function generateOrEditImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const res = await fetch('/api/gemini/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal menghasilkan atau mengedit gambar.');
  }

  return data;
}

export async function startVideoGeneration(
  options: VideoStartOptions
): Promise<{ operationName: string; aspectRatio: string; model: string }> {
  const res = await fetch('/api/gemini/video/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal memulai pembuatan video Veo.');
  }

  return data;
}

export async function checkVideoStatus(
  operationName: string
): Promise<VideoStatusResult> {
  const res = await fetch('/api/gemini/video/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal memeriksa status proses video.');
  }

  return data;
}

export async function downloadVideoAsBlobUrl(operationName: string): Promise<string> {
  const res = await fetch('/api/gemini/video/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName }),
  });

  if (!res.ok) {
    let errorText = 'Gagal mengunduh video.';
    try {
      const data = await res.json();
      errorText = data.error || errorText;
    } catch {}
    throw new Error(errorText);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function generateMusicTrack(
  options: MusicGenerationOptions
): Promise<MusicGenerationResult> {
  const res = await fetch('/api/gemini/music', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal membuat musik dengan Lyria.');
  }

  // Convert base64 audio to Blob URL
  const binary = atob(data.audioBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
  const audioUrl = URL.createObjectURL(blob);

  return {
    audioUrl,
    lyrics: data.lyrics,
    model: data.model,
  };
}

export async function sendGeminiChatMessage(
  options: ChatOptions
): Promise<{ reply: string; modelUsed: string }> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal berkomunikasi dengan chatbot Gemini.');
  }

  return data;
}
