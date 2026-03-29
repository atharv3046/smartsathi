import React, { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const styles = {
  screen: {
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
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
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  headerSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  headerRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
    background: 'rgba(74,103,65,0.08)',
    border: '2px solid rgba(74,103,65,0.2)',
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
    color: 'var(--text-primary)',
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
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: 'var(--shadow-card)',
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--danger)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  textarea: {
    width: '100%',
    minHeight: 100,
    background: '#F8FAF5',
    border: '1px solid var(--border-light)',
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
  examplesLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  exampleChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    background: 'var(--bg-page)',
    border: '1px solid var(--border-light)',
    borderRadius: 999,
    padding: '6px 14px',
    fontSize: 12,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.18s ease',
    lineHeight: 1.4,
  },
  analyzeBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, var(--primary), #3d5a36)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-btn)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resultCard: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    animation: 'fadeInUp 0.4s ease forwards',
    boxShadow: 'var(--shadow-card)',
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
  resultBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 6,
    letterSpacing: '0.03em',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  divider: {
    height: 1,
    background: 'var(--border-light)',
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
    gap: 8,
  },
  warningItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 13,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.5,
  },
  adviceBox: {
    background: 'var(--success-bg)',
    border: '1px solid var(--success-border)',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 13,
    color: '#2E7D32',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.6,
  },
  reportBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, var(--danger), #c82333)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 2px 8px rgba(220,53,69,0.3)',
  },
  resetBtn: {
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: 10,
    color: 'var(--text-secondary)',
    fontSize: 13,
    cursor: 'pointer',
    padding: '8px 16px',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'all 0.18s ease',
  },
};

// ── Per-language localization for ScamChecker ──────────────────────────────
const SCAM_STRINGS = {
  hi: {
    pageTitle:     'Scam SMS Checker',
    heroTitle:     'SMS की शुद्धता जाँचें',
    heroDesc:      'संदिग्ध मैसेज यहाँ पेस्ट करें और खुद को सुरक्षित रखें।',
    inputLabel:    'मैसेज यहाँ डालें',
    placeholder:   'जैसे: "जल्दी KYC अपडेट करें नहीं तो बैंक खाता बंद हो जाएगा..."',
    examplesLabel: 'उदाहरण (क्लिक करें)',
    analyzing:     '⏳ जाँच हो रही है...',
    analyzeBtn:    'जाँचें',
    errorFallback: 'जाँच करने में समस्या हुई।',
    badgeScam:     '⚠️ खतरा',
    badgeSafe:     '✅ सुरक्षित',
    resultScam:    'यह SCAM है!',
    resultSafe:    'Safe लगता है',
    whyScam:       'यह मैसेज संदिग्ध क्यों है:',
    whySafe:       'सुरक्षित रहने के लिए सुझाव:',
    confidence:    'निश्चितता:',
    confHigh:      'उच्च', confMed: 'मध्यम', confLow: 'कम',
    npciRule:      '📋 NPCI/RBI नियम:',
    resetBtn:      '← दूसरा message जाँचें',
    chips:         ['बैंक KYC अपडेट', 'इनाम रिवार्ड ऑफर', 'बिजली बिल बकाया'],
    examples: [
      'आपका SBI account KYC expired हो गया है। इसे update करने के लिए यहाँ click करें: http://sbi-kyc-update.xyz',
      'Congratulations! आपने 50 lakh rupees जीते हैं। Prize लेने के लिए अभी call करें: 9999999999',
      'PM Kisan Yojana: आपके खाते में ₹6000 आने वाले हैं। अपना Aadhaar और OTP verify करें।',
    ],
  },
  mr: {
    pageTitle:     'Scam SMS तपासणी',
    heroTitle:     'SMS ची सत्यता तपासा',
    heroDesc:      'संशयास्पद message येथे paste करा आणि स्वतःला सुरक्षित ठेवा।',
    inputLabel:    'message येथे टाका',
    placeholder:   'जसे: "लवकर KYC अपडेट करा नाहीतर बँक खाते बंद होईल..."',
    examplesLabel: 'उदाहरणे (क्लिक करा)',
    analyzing:     '⏳ तपासणी होत आहे...',
    analyzeBtn:    'तपासा',
    errorFallback: 'तपासणीत समस्या आली।',
    badgeScam:     '⚠️ धोका',
    badgeSafe:     '✅ सुरक्षित',
    resultScam:    'हे SCAM आहे!',
    resultSafe:    'Safe वाटते',
    whyScam:       'हे message संशयास्पद का आहे:',
    whySafe:       'सुरक्षित राहण्यासाठी सुचना:',
    confidence:    'खात्री:',
    confHigh:      'उच्च', confMed: 'मध्यम', confLow: 'कमी',
    npciRule:      '📋 NPCI/RBI नियम:',
    resetBtn:      '← दुसरा message तपासा',
    chips:         ['बँक KYC अपडेट', 'बक्षीस ऑफर', 'वीज बिल थकबाकी'],
    examples: [
      'तुमचे SBI account KYC expired झाले आहे. अपडेट करण्यासाठी येथे click करा: http://sbi-kyc-update.xyz',
      'अभिनंदन! तुम्ही 50 लाख रुपये जिंकले आहेत. Prize मिळवण्यासाठी आत्ता call करा: 9999999999',
      'PM Kisan Yojana: तुमच्या खात्यात ₹6000 येणार आहेत. तुमचा Aadhaar आणि OTP verify करा।',
    ],
  },
  ta: {
    pageTitle:     'Scam SMS சரிபார்ப்பு',
    heroTitle:     'SMS-ஐ சரிபார்க்கவும்',
    heroDesc:      'சந்தேகமான message-ஐ இங்கே paste செய்து உங்களை பாதுகாத்துக்கொள்ளுங்கள்.',
    inputLabel:    'message இங்கே உள்ளிடவும்',
    placeholder:   'உதா: "உடனே KYC புதுப்பிக்கவும் இல்லையெனில் வங்கி கணக்கு மூடப்படும்..."',
    examplesLabel: 'எடுத்துக்காட்டுகள் (கிளிக் செய்யவும்)',
    analyzing:     '⏳ சரிபார்க்கப்படுகிறது...',
    analyzeBtn:    'சரிபார்',
    errorFallback: 'சரிபார்ப்பில் சிக்கல் ஏற்பட்டது.',
    badgeScam:     '⚠️ ஆபத்து',
    badgeSafe:     '✅ பாதுகாப்பானது',
    resultScam:    'இது SCAM!',
    resultSafe:    'பாதுகாப்பானதாக தெரிகிறது',
    whyScam:       'இந்த message சந்தேகமானது ஏன்:',
    whySafe:       'பாதுகாப்பாக இருக்க ஆலோசனைகள்:',
    confidence:    'நம்பகத்தன்மை:',
    confHigh:      'அதிகம்', confMed: 'நடுத்தரம்', confLow: 'குறைவு',
    npciRule:      '📋 NPCI/RBI விதி:',
    resetBtn:      '← மற்றொரு message சரிபார்க்கவும்',
    chips:         ['வங்கி KYC புதுப்பிப்பு', 'பரிசு ஆஃபர்', 'மின்சாரக் கட்டண நிலுவை'],
    examples: [
      'உங்கள் SBI account KYC expired ஆகிவிட்டது. புதுப்பிக்க இங்கே click செய்யவும்: http://sbi-kyc-update.xyz',
      'வாழ்த்துக்கள்! நீங்கள் 50 லட்சம் வென்றுள்ளீர்கள். Prize பெற இப்போதே call செய்யவும்: 9999999999',
      'PM Kisan Yojana: உங்கள் கணக்கில் ₹6000 வரவிருக்கிறது. உங்கள் Aadhaar மற்றும் OTP verify செய்யவும்.',
    ],
  },
  bn: {
    pageTitle:     'Scam SMS যাচাই',
    heroTitle:     'SMS-এর সত্যতা যাচাই করুন',
    heroDesc:      'সন্দেহজনক message এখানে paste করুন এবং নিজেকে সুরক্ষিত রাখুন।',
    inputLabel:    'message এখানে দিন',
    placeholder:   'যেমন: "দ্রুত KYC আপডেট করুন নাহলে ব্যাংক অ্যাকাউন্ট বন্ধ হয়ে যাবে..."',
    examplesLabel: 'উদাহরণ (ক্লিক করুন)',
    analyzing:     '⏳ যাচাই হচ্ছে...',
    analyzeBtn:    'যাচাই করুন',
    errorFallback: 'যাচাইয়ে সমস্যা হয়েছে।',
    badgeScam:     '⚠️ বিপদ',
    badgeSafe:     '✅ নিরাপদ',
    resultScam:    'এটি SCAM!',
    resultSafe:    'নিরাপদ মনে হচ্ছে',
    whyScam:       'এই message সন্দেহজনক কেন:',
    whySafe:       'নিরাপদ থাকার পরামর্শ:',
    confidence:    'নিশ্চিততা:',
    confHigh:      'উচ্চ', confMed: 'মাঝারি', confLow: 'কম',
    npciRule:      '📋 NPCI/RBI নিয়ম:',
    resetBtn:      '← আরেকটি message যাচাই করুন',
    chips:         ['ব্যাংক KYC আপডেট', 'পুরস্কার অফার', 'বিদ্যুৎ বিল বকেয়া'],
    examples: [
      'আপনার SBI account KYC expired হয়ে গেছে। আপডেট করতে এখানে click করুন: http://sbi-kyc-update.xyz',
      'অভিনন্দন! আপনি 50 লক্ষ টাকা জিতেছেন। Prize নিতে এখনই call করুন: 9999999999',
      'PM Kisan Yojana: আপনার অ্যাকাউন্টে ₹6000 আসবে। আপনার Aadhaar এবং OTP verify করুন।',
    ],
  },
  en: {
    pageTitle:     'Scam SMS Checker',
    heroTitle:     'Check if a message is a scam',
    heroDesc:      'Paste any suspicious message here and protect yourself.',
    inputLabel:    'Paste your message here',
    placeholder:   'E.g.: "Update your KYC immediately or your bank account will be blocked..."',
    examplesLabel: 'Examples (click to try)',
    analyzing:     '⏳ Checking...',
    analyzeBtn:    'Check',
    errorFallback: 'Something went wrong while checking.',
    badgeScam:     '⚠️ Danger',
    badgeSafe:     '✅ Safe',
    resultScam:    'This is a SCAM!',
    resultSafe:    'Looks Safe',
    whyScam:       'Why this message is suspicious:',
    whySafe:       'Tips to stay safe:',
    confidence:    'Confidence:',
    confHigh:      'High', confMed: 'Medium', confLow: 'Low',
    npciRule:      '📋 NPCI/RBI Rule:',
    resetBtn:      '← Check another message',
    chips:         ['Bank KYC Update', 'Reward Offer', 'Electricity Bill Due'],
    examples: [
      'Your SBI account KYC has expired. Click here to update: http://sbi-kyc-update.xyz',
      'Congratulations! You have won 50 lakh rupees. Call now to claim your prize: 9999999999',
      'PM Kisan Yojana: ₹6000 is being credited to your account. Verify your Aadhaar and OTP.',
    ],
  },
};
function getSC(language) { return SCAM_STRINGS[language] || SCAM_STRINGS.hi; }

export default function ScamChecker({ onBack, language = 'hi', onLanguageSwitch }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredExample, setHoveredExample] = useState(null);
  const sc = getSC(language);

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
      setError(e.message || sc.errorFallback);
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

  const confidenceColor = { high: 'var(--danger)', medium: '#F57F17', low: 'var(--success)' };
  const confidenceLabel = { high: sc.confHigh, medium: sc.confMed, low: sc.confLow };

  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack} title="Back" id="scam-back-btn">←</button>
        <div style={{ flex: 1 }}>
          <div style={styles.headerTitle}>{sc.pageTitle}</div>
        </div>
        <div style={styles.headerRight}>
          <LanguageSwitcher language={language} onSwitch={onLanguageSwitch} showLabel={false} />
        </div>
      </div>

      <div style={styles.body} className="animate-up">
        {/* Hero */}
        <div style={styles.heroBox}>
          <div style={styles.heroIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: 30, color: 'var(--primary)' }}>search</span>
          </div>
          <h2 style={styles.heroTitle}>{sc.heroTitle}</h2>
          <p style={styles.heroDesc}>{sc.heroDesc}</p>
        </div>

        {/* Input */}
        {!result && (
          <>
            <div style={styles.inputCard}>
              <label style={styles.label} htmlFor="scam-input">{sc.inputLabel}</label>
              <textarea
                id="scam-input"
                style={{
                  ...styles.textarea,
                  borderColor: text ? 'var(--primary-light)' : 'var(--border-light)',
                }}
                placeholder={sc.placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div>
                <div style={styles.examplesLabel}>{sc.examplesLabel}</div>
                <div style={{ ...styles.exampleChips, marginTop: 8 }}>
                  {sc.chips.map((chip, i) => (
                    <button
                      key={i}
                      style={{
                        ...styles.exampleChip,
                        borderColor: hoveredExample === i ? 'var(--primary-light)' : 'var(--border-light)',
                        color: hoveredExample === i ? 'var(--primary)' : 'var(--text-secondary)',
                        background: hoveredExample === i ? 'rgba(74,103,65,0.06)' : 'var(--bg-page)',
                      }}
                      onMouseEnter={() => setHoveredExample(i)}
                      onMouseLeave={() => setHoveredExample(null)}
                      onClick={() => setText(sc.examples[i])}
                      id={`example-scam-${i}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
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
                {isLoading ? (
                  <>{sc.analyzing}</>
                ) : (
                  <>
                    {sc.analyzeBtn} <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 14, textAlign: 'center', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Scam Result Card */}
            <div
              style={{
                ...styles.resultCard,
                background: isScam ? 'var(--danger-bg)' : 'var(--success-bg)',
                border: `1.5px solid ${isScam ? 'var(--danger-border)' : 'var(--success-border)'}`,
              }}
            >
              {/* Badge */}
              <div style={{
                ...styles.resultBadge,
                background: isScam ? 'var(--danger)' : 'var(--success)',
                color: '#fff',
                alignSelf: 'flex-start',
              }}>
                {isScam ? sc.badgeScam : sc.badgeSafe}
              </div>

              {/* Result Header */}
              <div style={styles.resultHeader}>
                <div>
                  <div style={{ ...styles.resultTitle, color: isScam ? 'var(--danger)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isScam ? '🚫' : '✅'} {isScam ? sc.resultScam : sc.resultSafe}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isScam ? 'rgba(220,53,69,0.12)' : 'rgba(40,167,69,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}>
                  {isScam ? '⚠️' : '✅'}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {isScam ? sc.whyScam : sc.whySafe}
                </p>
                <p style={styles.reasonText}>{result.reason_hi}</p>
              </div>

              {/* Warning Signs */}
              {result.warning_signs?.length > 0 && (
                <div style={styles.warningList}>
                  {result.warning_signs.map((sign, i) => (
                    <div key={i} style={{ ...styles.warningItem, color: isScam ? 'var(--danger)' : 'var(--success)' }}>
                      <span style={{ fontSize: 16 }}>{isScam ? '🔴' : '🟢'}</span>
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {isScam && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.reportBtn, textDecoration: 'none', flex: 1, justifyContent: 'center' }}
                    id="report-cybercrime-btn"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>flag</span>
                    Report at cybercrime.gov.in
                  </a>
                  <a
                    href="tel:1930"
                    style={{ ...styles.reportBtn, background: 'linear-gradient(135deg, #6984A9, #567a9a)', textDecoration: 'none', flex: '0 0 auto' }}
                    id="report-helpline-btn"
                  >
                    📞 1930
                  </a>
                </div>
              )}

              {/* Advice */}
              {result.advice_hi && !isScam && (
                <div style={styles.adviceBox}>💡 {result.advice_hi}</div>
              )}

              {/* Confidence */}
              {confidence && (
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: `1px solid ${confidenceColor[confidence]}40`,
                  color: confidenceColor[confidence],
                  background: confidenceColor[confidence] + '10',
                  alignSelf: 'flex-start',
                }}>
                  {sc.confidence} {confidenceLabel[confidence]}
                </div>
              )}
            </div>

            {/* Official Rule */}
            {result.official_rule && (
              <div style={{
                width: '100%',
                background: 'rgba(105,132,169,0.06)',
                border: '1px solid rgba(105,132,169,0.15)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 12,
                color: 'var(--secondary)',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                lineHeight: 1.6,
              }}>
                <span style={{ fontWeight: 700 }}>{sc.npciRule} </span>
                {result.official_rule}
              </div>
            )}

            <button style={styles.resetBtn} onClick={reset} id="scam-reset-btn">
              {sc.resetBtn}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
