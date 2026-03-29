import React, { useState } from 'react';
import VideoCard from './VideoCard';

// ─── Suggestion chip — standalone animated component ──────────────────────
function SuggestionChip({ text, onClick, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`chip-animated chip-shimmer`}
      style={{
        animationDelay: `${index * 120}ms`,
        marginTop: 6,
        marginBottom: 2,
        padding: '7px 14px',
        background: hovered ? 'var(--primary)' : 'var(--bg-card)',
        border: `1.5px solid ${hovered ? 'var(--primary)' : 'var(--border-light)'}`,
        borderRadius: 999,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        color: hovered ? '#fff' : 'var(--primary)',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
        transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered ? '0 4px 14px rgba(74,103,65,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
        willChange: 'transform',
      }}
      onClick={() => onClick(text)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Green pulse dot on left */}
      <span className="chip-dot" style={{ flexShrink: 0 }} />

      {/* Chip label */}
      <span>• {text}</span>

      {/* Arrow — appears on hover */}
      <span
        className="chip-arrow"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          marginLeft: hovered ? 6 : 0,
          fontSize: 11,
          color: '#fff',
        }}
      >
        →
      </span>
    </div>
  );
}

// ─── Content formatter ────────────────────────────────────────────────────
function formatContent(text, onSuggestionClick, isGreeting) {
  const lines = text.split('\n');
  let chipIndex = 0;

  return lines.map((line, i) => {
    if (isGreeting && line.trim().startsWith('•') && onSuggestionClick) {
      const chipText = line.replace('•', '').trim();
      const idx = chipIndex++;
      return (
        <React.Fragment key={i}>
          <SuggestionChip text={chipText} onClick={onSuggestionClick} index={idx} />
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      );
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={i}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

const styles = {
  avatarUser: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--secondary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, flexShrink: 0, alignSelf: 'flex-end', color: '#fff',
  },
  avatarBot: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--bg-card)', border: '1.5px solid var(--primary-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, flexShrink: 0, alignSelf: 'flex-end',
  },
  bubbleUser: {
    background: 'var(--primary)', color: '#fff',
    borderRadius: '18px 18px 4px 18px', padding: '10px 16px', maxWidth: '100%',
    fontSize: 14, lineHeight: 1.6,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    wordBreak: 'break-word', boxShadow: '0 2px 8px rgba(74,103,65,0.2)',
  },
  bubbleBot: {
    background: 'var(--bg-card)', border: '1px solid var(--border-card)',
    color: 'var(--text-primary)', borderRadius: '18px 18px 18px 4px',
    padding: '10px 16px', maxWidth: '100%', fontSize: 14, lineHeight: 1.7,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    wordBreak: 'break-word', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  timeStamp: { fontSize: 10, color: 'var(--text-muted)', marginTop: 4 },
};

export default function ChatBubble({ role, content, time, onSpeak, onSuggestionClick, isGreeting, video }) {
  const isUser = role === 'user';
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={isUser ? 'bubble-slide-right' : 'bubble-slide-left'}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div style={{ display: 'flex', gap: 10, maxWidth: 580, flexDirection: isUser ? 'row-reverse' : 'row' }}>
        <div style={isUser ? styles.avatarUser : styles.avatarBot}>
          {isUser ? '👤' : '🤖'}
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div style={isUser ? styles.bubbleUser : styles.bubbleBot}>
            {isUser ? content : formatContent(content, onSuggestionClick, isGreeting)}
          </div>

          {/* Video card — only on assistant messages */}
          {!isUser && video && <VideoCard query={typeof video === 'string' ? video : video?.query || video?.id} />}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            {time && <span style={styles.timeStamp}>{time}</span>}
            {!isUser && onSpeak && hovered && (
              <button
                onClick={onSpeak}
                title="दोबारा सुनें"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-muted)', padding: '0 4px',
                  lineHeight: 1, transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                🔊
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
