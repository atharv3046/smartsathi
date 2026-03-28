import React, { useState, useEffect, useCallback } from 'react';
import { UI_STRINGS } from './LanguageSwitcher';

const styles = {
  card: {
    width: '100%',
    background: 'rgba(239,68,68,0.06)',
    border: '1px solid rgba(239,68,68,0.18)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(239,68,68,0.12)',
    background: 'rgba(239,68,68,0.04)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  liveBlip: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#EF4444',
    boxShadow: '0 0 0 2px rgba(239,68,68,0.3)',
    animation: 'pulse-live 2s infinite',
    flexShrink: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FCA5A5',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    letterSpacing: '0.03em',
  },
  refreshBtn: {
    background: 'transparent',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 8,
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '3px 10px',
    transition: 'all 0.18s ease',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  body: {
    padding: '14px 16px',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: 'var(--text-muted)',
    fontSize: 12,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
  newsText: {
    fontSize: 13,
    lineHeight: 1.8,
    color: 'var(--text-secondary)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    whiteSpace: 'pre-line',
  },
  bulletPoint: {
    display: 'block',
    color: '#FCA5A5',
    fontWeight: 600,
  },
  sources: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid rgba(239,68,68,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  sourcesLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  sourceLink: {
    fontSize: 10,
    color: 'rgba(249,115,22,0.7)',
    textDecoration: 'none',
    borderRadius: 4,
    padding: '1px 5px',
    background: 'rgba(249,115,22,0.08)',
    border: '1px solid rgba(249,115,22,0.15)',
  },
  timestamp: {
    fontSize: 10,
    color: 'var(--text-muted)',
    marginLeft: 'auto',
  },
  errorText: {
    fontSize: 12,
    color: 'var(--text-muted)',
    textAlign: 'center',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
  },
};

// Smartly render bullet points with highlighted 📌
function NewsContent({ text }) {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim());
  return (
    <div style={styles.newsText}>
      {lines.map((line, i) => {
        const isBullet = line.trim().startsWith('📌') || line.trim().startsWith('•');
        return (
          <div
            key={i}
            style={{
              marginBottom: isBullet ? 12 : 4,
              color: isBullet ? '#F8FAFC' : 'var(--text-secondary)',
              fontWeight: isBullet ? 500 : 400,
              paddingLeft: isBullet ? 0 : 4,
            }}
          >
            {line.trim()}
          </div>
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
    setLoading(true);
    setError(null);
    setIsSpinning(true);
    try {
      const res = await fetch(`/api/scam-news?lang=${language}`);
      const data = await res.json();
      if (data.news) {
        setNews(data.news);
        setSources(data.sources || []);
        setGeneratedAt(data.generatedAt);
      } else {
        setError('News load करने में समस्या हुई।');
      }
    } catch {
      setError('News fetch नहीं हो पाई। Internet connection जाँचें।');
    } finally {
      setLoading(false);
      setTimeout(() => setIsSpinning(false), 600);
    }
  }, [language]);

  // Fetch on mount and when language changes
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const timeAgo = generatedAt
    ? new Date(generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.liveBlip} />
          <span style={styles.title}>{ui.liveNews}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {timeAgo && (
            <span style={styles.timestamp}>{timeAgo}</span>
          )}
          <button
            style={{
              ...styles.refreshBtn,
              opacity: loading ? 0.5 : 1,
            }}
            onClick={fetchNews}
            disabled={loading}
            id="refresh-news-btn"
            title="Refresh news"
          >
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.6s ease',
                transform: isSpinning ? 'rotate(360deg)' : 'rotate(0deg)',
              }}
            >
              🔄
            </span>
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {loading && (
          <div style={styles.loadingRow}>
            <div className="typing-dots" style={{ transform: 'scale(0.8)' }}>
              <span /><span /><span />
            </div>
            <span>{ui.liveNewsLoading}</span>
          </div>
        )}
        {error && !loading && (
          <p style={styles.errorText}>⚠️ {error}</p>
        )}
        {news && !loading && (
          <>
            <NewsContent text={news} />
            {sources.length > 0 && (
              <div style={styles.sources}>
                <span style={styles.sourcesLabel}>Sources:</span>
                {sources.map((src, i) => {
                  try {
                    const domain = new URL(src).hostname.replace('www.', '');
                    return (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.sourceLink}
                      >
                        {domain}
                      </a>
                    );
                  } catch {
                    return null;
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
