// Vercel Serverless Function for High-Quality Arabic & English TTS Audio Stream
// Handles GET /api/tts?text=... and POST /api/tts

// In-memory cache for warm serverless instances
declare global {
  var __globalTTSCache: Map<string, Buffer> | undefined;
}

if (!globalThis.__globalTTSCache) {
  globalThis.__globalTTSCache = new Map<string, Buffer>();
}

const ttsCache = globalThis.__globalTTSCache;

function splitArabicText(text: string, maxLen = 140): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  if (clean.length <= maxLen) return [clean];

  const sentences = clean.split(/([.!؟،؛\n]+)/);
  const chunks: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if ((current + part).length <= maxLen) {
      current += part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (part.length > maxLen) {
        const words = part.split(' ');
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).length <= maxLen) {
            wordChunk = wordChunk ? wordChunk + ' ' + w : w;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = w;
          }
        }
        if (wordChunk) chunks.push(wordChunk);
        current = '';
      } else {
        current = part;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawText = (req.method === 'POST' ? req.body?.text : req.query?.text) as string;
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const textToSpeak = rawText.slice(0, 1500).trim();

    // Check warm instance cache
    if (ttsCache.has(textToSpeak)) {
      const cached = ttsCache.get(textToSpeak)!;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', cached.length.toString());
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Accept-Ranges', 'bytes');
      return res.send(cached);
    }

    const chunks = splitArabicText(textToSpeak, 120);

    const fetchPromises = chunks.map(async (chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return null;
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=ar&client=tw-ob`;
        const resp = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/'
          },
          signal: AbortSignal.timeout(3500)
        });
        if (resp.ok) {
          const arrayBuf = await resp.arrayBuffer();
          return Buffer.from(arrayBuf);
        }
      } catch {}
      return null;
    });

    const chunkBuffers = await Promise.all(fetchPromises);
    const validBuffers: Buffer[] = [];
    for (const b of chunkBuffers) {
      if (b) {
        validBuffers.push(b);
      }
    }

    if (validBuffers.length === 0) {
      return res.status(502).json({ error: 'Failed to synthesize audio chunks' });
    }

    const combinedBuffer = Buffer.concat(validBuffers);

    if (ttsCache.size > 200) {
      ttsCache.clear();
    }
    ttsCache.set(textToSpeak, combinedBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', combinedBuffer.length.toString());
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Accept-Ranges', 'bytes');
    return res.send(combinedBuffer);
  } catch (err: any) {
    console.error('Serverless TTS error:', err);
    return res.status(500).json({ error: 'TTS synthesis error' });
  }
}
