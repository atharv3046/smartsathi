import React from 'react';
import { getModules } from '../data/modulesData';
import LanguageSwitcher, { UI_STRINGS } from './LanguageSwitcher';
import ScamNews from './ScamNews';

const styles = {
  screen: {
    height: '100vh',
    overflowY: 'auto',
    padding: '0 16px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    maxWidth: 840,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '12px 0 0',
    gap: 8,
  },
  hero: {
    textAlign: 'center',
    padding: '28px 16px 28px',
    maxWidth: 480,
    width: '100%',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F97316, #C2410C)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    margin: '0 auto 20px',
    boxShadow: '0 0 40px rgba(249,115,22,0.4)',
  },
  appName: {
    fontSize: 36,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #F97316, #FED7AA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.2,
  },
  tagline: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    marginTop: 8,
    lineHeight: 1.6,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: 14,
    textAlign: 'left',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 14,
    width: '100%',
    maxWidth: 840,
  },
  moduleCard: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 20px',
    cursor: 'pointer',
    backdropFilter: 'blur(16px)',
    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  moduleIcon: {
    fontSize: 28,
    display: 'block',
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  moduleSubtitle: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.5,
  },
  startBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--saffron)',
    marginTop: 4,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  divider: {
    width: '100%',
    maxWidth: 840,
    textAlign: 'left',
    margin: '28px 0 14px',
  },
  scamCard: {
    width: '100%',
    maxWidth: 840,
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 22px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'all 0.22s ease',
  },
  scamIconWrap: {
    width: 48,
    height: 48,
    background: 'rgba(239,68,68,0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
};

export default function WelcomeScreen({ onStartModule, onScamChecker, onScreenshotAnalyzer, language, onLanguageSwitch }) {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const ui = UI_STRINGS[language] || UI_STRINGS.hi;
  const modules = getModules(language);

  return (
    <div style={styles.screen}>
      {/* Language Switcher top-right */}
      <div style={styles.topBar}>
        <LanguageSwitcher language={language} onSwitch={onLanguageSwitch} />
      </div>

      {/* Hero */}
      <div style={styles.hero} className="animate-up">
        <div style={styles.logoCircle}>🤖</div>
        <h1 style={styles.appName}>SmartSathi</h1>
        <p style={styles.tagline}>
          {ui.tagline} — AI Digital Tutor
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            AI-Powered Digital Literacy for First-Time Smartphone Users
          </span>
        </p>
      </div>

      {/* Module Cards */}
      <div style={{ width: '100%', maxWidth: 840 }} className="animate-up">
        <p style={styles.sectionLabel}>{ui.startLearning}</p>
        <div style={styles.grid}>
          {Object.values(modules).map((mod) => (
            <button
              key={mod.id}
              style={{
                ...styles.moduleCard,
                borderColor: hoveredCard === mod.id ? mod.color + '55' : 'var(--glass-border)',
                transform: hoveredCard === mod.id ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredCard === mod.id ? `0 12px 30px ${mod.color}25` : 'var(--shadow-card)',
              }}
              onMouseEnter={() => setHoveredCard(mod.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onStartModule(mod.id)}
              id={`module-btn-${mod.id}`}
            >
              <span style={styles.moduleIcon}>{mod.icon}</span>
              <div>
                <div style={{ ...styles.moduleTitle, color: mod.color }}>{mod.title}</div>
                <div style={styles.moduleSubtitle}>{mod.description}</div>
              </div>
              <div style={styles.startBadge}>
                {ui.startBtn}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Scam News */}
      <div style={styles.divider}>
        <p style={styles.sectionLabel}>{ui.liveNews}</p>
      </div>
      <div style={{ width: '100%', maxWidth: 840 }}>
        <ScamNews language={language} />
      </div>

      {/* Screenshot Analyzer Tool */}
      <div style={{ ...styles.divider, marginTop: 24 }}>
        <p style={styles.sectionLabel}>📸 Screen से सीखें</p>
      </div>
      <button
        style={{
          ...styles.scamCard,
          background: 'rgba(249,115,22,0.07)',
          border: '1px solid rgba(249,115,22,0.2)',
          transform: hoveredCard === 'screenshot' ? 'translateY(-2px)' : 'none',
          boxShadow: hoveredCard === 'screenshot' ? '0 8px 24px rgba(249,115,22,0.2)' : 'none',
        }}
        onMouseEnter={() => setHoveredCard('screenshot')}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={onScreenshotAnalyzer}
        id="screenshot-analyzer-btn"
      >
        <div style={{
          ...styles.scamIconWrap,
          background: 'rgba(249,115,22,0.15)',
        }}>📸</div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ ...styles.moduleTitle, color: '#F97316', fontSize: 15 }}>
            Screenshot से मदद लें
          </div>
          <div style={{ ...styles.moduleSubtitle, marginTop: 4 }}>
            किसी भी app का screenshot upload करें — SmartSathi step-by-step guide करेगा।
          </div>
        </div>
        <span style={{ fontSize: 20, color: '#F97316' }}>→</span>
      </button>

      {/* Scam Checker Tool */}
      <div style={{ ...styles.divider, marginTop: 24 }}>
        <p style={styles.sectionLabel}>{ui.checkMessage}</p>
      </div>
      <button
        style={{
          ...styles.scamCard,
          transform: hoveredCard === 'scam-checker' ? 'translateY(-2px)' : 'none',
          boxShadow: hoveredCard === 'scam-checker' ? '0 8px 24px rgba(239,68,68,0.25)' : 'none',
        }}
        onMouseEnter={() => setHoveredCard('scam-checker')}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={onScamChecker}
        id="scam-checker-btn"
      >
        <div style={styles.scamIconWrap}>🔍</div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ ...styles.moduleTitle, color: '#FCA5A5', fontSize: 15 }}>
            {ui.scamCheckerTitle}
          </div>
          <div style={{ ...styles.moduleSubtitle, marginTop: 4 }}>
            {ui.scamCheckerDesc}
          </div>
        </div>
        <span style={{ fontSize: 20, color: '#FCA5A5' }}>→</span>
      </button>

      <p style={styles.footer}>{ui.footer}</p>
    </div>
  );
}
