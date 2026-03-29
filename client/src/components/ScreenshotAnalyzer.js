import React, { useState, useRef, useCallback, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useVoice } from './useVoice';

// ─── Location → CSS position map ─────────────────────────────────────────────
const LOCATION_MAP = {
  'top-left':      { top: '8%',  left: '10%' },
  'top-center':    { top: '8%',  left: '50%', transform: 'translateX(-50%)' },
  'top-right':     { top: '8%',  right: '10%' },
  'middle-left':   { top: '50%', left: '10%', transform: 'translateY(-50%)' },
  'center':        { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
  'middle-right':  { top: '50%', right: '10%', transform: 'translateY(-50%)' },
  'bottom-left':   { bottom: '8%', left: '10%' },
  'bottom-center': { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':  { bottom: '8%', right: '10%' },
};

const ARROW_UNICODE = { down: '↓', up: '↑', left: '←', right: '→', none: '' };

const MODULE_OPTIONS = [
  { id: 'upi',        label: 'UPI Payment',       icon: '💳' },
  { id: 'digilocker', label: 'DigiLocker',         icon: '📂' },
  { id: 'scam',       label: 'Scam Detection',     icon: '🚨' },
  { id: 'general',    label: 'General',             icon: '📱' },
];

const CONF_COLOR  = { high: '#28A745', medium: '#F57F17', low: '#DC3545' };
const CONF_LABEL  = { high: 'उच्च विश्वास', medium: 'मध्यम विश्वास', low: 'कम विश्वास' };

// ─── Instruction key for each language ───────────────────────────────────────
function getLangInstruction(result, lang) {
  if (!result) return null;
  const map = {
    hi: 'instruction_hindi',
    mr: 'instruction_marathi',
    ta: 'instruction_tamil',
    en: 'instruction_english',
    bn: 'instruction_bengali',
  };
  return result[map[lang]] || result['instruction_hindi'];
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  screen: {
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 0 48px',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-card)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    flexShrink: 0,
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 18,
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.18s ease',
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: 'var(--text-primary)',
  },
  headerSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    marginTop: 1,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    padding: '20px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  // Upload Zone
  uploadZone: {
    border: '2px dashed var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    padding: '36px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.22s ease',
    background: 'var(--bg-card)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  uploadIcon: { fontSize: 40 },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  uploadSub: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  uploadBtnRow: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  // Context controls
  contextRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  moduleSelect: {
    flex: '0 0 auto',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  questionInput: {
    flex: 1,
    minWidth: 200,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 13,
    padding: '8px 14px',
    outline: 'none',
    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
  },
  analyzeBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, var(--primary), #3d5a36)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: 'var(--shadow-btn)',
    transition: 'all 0.2s ease',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  // Image preview with overlay
  previewWrap: {
    position: 'relative',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: '#000',
    border: '1px solid var(--border-light)',
  },
  previewImg: {
    display: 'block',
    width: '100%',
    maxHeight: 480,
    objectFit: 'contain',
  },
  annotationBadge: {
    position: 'absolute',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    pointerEvents: 'none',
  },
  annotationCircle: {
    width: 34, height: 34,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    border: '2.5px solid rgba(255,255,255,0.4)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
  },
  annotationLabel: {
    background: 'rgba(0,0,0,0.78)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 999,
    maxWidth: 120,
    textAlign: 'center',
    lineHeight: 1.3,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  // Safety alert
  safetyAlert: {
    background: 'var(--danger-bg)',
    border: '1.5px solid var(--danger-border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--danger)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  safetyMsg: {
    fontSize: 13,
    color: 'var(--danger)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.6,
  },
  helplineBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(239,68,68,0.2)',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: 999,
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: 700,
    padding: '5px 16px',
    cursor: 'pointer',
    textDecoration: 'none',
    alignSelf: 'flex-start',
    fontFamily: "'Inter', sans-serif",
  },
  // Voice script
  voiceBar: {
    background: 'var(--success-bg)',
    border: '1px solid var(--success-border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  voicePlayBtn: {
    width: 38, height: 38,
    background: 'rgba(40,167,69,0.12)',
    border: '1.5px solid rgba(40,167,69,0.3)',
    borderRadius: '50%',
    color: 'var(--success)',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.18s ease',
  },
  voiceText: {
    fontSize: 13,
    color: 'var(--success)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.7,
    flex: 1,
  },
  // Step cards
  stepsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: 2,
  },
  stepCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    boxShadow: 'var(--shadow-card)',
    transition: 'border-color 0.18s ease',
  },
  stepNum: {
    width: 28, height: 28,
    background: 'var(--primary)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  stepBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: 5 },
  stepText: {
    fontSize: 14,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.6,
  },
  stepTextEn: {
    fontSize: 12,
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    fontFamily: "'Inter', sans-serif",
  },
  warningPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 999,
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 10px',
    alignSelf: 'flex-start',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  stepSpeakBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    color: 'var(--text-muted)',
    padding: 4,
    flexShrink: 0,
    transition: 'color 0.15s',
  },
  // Confidence badge
  confBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 999,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  // OCR box
  ocrBox: {
    background: 'rgba(74,103,65,0.04)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
    lineHeight: 1.6,
    maxHeight: 100,
    overflowY: 'auto',
  },
  // Intent row
  intentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    fontSize: 13,
    color: '#A5B4FC',
    fontFamily: "'Inter', sans-serif",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function ScreenshotAnalyzer({ onBack, language = 'hi', onLanguageSwitch, messageHistory = [] }) {
  const [selectedModule, setSelectedModule] = useState('general');
  const [question, setQuestion]             = useState('');
  const [imageFile, setImageFile]           = useState(null);   // File object
  const [imageDataURL, setImageDataURL]     = useState(null);   // For preview + sending
  const [isDragging, setIsDragging]         = useState(false);
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [result, setResult]                 = useState(null);
  const [error, setError]                   = useState(null);
  const fileInputRef  = useRef(null);
  const cameraInputRef = useRef(null);

  const { speak, stopSpeaking, isSpeaking, hasSpeechSynthesis } = useVoice({ language });

  // ── Load image file ────────────────────────────────────────────────────────
  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImageDataURL(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  // ── Drag & drop handlers ───────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  // ── Analyze ────────────────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!imageDataURL || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    stopSpeaking();

    try {
      const mimeType = imageFile?.type || 'image/jpeg';
      const res = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageDataURL,
          mimeType,
          question,
          module: selectedModule,
          recentMessages: messageHistory.slice(-3),
          language,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      // Auto-play voice script
      if (hasSpeechSynthesis && data.voice_script_hindi) {
        setTimeout(() => speak(data.voice_script_hindi), 600);
      }
    } catch (err) {
      setError(err.message || 'कुछ गलत हो गया। कृपया दोबारा कोशिश करें।');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageDataURL, imageFile, isAnalyzing, question, selectedModule, messageHistory, language, hasSpeechSynthesis, speak, stopSpeaking]);

  // ── Clear ──────────────────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    setImageFile(null);
    setImageDataURL(null);
    setResult(null);
    setError(null);
    stopSpeaking();
    if (fileInputRef.current)   fileInputRef.current.value   = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, [stopSpeaking]);

  // ── Keyboard shortcut ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && imageDataURL && !isAnalyzing) analyze();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [analyze, imageDataURL, isAnalyzing]);

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderAnnotationOverlay = () => {
    if (!result?.annotations?.length) return null;
    return result.annotations.map((ann) => {
      const pos = LOCATION_MAP[ann.location] || LOCATION_MAP['center'];
      const arrow = ARROW_UNICODE[ann.arrow_direction] || '';
      return (
        <div key={ann.id} className="vge-annotation-badge" style={{ ...S.annotationBadge, ...pos }}>
          <div
            style={{
              ...S.annotationCircle,
              background: ann.highlight_color || '#e67e22',
              boxShadow: `0 0 16px ${ann.highlight_color || '#e67e22'}88`,
            }}
          >
            {arrow || ann.id}
          </div>
          <div style={S.annotationLabel}>{ann.label_hindi}</div>
        </div>
      );
    });
  };

  const renderSteps = () => {
    if (!result?.steps?.length) return null;
    return result.steps.map((step) => {
      const text    = getLangInstruction(step, language) || step.instruction_hindi;
      const textEn  = step.instruction_english;
      return (
        <div
          key={step.step_number}
          className="vge-step-card"
          style={{
            ...S.stepCard,
            borderColor: step.is_warning ? 'var(--danger-border)' : 'var(--border-card)',
          }}
        >
          <div style={{
            ...S.stepNum,
            background: step.is_warning ? 'var(--danger)' : 'var(--primary)',
          }}>
            {step.step_number}
          </div>
          <div style={S.stepBody}>
            <div style={S.stepText}>{text}</div>
            {language !== 'en' && textEn && (
              <div style={S.stepTextEn}>{textEn}</div>
            )}
            {step.is_warning && step.warning_hindi && (
              <div style={S.warningPill}>⚠️ {step.warning_hindi}</div>
            )}
          </div>
          {hasSpeechSynthesis && (
            <button
              style={S.stepSpeakBtn}
              title="यह step सुनें"
              onClick={() => speak(text)}
            >
              🔊
            </button>
          )}
        </div>
      );
    });
  };

  const confidence = result?.confidence;

  return (
    <div style={S.screen} id="screenshot-analyzer-screen">
      {/* ── Header ── */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack} id="vge-back-btn" title="वापस जाएं">←</button>
        <div style={{ flex: 1 }}>
          <div style={S.headerTitle}>📸 Visual Guide — स्क्रीन गाइड</div>
          <div style={S.headerSub}>Screenshot upload करें, step-by-step मदद पाएं</div>
        </div>
        <LanguageSwitcher language={language} onSwitch={onLanguageSwitch} showLabel={false} />
      </div>

      <div style={S.content}>

        {/* ── Upload Zone or Preview ── */}
        {!imageDataURL ? (
          <div
            className="vge-upload-zone"
            style={{
              ...S.uploadZone,
              borderColor: isDragging ? 'var(--primary)' : 'var(--border-light)',
              background: isDragging ? 'rgba(74,103,65,0.05)' : 'var(--bg-card)',
              transform: isDragging ? 'scale(1.01)' : 'scale(1)',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={S.uploadIcon}>📱</div>
            <div style={S.uploadTitle}>📸 Screenshot यहाँ drag करें या Upload करें</div>
            <div style={S.uploadSub}>
              JPG, PNG, WEBP — किसी भी app का screenshot चलेगा
            </div>
            <div style={S.uploadBtnRow} onClick={(e) => e.stopPropagation()}>
              <button
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '8px 18px' }}
                onClick={() => fileInputRef.current?.click()}
                id="vge-gallery-btn"
              >
                🖼️ Gallery से चुनें
              </button>
              <button
                className="btn btn-secondary"
                style={{ fontSize: 13, padding: '8px 18px' }}
                onClick={() => cameraInputRef.current?.click()}
                id="vge-camera-btn"
              >
                📷 Camera से लें
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => loadFile(e.target.files?.[0])}
              id="vge-file-input"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => loadFile(e.target.files?.[0])}
              id="vge-camera-input"
            />
          </div>
        ) : (
          /* ── Image Preview + Annotations ── */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {imageFile?.name || 'screenshot'} · {imageFile ? Math.round(imageFile.size / 1024) + ' KB' : ''}
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '5px 12px' }}
                onClick={clearAll}
                id="vge-clear-btn"
              >
                ✕ हटाएं
              </button>
            </div>

            <div className="vge-preview-wrap" style={S.previewWrap}>
              <img
                src={imageDataURL}
                alt="Uploaded screenshot"
                style={S.previewImg}
                id="vge-preview-img"
              />
              {/* Annotation badges overlay */}
              {renderAnnotationOverlay()}

              {/* Loading shimmer overlay */}
              {isAnalyzing && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,255,255,0.8)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 12,
                }}>
                  <div className="typing-dots"><span /><span /><span /></div>
                  <div style={{
                    fontSize: 14, color: 'var(--text-primary)',
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                  }}>
                    आपका screenshot analyze हो रहा है...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Context Controls ── */}
        <div style={S.contextRow}>
          <select
            style={S.moduleSelect}
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            id="vge-module-select"
          >
            {MODULE_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
            ))}
          </select>

          <input
            type="text"
            style={S.questionInput}
            placeholder="आपका सवाल या समस्या लिखें (optional)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            id="vge-question-input"
          />

          <button
            style={{
              ...S.analyzeBtn,
              opacity: (!imageDataURL || isAnalyzing) ? 0.45 : 1,
              transform: imageDataURL && !isAnalyzing ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={analyze}
            disabled={!imageDataURL || isAnalyzing}
            id="vge-analyze-btn"
          >
            {isAnalyzing ? (
              <>⏳ Analyzing...</>
            ) : (
              <>🔍 Analyze करें</>
            )}
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: 13,
            color: '#FCA5A5',
            fontFamily: "'Noto Sans Devanagari', sans-serif",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade">

            {/* Confidence + Intent row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {confidence && (
                <div
                  className="vge-confidence-pill"
                  style={{
                    ...S.confBadge,
                    background: CONF_COLOR[confidence] + '22',
                    border: `1px solid ${CONF_COLOR[confidence]}55`,
                    color: CONF_COLOR[confidence],
                  }}
                >
                  ● {CONF_LABEL[confidence] || confidence}
                </div>
              )}
              {result.user_intent && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, minWidth: 150,
                              fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}>
                  {result.user_intent}
                </div>
              )}
            </div>

            {/* Safety Alert — shown first if triggered */}
            {result.safety_alert?.triggered && (
              <div className="vge-safety-alert" style={S.safetyAlert}>
                <div style={S.safetyTitle}>
                  🚨 सावधान! यह SCAM हो सकता है
                </div>
                <div style={S.safetyMsg}>
                  {result.safety_alert.message_hindi}
                </div>
                {result.safety_alert.message_english && (
                  <div style={{ ...S.safetyMsg, fontSize: 12, color: '#FCA5A5cc' }}>
                    {result.safety_alert.message_english}
                  </div>
                )}
                <a href="tel:1930" style={S.helplineBtn} id="vge-helpline-btn">
                  📞 Helpline: 1930 पर Call करें
                </a>
              </div>
            )}

            {/* Low-confidence fallback */}
            {result.confidence === 'low' && result.fallback_message_hindi && (
              <div style={{
                background: 'rgba(234,179,8,0.08)',
                border: '1px solid rgba(234,179,8,0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                fontSize: 13,
                color: '#FDE047',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
              }}>
                📷 {result.fallback_message_hindi}
              </div>
            )}

            {/* Voice Script bar */}
            {result.voice_script_hindi && (
              <div className="vge-voice-bar" style={S.voiceBar}>
                <button
                  style={S.voicePlayBtn}
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else speak(result.voice_script_hindi);
                  }}
                  id="vge-voice-play-btn"
                  title={isSpeaking ? 'आवाज़ रोकें' : 'आवाज़ में सुनें'}
                  disabled={!hasSpeechSynthesis}
                >
                  {isSpeaking ? '⏸' : '▶'}
                </button>
                <div style={S.voiceText}>{result.voice_script_hindi}</div>
              </div>
            )}

            {/* Step-by-step instructions */}
            {result.steps?.length > 0 && (
              <div style={S.stepsSection}>
                <p style={S.sectionLabel}>📋 Step-by-Step गाइड</p>
                {renderSteps()}
              </div>
            )}

            {/* OCR extracted text (collapsible) */}
            {result.ocr_text && (
              <details style={{ cursor: 'pointer' }}>
                <summary style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  padding: '4px 0',
                  userSelect: 'none',
                }}>
                  📄 Screenshot में पढ़ा गया Text
                </summary>
                <div style={{ ...S.ocrBox, marginTop: 8 }}>{result.ocr_text}</div>
              </details>
            )}

          </div>
        )}

        {/* ── Empty State (no image yet) ── */}
        {!imageDataURL && !result && (
          <div style={{
            textAlign: 'center',
            padding: '20px 0 10px',
            color: 'var(--text-muted)',
            fontSize: 13,
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            lineHeight: 1.8,
          }}>
            💡 <strong style={{ color: 'var(--text-secondary)' }}>कैसे use करें:</strong><br />
            अपने phone की कोई भी screen का screenshot लें<br />
            (UPI payment, DigiLocker, कोई भी app) और upload करें —<br />
            SmartSathi आपको step-by-step बताएगा क्या करना है।
          </div>
        )}
      </div>
    </div>
  );
}
