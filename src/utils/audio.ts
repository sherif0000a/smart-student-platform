// Kid-Friendly Web Audio & Speech Synthesis Engine with Mobile Audio Unlock & Anti-Stall Guards

// Global references to prevent browser garbage collection cutting off speech on Android/iOS
declare global {
  interface Window {
    __activeUtterance?: SpeechSynthesisUtterance | null;
    __speechKeepAliveTimer?: any;
    __hasUnlockedMobileAudio?: boolean;
  }
}

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. Welcome to Lesson Sound (Magical Ascending Glockenspiel Arpeggio)
  public playWelcomeLesson() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        gain.gain.setValueAtTime(0.16, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.4);
      });
    } catch {}
  }

  // 2. Cheerful Encouragement Sound on Correct Answer
  public playCheerSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // First chord: F5 + A5
      [698.46, 880.0].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      });

      // Second chord: G5 + B5
      [783.99, 987.77].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.12);
        gain.gain.setValueAtTime(0.15, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.12);
        osc.stop(now + 0.12 + 0.3);
      });

      // Final triumphant chord: C6 + E6 + G6
      [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.24);
        gain.gain.setValueAtTime(0.18, now + 0.24);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24 + 0.6 + idx * 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.24);
        osc.stop(now + 0.24 + 0.7);
      });
    } catch {}
  }

  public playSuccess() {
    this.playCheerSuccess();
  }

  // 3. Smooth Transition Between Tabs & Lessons
  public playTransition() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  public playTabSwitch() {
    this.playTransition();
  }

  // 4. Interactive Tactile Tap for Buttons & Options
  public playButtonTap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public playClick() {
    this.playButtonTap();
  }

  // 5. Gentle Hint & Learning Prompt Sound
  public playHint() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 523.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.08, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.15);
      });
    } catch {}
  }

  public playEncourage() {
    this.playHint();
  }

  public playStar() {
    this.playWelcomeLesson();
  }

  public playBalloonPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playBonusScore() {
    this.playCheerSuccess();
  }

  public playLevelUp() {
    this.playFanfare();
  }

  // 6. Royal Fanfare for Certificates and Honors
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.0, d: 0.14 },
        { f: 659.25, t: 0.15, d: 0.14 },
        { f: 783.99, t: 0.30, d: 0.14 },
        { f: 1046.50, t: 0.45, d: 0.45 }
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.18, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    } catch {}
  }
}

export const sounds = new SoundEffectsEngine();

// Mobile audio unlocker: resumes Web Audio Context and primes SpeechSynthesis & HTMLAudio on first tap
export function unlockMobileAudio() {
  if (typeof window === 'undefined') return;

  try {
    const ctx = sounds.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (ctx) {
      // Play a 1-sample inaudible buffer to reliably unlock Web Audio on iOS Safari & Chrome
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }

    if (window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Prime mobile TTS pipeline with a tiny space character
      if (!window.__hasUnlockedMobileAudio) {
        const dummy = new SpeechSynthesisUtterance(' ');
        dummy.volume = 0.01;
        dummy.rate = 2.0;
        window.speechSynthesis.speak(dummy);
      }
    }

    window.__hasUnlockedMobileAudio = true;
  } catch {}
}

// Auto-register touch & click unlockers across all interaction types
if (typeof window !== 'undefined') {
  const events = ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'];
  events.forEach((evt) => {
    window.addEventListener(evt, unlockMobileAudio, { passive: true });
  });
}

// Track active audio sessions and elements
let currentAudioElement: HTMLAudioElement | null = null;
let currentAudioTimeout: any = null;
let isGloballyPlayingAudio = false;
let currentSessionCounter = 0;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Preload voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

// Clear any ongoing speech keep-alive timer
function clearKeepAlive() {
  if (typeof window !== 'undefined' && window.__speechKeepAliveTimer) {
    clearInterval(window.__speechKeepAliveTimer);
    window.__speechKeepAliveTimer = null;
  }
}

// Global Stop Audio function
export function stopSpeaking() {
  currentSessionCounter++;
  isGloballyPlayingAudio = false;
  clearKeepAlive();

  if (currentAudioTimeout) {
    clearTimeout(currentAudioTimeout);
    currentAudioTimeout = null;
  }

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch {}
    currentAudioElement = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      window.__activeUtterance = null;
    } catch {}
  }
}

export function isAudioPlaying(): boolean {
  return isGloballyPlayingAudio;
}

// Speech Synthesis Keep-Alive to fix mobile Chrome 15s freeze & audio cut-off
function startSpeechKeepAlive() {
  clearKeepAlive();
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.__speechKeepAliveTimer = setInterval(() => {
    try {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearKeepAlive();
      }
    } catch {
      clearKeepAlive();
    }
  }, 10000);
}

// Clean and prepare Arabic text for clear recitation
function cleanArabicForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[#*_~`>[\]()]/g, ' ')
    .replace(/http[s]?:\/\/\S+/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Browser Web Speech fallback with Android/iOS garbage collection and stall guards
function runWebSpeech(
  text: string,
  lang: 'ar-SA' | 'en-US',
  rate: number,
  onStart?: () => void,
  onEnd?: () => void,
  sessionId?: number
) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return;
  }

  try {
    unlockMobileAudio();
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // CRITICAL: save to window to prevent JavaScript Garbage Collection from cutting off audio mid-speech on mobile!
    window.__activeUtterance = utterance;

    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
    
    if (lang === 'ar-SA') {
      const arabicVoice = voices.find(
        (v) =>
          v.lang.startsWith('ar') ||
          v.name.toLowerCase().includes('arabic') ||
          v.name.toLowerCase().includes('tarik') ||
          v.name.toLowerCase().includes('laila') ||
          v.name.toLowerCase().includes('maged') ||
          v.name.toLowerCase().includes('zeina') ||
          v.name.toLowerCase().includes('shakir')
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
    } else {
      const enVoice = voices.find(
        (v) =>
          (v.lang.startsWith('en') || v.lang === 'en-US' || v.lang === 'en-GB') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Victoria'))
      ) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }

    utterance.onstart = () => {
      if (sessionId !== undefined && sessionId !== currentSessionCounter) {
        window.speechSynthesis.cancel();
        return;
      }
      isGloballyPlayingAudio = true;
      startSpeechKeepAlive();
      onStart?.();
    };

    utterance.onend = () => {
      clearKeepAlive();
      window.__activeUtterance = null;
      if (sessionId !== undefined && sessionId !== currentSessionCounter) return;
      isGloballyPlayingAudio = false;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      clearKeepAlive();
      window.__activeUtterance = null;
      if (sessionId !== undefined && sessionId !== currentSessionCounter) return;
      isGloballyPlayingAudio = false;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    clearKeepAlive();
    window.__activeUtterance = null;
    isGloballyPlayingAudio = false;
    onEnd?.();
  }
}

// Speak Arabic text cleanly with dual engine: Server MP3 stream (if online) with instant Web Speech fallback
export function speakArabic(
  text: string,
  onEnd?: () => void,
  onStart?: () => void,
  rate: number = 0.95
): { stop: () => void } {
  stopSpeaking();
  unlockMobileAudio();

  const cleanText = cleanArabicForSpeech(text);
  if (!cleanText) {
    onEnd?.();
    return { stop: () => stopSpeaking() };
  }

  const activeSessionId = ++currentSessionCounter;
  let hasStarted = false;
  isGloballyPlayingAudio = true;

  const safeEnd = () => {
    if (activeSessionId !== currentSessionCounter) return;
    isGloballyPlayingAudio = false;
    if (currentAudioTimeout) {
      clearTimeout(currentAudioTimeout);
      currentAudioTimeout = null;
    }
    currentAudioElement = null;
    onEnd?.();
  };

  const safeStart = () => {
    if (activeSessionId !== currentSessionCounter) return;
    if (!hasStarted) {
      hasStarted = true;
      if (currentAudioTimeout) {
        clearTimeout(currentAudioTimeout);
        currentAudioTimeout = null;
      }
      onStart?.();
    }
  };

  // Universal playback engine for mobile & desktop: High-quality MP3 stream first with instant Web Speech fallback
  try {
    const textSample = cleanText.slice(0, 450).trim();
    const audioUrl = `/api/tts?text=${encodeURIComponent(textSample)}&tl=ar`;
    const audio = new Audio();
    currentAudioElement = audio;
    audio.preload = 'auto';
    audio.playbackRate = Math.max(0.6, Math.min(1.8, rate));

    // Watchdog: If server audio doesn't start in 650ms, fall back to Web Speech API
    currentAudioTimeout = setTimeout(() => {
      if (activeSessionId !== currentSessionCounter) return;
      if (!hasStarted) {
        runWebSpeech(cleanText, 'ar-SA', rate, safeStart, safeEnd, activeSessionId);
      }
    }, 650);

    audio.onplay = () => {
      if (activeSessionId !== currentSessionCounter) {
        audio.pause();
        return;
      }
      safeStart();
    };

    audio.onended = () => {
      if (activeSessionId !== currentSessionCounter) return;
      safeEnd();
    };

    audio.onerror = () => {
      if (activeSessionId !== currentSessionCounter) return;
      runWebSpeech(cleanText, 'ar-SA', rate, safeStart, safeEnd, activeSessionId);
    };

    audio.src = audioUrl;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (activeSessionId !== currentSessionCounter) return;
        runWebSpeech(cleanText, 'ar-SA', rate, safeStart, safeEnd, activeSessionId);
      });
    }
  } catch {
    runWebSpeech(cleanText, 'ar-SA', rate, safeStart, safeEnd, activeSessionId);
  }

  return { stop: () => stopSpeaking() };
}

// Split Arabic text into natural sentences for the interactive sentence-by-sentence reader
export function splitArabicSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/[\n.!?؟]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Cheerful praise voice for achievements, badges, and completed missions
export function playPraiseVoice(
  studentNameOrIsGirl?: string | boolean,
  isGirlParam?: boolean,
  customPhrase?: string
): void {
  sounds.playCheerSuccess();

  if (customPhrase) {
    speakArabic(customPhrase);
    return;
  }

  const isGirl = typeof studentNameOrIsGirl === 'boolean' 
    ? studentNameOrIsGirl 
    : (isGirlParam ?? false);
  const studentName = typeof studentNameOrIsGirl === 'string' && studentNameOrIsGirl.trim().length > 0 
    ? studentNameOrIsGirl.trim() 
    : (isGirl ? 'بَطَلَتَنَا' : 'بَطَلَنَا');

  const praisesBoys = [
    `أَحْسَنْتَ يَا ${studentName}! أَنْتَ فَخْرٌ لِلْجَمِيعِ! 🌟`,
    `عَبْقَرِيٌّ يَا ${studentName}! إِجَابَةٌ رَائِعَةٌ وَتَفَوُّقٌ مُسْتَحَقٌّ! 🚀`,
    `مَا شَاءَ اللَّهُ عَلَيْكَ يَا ${studentName}! انْطَلِقْ نَحْوَ الصَّدَارَةِ! 🏆`
  ];
  const praisesGirls = [
    `أَحْسَنْتِ يَا ${studentName}! أَنْتِ فَخْرٌ لِلْجَمِيعِ! 🌟`,
    `عَبْقَرِيَّةٌ يَا ${studentName}! إِجَابَةٌ رَائِعَةٌ وَتَفَوُّقٌ مُسْتَحَقٌّ! 🚀`,
    `مَا شَاءَ اللَّهُ عَلَيْكِ يَا ${studentName}! انْطَلِقِي نَحْوَ الصَّدَارَةِ! 🏆`
  ];
  const list = isGirl ? praisesGirls : praisesBoys;
  const chosen = list[Math.floor(Math.random() * list.length)];
  speakArabic(chosen);
}

// Ultra-clear English Speech for Vocabulary & Dictionary
export function speakEnglish(
  text: string,
  onEnd?: () => void,
  onStart?: () => void,
  rate: number = 0.85
): { stop: () => void } {
  stopSpeaking();
  unlockMobileAudio();

  const clean = text.replace(/[^a-zA-Z0-9\s'.,!?-]/g, '').trim();
  if (!clean) {
    onEnd?.();
    return { stop: () => stopSpeaking() };
  }

  const activeSessionId = ++currentSessionCounter;
  let hasStarted = false;
  isGloballyPlayingAudio = true;

  const safeEnd = () => {
    if (activeSessionId !== currentSessionCounter) return;
    isGloballyPlayingAudio = false;
    if (currentAudioTimeout) {
      clearTimeout(currentAudioTimeout);
      currentAudioTimeout = null;
    }
    currentAudioElement = null;
    onEnd?.();
  };

  const safeStart = () => {
    if (activeSessionId !== currentSessionCounter) return;
    if (!hasStarted) {
      hasStarted = true;
      if (currentAudioTimeout) {
        clearTimeout(currentAudioTimeout);
        currentAudioTimeout = null;
      }
      onStart?.();
    }
  };

  // Try server English MP3 stream first with fallback to runWebSpeech
  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(clean.slice(0, 300))}&tl=en`;
    const audio = new Audio();
    currentAudioElement = audio;
    audio.preload = 'auto';
    audio.playbackRate = Math.max(0.6, Math.min(1.8, rate));

    currentAudioTimeout = setTimeout(() => {
      if (activeSessionId !== currentSessionCounter) return;
      if (!hasStarted) {
        runWebSpeech(clean, 'en-US', rate, safeStart, safeEnd, activeSessionId);
      }
    }, 600);

    audio.onplay = () => {
      if (activeSessionId !== currentSessionCounter) {
        audio.pause();
        return;
      }
      safeStart();
    };

    audio.onended = () => {
      if (activeSessionId !== currentSessionCounter) return;
      safeEnd();
    };

    audio.onerror = () => {
      if (activeSessionId !== currentSessionCounter) return;
      runWebSpeech(clean, 'en-US', rate, safeStart, safeEnd, activeSessionId);
    };

    audio.src = audioUrl;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (activeSessionId !== currentSessionCounter) return;
        runWebSpeech(clean, 'en-US', rate, safeStart, safeEnd, activeSessionId);
      });
    }
  } catch {
    runWebSpeech(clean, 'en-US', rate, safeStart, safeEnd, activeSessionId);
  }

  return { stop: () => stopSpeaking() };
}
