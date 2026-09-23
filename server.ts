import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Load Official Egyptian Primary 3 Curriculum Reference JSON
let curriculumReferenceData: any = null;
try {
  const jsonPath = path.join(process.cwd(), "src", "data", "curriculumReference.json");
  if (fs.existsSync(jsonPath)) {
    curriculumReferenceData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load curriculumReference.json:", e);
}

let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    try {
      if (process.env.GEMINI_API_KEY) {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } else {
        aiClient = new GoogleGenAI({});
      }
    } catch (e) {
      console.warn("Notice: GoogleGenAI init:", e);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Real-time Presence Tracking for Online Classmates
  interface OnlineStudentInfo {
    id: string;
    name: string;
    heroType: "boy" | "girl";
    avatar: string;
    subject: string;
    currentActivity: string;
    stars: number;
    lastSeen: number;
  }
  const activeStudentsMap = new Map<string, OnlineStudentInfo>();

  // Periodically clean up students who disconnected (> 40s inactive)
  setInterval(() => {
    const cutoff = Date.now() - 40000;
    for (const [id, student] of activeStudentsMap.entries()) {
      if (student.lastSeen < cutoff) {
        activeStudentsMap.delete(id);
      }
    }
  }, 10000);

  // Endpoint for real-time presence heartbeat (supports both /api/presence and /api/presence/heartbeat)
  const handlePresencePost = (req: any, res: any) => {
    try {
      const studentId = req.body?.id || req.body?.studentId;
      const studentName = req.body?.name;
      const isGirl = req.body?.isGirl === true || req.body?.heroType === "girl";
      const avatar = req.body?.avatar || (isGirl ? "👧" : "👦");
      const subject = req.body?.subject || "الرِّيَاضِيَّاتُ";
      const currentActivity = req.body?.currentLesson || req.body?.currentActivity || "يحل تدريبات المنهج";
      const gradeLevel = req.body?.gradeLevel || "الصف الثالث الابتدائي";
      const stars = Number(req.body?.stars) || 0;

      if (!studentId || !studentName) {
        return res.status(400).json({ error: "Missing required student presence fields" });
      }

      activeStudentsMap.set(studentId, {
        id: studentId,
        name: String(studentName).slice(0, 35),
        heroType: isGirl ? "girl" : "boy",
        avatar,
        subject,
        currentActivity,
        stars,
        lastSeen: Date.now()
      });

      const list = Array.from(activeStudentsMap.values()).map(s => ({
        ...s,
        isSelf: false,
        secondsAgo: Math.round((Date.now() - s.lastSeen) / 1000)
      }));

      return res.json({ success: true, onlineCount: activeStudentsMap.size, students: list });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  };

  app.post("/api/presence/heartbeat", handlePresencePost);
  app.post("/api/presence", handlePresencePost);

  // Endpoint to get active online students list (supports both /api/presence/online and /api/presence)
  const handlePresenceGet = (_req: any, res: any) => {
    const list = Array.from(activeStudentsMap.values()).map(s => ({
      ...s,
      isSelf: false,
      secondsAgo: Math.round((Date.now() - s.lastSeen) / 1000)
    }));
    return res.json({ count: list.length, students: list });
  };

  app.get("/api/presence/online", handlePresenceGet);
  app.get("/api/presence", handlePresenceGet);

  // Helper to split text into manageable sentences for TTS
  function splitArabicText(text: string, maxLen = 140): string[] {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return [];
    if (clean.length <= maxLen) return [clean];

    const sentences = clean.split(/([.!؟،؛\n]+)/);
    const chunks: string[] = [];
    let current = "";

    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      if ((current + part).length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        if (part.length > maxLen) {
          const words = part.split(" ");
          let wordChunk = "";
          for (const w of words) {
            if ((wordChunk + " " + w).length <= maxLen) {
              wordChunk = wordChunk ? wordChunk + " " + w : w;
            } else {
              if (wordChunk) chunks.push(wordChunk);
              wordChunk = w;
            }
          }
          if (wordChunk) chunks.push(wordChunk);
          current = "";
        } else {
          current = part;
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  // In-memory TTS audio cache for instant playback
  const ttsCache = new Map<string, Buffer>();

  // Ultra-reliable High-Quality Arabic TTS Endpoint (MP3 audio stream with parallel fetch & cache)
  const handleTTS = async (req: express.Request, res: express.Response) => {
    try {
      const rawText = (req.method === "POST" ? req.body?.text : req.query?.text) as string;
      if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
        return res.status(400).json({ error: "Text parameter is required" });
      }

      // Limit overall text to reasonable lesson summary length
      const textToSpeak = rawText.slice(0, 1500).trim();
      
      // Check cache first
      if (ttsCache.has(textToSpeak)) {
        const cached = ttsCache.get(textToSpeak)!;
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Length", cached.length.toString());
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setHeader("Accept-Ranges", "bytes");
        return res.send(cached);
      }

      const chunks = splitArabicText(textToSpeak, 120);
      
      // Fetch all chunks concurrently in parallel for ultra-fast response (<300ms)
      const fetchPromises = chunks.map(async (chunk) => {
        const trimmed = chunk.trim();
        if (!trimmed) return null;
        try {
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=ar&client=tw-ob`;
          const resp = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Referer": "https://translate.google.com/"
            },
            signal: AbortSignal.timeout(3000)
          });
          if (resp.ok) {
            const arrayBuf = await resp.arrayBuffer();
            return Buffer.from(arrayBuf);
          }
        } catch {
          // Ignore individual chunk failure
        }
        return null;
      });

      const chunkBuffers = await Promise.all(fetchPromises);
      const audioBuffers: Buffer[] = [];
      for (const b of chunkBuffers) {
        if (b) {
          audioBuffers.push(b);
        }
      }

      if (audioBuffers.length === 0) {
        return res.status(502).json({ error: "Failed to synthesize speech" });
      }

      const combinedBuffer = Buffer.concat(audioBuffers);

      // Save to cache (limit cache size to 100 items to conserve memory)
      if (ttsCache.size > 100) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(textToSpeak, combinedBuffer);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", combinedBuffer.length.toString());
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Accept-Ranges", "bytes");
      return res.send(combinedBuffer);
    } catch (error: any) {
      console.error("TTS endpoint error:", error);
      return res.status(500).json({ error: "Speech synthesis error" });
    }
  };

  app.get("/api/tts", handleTTS);
  app.post("/api/tts", handleTTS);

  // AI Tutor Endpoint with Full Egyptian Primary 3 Curriculum Knowledge from JSON Reference
  app.post("/api/tutor", async (req, res) => {
    const { message, studentName, heroType, currentLessonTitle, unitTitle, curriculumContext } = req.body;
    const isGirl = heroType === "girl";
    const name = studentName?.trim() || (isGirl ? "بَطَلَتَنَا" : "بَطَلَنَا");
    const userMsg = (message || "").trim();
    const praise = isGirl ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${name}! 🌟` : `أَحْسَنْتَ يَا بَطَلَنَا ${name}! 🌟`;

    // Arabic Text Normalizer for ultra-resilient matching (strips diacritics & standardizes hamzas)
    const normalizeArabic = (text: string): string => {
      if (!text) return "";
      return text
        .replace(/[\u064B-\u065F\u0670]/g, "") // remove tashkeel
        .replace(/[إأآا]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, " ")
        .toLowerCase()
        .trim();
    };

    // Stop words to prevent false preposition matching
    const STOP_WORDS = new Set(['في', 'من', 'عن', 'علي', 'على', 'الي', 'إلى', 'ما', 'هو', 'هي', 'هل', 'كم', 'يا', 'مع', 'ان', 'أن']);

    // Intelligent Curriculum Knowledge Helper grounded in curriculumReferenceData
    const getCurriculumAnswer = (q: string): string => {
      const normQuery = normalizeArabic(q);

      // 0. High-Priority Math Clock & Time Check
      if (normQuery.includes('ساعه') || normQuery.includes('وقت') || normQuery.includes('منقضي') || normQuery.includes('دقائق') || normQuery.includes('عقرب')) {
        return `${praise}
⏰ شَرْحُ دَرْسِ السَّاعَةِ وَقِرَاءَةِ الْوَقْتِ وَالْمُدَّةِ الزَّمَنِيَّةِ (مَرْجِعُ كِتَابِ الْوَزَارَةِ، سِلَاحِ التِّلْمِيذِ، وَالأَضْوَاءِ):

1️⃣ أَجْزَاءُ السَّاعَةِ:
• عَقْرَبُ السَّاعَاتِ (الْقَصِيرُ الْبَطِيءُ): يُحَدِّدُ رَقَمَ السَّاعَةِ.
• عَقْرَبُ الدَّقَائِقِ (الطَّوِيلُ السَّرِيعُ): نَضْرِبُ الرَّقَمَ الَّذِي يَقِفُ عَلَيْهِ فِي 5 لِمَعْرِفَةِ الدَّقَائِقِ!

2️⃣ جَدْوَلُ قِرَاءَةِ عَقْرَبِ الدَّقَائِقِ (الْقَفْزُ بِمِقْدَارِ 5 دَقَائِقَ):
• عِنْدَ 12 ⬅️ السَّاعَةُ تَمَاماً (:00)
• عِنْدَ 1 ⬅️ وَخَمْسُ دَقَائِقَ (:05)
• عِنْدَ 2 ⬅️ وَعَشْرُ دَقَائِقَ (:10)
• عِنْدَ 3 ⬅️ وَالرُّبْعُ (:15 دَقِيقَةً)
• عِنْدَ 4 ⬅️ وَالثُّلْثُ (:20 دَقِيقَةً)
• عِنْدَ 5 ⬅️ وَالنِّصْفُ إِلَّا خَمْسَةً (:25 دَقِيقَةً)
• عِنْدَ 6 ⬅️ وَالنِّصْفُ (:30 دَقِيقَةً)
• عِنْدَ 7 ⬅️ وَالنِّصْفُ وَخَمْسَةٌ (:35 دَقِيقَةً)
• عِنْدَ 8 ⬅️ إِلَّا ثُلْثاً (:40 دَقِيقَةً)
• عِنْدَ 9 ⬅️ إِلَّا رُبْعاً (:45 دَقِيقَةً)
• عِنْدَ 10 ⬅️ إِلَّا عَشْرَ دَقَائِقَ (:50 دَقِيقَةً)
• عِنْدَ 11 ⬅️ إِلَّا خَمْسَ دَقَائِقَ (:55 دَقِيقَةً)

3️⃣ حِسَابُ الْوَقْتِ الْمُنْقَضِي (الْمُدَّةِ الزَّمَنِيَّةِ):
القاعدة: «الْوَقْتُ الْمُنْقَضِي = وَقْتُ النِّهَايَةِ - وَقْتُ الْبِدَايَةِ»
📌 مِثَالٌ مَحْلُولٌ:
بَدَأَ التِّلْمِيذُ الْمُذَاكَرَةَ السَّاعَةَ 3:15 وَانْتَهَى السَّاعَةَ 4:45.
• نَقْفِزُ سَاعَةً كَامِلَةً: مِنْ 3:15 إِلَى 4:15 = 1 سَاعَةٌ (60 دَقِيقَةً).
• نَقْفِزُ الدَّقَائِقَ الْمُتَبَقِّيَةَ: مِنْ 4:15 إِلَى 4:45 = 30 دَقِيقَةً.
• الْوَقْتُ الْمُنْقَضِي الْكُلِّيُّ = سَاعَةٌ وَ 30 دَقِيقَةً (أَيْ 90 دَقِيقَةً)!

4️⃣ تَحْوِيلَاتٌ زَمَنِيَّةٌ مُهِمَّةٌ لِلِامْتِحَانِ:
• 1 سَاعَة = 60 دَقِيقَةً
• نِصْفُ سَاعَةٍ = 30 دَقِيقَةً
• رُبْعُ سَاعَةٍ = 15 دَقِيقَةً
• ثُلْثُ سَاعَةٍ = 20 دَقِيقَةً
• ثَلَاثَةُ أَرْبَاعِ السَّاعَةِ = 45 دَقِيقَةً

🎯 تَحَدٍّ لَكَ يَا بَطَلُ: إِذَا كَانَ عَقْرَبُ السَّاعَاتِ عِنْدَ 5 وَعَقْرَبُ الدَّقَائِقِ عِنْدَ 3، فَكَمْ تَكُونُ السَّاعَةُ؟ (5:15 أَمْ 5:30 أَمْ 3:25؟)`;
      }

        // 1. Check for Random Question or Test Request
        const isRandomRequest = normQuery.includes('عشوائي') || normQuery.includes('اختبرني') || normQuery.includes('اسالني') || normQuery.includes('سؤال من الكتاب') || normQuery.includes('تحدي');
        if (isRandomRequest) {
          const sampleQuestions = [
            {
              lesson: 'ازْرَعْ نَبْتَةً (الْوَحْدَةُ الأُولَى)',
              q: 'مَاذَا فَعَلَتْ مَرْيَمُ عِنْدَمَا لَمْ تَنْبُتِ الْبُذُورُ فِي الْمَرَّةِ الأُولَى؟',
              opts: ['اسْتَسْلَمَتْ وَتَرَكَتِ الزِّرَاعَةَ', 'حَاوَلَتْ مَرَّةً أُخْرَى بِبُذُورٍ جَدِيدَةٍ', 'غَضِبَتْ وَكَسَرَتِ الزُّجَاجَةَ'],
              ans: 'حَاوَلَتْ مَرَّةً أُخْرَى بِبُذُورٍ جَدِيدَةٍ',
              hint: 'الصَّبْرُ وَالْمُثَابَرَةُ مِفْتَاحُ النَّجَاحِ.'
            },
            {
              lesson: 'الْبَطَلُ الْخَفِيُّ (الْوَحْدَةُ الثَّانِيَةُ)',
              q: 'مَنْ هُوَ الْبَطَلُ الْخَفِيُّ الَّذِي كَشَفَهُ لُغْزُ الأُسْتَاذِ أَحْمَدَ؟',
              opts: ['مُدِيرُ الْمَدْرَسَةِ', 'الْعَمُّ أَمِينٌ حَارِسُ الْمَدْرَسَةِ', 'طَبِيبُ الْوَحْدَةِ الصِّحِّيَّةِ'],
              ans: 'الْعَمُّ أَمِينٌ حَارِسُ الْمَدْرَسَةِ',
              hint: 'أَوَّلُ مَنْ يَصِلُ إِلَى الْمَدْرَسَةِ وَآخِرُ مَنْ يُغَادِرُهَا.'
            },
            {
              lesson: 'نَشِيدُ أَصْحَابِ الْمِهَنِ (الْوَحْدَةُ الثَّانِيَةُ)',
              q: 'مَنْ صَاحِبُ الْمِهْنَةِ الَّذِي يَبْنِي دَاراً أَوْ مَدْرَسَةً فِي النَّشِيدِ؟',
              opts: ['النَّجَّارُ', 'الْبَنَّاءُ', 'الْحَدَّادُ'],
              ans: 'الْبَنَّاءُ',
              hint: 'فِي النَّشِيدِ: «ذَاكَ بَنَّاءٌ يَبْنِي دَاراً، أَوْ مَدْرَسَةً أَوْ أَسْوَاراً».'
            },
            {
              lesson: 'أَدَوَاتُ الاسْتِفْهَامِ (الأَسَالِيبُ وَالتَّرَاكِيبُ)',
              q: 'نَسْتَخْدِمُ أَدَاةَ الاسْتِفْهَامِ (لِمَاذَا) لِلسُّؤَالِ عَنِ:',
              opts: ['الزَّمَانِ', 'الْمَكَانِ', 'السَّبَبِ'],
              ans: 'السَّبَبِ',
              hint: '«لِمَاذَا نَذْهَبُ إِلَى الْمَدْرَسَةِ؟ لِنَتَعَلَّمَ».'
            }
          ];
          const pick = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
          return `${praise}
🎲 هَا هُوَ سُؤَالُ التَّحَدِّي الْعَشْوَائِيُّ الْمُخْتَارُ لَكَ مِنْ كِتَابِ الْوَزَارَةِ:

📌 الدَّرْسُ الْمُقَرَّرُ: «${pick.lesson}»
❓ السُّؤَالُ: ${pick.q}
${pick.opts.map((opt, i) => `${i + 1}) ${opt}`).join('\n')}

💡 تَلْمِيحٌ ذَكِيٌّ: ${pick.hint}
اكْتُبْ لِي رَقَمَ الإِجَابَةِ أَوْ نَصَّهَا هُنَا لأَرَى مَدَى شَجَاعَتِكَ وَذَكَائِكَ! 🚀`;
        }

        // 2. Check Poems in Reference JSON
        if (curriculumReferenceData?.poems) {
          const matchedPoem = curriculumReferenceData.poems.find((p: any) => {
            const normTitle = normalizeArabic(p.title);
            if (normTitle && (normQuery.includes(normTitle) || normTitle.includes(normQuery))) return true;
            if (p.keywords?.some((k: string) => {
              const normK = normalizeArabic(k);
              return normK && (normQuery.includes(normK) || normK.includes(normQuery));
            })) return true;
            return p.verses?.some((v: any) => {
              const normV1 = normalizeArabic(v.first);
              const normV2 = normalizeArabic(v.second);
              return (normV1 && normQuery.includes(normV1)) || (normV2 && normQuery.includes(normV2));
            });
          });

          if (matchedPoem) {
            let reply = `${praise}\nطَلَبْتَ «${matchedPoem.title}» مِنْ كِتَابِ الْوَزَارَةِ (${matchedPoem.unitTitle})، وَإِلَيْكَ الأَبْيَاتَ كَامِلَةً بِالتَّشْكِيلِ الدَّقِيقِ:\n\n${matchedPoem.fullText}`;
            if (matchedPoem.vocabulary && matchedPoem.vocabulary.length > 0) {
              reply += `\n\n📚 أَهَمُّ مُفْرَدَاتِ وَمَعَانِي النَّشِيدِ:\n` + matchedPoem.vocabulary.map((v: any) => `• ${v.word}: ${v.meaning || ''} ${v.opposite ? `(مُضَادُّهَا: ${v.opposite})` : ''} ${v.plural ? `(جَمْعُهَا: ${v.plural})` : ''}`).join('\n');
            }
            if (matchedPoem.moral) {
              reply += `\n\n💡 الْعِبْرَةُ وَالْفَائِدَةُ:\n${matchedPoem.moral}`;
            }
            return reply;
          }
        }

        // 2. Check Grammar Rules in Reference JSON (strictly avoiding prepositions / stop words)
        if (curriculumReferenceData?.grammarRules) {
          const matchedGrammar = curriculumReferenceData.grammarRules.find((g: any) => {
            const normTitle = normalizeArabic(g.title);
            if (normTitle && normTitle.length >= 4 && normQuery.includes(normTitle)) return true;
            return g.keywords?.some((k: string) => {
              const normK = normalizeArabic(k);
              if (!normK || STOP_WORDS.has(normK) || normK.length < 3) return false;
              return normQuery.includes(normK);
            });
          });

          if (matchedGrammar) {
            let reply = `${praise}\nإِلَيْكَ قَاعِدَةَ «${matchedGrammar.title}» كَمَا هِيَ مُقَرَّرَةٌ فِي كِتَابِ الْوَزَارَةِ:\n${matchedGrammar.summary}\n\n`;
            if (matchedGrammar.tools && matchedGrammar.tools.length > 0) {
              reply += `📝 الأَدَوَاتُ وَالأَمْثِلَةُ التَّوْضِيحِيَّةُ:\n` + matchedGrammar.tools.map((t: any) => {
                if (t.tool) return `• (${t.tool}): ${t.usage || t.meaning || ''} -> مِثْلَ: ${t.example || ''}`;
                if (t.type) return `• ${t.type}: ${t.meaning} -> أَمْثِلَة: ${t.examples}`;
                return `• ${JSON.stringify(t)}`;
              }).join('\n');
            }
            if (matchedGrammar.goldenRule) {
              reply += `\n\n⭐ الْقَاعِدَةُ الذَّهَبِيَّةُ:\n${matchedGrammar.goldenRule}`;
            }
            return reply;
          }
        }

        // 3. Check Stories in Reference JSON
        if (curriculumReferenceData?.storiesAndReading) {
          const matchedStory = curriculumReferenceData.storiesAndReading.find((s: any) => {
            const normTitle = normalizeArabic(s.title);
            if (normTitle && (normQuery.includes(normTitle) || normTitle.includes(normQuery))) return true;
            return s.keywords?.some((k: string) => {
              const normK = normalizeArabic(k);
              return normK && (normQuery.includes(normK) || normK.includes(normQuery));
            });
          });

          if (matchedStory) {
            let reply = `${praise}\nإِلَيْكَ دَرْسَ «${matchedStory.title}» مِنْ كِتَابِ الْوَزَارَةِ (${matchedStory.unitTitle}):\n\n${matchedStory.fullPassage}`;
            if (matchedStory.vocabulary && matchedStory.vocabulary.length > 0) {
              reply += `\n\n📚 أَهَمُّ مُفْرَدَاتِ الدَّرْسِ:\n` + matchedStory.vocabulary.map((v: any) => `• ${v.word}: ${v.meaning || ''} ${v.opposite ? `(مُضَادُّهَا: ${v.opposite})` : ''} ${v.plural ? `(جَمْعُهَا: ${v.plural})` : ''}`).join('\n');
            }
            if (matchedStory.moral) {
              reply += `\n\n💡 الدَّرْسُ الْمُسْتَفَادُ:\n${matchedStory.moral}`;
            }
            return reply;
          }
        }

        // 4. Check Spelling Rules in Reference JSON
        if (curriculumReferenceData?.spellingRules) {
          const matchedSpelling = curriculumReferenceData.spellingRules.find((sp: any) => {
            const normTitle = normalizeArabic(sp.title);
            if (normTitle && (normQuery.includes(normTitle) || normTitle.includes(normQuery))) return true;
            return sp.keywords?.some((k: string) => {
              const normK = normalizeArabic(k);
              return normK && (normQuery.includes(normK) || normK.includes(normQuery));
            });
          });

          if (matchedSpelling) {
            let reply = `${praise}\nإِلَيْكَ قَاعِدَةَ «${matchedSpelling.title}» الإِمْلائِيَّةَ الْمُقَرَّرَةَ:\n${matchedSpelling.summary}\n\n`;
            if (matchedSpelling.details) {
              reply += Object.entries(matchedSpelling.details).map(([key, val]) => `• ${val}`).join('\n');
            }
            return reply;
          }
        }

        // 5. Check Math Curriculum Concepts
        if (normQuery.includes('ضرب') || normQuery.includes('جدول') || normQuery.includes('خاصيه الابدال') || normQuery.includes('تفكيك') || normQuery.includes('توزيع')) {
          return `${praise}
🧮 إِلَيْكَ قَاعِدَةَ الضَّرْبِ مِنْ كِتَابِ الرِّيَاضِيَّاتِ لِلصَّفِّ الثَّالِثِ:
عَمَلِيَّةُ الضَّرْبِ هِيَ جَمْعٌ مُتَكَرِّرٌ!
• خَاصِّيَّةُ الإِبْدَالِ: 3 × 7 = 7 × 3 = 21.
• خَاصِّيَّةُ التَّفْكِيكِ: 8 × 7 = (8 × 5) + (8 × 2) = 40 + 16 = 56.
• الضَّرْبُ فِي 10: نَضَعُ صِفْراً عَلَى الْيَمِينِ (مِثْلَ: 6 × 10 = 60).
• الضَّرْبُ فِي 0: النَّاتِجُ دَائِماً يُسَاوِي 0!

🧠 سُؤَالُ الْعَبَاقِرَةِ: إِذَا كَانَ 5 × س = 35، فَمَا هِيَ قِيمَةُ س؟ (اخْتَرْ: 6، 7، أَمْ 8؟)`;
        }

        if (normQuery.includes('قسمه') || normQuery.includes('توزيع عادل') || normQuery.includes('مقسوم')) {
          return `${praise}
🍏 الْقِسْمَةُ هِيَ التَّوْزِيعُ الْعَادِلُ بِالتَّسَاوِي، وَهِيَ الْعَمَلِيَّةُ الْعَكْسِيَّةُ لِلضَّرْبِ:
• إِذَا كَانَ: 4 × 5 = 20، فَإِنَّ: 20 ÷ 5 = 4، وَ 20 ÷ 4 = 5!
• مِثَالٌ: لَدَيْنَا 18 قَلَماً نُرِيدُ تَوْزِيعَهَا عَلَى 3 تَلاَمِيذَ بِالتَّسَاوِي:
الْحَلُّ: 18 ÷ 3 = 6 أَقْلامٍ لِكُلِّ تِلْمِيذٍ!

❓ سُؤَالٌ تَفَاعُلِيٌّ: مَا نَاتِجُ 24 ÷ 6؟ (اخْتَرْ: 3، 4، أَمْ 5؟)`;
        }

        if (normQuery.includes('ساعه') || normQuery.includes('وقت') || normQuery.includes('منقضي') || normQuery.includes('دقائق') || normQuery.includes('عقرب')) {
          return `${praise}
⏰ شَرْحُ دَرْسِ السَّاعَةِ وَقِرَاءَةِ الْوَقْتِ وَالْمُدَّةِ الزَّمَنِيَّةِ (مَرْجِعُ كِتَابِ الْوَزَارَةِ، سِلَاحِ التِّلْمِيذِ، وَالأَضْوَاءِ):

1️⃣ أَجْزَاءُ السَّاعَةِ:
• عَقْرَبُ السَّاعَاتِ (الْقَصِيرُ الْبَطِيءُ): يُحَدِّدُ رَقَمَ السَّاعَةِ.
• عَقْرَبُ الدَّقَائِقِ (الطَّوِيلُ السَّرِيعُ): نَضْرِبُ الرَّقَمَ الَّذِي يَقِفُ عَلَيْهِ فِي 5 لِمَعْرِفَةِ الدَّقَائِقِ!

2️⃣ جَدْوَلُ قِرَاءَةِ عَقْرَبِ الدَّقَائِقِ (الْقَفْزُ بِمِقْدَارِ 5 دَقَائِقَ):
• عِنْدَ 12 ⬅️ السَّاعَةُ تَمَاماً (:00)
• عِنْدَ 1 ⬅️ وَخَمْسُ دَقَائِقَ (:05)
• عِنْدَ 2 ⬅️ وَعَشْرُ دَقَائِقَ (:10)
• عِنْدَ 3 ⬅️ وَالرُّبْعُ (:15 دَقِيقَةً)
• عِنْدَ 4 ⬅️ وَالثُّلْثُ (:20 دَقِيقَةً)
• عِنْدَ 5 ⬅️ وَالنِّصْفُ إِلَّا خَمْسَةً (:25 دَقِيقَةً)
• عِنْدَ 6 ⬅️ وَالنِّصْفُ (:30 دَقِيقَةً)
• عِنْدَ 7 ⬅️ وَالنِّصْفُ وَخَمْسَةٌ (:35 دَقِيقَةً)
• عِنْدَ 8 ⬅️ إِلَّا ثُلْثاً (:40 دَقِيقَةً)
• عِنْدَ 9 ⬅️ إِلَّا رُبْعاً (:45 دَقِيقَةً)
• عِنْدَ 10 ⬅️ إِلَّا عَشْرَ دَقَائِقَ (:50 دَقِيقَةً)
• عِنْدَ 11 ⬅️ إِلَّا خَمْسَ دَقَائِقَ (:55 دَقِيقَةً)

3️⃣ حِسَابُ الْوَقْتِ الْمُنْقَضِي (الْمُدَّةِ الزَّمَنِيَّةِ):
القاعدة: «الْوَقْتُ الْمُنْقَضِي = وَقْتُ النِّهَايَةِ - وَقْتُ الْبِدَايَةِ»
📌 مِثَالٌ مَحْلُولٌ:
بَدَأَ التِّلْمِيذُ الْمُذَاكَرَةَ السَّاعَةَ 3:15 وَانْتَهَى السَّاعَةَ 4:45.
• نَقْفِزُ سَاعَةً كَامِلَةً: مِنْ 3:15 إِلَى 4:15 = 1 سَاعَةٌ (60 دَقِيقَةً).
• نَقْفِزُ الدَّقَائِقَ الْمُتَبَقِّيَةَ: مِنْ 4:15 إِلَى 4:45 = 30 دَقِيقَةً.
• الْوَقْتُ الْمُنْقَضِي الْكُلِّيُّ = سَاعَةٌ وَ 30 دَقِيقَةً (أَيْ 90 دَقِيقَةً)!

4️⃣ تَحْوِيلَاتٌ زَمَنِيَّةٌ مُهِمَّةٌ لِلِامْتِحَانِ:
• 1 سَاعَة = 60 دَقِيقَةً
• نِصْفُ سَاعَةٍ = 30 دَقِيقَةً
• رُبْعُ سَاعَةٍ = 15 دَقِيقَةً
• ثُلْثُ سَاعَةٍ = 20 دَقِيقَةً
• ثَلَاثَةُ أَرْبَاعِ السَّاعَةِ = 45 دَقِيقَةً
• 1 دَقِيقَة = 60 ثَانِيَةً

🎯 تَحَدٍّ لَكَ يَا بَطَلُ: إِذَا كَانَ عَقْرَبُ السَّاعَاتِ عِنْدَ 5 وَعَقْرَبُ الدَّقَائِقِ عِنْدَ 3، فَكَمْ تَكُونُ السَّاعَةُ؟ (5:15 أَمْ 5:30 أَمْ 3:25؟)`;
        }

        if (normQuery.includes('محيط') || normQuery.includes('مساحه') || normQuery.includes('مضلع') || normQuery.includes('مستطيل') || normQuery.includes('مربع')) {
          return `${praise}
📐 الْهَنْدَسَةُ: الْمُحِيطُ وَالْمَسَاحَةُ:
• الْمُحِيطُ: هُوَ مَجْمُوعُ أَطْوَالِ الأَضْلاعِ الْخَارِجِيَّةِ لِلشَّكْلِ.
(مُحِيطُ الْمُسْتَطِيلِ = (الطُّولُ + الْعَرْضُ) × 2).
• الْمَسَاحَةُ: هِيَ عَدَدُ الْوَحَدَاتِ الْمُرَبَّعَةِ دَاخِلَ الشَّكْلِ.
(مَسَاحَةُ الْمُسْتَطِيلِ = الطُّولُ × الْعَرْضُ، أَوْ عَدَدُ الصُّفُوفِ × عَدَدُ الأَعْمِدَةِ فِي الْمَصْفُوفَةِ).`;
        }

        if (normQuery.includes('كسور') || normQuery.includes('كسر') || normQuery.includes('بسط') || normQuery.includes('مقام')) {
          return `${praise}
🍕 دَرْسُ الْكُسُورِ الاعْتِيَادِيَّةِ:
• الْبَسْطُ (فِي الأَعْلَى): يُعَبِّرُ عَنِ الأَجْزَاءِ الْمُلَوَّنَةِ.
• الْمَقَامُ (فِي الأَسْفَلِ): يُعَبِّرُ عَنْ جَمِيعِ الأَجْزَاءِ الْمُتَسَاوِيَةِ.
• الْمُقَارَنَةُ: إِذَا تَسَاوَى الْمَقَامَانِ: الْبَسْطُ الأَكْبَرُ هُوَ الأَكْبَرُ (3/5 > 2/5).
أَمَّا إِذَا تَسَاوَى الْبَسْطَانِ: الْمَقَامُ الأَصْغَرُ هُوَ الأَكْبَرُ (1/2 > 1/4)!`;
        }

        // 6. Check English Connect 3 Curriculum Concepts
        if (normQuery.includes('انجليزي') || normQuery.includes('connect') || normQuery.includes('feel') || normQuery.includes('headache') || normQuery.includes('medicine') || normQuery.includes('zoo') || normQuery.includes('circus')) {
          return `${praise}
🔤 إِلَيْكَ قَاعِدَةَ اللُّغَةِ الإِنْجِلِيزِيَّةِ مِنْ مَنْهَجِ Connect 3:
• الوحدة الأولى (Feelings):
- How do you feel? -> I feel happy (سَعِيدٌ) / I feel thirsty (عَطْشَانٌ) / I feel hungry (جَوْعَانٌ).
• الوحدة الثانية (Health & Medicine):
- What's the matter? -> I have a cold (بَرْدٌ) / I have a headache (صُدَاعٌ) / I have a fever (حُمَّى).
- Take your medicine (تَنَاوَلْ دَوَاءَكَ).
• الفونكس Phonics:
- الصوت الطويل ee / ea مثل: sleep, green, eat, clean.

💡 Challenge: Complete: "What's the matter? I have a ... (headache / happy / play)?"`;
        }

        // Default friendly textbook guidance across all subjects
        return `${praise}
أَنَا رَفِيقُكَ الرُّوبُوتُ الْمُعَلِّمُ الذَّكِيُّ لِجَمِيعِ مَوَادِّ الصَّفِّ الثَّالِثِ الِابْتِدَائِيِّ مَعَ الأُسْتَاذِ شَرِيف عَسْقَلَانِي!
🧮 فِي الرِّيَاضِيَّاتِ: اسْأَلْنِي عَنْ جَدَاوِلِ الضَّرْبِ، الْقِسْمَةِ، الْوَقْتِ، الْمُحِيطِ، وَالْكُسُورِ.
🔤 فِي الإِنْجِلِيزِيِّ: اسْأَلْنِي عَنْ أَيِّ كَلِمَةٍ أَوْ قَاعِدَةٍ فِي Connect 3 (مَعَانٍ، فُونِكْس، وَتَرْجَمَةٍ).
📖 فِي اللُّغَةِ الْعَرَبِيَّةِ: اسْأَلْنِي عَنِ الأَنَاشِيدِ، الْقِصَصِ، النَّحْوِ، وَالإِمْلَاءِ!
اكْتُبْ لِي سُؤَالَكَ الآنَ وَسَأُجِيبُكَ فَوْراً كَمُعَلِّمِكَ الْخَاصِّ! ⭐`;
      };

      try {
        const ai = getAIClient();
        if (!ai) {
          return res.json({ reply: getCurriculumAnswer(userMsg) });
        }

        // Compact context injection: prefer specific slice if available, else send concise curriculum catalog
        const referenceContextToInject = curriculumContext || {
          curriculumMetadata: curriculumReferenceData.curriculumMetadata,
          poemsSummary: curriculumReferenceData.poems?.map((p: any) => ({ id: p.id, title: p.title, unit: p.unitTitle, keywords: p.keywords })),
          grammarSummary: curriculumReferenceData.grammarRules?.map((g: any) => ({ id: g.id, title: g.title, summary: g.summary, keywords: g.keywords })),
          storiesSummary: curriculumReferenceData.storiesAndReading?.map((s: any) => ({ id: s.id, title: s.title, keywords: s.keywords }))
        };

        const systemPrompt = `أنت «الرُّوبُوتُ الْمُعَلِّمُ الذَّكِيُّ الشَّامِلُ» لِمَنَصَّةِ الطَّالِبِ الْمُجْتَهِدِ - الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ (جُمْهُورِيَّةُ مِصْرَ الْعَرَبِيَّةِ)، إِعْدَادُ وَتَطْوِيرُ: الأُسْتَاذُ شَرِيف عَسْقَلَانِي (واتساب: 01080997505).

الْمَرَاجِعُ التَّعْلِيمِيَّةُ الْمُعْتَمَدَةُ (Official Egyptian Curriculum Sources):
1. كُتُبُ وَزَارَةِ التَّرْبِيَةِ وَالتَّعْلِيمِ الْمِصْرِيَّةِ الرَّسْمِيَّةُ لِلْمَوَادِّ الثَّلَاثِ وَمَوْقِعُ الْوَزَارَةِ الإِلِكْتَرُونِيُّ وَبَنْكُ الْمَعْرِفَةِ.
2. الْكُتُبُ الْخَارِجِيَّةُ الْمُعْتَمَدَةُ: سِلَاحُ التِّلْمِيذِ، كِتَابُ الأَضْوَاءِ، وَكِتَابُ بَكَّار (فِي الرِّيَاضِيَّاتِ وَاللُّغَةِ الْعَرَبِيَّةِ).
3. كِتَابُ الْمُعَاصِرِ (El Moasser) وَكِتَابُ Bit by Bit (فِي اللُّغَةِ الإِنْجِلِيزِيَّةِ Connect 3).

المواد المعتمدة:
1. الرياضيات (الضرب وخواصه، القسمة، الوقت وقراءة الساعة والوقت المنقضي بدقة متناهية، المحيط والمساحة، الكسور الاعتيادية، الألوف، والتمثيل البياني).
2. اللغة الإنجليزية (منهج Connect 3: الوحدات 1-6، الفونكس، القاموس، وتراكيب المشاعر والصحة والهوايات).
3. اللغة العربية (الأناشيد الرسمية، القراءة والقصص، النحو والأساليب، وقواعد الإملاء).

قَوَاعِدُ الرِّيَاضِيَّاتِ وَالسَّاعَةِ الْمُعْتَمَدَةُ (مُهِمٌّ جِدّاً لِلدِّقَّةِ):
• عَقْرَبُ السَّاعَاتِ (الْقَصِيرُ) يُحَدِّدُ السَّاعَةَ، وَعَقْرَبُ الدَّقَائِقِ (الطَّوِيلُ) نَضْرِبُ رَقَمَهُ فِي 5:
  (12: تماماً، 1: 5 دقائق، 2: 10 دقائق، 3: ربع ساعة/15 دقيقة، 4: ثلث ساعة/20 دقيقة، 5: نصف إلا خمسة/25 دقيقة، 6: نصف ساعة/30 دقيقة، 7: نصف وخمسة/35 دقيقة، 8: إلا ثلث/40 دقيقة، 9: إلا ربع/45 دقيقة، 10: إلا عشرة/50 دقيقة، 11: إلا خمسة/55 دقيقة).
• حِسَابُ الْوَقْتِ الْمُنْقَضِي: نَقْفِزُ بِالسَّاعَاتِ ثُمَّ بِالدَّقَائِقِ: (وَقْتُ النِّهَايَةِ - وَقْتُ الْبِدَايَةِ).
• أَيُّ حِسَابٍ رِيَاضِيٍّ يَجِبُ أَنْ يَكُونَ دَقِيقاً 100% وَمُوَضَّحاً خَطْوَةً بِخَطْوَةٍ.

اسم التلميذ: ${name}
نوع البطل: ${isGirl ? "بنت / بطلة" : "ولد / بطل"}
الدرس الحالي في التطبيق: ${currentLessonTitle || "عام"} من مادة: ${unitTitle || "المنهج"}.

مَرْجِعُ كِتَابِ الْوَزَارَةِ الرَّسْمِيُّ الْمُرْفَقُ (Curriculum Context):
\`\`\`json
${JSON.stringify(referenceContextToInject)}
\`\`\`

قَوَاعِدُ الرُّوبُوتِ الذَّكِيِّ (Strict Instructions):
1. ابْدَأْ دَائِماً رَدَّكَ بِعِبَارَةِ تَشْجِيعٍ مُبْهِجَةٍ تَذْكُرُ فِيهَا اسْمَ التِّلْمِيذِ صَرَاحَةً:
   ${isGirl ? `«أَحْسَنْتِ يَا بَطَلَتَنَا ${name}! 🌟»` : `«أَحْسَنْتَ يَا بَطَلَنَا ${name}! 🌟»`}
2. الشرح المبسط والتفاعلي (Child-Friendly Pedagogy):
   - اشرح بأسلوب معلم يحب الأطفال ويفهم سنهم (8-9 سنوات).
   - في الرياضيات: وضح الخطوات الرياضية خطوة بخطوة بالجمع والضرب مع أمثلة من الحياة (تفاح، قطع حلوى، ساعات).
   - في الإنجليزي: اكتب الكلمة بالإنجليزية ثم ترجمتها ونطقها الصوتي بحروف عربية وجملة عليها.
   - في العربي: التزم بالتشكيل التام وقواعد كتاب الوزارة.
3. التفاعل مع الطفل: اطرح عليه سؤالاً أو تحدياً صغيراً في نهاية الشرح ليجيب عليه ويشعر بالفخر والإنجاز!`;

        // Helper function for safe generation with gemini-3.8-flash as primary
        const generateWithFallback = async () => {
          const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest"];
          for (const model of candidateModels) {
            try {
              const res = await ai.models.generateContent({
                model,
                contents: [
                  { role: "user", parts: [{ text: `${systemPrompt}\n\nرسالة التلميذ: ${userMsg}` }] }
                ]
              });
              if (res && res.text) {
                return res.text;
              }
            } catch (modelErr: any) {
              console.warn(`Model ${model} unavailable (${modelErr?.status || modelErr?.code || "error"}), trying next...`);
            }
          }
          return null;
        };

        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 14000));
        const aiText = await Promise.race([generateWithFallback(), timeoutPromise]);

        if (aiText) {
          return res.json({ reply: aiText });
        }

        // If AI model is busy, times out or unavailable, immediately return guaranteed official textbook answer
        return res.json({ reply: getCurriculumAnswer(userMsg) });
      } catch (err: any) {
        console.warn("Notice: Falling back to official curriculum database due to upstream availability:", err?.message || err);
        const curriculumReply = getCurriculumAnswer(userMsg);
        return res.json({ reply: curriculumReply });
      }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
