// Vercel Serverless Function for AI Tutor across Math, English (Connect 3), and Arabic
// Handles POST /api/tutor

import { GoogleGenAI } from '@google/genai';

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
    .toLowerCase()
    .trim();
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, studentName, heroType, currentLessonTitle, unitTitle } = req.body || {};
  const isGirl = heroType === 'girl';
  const name = studentName?.trim() || (isGirl ? 'بَطَلَتَنَا' : 'بَطَلَنَا');
  const userMsg = (message || '').trim();
  const praise = isGirl ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${name}! 🌟` : `أَحْسَنْتَ يَا بَطَلَنَا ${name}! 🌟`;
  const normQuery = normalizeArabic(userMsg);

  // 1. Check if Gemini AI key is available
  const ai = getAIClient();
  if (ai) {
    try {
      const systemInstruction = `أنت «الرُّوبُوتُ الْمُعَلِّمُ الذَّكِيُّ الشَّامِلُ» لمنصة الطالب المجتهد - الصف الثالث الابتدائي بجمهورية مصر العربية.
المطور والمعلم المشرف: الأستاذ شريف عسقلاني (واتساب: 01080997505).
المواد الثلاث:
1. الرياضيات (حساب الوقت وقراءة الساعة بالساعات والدقائق بدقة 100%، الوقت المنقضي، جداول الضرب وخواص الإبدال والتوزيع، القسمة العادلة، الكسور الاعتيادية وبسط ومقام، المحيط والمساحة).
2. اللغة الإنجليزية (منهج Connect 3 المعتمد، الفونكس، الكلمات والمحادثات والقواعد).
3. اللغة العربية (الأناشيد الرسمية، القراءة والقصص، قواعد النحو والأساليب، الإملاء).

اسم التلميذ: ${name} (${isGirl ? 'بنت' : 'ولد'}).
الهدف الرئيسي: مساعدة التلميذ ورفع عبء المذاكرة عن أولياء الأمور، وتقديم إجابات تعليمية مبسطة، مشجعة، وواضحة جداً مع تشكيل للكلمات الصعبة.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nسؤال التلميذ: ${userMsg}` }] }
        ]
      });

      if (response.text) {
        return res.status(200).json({ reply: response.text });
      }
    } catch (e) {
      console.warn('Gemini call failed in serverless, using curriculum brain:', e);
    }
  }

  // 2. Comprehensive Primary 3 Curriculum Knowledge Engine (Fallback & Instant Engine)
  // A. Clock & Time
  if (normQuery.includes('ساعه') || normQuery.includes('وقت') || normQuery.includes('دقائق') || normQuery.includes('عقرب')) {
    return res.status(200).json({
      reply: `${praise}
⏰ شَرْحُ دَرْسِ السَّاعَةِ وَقِرَاءَةِ الْوَقْتِ لِلصَّفِّ الثَّالِثِ الابْتِدَائِيِّ:
1️⃣ عَقْرَبُ السَّاعَاتِ (الْقَصِيرُ): يُشِيرُ إِلَى رَقَمِ السَّاعَةِ.
2️⃣ عَقْرَبُ الدَّقَائِقِ (الطَّوِيلُ): نَقْفِزُ بِمِقْدَارِ 5 دَقَائِقَ مَعَ كُلِّ رَقَمٍ!
• 12 ⬅️ تَمَاماً (:00)
• 3 ⬅️ وَالرُّبْعُ (:15 دَقِيقَةً)
• 4 ⬅️ وَالثُّلْثُ (:20 دَقِيقَةً)
• 6 ⬅️ وَالنِّصْفُ (:30 دَقِيقَةً)
• 9 ⬅️ إِلَّا رُبْعاً (:45 دَقِيقَةً)

💡 قَاعِدَةُ الْوَقْتِ الْمُنْقَضِي: «الْوَقْتُ الْمُنْقَضِي = وَقْتُ النِّهَايَةِ - وَقْتُ الْبِدَايَةِ».`
    });
  }

  // B. Math Multiplication & Division
  if (normQuery.includes('ضرب') || normQuery.includes('جدول') || normQuery.includes('قسمه')) {
    return res.status(200).json({
      reply: `${praise}
🧮 أَسْرَارُ الضَّرْبِ وَالْقِسْمَةِ فِي الرِّيَاضِيَّاتِ:
• الضَّرْبُ هُوَ جَمْعٌ مُتَكَرِّرٌ! مِثَالٌ: 4 × 3 = 3 + 3 + 3 + 3 = 12.
• خَاصِّيَّةُ الإِبْدَالِ: 6 × 7 = 7 × 6 = 42!
• خَاصِّيَّةُ التَّوْزِيعِ: 8 × 7 = (8 × 5) + (8 × 2) = 40 + 16 = 56!
• الْقِسْمَةُ هِيَ التَّوْزِيعُ الْعَادِلُ بِالتَّسَاوِي: 20 ÷ 4 = 5 (لأَنَّ 5 × 4 = 20).`
    });
  }

  // C. English Connect 3
  if (normQuery.includes('انجليزي') || normQuery.includes('connect') || normQuery.includes('english') || normQuery.includes('ترجم') || normQuery.includes('معنى')) {
    return res.status(200).json({
      reply: `${praise}
🔤 مَنْهَجُ Connect 3 لِلصَّفِّ الثَّالِثِ الابْتِدَائِيِّ:
• Unit 1 (Feelings): How do you feel? -> I feel happy / excited / thirsty / tired.
• Unit 2 (Health): What's the matter? -> I have a cold / headache / fever.
• Phonics: الصوت الطويل ee / ea مثل: sleep, green, eat, clean.
اسْأَلْنِي عَنْ أَيِّ كَلِمَةٍ إِذَا أَرَدْتَ مَعْنَاهَا وَنُطْقَهَا الصَّحِيحَ! 🌟`
    });
  }

  // D. Arabic Language & Grammar
  if (normQuery.includes('عربي') || normQuery.includes('نشيد') || normQuery.includes('نحو') || normQuery.includes('قصه') || normQuery.includes('اسم') || normQuery.includes('فعل')) {
    return res.status(200).json({
      reply: `${praise}
📖 مَنْهَجُ اللُّغَةِ الْعَرَبِيَّةِ لِلصَّفِّ الثَّالِثِ الابْتِدَائِيِّ:
• أَقْسَامُ الْكَلِمَةِ: اسْمٌ (مِثْلَ: مَدْرَسَة، شَجَرَة)، فِعْلٌ (مَاضٍ، مُضَارِعٌ، أَمْرٌ)، حَرْفٌ (مِنْ، إِلَى، عَنْ، عَلَى، فِي).
• الأَنَاشِيدُ الْمُقَرَّرَةُ: «صِحَّتُنَا سِرُّ سَعَادَتِنَا»، «أَرْضُ مَوْطِنِي».
• الظَّوَاهِرُ اللُّغَوِيَّةُ: لَامُ التَّعْلِيلِ، يَاءُ الْمِلْكِيَّةِ، أُسْلُوبُ النَّهْيِ بـ (لَا)، وَالتَّاءُ الْمَرْبُوطَةُ وَالْمَفْتُوحَةُ!`
    });
  }

  // Default response
  return res.status(200).json({
    reply: `${praise}
أَنَا رَفِيقُكَ الرُّوبُوتُ الْمُعَلِّمُ الذَّكِيُّ لِجَمِيعِ مَوَادِّ الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ (الرِّيَاضِيَّاتُ، Connect 3، وَاللُّغَةُ الْعَرَبِيَّةُ) مَعَ الأُسْتَاذِ شَرِيف عَسْقَلَانِي!
اُكْتُبْ لِي أَيَّ سُؤَالٍ فِي وَاجِبِكَ أَوْ مَنْهَجِكَ وَسَأُجِيبُكَ بِالتَّفْصِيلِ خَطْوَةً بِخَطْوَةٍ! 🤖⭐`
  });
}
