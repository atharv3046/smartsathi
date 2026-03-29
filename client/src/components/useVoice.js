import { useRef, useState, useCallback, useEffect } from 'react';

// Map app language codes to BCP-47 language tags for Web Speech API
const LANG_CODES = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  en: 'en-IN',
};

// Check browser support
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const hasSpeechRecognition = !!SpeechRecognition;
const hasSpeechSynthesis = !!(window.speechSynthesis);

/** Wait until speechSynthesis.getVoices() returns a non-empty list */
function getVoicesAsync() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      resolve(voices);
      return;
    }
    const handler = () => {
      synth.removeEventListener('voiceschanged', handler);
      resolve(synth.getVoices());
    };
    synth.addEventListener('voiceschanged', handler);
    // Safety timeout: resolve after 3 s even if event never fires
    setTimeout(() => {
      synth.removeEventListener('voiceschanged', handler);
      resolve(synth.getVoices());
    }, 3000);
  });
}

/** Pick the best available voice for the target lang code (e.g. 'hi-IN') */
function pickVoice(voices, langCode) {
  if (!voices || voices.length === 0) return null;

  const prefix = langCode.split('-')[0];

  // 1. Prioritize Google's cloud voices for the target language (best quality)
  let match = voices.find((v) => v.lang.startsWith(langCode) && v.name.includes('Google'));
  if (match) return match;

  // 2. Any exact match
  match = voices.find((v) => v.lang === langCode || v.lang.replace('_', '-') === langCode);
  if (match) return match;

  // 3. Prefix match ('hi' for 'hi-IN')
  match = voices.find((v) => v.lang.startsWith(prefix));
  if (match) return match;

  // 4. Smart fallback for languages whose voices are rarely installed in browsers:
  //    Marathi uses Devanagari → Hindi TTS reads it well.
  //    Tamil and Bengali rarely have OS voices → fall back to Hindi (closest Indian language available).
  if (['mr', 'ta', 'bn'].includes(prefix)) {
    const hiGoogle = voices.find((v) => v.lang.startsWith('hi') && v.name.includes('Google'));
    if (hiGoogle) return hiGoogle;
    const hiAny = voices.find((v) => v.lang.startsWith('hi'));
    if (hiAny) return hiAny;
  }

  // 5. Last resort: any Indian English voice so speech still works
  const enIn = voices.find((v) => v.lang === 'en-IN' || v.lang === 'en_IN');
  if (enIn) return enIn;

  return null;
}

export function useVoice({ language = 'hi', onTranscript, onEnd }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // ── KEY FIX: store langCode in a ref so speak() always reads the LATEST value
  // even though speak is memoised with useCallback
  const langCodeRef = useRef(LANG_CODES[language] || 'hi-IN');
  useEffect(() => {
    langCodeRef.current = LANG_CODES[language] || 'hi-IN';
  }, [language]);

  // ── When language changes: cancel any ongoing speech/listening immediately
  useEffect(() => {
    // stop TTS
    synthRef.current.cancel();
    setIsSpeaking(false);
    // stop STT
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [language]);

  // ── Cleanup on unmount
  useEffect(() => {
    // Snapshot the ref values so the cleanup closure uses stable references
    const synth = synthRef.current;
    const recognition = recognitionRef;
    const keepalive = keepaliveRef;
    return () => {
      synth.cancel();
      if (keepalive.current) {
        clearInterval(keepalive.current);
        keepalive.current = null;
      }
      if (recognition.current) {
        recognition.current.stop();
        recognition.current = null;
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current);
      keepaliveRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) {
      setError('आपका browser voice input support नहीं करता। Chrome use करें।');
      return;
    }

    // Stop any ongoing TTS before listening
    synthRef.current.cancel();
    setIsSpeaking(false);
    setError(null);
    setTranscript('');

    const currentLang = langCodeRef.current; // always fresh
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      const current = finalText || interimText;
      setTranscript(current);
      if (finalText && onTranscript) onTranscript(finalText.trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);

      // Localized error messages per language
      const errorMessagesByLang = {
        hi: {
          'no-speech': 'कोई आवाज़ नहीं आई। दोबारा कोशिश करें।',
          'audio-capture': 'Microphone access नहीं मिला।',
          'not-allowed': 'Microphone की permission दें।',
          'network': 'Internet connection की जरूरत है।',
          'language-not-supported': 'यह भाषा voice input के लिए उपलब्ध नहीं है।',
        },
        mr: {
          'no-speech': 'कोणताही आवाज आला नाही। पुन्हा प्रयत्न करा।',
          'audio-capture': 'Microphone access मिळाला नाही।',
          'not-allowed': 'Microphone ची permission द्या।',
          'network': 'Internet connection आवश्यक आहे।',
          'language-not-supported': 'Voice input साठी ही भाषा उपलब्ध नाही।',
        },
        ta: {
          'no-speech': 'எந்த குரலும் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்。',
          'audio-capture': 'Microphone அணுக முடியவில்லை。',
          'not-allowed': 'Microphone அனுமதி கொடுங்கள்。',
          'network': 'Internet இணைப்பு தேவை।',
          'language-not-supported': 'இந்த மொழியில் voice input கிடைக்கவில்லை。 Hindi/English try செய்யுங்கள்。',
        },
        bn: {
          'no-speech': 'কোনো আওয়াজ পাওয়া যায়নি। আবার চেষ্টা করুন।',
          'audio-capture': 'Microphone access পাওয়া যায়নি।',
          'not-allowed': 'Microphone-এর অনুমতি দিন।',
          'network': 'Internet সংযোগ প্রয়োজন।',
          'language-not-supported': 'এই ভাষায় voice input পাওয়া যাচ্ছে না। Hindi/English ব্যবহার করুন।',
        },
        en: {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone not found.',
          'not-allowed': 'Please grant microphone permission.',
          'network': 'Internet connection required.',
          'language-not-supported': 'Voice input not supported for this language.',
        },
      };

      const langKey = (langCodeRef.current || 'hi-IN').split('-')[0];
      const messages = errorMessagesByLang[langKey] || errorMessagesByLang['hi'];
      const msg = messages[event.error] ?? null;
      if (msg) setError(msg);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (onEnd) onEnd();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript, onEnd]); // no langCode dep — reads from ref instead

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  /**
   * Speak text aloud using TTS.
   * Reads langCode from a ref so it always uses the CURRENT language,
   * even though the function itself is memoised.
   *
   * Chrome bug workarounds applied:
   * 1. Small delay after cancel() to avoid "interrupted" error.
   * 2. Pause/resume keepalive every 10s to prevent silent kill of long utterances.
   * 3. "interrupted" and "canceled" errors are non-fatal — silently ignored.
   */
  const keepaliveRef = useRef(null);

  const speak = useCallback(async (text, opts = {}) => {
    if (!hasSpeechSynthesis || !text) return;

    // Clear any existing keepalive timer
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current);
      keepaliveRef.current = null;
    }

    // Cancel any existing speech
    synthRef.current.cancel();
    setIsSpeaking(false);

    // ── Chrome bug fix #1: wait a tick after cancel() before speaking
    await new Promise((r) => setTimeout(r, 120));

    // Strip markdown / emoji for cleaner speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6} /g, '')
      .replace(/[📌📋💡⚠️✅🚨📱🏦🔍🤖🙏🇮🇳]/gu, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanText) return;

    const currentLang = langCodeRef.current; // always the latest language

    // Wait for voices list to be populated
    const voices = await getVoicesAsync();
    const bestVoice = pickVoice(voices, currentLang);

    console.log(
      bestVoice
        ? `[TTS] Voice: ${bestVoice.name} (${bestVoice.lang})`
        : `[TTS] No voice for ${currentLang}, using browser default`
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang;
    utterance.rate = opts.rate ?? 0.85;
    utterance.pitch = opts.pitch ?? 1.0;
    utterance.volume = opts.volume ?? 1.0;
    if (bestVoice) utterance.voice = bestVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // ── Chrome bug fix #2: keepalive — pause/resume every 10s so Chrome
      //    doesn't silently kill utterances longer than ~15 seconds
      keepaliveRef.current = setInterval(() => {
        if (synthRef.current.speaking) {
          synthRef.current.pause();
          synthRef.current.resume();
        } else {
          clearInterval(keepaliveRef.current);
          keepaliveRef.current = null;
        }
      }, 10000);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
    };

    utterance.onerror = (e) => {
      // ── Chrome bug fix #3: "interrupted" and "canceled" are non-fatal —
      //    they fire when cancel() is called intentionally. Suppress them.
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.error('[TTS] error:', e.error);
      setIsSpeaking(false);
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
    };

    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  }, []); // stable — reads language from ref

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    hasSpeechRecognition,
    hasSpeechSynthesis,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
  };
}
