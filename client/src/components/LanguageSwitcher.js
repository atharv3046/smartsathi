import React, { useState } from 'react';

export const LANGUAGES = {
  hi: {
    code: 'hi',
    name: 'हिंदी',
    englishName: 'Hindi',
    flag: '🇮🇳',
    script: 'Devanagari',
    nativeName: 'हिंदी',
  },
  mr: {
    code: 'mr',
    name: 'मराठी',
    englishName: 'Marathi',
    flag: '🇮🇳',
    script: 'Devanagari',
    nativeName: 'मराठी',
  },
  ta: {
    code: 'ta',
    name: 'தமிழ்',
    englishName: 'Tamil',
    flag: '🇮🇳',
    script: 'Tamil',
    nativeName: 'தமிழ்',
  },
  bn: {
    code: 'bn',
    name: 'বাংলা',
    englishName: 'Bengali',
    flag: '🇮🇳',
    script: 'Bengali',
    nativeName: 'বাংলা',
  },
  en: {
    code: 'en',
    name: 'English',
    englishName: 'English',
    flag: '🇮🇳',
    script: 'Latin',
    nativeName: 'English',
  },
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
    placeholder: 'यहाँ अपना सवाल लिखें...',
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
    placeholder: 'Type your question here...',
    subject: 'Subject:',
    language: 'Language:',
    footer: 'SmartSathi · AI-Powered · Made in India 🇮🇳',
  },
};

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    flexShrink: 0,
    marginRight: 2,
  },
  langBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 11px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1.5px solid transparent',
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
    background: 'transparent',
    flexShrink: 0,
  },
};

export default function LanguageSwitcher({ language, onSwitch, showLabel = true }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.bar}>
      {showLabel && (
        <span style={styles.label}>
          {UI_STRINGS[language]?.language || 'भाषा:'}
        </span>
      )}
      {Object.values(LANGUAGES).map((lang) => {
        const isActive = lang.code === language;
        return (
          <button
            key={lang.code}
            id={`lang-btn-${lang.code}`}
            style={{
              ...styles.langBtn,
              background: isActive
                ? 'rgba(249,115,22,0.15)'
                : hovered === lang.code
                ? 'rgba(255,255,255,0.05)'
                : 'transparent',
              borderColor: isActive
                ? 'rgba(249,115,22,0.5)'
                : hovered === lang.code
                ? 'var(--navy-border)'
                : 'transparent',
              color: isActive ? '#F97316' : 'var(--text-secondary)',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={() => onSwitch(lang.code)}
            onMouseEnter={() => setHovered(lang.code)}
            onMouseLeave={() => setHovered(null)}
            title={lang.englishName}
          >
            {lang.nativeName}
          </button>
        );
      })}
    </div>
  );
}
