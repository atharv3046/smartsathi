import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatBubble from './ChatBubble';
import ModuleSelector from './ModuleSelector';
import LanguageSwitcher, { UI_STRINGS } from './LanguageSwitcher';
import { useVoice } from './useVoice';
import { getModules } from '../data/modulesData';

// ── Language-aware fallback strings ──────────
const LANG_STRINGS = {
  hi: {
    confusedMsg:  'मुझे समझ नहीं आया। और आसान तरीके से समझाएं।',
    serverErr:    '⚠️ Server से जुड़ने में दिक्कत हुई। कृपया दोबारा कोशिश करें।',
    genericErr:   'कुछ गलत हो गया। दोबारा कोशिश करें।',
    speaking:     '🔊 आवाज़ चल रही है...',
    stopBtn:      '■ रोकें',
    listening:    'सुन रहा हूँ... बोलें, फिर mic button दबाएं ✅',
    askByVoice:   'बोलकर पूछें',
    sendBtn:      'भेजें',
  },
  mr: {
    confusedMsg:  'मला समजले नाही. अधिक सोप्या भाषेत सांगा.',
    serverErr:    '⚠️ Server शी कनेक्ट होण्यात समस्या. कृपया पुन्हा प्रयत्न करा.',
    genericErr:   'काहीतरी चुकले. पुन्हा प्रयत्न करा.',
    speaking:     '🔊 आवाज चालू आहे...',
    stopBtn:      '■ थांबवा',
    listening:    'ऐकत आहे... बोला, नंतर mic बटण दाबा ✅',
    askByVoice:   'बोलून विचारा',
    sendBtn:      'पाठवा',
  },
  ta: {
    confusedMsg:  'எனக்கு புரியவில்லை. இன்னும் எளிமையாக விளக்குங்கள்.',
    serverErr:    '⚠️ Server உடன் இணைப்பில் சிக்கல். மீண்டும் முயற்சிக்கவும்.',
    genericErr:   'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    speaking:     '🔊 குரல் ஒலிக்கிறது...',
    stopBtn:      '■ நிறுத்து',
    listening:    'கேட்கிறேன்... பேசுங்கள், பிறகு mic button அழுத்தவும் ✅',
    askByVoice:   'பேசி கேளுங்கள்',
    sendBtn:      'அனுப்பு',
  },
  bn: {
    confusedMsg:  'আমি বুঝিনি। আরও সহজে বুঝিয়ে বলুন।',
    serverErr:    '⚠️ Server এর সাথে সংযোগে সমস্যা। আবার চেষ্টা করুন।',
    genericErr:   'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।',
    speaking:     '🔊 আওয়াজ চলছে...',
    stopBtn:      '■ থামুন',
    listening:    'শুনছি... বলুন, তারপর mic button চাপুন ✅',
    askByVoice:   'বলে জিজ্ঞেস করুন',
    sendBtn:      'পাঠান',
  },
  en: {
    confusedMsg:  'I did not understand. Please explain in a simpler way.',
    serverErr:    '⚠️ Could not connect to server. Please try again.',
    genericErr:   'Something went wrong. Please try again.',
    speaking:     '🔊 Speaking...',
    stopBtn:      '■ Stop',
    listening:    'Listening... speak, then press the mic button ✅',
    askByVoice:   'Speak your question',
    sendBtn:      'Send',
  },
};
function getLang(language) {
  return LANG_STRINGS[language] || LANG_STRINGS.hi;
}

// Responsive hook
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// ── Parse [VIDEO: ...] tag from AI reply ────────────────────────────
function parseReply(raw) {
  const match = raw.match(/\[VIDEO:\s*(.+?)\]/i);
  const text = raw.replace(/\[VIDEO:.*?\]/gi, '').trim();
  return { text, videoQuery: match ? match[1].trim() : null };
}

async function fetchYouTubeVideo(query, lang) { // eslint-disable-line no-unused-vars
  return null;
}

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const styles = {
  window: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--bg-page)',
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-card)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 18,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.18s ease',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  headerSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  onlineDot: {
    width: 8,
    height: 8,
    background: 'var(--success)',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 5,
    boxShadow: '0 0 6px rgba(40,167,69,0.4)',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: 'var(--bg-page)',
  },
  confusionBanner: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 16px',
    background: 'var(--bg-header)',
    borderTop: '1px solid var(--border-card)',
  },
  confusionBtn: {
    background: 'var(--primary)',
    border: 'none',
    borderRadius: 999,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '8px 22px',
    transition: 'all 0.18s ease',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    boxShadow: '0 2px 6px rgba(74,103,65,0.2)',
  },
  inputRow: {
    flexShrink: 0,
    display: 'flex',
    gap: 8,
    padding: '10px 14px 14px',
    background: 'var(--bg-header)',
    borderTop: '1px solid var(--border-card)',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 16,
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
    padding: '10px 16px',
    resize: 'none',
    outline: 'none',
    maxHeight: 120,
    lineHeight: 1.5,
    transition: 'border-color 0.18s ease',
  },
  sendBtn: {
    width: 42,
    height: 42,
    background: 'var(--primary)',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.18s ease',
    boxShadow: '0 2px 8px rgba(74,103,65,0.3)',
  },
  confusionLevelBag: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--text-muted)',
    padding: '4px 12px',
    textAlign: 'center',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  voiceStatusBar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '6px 16px',
    background: 'var(--danger-bg)',
    borderTop: '1px solid var(--danger-border)',
    fontSize: 12,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: 'var(--danger)',
  },
  speakingBar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '8px 16px',
    background: 'var(--success-bg)',
    borderTop: '1px solid var(--success-border)',
    fontSize: 13,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: 'var(--success)',
  },
  stopSpeakBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--danger-bg)',
    border: '1.5px solid var(--danger-border)',
    borderRadius: 999,
    color: 'var(--danger)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
    padding: '4px 14px',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.18s ease',
  },
};

const CONFUSION_LABELS_MAP = {
  hi: [null, '💡 सरल भाषा में समझा रहा हूँ...', '📖 और भी आसान बना रहा हूँ...'],
  mr: [null, '💡 सोप्या भाषेत सांगतोय...', '📖 आणखी सोपे करतोय...'],
  ta: [null, '💡 எளிய மொழியில் விளக்குகிறேன்...', '📖 இன்னும் எளிதாக மாற்றுகிறேன்...'],
  bn: [null, '💡 সহজ ভাষায় বোঝাচ্ছি...', '📖 আরও সহজ করছি...'],
  en: [null, '💡 Simplifying the explanation...', '📖 Making it even easier...'],
};
function getConfusionLabel(language, level) {
  const labels = CONFUSION_LABELS_MAP[language] || CONFUSION_LABELS_MAP.hi;
  return labels[level] || null;
}

export default function ChatWindow({
  module,
  messageHistory,
  setMessageHistory,
  confusionLevel,
  onConfusion,
  onModuleSwitch,
  onBack,
  onScreenshotAnalyzer,
  language = 'hi',
  onLanguageSwitch,
}) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [displayMessages, setDisplayMessages] = useState(() =>
    messageHistory.map((msg, i) => ({ ...msg, id: i, time: getTime() }))
  );
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const modules = getModules(language);
  const mod = modules[module];
  const ui = UI_STRINGS[language] || UI_STRINGS.hi;

  // ── Voice Integration ──────────────────────────────────────────────
  const handleVoiceTranscript = useCallback((text) => {
    setInput(text);
  }, []);

  const handleVoiceEnd = useCallback(() => {}, []);

  const {
    isListening,
    isSpeaking,
    transcript,
    error: voiceError,
    hasSpeechRecognition,
    hasSpeechSynthesis,
    toggleListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice({ language, onTranscript: handleVoiceTranscript, onEnd: handleVoiceEnd });

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, isLoading]);

  useEffect(() => {
    setDisplayMessages((prev) => {
      if (messageHistory.length === 1 && messageHistory[0].role === 'assistant') {
         if (prev.length !== 1 || prev[0].content !== messageHistory[0].content) {
            return messageHistory.map((msg, i) => ({ ...msg, id: Date.now() + i, time: getTime() }));
         }
      }
      if (messageHistory.length > 0 && prev.length > 0 && prev[0].content !== messageHistory[0].content) {
         const newDisp = [...prev];
         newDisp[0] = { ...newDisp[0], content: messageHistory[0].content };
         return newDisp;
      }
      return prev;
    });
  }, [messageHistory]);

  const addMessage = useCallback((role, content, video = null) => {
    const msg = { role, content, video, id: Date.now(), time: getTime() };
    setDisplayMessages((prev) => [...prev, msg]);
    return { role, content };
  }, []);

  const sendMessageCore = useCallback(async (trimmed) => {
    stopListening();
    addMessage('user', trimmed);
    const apiMessages = [...messageHistory, { role: 'user', content: trimmed }];
    setMessageHistory(apiMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          messageHistory,
          module,
          confusionLevel,
          language,
        }),
      });
      const data = await res.json();
      const rawReply = data.reply || data.error || getLang(language).genericErr;

      // Parse text + optional video query from AI reply
      const { text: reply, videoQuery } = parseReply(rawReply);

      // Store the query string directly — VideoCard builds the embed URL itself (no API key needed)
      const video = (videoEnabled && videoQuery) ? videoQuery : null;

      addMessage('assistant', reply, video);
      setMessageHistory((prev) => [...prev, { role: 'assistant', content: reply }]);
      if (ttsEnabled && hasSpeechSynthesis) {
        speak(reply);
      }
    } catch {
      addMessage('assistant', getLang(language).serverErr);
    } finally {
      setIsLoading(false);
    }
  }, [messageHistory, module, confusionLevel, language, ttsEnabled, videoEnabled,
      hasSpeechSynthesis, addMessage, setMessageHistory, stopListening, speak]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessageCore(trimmed);
  }, [input, isLoading, sendMessageCore]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
      const trimmed = input.trim();
      if (trimmed && !isLoading) {
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        sendMessageCore(trimmed);
      }
    } else {
      stopSpeaking();
      setInput('');
      toggleListening();
    }
  }, [isListening, input, isLoading, stopListening, stopSpeaking, toggleListening, sendMessageCore]);

  const handleConfusionClick = useCallback(async () => {
    onConfusion();
    const confusedMsg = getLang(language).confusedMsg;
    addMessage('user', confusedMsg);
    const apiMessages = [...messageHistory, { role: 'user', content: confusedMsg }];
    setMessageHistory(apiMessages);
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: confusedMsg,
          messageHistory,
          module,
          confusionLevel: Math.min(confusionLevel + 1, 2),
          language,
        }),
      });
      const data = await res.json();
      const rawReply = data.reply || data.error || getLang(language).genericErr;
      const { text: reply, videoQuery } = parseReply(rawReply);
      const video = (videoEnabled && videoQuery) ? videoQuery : null;
      addMessage('assistant', reply, video);
      setMessageHistory((prev) => [...prev, { role: 'assistant', content: reply }]);
      if (ttsEnabled && hasSpeechSynthesis) speak(reply);
    } catch {
      addMessage('assistant', getLang(language).serverErr);
    } finally {
      setIsLoading(false);
    }
  }, [onConfusion, addMessage, messageHistory, module, confusionLevel, language,
      ttsEnabled, videoEnabled, hasSpeechSynthesis, setMessageHistory, speak]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const toggleTts = () => {
    if (isSpeaking) stopSpeaking();
    setTtsEnabled((prev) => !prev);
  };

  return (
    <div style={styles.window}>
      {/* Header */}
      <div style={{
        ...styles.header,
        padding: isMobile ? '8px 10px' : '12px 16px',
        gap: isMobile ? 6 : 12,
      }}>
        <button style={{
          ...styles.backBtn,
          width: isMobile ? 32 : 36,
          height: isMobile ? 32 : 36,
          fontSize: isMobile ? 16 : 18,
        }} onClick={onBack} id="chat-back-btn" title="वापस जाएं">←</button>
        <div style={styles.headerInfo}>
          <div style={{
            ...styles.headerTitle,
            fontSize: isMobile ? 13 : 15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {mod?.icon} {mod?.title}
          </div>
        </div>

        {/* Screenshot Analyzer shortcut */}
        {onScreenshotAnalyzer && (
          <button
            style={{
              background: 'transparent',
              border: '1.5px solid var(--border-light)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: isMobile ? 14 : 16,
              color: 'var(--text-muted)',
              padding: isMobile ? '3px 5px' : '4px 7px',
              transition: 'all 0.18s ease',
              display: 'flex', alignItems: 'center',
            }}
            onClick={onScreenshotAnalyzer}
            id="chat-screenshot-btn"
            title="Screenshot से मदद लें"
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
          >
            📸
          </button>
        )}

        {/* TTS toggle */}
        {hasSpeechSynthesis && (
          <button
            className={`tts-btn ${ttsEnabled ? 'active' : ''}`}
            onClick={toggleTts}
            id="tts-toggle-btn"
            title={ttsEnabled ? getLang(language).speaking : getLang(language).stopBtn}
          >
            {ttsEnabled ? '🔈' : '🔇'}
          </button>
        )}

        {/* Video toggle */}
        <button
          onClick={() => setVideoEnabled(v => !v)}
          id="video-toggle-btn"
          title={videoEnabled ? 'Turn off video suggestions' : 'Turn on video suggestions'}
          style={{
            background: 'transparent',
            border: '1.5px solid var(--border-light)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: isMobile ? 13 : 15,
            color: videoEnabled ? 'var(--primary)' : 'var(--text-muted)',
            padding: isMobile ? '3px 5px' : '4px 7px',
            transition: 'all 0.18s ease',
            display: 'flex',
            alignItems: 'center',
            borderColor: videoEnabled ? 'var(--primary-light)' : 'var(--border-light)',
          }}
        >
          {videoEnabled ? '📺' : '📵'}
        </button>

        {/* Language switcher */}
        <LanguageSwitcher
          language={language}
          onSwitch={onLanguageSwitch}
          showLabel={false}
          compact={isMobile}
        />
      </div>

      {/* Module Switcher */}
      <ModuleSelector activeModule={module} onSwitch={onModuleSwitch} language={language} />

      {/* Confusion level indicator */}
      {confusionLevel > 0 && getConfusionLabel(language, confusionLevel) && (
        <div style={{ ...styles.confusionLevelBag, background: 'var(--warning-bg)' }}>
          {getConfusionLabel(language, confusionLevel)}
        </div>
      )}

      {/* Messages */}
      <div style={styles.messagesArea} id="chat-messages">
        {displayMessages.map((msg, index) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            time={msg.time}
            video={msg.video}
            onSpeak={hasSpeechSynthesis ? () => speak(msg.content) : null}
            isGreeting={index === 0}
            onSuggestionClick={(text) => {
              setInput(text);
              if (textareaRef.current) {
                textareaRef.current.focus();
              }
            }}
          />
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🤖</div>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: '18px 18px 18px 4px', padding: '12px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* TTS Speaking bar */}
      {isSpeaking && (
        <div style={styles.speakingBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="voice-waveform" style={{ '--wave-color': 'var(--success)' }}>
              <span /><span /><span /><span /><span />
            </div>
            <span>{getLang(language).speaking}</span>
          </div>
          <button
            style={styles.stopSpeakBtn}
            onClick={stopSpeaking}
            id="stop-speak-btn"
            title={getLang(language).stopBtn}
          >
            {getLang(language).stopBtn}
          </button>
        </div>
      )}

      {/* Voice listening status bar */}
      {isListening && (
        <div style={styles.voiceStatusBar}>
          <div className="voice-waveform">
            <span /><span /><span /><span /><span />
          </div>
          <span>{getLang(language).listening}</span>
          <div className="voice-waveform">
            <span /><span /><span /><span /><span />
          </div>
        </div>
      )}

      {/* Voice error */}
      {voiceError && (
        <div style={{
          flexShrink: 0, padding: '6px 16px', textAlign: 'center',
          fontSize: 12, color: 'var(--danger)', background: 'var(--danger-bg)',
          fontFamily: "'Noto Sans Devanagari', sans-serif",
        }}>
          ⚠️ {voiceError}
        </div>
      )}

      {/* Confusion Button */}
      <div style={styles.confusionBanner}>
        <button
          className="confusion-btn-bounce"
          style={styles.confusionBtn}
          onClick={handleConfusionClick}
          disabled={isLoading}
          id="confusion-btn"
        >
          {ui.confusionBtn}
        </button>
      </div>

      {/* Input Row */}
      <div style={styles.inputRow}>
        {/* Mic Button */}
        {hasSpeechRecognition && (
          <button
            className={`mic-btn ${isListening ? 'listening' : 'idle'}`}
            onClick={handleMicClick}
            disabled={isLoading}
            id="mic-btn"
            title={isListening ? getLang(language).listening : getLang(language).askByVoice}
          >
            {isListening ? '✅' : '🎙️'}
          </button>
        )}

        <textarea
          ref={textareaRef}
          id="chat-input"
          style={{
            ...styles.textarea,
            borderColor: isListening ? 'var(--danger-border)' : 'var(--border-light)',
          }}
          placeholder={isListening ? getLang(language).listening : ui.placeholder}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          onFocus={e => e.target.style.borderColor = 'var(--primary-light)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: (!input.trim() || isLoading) ? 0.4 : 1,
            transform: input.trim() && !isLoading ? 'scale(1.05)' : 'scale(1)',
          }}
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          id="send-btn"
          title={getLang(language).sendBtn}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
