// Synthesized kid-friendly sound effects using Web Audio API

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
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

    const now = ctx.currentTime;
    // Ascending celebratory notes: C5, E5, G5, B5, C6, E6
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
  }

  // 2. Cheerful Encouragement Sound on Correct Answer (Rich Chime + Sparkling Shimmer)
  public playCheerSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

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

    // Final triumphant chord: C6 + E6 + G6 with sparkling shimmer
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
  }

  // Alias for backward compatibility
  public playSuccess() {
    this.playCheerSuccess();
  }

  // 3. Smooth Transition Between Paragraphs & Lesson Tabs (Gentle Melody Slide)
  public playTransition() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.12); // A5

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Alias for tab switching
  public playTabSwitch() {
    this.playTransition();
  }

  // 4. Interactive Tactile Tap for Buttons & Options
  public playButtonTap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Soft click alias
  public playClick() {
    this.playButtonTap();
  }

  // 5. Gentle Hint / Think Tone
  public playHint() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25]; // A4, C#5, E5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.28);
    });
  }

  // 6. Star Collected Twinkle
  public playStar() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 7. Grand Celebratory Fanfare for Lesson Completion
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfareNotes = [
      { f: 523.25, t: 0, d: 0.15 },
      { f: 659.25, t: 0.15, d: 0.15 },
      { f: 783.99, t: 0.30, d: 0.18 },
      { f: 1046.5, t: 0.48, d: 0.55 },
      { f: 1318.5, t: 0.55, d: 0.55 }
    ];

    fanfareNotes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.18, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });
  }

  public playEncourage() {
    this.playHint();
  }

  // Game Sounds for Points Reward Arcade
  public playBalloonPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playBonusScore() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  }

  public playLevelUp() {
    this.playFanfare();
  }
}

export const sounds = new SoundEffectsEngine();

// Encouragement Voice Helper saying: "أَحْسَنْتَ يَا [اسم الطفل]!"
export function playPraiseVoice(
  studentName?: string, 
  isGirl?: boolean, 
  customPhrase?: string
) {
  const name = studentName?.trim() || (isGirl ? 'بَطَلَتَنَا' : 'بَطَلَنَا');
  const phrase = customPhrase || (
    isGirl 
      ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${name}! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَةٌ!` 
      : `أَحْسَنْتَ يَا بَطَلَنَا ${name}! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَةٌ!`
  );

  speakArabic(phrase);
}

// Helper to split Arabic text into clean, manageable sentences for reading
export function splitArabicSentences(text: string): string[] {
  if (!text) return [];
  // Remove markdown formatting
  const clean = text
    .replace(/[#*_`~[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  // Split on Arabic sentence terminators: . ! ؟ : \n
  const parts = clean.split(/([.!؟:\n]+)/);
  const sentences: string[] = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.match(/^[.!؟:\n]+$/)) {
      current += part;
      if (current.trim()) {
        sentences.push(current.trim());
        current = '';
      }
    } else {
      if (current.trim()) {
        sentences.push(current.trim());
      }
      current = part;
    }
  }
  if (current.trim()) {
    sentences.push(current.trim());
  }

  // Filter out any empty items
  return sentences.filter(s => s.trim().length > 1);
}

// Active Audio Instance Tracker & Global Session Tokens
let currentAudioElement: HTMLAudioElement | null = null;
let currentAudioTimeout: any = null;
let currentSessionCounter: number = 0;
let isGloballyPlayingAudio: boolean = false;

// Cache loaded speech synthesis voices
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const updateVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch {}
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

// Complete Immediate Audio Stop - Halts all audio streams, Web Speech, and pending tasks instantly
export function stopSpeaking() {
  currentSessionCounter++;
  isGloballyPlayingAudio = false;

  if (currentAudioTimeout) {
    clearTimeout(currentAudioTimeout);
    currentAudioTimeout = null;
  }

  // Stop backend audio stream if playing or loading
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.removeAttribute('src');
      currentAudioElement.load();
    } catch {
      // Ignore
    }
    currentAudioElement = null;
  }

  // Stop browser speech synthesis if active
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  // Notify any active UI listener to reset playing states
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('al-talib-audio-stopped'));
  }
}

export const stopAllAudio = stopSpeaking;

export function isAudioCurrentlyPlaying(): boolean {
  return isGloballyPlayingAudio;
}

// Speech Synthesis Helper using High-Definition Audio Stream with Web Speech Fallback
export function speakArabic(
  text: string, 
  onEnd?: () => void, 
  onStart?: () => void,
  rate: number = 0.95
): { stop: () => void } {
  // Always cancel any prior audio completely
  stopSpeaking();

  const cleanText = text
    ? text.replace(/[\\/*#_`~[\]()\-+]/g, ' ').replace(/\s+/g, ' ').trim()
    : '';

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

  // 1. Try dedicated backend MP3 TTS endpoint first
  try {
    const textSample = cleanText.slice(0, 550).trim();
    const audioUrl = `/api/tts?text=${encodeURIComponent(textSample)}`;
    const audio = new Audio(audioUrl);
    currentAudioElement = audio;
    audio.playbackRate = Math.max(0.6, Math.min(1.8, rate));

    // Watchdog timer: if backend audio hasn't started playing within 2s, fallback to Web Speech API
    currentAudioTimeout = setTimeout(() => {
      if (activeSessionId !== currentSessionCounter) return;
      if (!hasStarted) {
        fallbackWebSpeech(cleanText, safeEnd, safeStart, rate, activeSessionId);
      }
    }, 2000);

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
      fallbackWebSpeech(cleanText, safeEnd, safeStart, rate, activeSessionId);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If aborted due to user stop, DO NOT fallback!
        if (activeSessionId !== currentSessionCounter) return;
        fallbackWebSpeech(cleanText, safeEnd, safeStart, rate, activeSessionId);
      });
    }

    return {
      stop: () => stopSpeaking()
    };
  } catch {
    if (activeSessionId === currentSessionCounter) {
      fallbackWebSpeech(cleanText, safeEnd, safeStart, rate, activeSessionId);
    }
    return {
      stop: () => stopSpeaking()
    };
  }
}

// Fallback to browser Web Speech API with rate and Arabic voice matching
function fallbackWebSpeech(
  text: string, 
  onEnd: () => void, 
  onStart: () => void, 
  rate: number = 0.95,
  sessionId?: number
) {
  if (sessionId !== undefined && sessionId !== currentSessionCounter) {
    return;
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
    const arabicVoice = voices.find(
      (v) =>
        v.lang.startsWith('ar') ||
        v.name.toLowerCase().includes('arabic') ||
        v.name.toLowerCase().includes('tarik') ||
        v.name.toLowerCase().includes('laila') ||
        v.name.toLowerCase().includes('maged') ||
        v.name.toLowerCase().includes('zeina')
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      if (sessionId !== undefined && sessionId !== currentSessionCounter) {
        window.speechSynthesis.cancel();
        return;
      }
      onStart();
    };

    utterance.onend = () => {
      if (sessionId !== undefined && sessionId !== currentSessionCounter) return;
      onEnd();
    };

    utterance.onerror = () => {
      if (sessionId !== undefined && sessionId !== currentSessionCounter) return;
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd();
  }
}

// Ultra-clear English Speech for Vocabulary & Dictionary with accurate, calm phonetic pronunciation suited for children
export function speakEnglish(
  text: string,
  onEnd?: () => void,
  onStart?: () => void,
  rate: number = 0.82
): { stop: () => void } {
  stopSpeaking();
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return { stop: () => {} };
  }

  const clean = text.replace(/[^a-zA-Z0-9\s'.,!?-]/g, '').trim();
  if (!clean) {
    onEnd?.();
    return { stop: () => {} };
  }

  const activeSessionId = ++currentSessionCounter;
  isGloballyPlayingAudio = true;

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US';
    utterance.rate = rate; // Calm, gentle, articulate cadence for young children
    utterance.pitch = 1.0;
    utterance.volume = 0.95;

    const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
    // Prioritize high-quality, friendly, calm voices
    const enVoice = voices.find(
      v => (v.lang === 'en-US' || v.lang === 'en-GB' || v.lang.startsWith('en')) &&
           (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Zira'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      if (activeSessionId !== currentSessionCounter) {
        window.speechSynthesis.cancel();
        return;
      }
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (activeSessionId !== currentSessionCounter) return;
      isGloballyPlayingAudio = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (activeSessionId !== currentSessionCounter) return;
      isGloballyPlayingAudio = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return { stop: () => stopSpeaking() };
  } catch {
    isGloballyPlayingAudio = false;
    onEnd?.();
    return { stop: () => {} };
  }
}

