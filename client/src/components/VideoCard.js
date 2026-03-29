import React, { useState } from 'react';

// ─── VideoCard ──────────────────────────────────────────────────────────────
// No API key needed. Uses YouTube's built-in search embed.
// `query` = the search string from the [VIDEO: ...] AI tag.
export default function VideoCard({ query }) {
  const [playing, setPlaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!query || dismissed) return null;

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const embedSrc  = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}&autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      className="video-card animate-fade"
      style={{
        marginTop: 10,
        borderRadius: 14,
        overflow: 'hidden',
        border: '1.5px solid var(--border-card)',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-card)',
        maxWidth: 320,
        position: 'relative',
        transition: 'box-shadow 0.2s ease',
      }}
      id="youtube-video-card"
    >
      {/* Dismiss (✕) */}
      <button
        onClick={() => setDismissed(true)}
        title="Dismiss"
        id="video-dismiss-btn"
        style={{
          position: 'absolute', top: 6, right: 6, zIndex: 20,
          background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
          color: '#fff', width: 22, height: 22, fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >✕</button>

      {/* YouTube badge */}
      <div style={{
        position: 'absolute', top: 8, left: 8, zIndex: 10,
        background: '#FF0000', borderRadius: 4, padding: '2px 7px',
        display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none',
      }}>
        {/* YouTube play icon (inline SVG, no external deps) */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect width="24" height="24" rx="4" fill="#FF0000"/>
          <polygon points="9.5,7 19,12 9.5,17" fill="#fff"/>
        </svg>
        <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '0.03em' }}>
          YouTube
        </span>
      </div>

      {/* Thumbnail / Embed */}
      {!playing ? (
        /* ── Thumbnail placeholder (gradient + play button) ── */
        <div
          onClick={() => setPlaying(true)}
          id="video-thumbnail-btn"
          style={{
            position: 'relative',
            cursor: 'pointer',
            height: 175,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {/* Big play button */}
          <div style={{
            width: 58, height: 58, borderRadius: '50%',
            background: '#FF0000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255,0,0,0.45)',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          }}>
            <span style={{ color: '#fff', fontSize: 22, marginLeft: 4, lineHeight: 1 }}>▶</span>
          </div>

          {/* Query preview text */}
          <div style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 11,
            fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
            textAlign: 'center',
            padding: '0 16px',
            lineHeight: 1.5,
            maxWidth: '100%',
          }}>
            🔍 "{query}"
          </div>
        </div>
      ) : (
        /* ── Embedded iframe player ── */
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            src={embedSrc}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={query}
            id="youtube-embed-iframe"
          />
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '9px 12px 11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
          lineHeight: 1.4,
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {playing ? '▶ Playing...' : `🎬 ${query}`}
        </div>

        {/* Open on YouTube link */}
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="youtube-open-link"
          title="Open on YouTube"
          style={{
            flexShrink: 0,
            fontSize: 10,
            color: '#FF0000',
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            textDecoration: 'none',
            border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: 6,
            padding: '2px 7px',
            whiteSpace: 'nowrap',
          }}
          onClick={e => e.stopPropagation()}
        >
          Open ↗
        </a>
      </div>
    </div>
  );
}
