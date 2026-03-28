import React, { useState } from 'react';
import LanguageSwitcher, { UI_STRINGS } from './LanguageSwitcher';

const styles = {
  screen: {
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.98)',
    borderBottom: '1px solid var(--navy-border)',
    backdropFilter: 'blur(12px)',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid var(--navy-border)',
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
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#FCA5A5',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  headerSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  body: {
    flex: 1,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    maxWidth: 640,
    margin: '0 auto',
    width: '100%',
  },
  heroBox: {
    textAlign: 'center',
    padding: '16px 0 8px',
  },
  heroIcon: {
    width: 64,
    height: 64,
    background: 'rgba(239,68,68,0.12)',
    border: '2px solid rgba(239,68,68,0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    margin: '0 auto 16px',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FCA5A5',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  heroDesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginTop: 8,
    lineHeight: 1.6,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  inputCard: {
    width: '100%',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    backdropFilter: 'blur(16px)',
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    background: 'var(--navy)',
    border: '1px solid var(--navy-border)',
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
    padding: '12px 14px',
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.6,
    transition: 'border-color 0.18s ease',
  },
  analyzeBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(239,68,68,0.35)',
  },
  examples: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  examplesLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: 4,
  },
  exampleChip: {
    background: 'var(--navy-card)',
    border: '1px solid var(--navy-border)',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 12,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.18s ease',
    lineHeight: 1.5,
  },
  resultCard: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    animation: 'fadeInUp 0.4s ease forwards',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  resultIconWrap: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    flexShrink: 0,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  divider: {
    height: 1,
    background: 'var(--navy-border)',
    width: '100%',
  },
  reasonText: {
    fontSize: 14,
    color: 'var(--text-primary)',
    lineHeight: 1.7,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  warningList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  warningItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 13,
    color: '#FCA5A5',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.5,
  },
  adviceBox: {
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    color: '#86EFAC',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.6,
  },
  resetBtn: {
    background: 'transparent',
    border: '1px solid var(--navy-border)',
    borderRadius: 10,
    color: 'var(--text-secondary)',
    fontSize: 13,
    cursor: 'pointer',
    padding: '8px 16px',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.18s ease',
  },
};

const EXAMPLE_SCAMS = [
  'आपका SBI account KYC expired हो गया है। इसे update करने के लिए यहाँ click करें: http://sbi-kyc-update.xyz',
  'Congratulations! आपने 50 lakh rupees जीते हैं। Prize लेने के लिए अभी call करें: 9999999999',
  'PM Kisan Yojana: आपके खाते में ₹6000 आने वाले हैं। अपना Aadhaar और OTP verify करें।',
];

export default function ScamChecker({ onBack, language = 'hi', onLanguageSwitch }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredExample, setHoveredExample] = useState(null);
  const ui = UI_STRINGS[language] || UI_STRINGS.hi;

  const analyze = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/detect-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), language }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || 'जाँच करने में समस्या हुई।');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const isScam = result?.isScam;
  const confidence = result?.confidence;

  const confidenceColor = { high: '#EF4444', medium: '#EAB308', low: '#22C55E' };
  const confidenceLabelHi = { high: 'उच्च', medium: 'मध्यम', low: 'कम' };

  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack} title="वापस जाएं" id="scam-back-btn">←</button>
        <div style={{ flex: 1 }}>
          <div style={styles.headerTitle}>🔍 {ui.scamCheckerTitle}</div>
          <div style={styles.headerSub}>संदिग्ध message paste करें और जानें कि यह fraud है या नहीं</div>
        </div>
        <LanguageSwitcher language={language} onSwitch={onLanguageSwitch} showLabel={false} />
      </div>

      <div style={styles.body} className="animate-up">
        {/* Hero */}
        <div style={styles.heroBox}>
          <div style={styles.heroIcon}>🔍</div>
          <h2 style={styles.heroTitle}>Scam Message Detector</h2>
          <p style={styles.heroDesc}>
            कोई भी SMS, WhatsApp message, या call का screenshot का text यहाँ paste करें।
            <br />AI बताएगा कि यह scam है या safe।
          </p>
        </div>

        {/* Input */}
        {!result && (
          <>
            <div style={styles.inputCard}>
              <label style={styles.label} htmlFor="scam-input">संदेश यहाँ paste करें:</label>
              <textarea
                id="scam-input"
                style={styles.textarea}
                placeholder="यहाँ message paste करें..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                style={{
                  ...styles.analyzeBtn,
                  opacity: (!text.trim() || isLoading) ? 0.5 : 1,
                  cursor: (!text.trim() || isLoading) ? 'not-allowed' : 'pointer',
                }}
                onClick={analyze}
                disabled={!text.trim() || isLoading}
                id="analyze-btn"
              >
                {isLoading ? '⏳ जाँच हो रही है...' : '🔍 जाँचें — Scam है या नहीं?'}
              </button>
            </div>

            {/* Example Scam Messages */}
            <div style={styles.examples}>
              <p style={styles.examplesLabel}>📋 उदाहरण (try करें)</p>
              {EXAMPLE_SCAMS.map((ex, i) => (
                <button
                  key={i}
                  id={`example-scam-${i}`}
                  style={{
                    ...styles.exampleChip,
                    borderColor: hoveredExample === i ? 'rgba(239,68,68,0.4)' : 'var(--navy-border)',
                    color: hoveredExample === i ? '#FCA5A5' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={() => setHoveredExample(i)}
                  onMouseLeave={() => setHoveredExample(null)}
                  onClick={() => setText(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: '#FCA5A5', fontSize: 14, textAlign: 'center', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div
            style={{
              ...styles.resultCard,
              background: isScam ? 'rgba(239,68,68,0.07)' : 'rgba(34,197,94,0.07)',
              border: `1px solid ${isScam ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
            }}
          >
            {/* Result Header */}
            <div style={styles.resultHeader}>
              <div
                style={{
                  ...styles.resultIconWrap,
                  background: isScam ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                }}
              >
                {isScam ? '🚨' : '✅'}
              </div>
              <div>
                <div style={{ ...styles.resultTitle, color: isScam ? '#FCA5A5' : '#86EFAC' }}>
                  {isScam ? 'यह SCAM है!' : 'यह Safe लगता है'}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span
                    className={`badge ${isScam ? 'badge-scam' : 'badge-safe'}`}
                  >
                    {isScam ? '⚠️ FRAUD' : '✅ SAFE'}
                  </span>
                  {confidence && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px',
                      borderRadius: 999, border: `1px solid ${confidenceColor[confidence]}40`,
                      color: confidenceColor[confidence],
                      background: confidenceColor[confidence] + '14',
                    }}>
                      निश्चितता: {confidenceLabelHi[confidence]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            {/* Reason */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>विश्लेषण</p>
              <p style={styles.reasonText}>{result.reason_hi}</p>
            </div>

            {/* Warning Signs */}
            {result.warning_signs?.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>⚠️ चेतावनी के संकेत</p>
                <div style={styles.warningList}>
                  {result.warning_signs.map((sign, i) => (
                    <div key={i} style={styles.warningItem}>
                      <span>🔴</span>
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advice */}
            {result.advice_hi && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>💡 क्या करें?</p>
                <div style={styles.adviceBox}>💡 {result.advice_hi}</div>
              </div>
            )}

            {/* Official Rule referenced */}
            {result.official_rule && (
              <div style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                color: '#A5B4FC',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                lineHeight: 1.6,
              }}>
                <span style={{ fontWeight: 700 }}>📋 NPCI/RBI नियम: </span>
                {result.official_rule}
              </div>
            )}

            <button style={styles.resetBtn} onClick={reset} id="scam-reset-btn">
              ← {language === 'hi' ? 'दूसरा message जाँचें' : language === 'mr' ? 'दुसरा message तपासा' : language === 'ta' ? 'மற்றொரு message சரிபார்க்கவும்' : 'আরেকটি message যাচাই করুন'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
