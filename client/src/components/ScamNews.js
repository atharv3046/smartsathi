import React, { useState, useEffect, useCallback } from 'react';
import { UI_STRINGS } from './LanguageSwitcher';

const styles = {
  card: {
    width: '100%',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-card)',
    background: 'rgba(220,53,69,0.03)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  liveBlip: {
    /* Styles are handled by live-dot-red class in index.css */
  },
  title: {
    fontSize: 12, fontWeight: 700, color: 'var(--danger)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  refreshBtn: {
    background: 'transparent', border: '1px solid var(--danger-border)',
    borderRadius: 8, color: 'var(--danger)', fontSize: 11, fontWeight: 600,
    cursor: 'pointer', padding: '3px 10px', transition: 'all 0.18s ease',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex', alignItems: 'center', gap: 4,
  },
  body: { padding: '14px 16px' },
  loadingRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    color: 'var(--text-muted)', fontSize: 12,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  newsText: {
    fontSize: 13, lineHeight: 1.8, color: 'var(--text-secondary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif", whiteSpace: 'pre-line',
  },
  sources: {
    marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-card)',
    display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
  },
  sourcesLabel: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' },
  sourceLink: {
    fontSize: 10, color: 'var(--primary)', textDecoration: 'none',
    borderRadius: 4, padding: '1px 5px',
    background: 'rgba(74,103,65,0.06)', border: '1px solid rgba(74,103,65,0.12)',
  },
  timestamp: { fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' },
  errorText: { fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', fontFamily: "'Noto Sans Devanagari', sans-serif" },
};

function NewsContent({ text }) {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim());
  return (
    <div style={styles.newsText}>
      {lines.map((line, i) => {
        const isBullet = line.trim().startsWith('📌') || line.trim().startsWith('•');
        return (
          <div key={i} className="animate-fade" style={{
            marginBottom: isBullet ? 12 : 4,
            color: isBullet ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: isBullet ? 500 : 400, paddingLeft: isBullet ? 0 : 4,
            opacity: 0,
            animationDelay: `${i * 200}ms`,
          }}>{line.trim()}</div>
        );
      })}
    </div>
  );
}

export default function ScamNews({ language = 'hi' }) {
  const [news, setNews] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const ui = UI_STRINGS[language] || UI_STRINGS.hi;

  const fetchNews = useCallback(async () => {
    setLoading(true); setError(null); setIsSpinning(true);
    try {
      const res = await fetch(`/api/scam-news?lang=${language}`);
      const data = await res.json();
      if (data.news) { setNews(data.news); setSources(data.sources || []); setGeneratedAt(data.generatedAt); }
      else { setError('News load करने में समस्या हुई।'); }
    } catch { setError('News fetch नहीं हो पाई। Internet connection जाँचें।'); }
    finally { setLoading(false); setTimeout(() => setIsSpinning(false), 600); }
  }, [language]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const timeAgo = generatedAt ? new Date(generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div className="live-dot-red" />
          <span style={styles.title}>{ui.liveNews}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {timeAgo && <span style={styles.timestamp}>{timeAgo}</span>}
          <button style={{ ...styles.refreshBtn, opacity: loading ? 0.5 : 1 }} onClick={fetchNews} disabled={loading} id="refresh-news-btn" title="Refresh news">
            <span className={isSpinning ? "spin-once" : ""} style={{ display: 'inline-block' }}>🔄</span> Refresh
          </button>
        </div>
      </div>
      <div style={styles.body}>
        {loading && <div style={styles.loadingRow}><div className="typing-dots" style={{ transform: 'scale(0.8)' }}><span /><span /><span /></div><span>{ui.liveNewsLoading}</span></div>}
        {error && !loading && <p style={styles.errorText}>⚠️ {error}</p>}
        {news && !loading && (
          <>
            <NewsContent text={news} />
            {sources.length > 0 && (
              <div style={styles.sources}>
                <span style={styles.sourcesLabel}>Sources:</span>
                {sources.map((src, i) => {
                  try {
                    const domain = new URL(src).hostname.replace('www.', '');
                    return <a key={i} href={src} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>{domain}</a>;
                  } catch { return null; }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
