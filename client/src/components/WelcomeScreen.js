import React, { useState, useEffect } from 'react';
import { getModules } from '../data/modulesData';
import LanguageSwitcher from './LanguageSwitcher';
import ScamNews from './ScamNews';
import Logo from './Logo';
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// ─── Number Counting Animation ──────────────────────────────────────────
function CountUpStat({ valueStr }) {
  const [count, setCount] = React.useState(null);
  const ref = React.useRef(null);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    const match = valueStr.match(/^(\D*)(\d+)(\D*)$/);
    if (!match) {
      setCount(valueStr);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const endVal = parseInt(numStr, 10);

    setCount(`${prefix}0${suffix}`);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let startObj = null;
        const duration = 1500;

        const step = (timestamp) => {
          if (!startObj) startObj = timestamp;
          const progress = Math.min((timestamp - startObj) / duration, 1);
          const easeProgress = progress * (2 - progress);
          const currentVal = Math.floor(easeProgress * endVal);
          setCount(`${prefix}${currentVal}${suffix}`);

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(valueStr);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [valueStr]);

  return <span ref={ref}>{count || valueStr}</span>;
}

// ── Welcome screen locale strings ──────────────────────────────────────
const WELCOME_STRINGS = {
  hi: {
    heroHeadline: 'डिजिटल दुनिया में\nआपका साथी',
    heroSubtext:  'UPI payments, scam detection, and government apps — explained simply, in your language.',
    heroCTA:      'अभी सीखना शुरू करें',
    heroAlt:      'See How It Works',
    modulesTitle: 'क्या सीखेंगे आप?',
    howWorks:     'How It Works',
    steps: [
      { title: 'Choose Language',  desc: 'Select your mother tongue for a personalized experience.' },
      { title: 'Pick a Module',    desc: 'Choose what you want to learn today from our library.' },
      { title: 'Chat with AI',     desc: 'Interactive voice-enabled tutor to guide you step-by-step.' },
    ],
    scamTitle: 'Got a suspicious message?',
    scamDesc:  'Paste any SMS or WhatsApp message — AI will tell you if it’s a scam in seconds.',
    scamInput: 'Paste your message here...',
    scamBtn:   'Check Now',
    screenshotTitle: 'Screenshot से मदद लें',
    screenshotDesc:  'किसी भी app का screenshot upload करें — SmartSathi step-by-step guide करेगा।',
    footerTagline: 'आपका डिजिटल सुरक्षा साथी',
  },
  mr: {
    heroHeadline: 'डिजिटल दुनियेत\nतुमचा साथी',
    heroSubtext:  'UPI payments, scam detection, आणि सरकारी apps — तुमच्या भाषेत सोप्या भाषेत समजावले.',
    heroCTA:      'आता शिकणे सुरू करा',
    heroAlt:      'हे कसे काम करते',
    modulesTitle: 'तुम्ही काय शिकणार?',
    howWorks:     'हे कसे काम करते',
    steps: [
      { title: 'भाषा निवडा',     desc: 'वैयक्तिक अनुभवासाठी तुमची मातृभाषा निवडा.' },
      { title: 'विषय निवडा',    desc: 'आज तुम्हाला काय शिकायचे आहे ते निवडा.' },
      { title: 'AI शी गप्पा करा', desc: 'आवाज-सक्षम AI शिक्षक तुम्हाला step-by-step मार्गदर्शन करेल.' },
    ],
    scamTitle: 'संशयास्पद message मिळाले?',
    scamDesc:  'कोणताही SMS किंवा WhatsApp message येथे paste करा — AI तुम्हाला जारात सांगेल.',
    scamInput: 'तुमचा message येथे paste करा...',
    scamBtn:   'तपासा',
    screenshotTitle: 'Screenshot ने मदत घ्या',
    screenshotDesc:  'कोणत्याही app चा screenshot upload करा — SmartSathi step-by-step guide करेल.',
    footerTagline: 'तुमचा डिजिटल सुरक्षा साथी',
  },
  ta: {
    heroHeadline: 'இணைய உலகில்\nஉங்கள் துணைவாளர்',
    heroSubtext:  'UPI payments, மோசடி கண்டறிப்பு, மற்றும் અரசு apps — உங்கள் மொழியில் எளிதாக விளக்கப்படுகிறது.',
    heroCTA:      'இப்போதே கலிக்க தொடங்குங்கள்',
    heroAlt:      'எப்படி செயல்படுகிறது',
    modulesTitle: 'நீங்கள் என்ன கலி்பீர்கள்?',
    howWorks:     'எப்படி செயல்படுகிறது',
    steps: [
      { title: 'மொழியை தேர்வு',      desc: 'தனிப்பট்ட அனுபவத்திற்கு உங்கள் தாய்மொழியை தேர்வுசெய்யுங்கள்.' },
      { title: 'பாடத்திர்வு தேர்வு', desc: 'இன்று நீங்கள் கலிக்க விரும்புவதை தேர்வுசெய்யுங்கள்.' },
      { title: 'AIயுடன் உரையுங்கள்', desc: 'உங்களுக்கு step-by-step வழிகாட்டும் இணைய AI பயிற்சியாளர்.' },
    ],
    scamTitle: 'சந்தேகமான message கிடைததா?',
    scamDesc:  'எந்த SMS மற்றும் WhatsApp message-ஐயும் இங்கே paste செய்யுங்கள் — AI உடனடியாக சொல்வது.',
    scamInput: 'உங்கள் message-ஐ இங்கே paste செய்யுங்கள்...',
    scamBtn:   'சரிபார்',
    screenshotTitle: 'Screenshot மூலம் உதவி பெறுங்கள்',
    screenshotDesc:  'எந்த appஅடையும் screenshot upload செய்யுங்கள் — SmartSathi step-by-step வழிகாட்டும்.',
    footerTagline: 'உங்கள் இணைய பாதுகாப்பு துணைவாளர்',
  },
  bn: {
    heroHeadline: 'ডিজিটাল দুনিয়ায়\nআপনার সাথী',
    heroSubtext:  'UPI payments, জালিয়াতি শনাক্তকরণ, এবং সরকারি apps — আপনার ভাষায় সহজে বোঝানো হয়েছে.',
    heroCTA:      'এখনই শেখা শুরু করুন',
    heroAlt:      'কীভাবে কাজ করে',
    modulesTitle: 'আপনি কী শিখবেন?',
    howWorks:     'কীভাবে কাজ করে',
    steps: [
      { title: 'ভাষা বেছুন',      desc: 'ব্যক্তিগত অভিজ্ঞতার জন্য আপনার মাতৃভাষা বেছুন.' },
      { title: 'বিষয় বেছুন',   desc: 'আজ আপনি কী শিখতে চান তা বেছুন.' },
      { title: 'AIয়ের সাথে কথা বলুন', desc: 'কণ্ঠস্বর-সক্ষম AI step-by-step আপনাকে সাহায্য করবে.' },
    ],
    scamTitle: 'সন্দেহজনক message পেয়েছেন?',
    scamDesc:  'যেকোনো SMS বা WhatsApp message এখানে paste করুন — AI তাৎক্ষণিক বলবে.',
    scamInput: 'আপনার message এখানে paste করুন...',
    scamBtn:   'যাচাই করুন',
    screenshotTitle: 'Screenshot থেকে সাহায্য নিন',
    screenshotDesc:  'যেকোনো app-এর screenshot upload করুন — SmartSathi step-by-step guide করবে.',
    footerTagline: 'আপনার ডিজিটাল সুরক্ষা সাথী',
  },
  en: {
    heroHeadline: 'Your Companion\nin the Digital World',
    heroSubtext:  'UPI payments, scam detection, and government apps — explained simply, in your language.',
    heroCTA:      'Start Learning Now',
    heroAlt:      'See How It Works',
    modulesTitle: 'What Will You Learn?',
    howWorks:     'How It Works',
    steps: [
      { title: 'Choose Language',  desc: 'Select your mother tongue for a personalized experience.' },
      { title: 'Pick a Module',    desc: 'Choose what you want to learn today from our library.' },
      { title: 'Chat with AI',     desc: 'Interactive voice-enabled tutor to guide you step-by-step.' },
    ],
    scamTitle: 'Got a suspicious message?',
    scamDesc:  'Paste any SMS or WhatsApp message — AI will tell you if it’s a scam in seconds.',
    scamInput: 'Paste your message here...',
    scamBtn:   'Check Now',
    screenshotTitle: 'Get help from a Screenshot',
    screenshotDesc:  'Upload any app screenshot — SmartSathi will guide you step-by-step.',
    footerTagline: 'Your Digital Safety Companion',
  },
};
function getSW(language) { return WELCOME_STRINGS[language] || WELCOME_STRINGS.hi; }

const styles = {
  screen: {
    height: '100vh',
    overflowY: 'auto',
    background: 'var(--bg-page)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  // ── Top Nav ──
  navbar: {
    width: '100%',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-card)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    gap: 8,
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  navCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  // ── Hero Section ──
  heroSection: {
    width: '100%',
    maxWidth: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 20px 28px',
    gap: 32,
    flexWrap: 'wrap',
  },
  heroLeft: {
    flex: 1,
    minWidth: 0,   // allow shrinking on mobile
  },
  heroHeadline: {
    fontSize: 38,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.3,
    marginBottom: 12,
  },
  heroSubtext: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    marginBottom: 24,
    maxWidth: 440,
  },
  heroCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    fontSize: 15,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    boxShadow: 'var(--shadow-btn)',
    transition: 'var(--transition)',
  },
  heroSecondaryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-md)',
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid var(--border-light)',
    cursor: 'pointer',
    marginLeft: 12,
    transition: 'var(--transition)',
  },
  heroRight: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 260,
    height: 260,
    borderRadius: '50%',
    objectFit: 'cover',
    background: 'linear-gradient(135deg, #C5E6B4, #EEFABD)',
    boxShadow: '0 8px 32px rgba(74,103,65,0.15)',
  },
  // ── Stats Row ──
  statsRow: {
    width: '100%',
    maxWidth: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '12px 16px 8px',
    flexWrap: 'wrap',
  },
  statChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 999,
    padding: '6px 14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  statIcon: {
    color: 'var(--primary)',
    fontSize: 20,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    lineHeight: 1.2,
  },
  // ── Section ──
  sectionWrap: {
    width: '100%',
    maxWidth: 1100,
    padding: '32px 32px 0',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: 'center',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: 'var(--text-primary)',
    marginBottom: 24,
  },
  // ── Module Cards ──
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  moduleCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: 'var(--shadow-card)',
  },
  moduleIcon: {
    fontSize: 20,
    color: 'var(--primary)',
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  moduleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--text-secondary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.6,
  },
  moduleItemIcon: {
    color: 'var(--primary)',
    fontSize: 18,
    flexShrink: 0,
  },
  // ── Steps Section ──
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
    padding: '0 0 16px',
  },
  stepCard: {
    textAlign: 'center',
    padding: '24px 20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    transition: 'var(--transition)',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  stepIcon: {
    color: 'var(--primary)',
    fontSize: 32,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  stepDesc: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    lineHeight: 1.5,
  },
  // ── Scam Checker CTA ──
  scamCTA: {
    width: '100%',
    maxWidth: 1100,
    margin: '12px 0 0',
    padding: '28px 32px',
    background: 'var(--primary-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-card)',
  },
  scamCTATitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    marginBottom: 6,
  },
  scamCTADesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    marginBottom: 16,
  },
  scamCTARow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scamCTAInput: {
    flex: 1,
    minWidth: 240,
    padding: '10px 16px',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    fontSize: 14,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    outline: 'none',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
  },
  scamCTABtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 22px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    fontSize: 14,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    boxShadow: 'var(--shadow-btn)',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  },
  // ── Screenshot Analyzer Card ──
  screenshotCard: {
    width: '100%',
    maxWidth: 1100,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow-card)',
    margin: '0 32px',
  },
  screenshotIconWrap: {
    width: 48,
    height: 48,
    background: 'rgba(74,103,65,0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  // ── Footer ──
  footer: {
    textAlign: 'center',
    padding: '32px 16px 24px',
    fontSize: 13,
    color: 'var(--text-muted)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  footerBrand: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  footerLinks: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 6,
    background: 'transparent',
    border: 'none',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    transition: 'color 0.15s ease',
  },
};

// Module-specific items for the card details
const MODULE_ITEMS = {
  upi: {
    icon: 'account_balance',
    items_hi: ['Setup UPI', 'Send money safely', 'Avoid fraud'],
    items_en: ['Setup UPI', 'Send money safely', 'Avoid fraud'],
  },
  scam: {
    icon: 'report',
    items_hi: ['Identify scam SMS', 'Spot fake calls', 'Report fraud'],
    items_en: ['Identify scam SMS', 'Spot fake calls', 'Report fraud'],
  },
  digilocker: {
    icon: 'badge',
    items_hi: ['Store Aadhaar/PAN', 'Download documents', 'What is safe'],
    items_en: ['Store Aadhaar/PAN', 'Download documents', 'What is safe'],
  },
};

export default function WelcomeScreen({ onStartModule, onScamChecker, onScreenshotAnalyzer, language = 'hi', onLanguageSwitch }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;
  const sw = getSW(language);
  const modules = getModules(language);

  const scrollToModules = () => {
    document.getElementById('modules-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.screen}>
      {/* ── Top Nav Bar ── */}
    <nav style={styles.navbar} id="main-navbar">
        <Logo isMobile={isMobile} />

        {/* Language Switcher: pill row on desktop, compact dropdown on mobile */}
        {isMobile ? (
          <LanguageSwitcher language={language} onSwitch={onLanguageSwitch} compact={true} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <LanguageSwitcher language={language} onSwitch={onLanguageSwitch} showLabel={false} />
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <div style={{
        ...styles.heroSection,
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '28px 16px 20px' : '48px 32px 32px',
        textAlign: isMobile ? 'center' : 'left',
      }} className="animate-up">
        <div style={{ ...styles.heroLeft, width: isMobile ? '100%' : undefined }}>
          <h1
            className="hero-headline-animated"
            style={{
              ...styles.heroHeadline,
              fontSize: isMobile ? 26 : 38,
              marginBottom: isMobile ? 10 : 12,
            }}
          >
            {sw.heroHeadline.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
            ))}
          </h1>
          <p style={{
            ...styles.heroSubtext,
            fontSize: isMobile ? 13 : 15,
            maxWidth: isMobile ? '100%' : 440,
            marginBottom: isMobile ? 18 : 24,
          }}>{sw.heroSubtext}</p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <button
              className="cta-btn-pulse"
              style={styles.heroCTA}
              onClick={scrollToModules}
              id="hero-cta-btn"
            >
              {sw.heroCTA} <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
            <button
              style={styles.heroSecondaryLink}
              onClick={scrollToModules}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {sw.heroAlt}
            </button>
          </div>
        </div>
        <div className="hero-image-wrap" style={styles.heroRight}>
          <img
            src={process.env.PUBLIC_URL + '/tutor.png'}
            alt="SmartSathi Tutor"
            className="hero-image-float"
            style={{
              ...styles.heroImage,
              width: isMobile ? 180 : 260,
              height: isMobile ? 180 : 260,
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={styles.statsRow}>
        {[
          { icon: 'location_city', value: '200M+', label: 'New Internet\nUsers' },
          { icon: 'school', value: '3', label: 'Learning\nModules' },
          { icon: 'translate', value: '5', label: 'Regional\nLanguages' },
          { icon: 'shield', value: 'Real-time', label: 'Scam Detection' },
        ].map((stat, i) => (
          <div key={i} className="stat-animated" style={styles.statChip}>
            <span className="material-symbols-outlined" style={styles.statIcon}>{stat.icon}</span>
            <div>
              <div style={styles.statValue}><CountUpStat valueStr={stat.value} /></div>
              <div style={styles.statLabel}>{stat.label.split('\n').map((l, j) => <span key={j}>{l}<br/></span>)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Module Cards Section ── */}
      <div style={{ ...styles.sectionWrap, padding: isMobile ? '24px 16px 0' : '32px 32px 0' }} id="modules-section">
        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? 20 : 24 }}>{sw.modulesTitle}</h2>
        <div style={styles.moduleGrid} className="module-grid-responsive">
          {Object.values(modules).map((mod, index) => {
            const meta = MODULE_ITEMS[mod.id] || {};
            // Determine chat bubble shape: alternate left/right tails
            const bubbleRadius = index % 2 === 0 ? '24px 24px 24px 6px' : '24px 24px 6px 24px';
            return (
              <button
                key={mod.id}
                className="module-card-animated"
                style={{
                  ...styles.moduleCard,
                  background: `${mod.color}15`,
                  borderColor: `${mod.color}40`,
                  borderRadius: bubbleRadius,
                  borderWidth: '1.5px',
                  boxShadow: `0 4px 12px ${mod.color}10`,
                }}
                onMouseEnter={() => setHoveredCard(mod.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onStartModule(mod.id)}
                id={`module-btn-${mod.id}`}
              >
                <div style={styles.moduleTitle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: mod.color }}>{meta.icon || 'school'}</span>
                  {mod.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(meta.items_en || []).map((item, j) => (
                    <div key={j} style={styles.moduleItem}>
                      <span className="material-symbols-outlined module-check-icon" style={styles.moduleItemIcon}>check_circle</span>
                      {item}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── How It Works Steps ── */}
      <div style={{ ...styles.sectionWrap, paddingTop: 40 }}>
        <div style={styles.stepsRow}>
          {[
            { num: 1, icon: 'translate', ...sw.steps[0] },
            { num: 2, icon: 'category',  ...sw.steps[1] },
            { num: 3, icon: 'forum',     ...sw.steps[2] },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                ...styles.stepCard,
                transform: hoveredCard === `step-${step.num}` ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredCard === `step-${step.num}` ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
              }}
              onMouseEnter={() => setHoveredCard(`step-${step.num}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.stepNumber}>{step.num}</div>
              <span className="material-symbols-outlined" style={styles.stepIcon}>{step.icon}</span>
              <div style={styles.stepTitle}>{step.title}</div>
              <div style={styles.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Suspicious Message CTA ── */}
      <div style={{ width: '100%', maxWidth: 1100, padding: isMobile ? '0 16px' : '0 32px' }}>
        <div style={styles.scamCTA}>
          <div style={styles.scamCTATitle}>
            {sw.scamTitle}
            <span className="scam-live-dot" />
          </div>
          <div style={styles.scamCTADesc}>{sw.scamDesc}</div>
          <div style={styles.scamCTARow}>
            <input
              type="text"
              placeholder={sw.scamInput}
              className="scam-input-glow"
              style={styles.scamCTAInput}
              readOnly
              onClick={onScamChecker}
              id="hero-scam-input"
            />
            <button
              className="scam-btn-animated"
              style={styles.scamCTABtn}
              onClick={onScamChecker}
              id="hero-scam-btn"
            >
              {sw.scamBtn} <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Screenshot Analyzer ── */}
      <div style={{ width: '100%', maxWidth: 1100, padding: '20px 32px 0' }}>
        <button
          style={{
            ...styles.screenshotCard,
            margin: 0,
            width: '100%',
            borderColor: hoveredCard === 'screenshot' ? 'var(--primary-light)' : 'var(--border-card)',
            transform: hoveredCard === 'screenshot' ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredCard === 'screenshot' ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          }}
          onMouseEnter={() => setHoveredCard('screenshot')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={onScreenshotAnalyzer}
          id="screenshot-analyzer-btn"
        >
          <div style={styles.screenshotIconWrap}>📸</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              {sw.screenshotTitle}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Noto Sans Devanagari', sans-serif", marginTop: 3, lineHeight: 1.5 }}>
              {sw.screenshotDesc}
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)' }}>arrow_forward</span>
        </button>
      </div>

      {/* ── Live Scam News ── */}
      <div style={{ width: '100%', maxWidth: 1100, padding: '20px 32px' }}>
        <ScamNews language={language} />
      </div>

      {/* ── Footer ── */}
      <div style={styles.footer}>
        <div style={styles.footerBrand}>
          <Logo isMobile={true} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {sw.footerTagline}
        </div>
        <div style={styles.footerLinks}>
          {['हिंदी', 'मराठी', 'தமிழ்', 'বাংলা', 'English'].map((lang, i) => (
            <span key={i} style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lang}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, marginTop: 4 }}>
          🇮🇳 Made in India
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          © 2024 SmartSathi. Made in India 🇮🇳
        </div>
      </div>
    </div>
  );
}
