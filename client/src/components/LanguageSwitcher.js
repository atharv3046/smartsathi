import React, { useState, useRef, useEffect } from 'react';

export const LANGUAGES = {
  hi: { code: 'hi', name: 'हिंदी',  englishName: 'Hindi',   script: 'Devanagari', nativeName: 'हिंदी'  },
  mr: { code: 'mr', name: 'मराठी', englishName: 'Marathi',  script: 'Devanagari', nativeName: 'मराठी' },
  ta: { code: 'ta', name: 'தமிழ்', englishName: 'Tamil',    script: 'Tamil',      nativeName: 'தமிழ்' },
  bn: { code: 'bn', name: 'বাংলা', englishName: 'Bengali',  script: 'Bengali',    nativeName: 'বাংলা'  },
  en: { code: 'en', name: 'English',englishName: 'English',  script: 'Latin',      nativeName: 'English'},
};

// Per-language UI strings
export const UI_STRINGS = {
  hi: {
    startLearning: '📚 सीखने की शुरुआत करें',
    checkMessage: '🔍 संदेश जाँचें',
    scamCheckerTitle: 'Scam SMS जाँचें',
    scamCheckerDesc: 'कोई भी संदिग्ध message यहाँ paste करें — हम बताएंगे कि यह scam है या नहीं।',
    liveNews: '📡 आज के UPI Fraud अलर्ट',
    liveNewsLoading: 'ताजा खबरें लोड हो रही हैं...',
    startBtn: 'शुरू करें →',
    tagline: 'आपका AI डिजिटल साथी',
    confusionBtn: '🤔 मुझे समझ नहीं आया',
    sending: 'भेज रहे हैं...',
    placeholder: 'अपना संदेश लिखें...',
    subject: 'विषय:',
    language: 'भाषा:',
    footer: 'SmartSathi · AI-Powered · Made in India 🇮🇳',
  },
  mr: {
    startLearning: '📚 शिकण्यास सुरुवात करा',
    checkMessage: '🔍 संदेश तपासा',
    scamCheckerTitle: 'Scam SMS तपासा',
    scamCheckerDesc: 'कोणताही संशयास्पद message येथे paste करा — आम्ही सांगू की हे scam आहे की नाही।',
    liveNews: '📡 आजचे UPI फसवणूक अलर्ट',
    liveNewsLoading: 'ताज्या बातम्या लोड होत आहेत...',
    startBtn: 'सुरू करा →',
    tagline: 'तुमचा AI डिजिटल साथी',
    confusionBtn: '🤔 मला समजले नाही',
    sending: 'पाठवत आहे...',
    placeholder: 'येथे तुमचा प्रश्न लिहा...',
    subject: 'विषय:',
    language: 'भाषा:',
    footer: 'SmartSathi · AI-Powered · Made in India 🇮🇳',
  },
  ta: {
    startLearning: '📚 கற்றலை தொடங்குங்கள்',
    checkMessage: '🔍 செய்தி சரிபார்க்கவும்',
    scamCheckerTitle: 'Scam SMS சரிபார்க்கவும்',
    scamCheckerDesc: 'சந்தேகமான எந்த message-ஐயும் இங்கே paste செய்யுங்கள் — இது scam-ஆ என்று கூறுவோம்.',
    liveNews: '📡 இன்றைய UPI மோசடி அலர்ட்',
    liveNewsLoading: 'புதிய செய்திகள் ஏற்றப்படுகின்றன...',
    startBtn: 'தொடங்கு →',
    tagline: 'உங்கள் AI டிஜிட்டல் துணை',
    confusionBtn: '🤔 எனக்கு புரியவில்லை',
    sending: 'அனுப்புகிறோம்...',
    placeholder: 'இங்கே உங்கள் கேள்வியை எழுதுங்கள்...',
    subject: 'தலைப்பு:',
    language: 'மொழி:',
    footer: 'SmartSathi · AI-Powered · Made in India 🇮🇳',
  },
  bn: {
    startLearning: '📚 শেখা শুরু করুন',
    checkMessage: '🔍 বার্তা যাচাই করুন',
    scamCheckerTitle: 'Scam SMS যাচাই করুন',
    scamCheckerDesc: 'যেকোনো সন্দেহজনক message এখানে paste করুন — আমরা বলব এটি scam কিনা।',
    liveNews: '📡 আজকের UPI জালিয়াতি সতর্কতা',
    liveNewsLoading: 'তাজা খবর লোড হচ্ছে...',
    startBtn: 'শুরু করুন →',
    tagline: 'আপনার AI ডিজিটাল সঙ্গী',
    confusionBtn: '🤔 আমি বুঝিনি',
    sending: 'পাঠানো হচ্ছে...',
    placeholder: 'এখানে আপনার প্রশ্ন লিখুন...',
    subject: 'বিষয়:',
    language: 'ভাষা:',
    footer: 'SmartSathi · AI-Powered · Made in India 🇮🇳',
  },
  en: {
    startLearning: '📚 Start Learning',
    checkMessage: '🔍 Check Message',
    scamCheckerTitle: 'Scam SMS Checker',
    scamCheckerDesc: 'Paste any suspicious message here — we will tell you if it is a scam or not.',
    liveNews: '📡 Today\'s UPI Fraud Alerts',
    liveNewsLoading: 'Loading latest news...',
    startBtn: 'Start →',
    tagline: 'Your AI Digital Companion',
    confusionBtn: '🤔 I do not understand',
    sending: 'Sending...',
    placeholder: 'Type your message here...',
    subject: 'Subject:',
    language: 'Language:',
    footer: 'SmartSathi · AI-Powered · Made in India 🇮🇳',
  },
};

// ─── Mobile-friendly compact dropdown version ──────────────────────────────
function CompactDropdown({ language, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES[language] || LANGUAGES.hi;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        id="lang-dropdown-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 12px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          border: '1.5px solid var(--primary-light)',
          background: 'rgba(74,103,65,0.08)',
          color: 'var(--primary)',
          whiteSpace: 'nowrap',
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          transition: 'all 0.18s ease',
        }}
      >
        {current.nativeName}
        <span style={{ fontSize: 10, opacity: 0.7, lineHeight: 1 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            minWidth: 150,
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {Object.values(LANGUAGES).map(lang => (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              onClick={() => { onSwitch(lang.code); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '11px 16px',
                background: lang.code === language ? 'rgba(74,103,65,0.08)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-light)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: lang.code === language ? 700 : 500,
                color: lang.code === language ? 'var(--primary)' : 'var(--text-secondary)',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
            >
              <span>{lang.nativeName}</span>
              {lang.code === language && (
                <span style={{ color: 'var(--primary)', fontSize: 14 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component: pill row on desktop, dropdown on mobile ───────────────
export default function LanguageSwitcher({ language, onSwitch, showLabel = true, compact = false }) {
  const [hovered, setHovered] = useState(null);

  // Always use compact dropdown when compact=true or on mobile screens
  if (compact) {
    return <CompactDropdown language={language} onSwitch={onSwitch} />;
  }

  // Full pill row (desktop)
  const langKeys = Object.keys(LANGUAGES);
  const activeIndex = langKeys.indexOf(language) === -1 ? 0 : langKeys.indexOf(language);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }}>
      {showLabel && (
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-muted)', flexShrink: 0, marginRight: 2,
        }} className="hindi">
          {UI_STRINGS[language]?.language || 'भाषा:'}
        </span>
      )}

      {/* Segmented Control Container */}
      <div style={{
        display: 'flex', position: 'relative',
        background: 'var(--bg-card)',
        padding: 4, borderRadius: 999, border: '1px solid var(--border-light)'
      }}>
        {/* Sliding background pill */}
        <div style={{
          position: 'absolute',
          top: 4, bottom: 4,
          left: 4,
          width: `calc((100% - 8px) / ${langKeys.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
          background: 'rgba(74,103,65,0.1)',
          border: '1.5px solid var(--primary-light)',
          borderRadius: 999,
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 0,
        }} />

        {/* Buttons */}
        {Object.values(LANGUAGES).map((lang) => {
          const isActive = lang.code === language;
          return (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              style={{
                position: 'relative', zIndex: 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '4px 11px', borderRadius: 999, fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', border: '1.5px solid transparent',
                transition: 'color 0.2s ease, transform 0.2s ease',
                whiteSpace: 'nowrap', background: 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                flex: 1,
              }}
              onClick={() => onSwitch(lang.code)}
              title={lang.englishName}
            >
              {lang.nativeName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
