import React, { useState } from 'react';

function formatContent(text, onSuggestionClick, isGreeting) {
  return text.split('\n').map((line, i) => {
    // If it's the greeting and a bullet point, render as a clickable suggestion
    if (isGreeting && line.trim().startsWith('•') && onSuggestionClick) {
      return (
        <React.Fragment key={i}>
          <div
            style={{
              marginTop: 6,
              marginBottom: 2,
              padding: '6px 14px',
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 16,
              cursor: 'pointer',
              display: 'inline-block',
              color: 'var(--saffron)',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
            onClick={() => onSuggestionClick(line.replace('•', '').trim())}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(249,115,22,0.22)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(249,115,22,0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {line.trim()}
          </div>
          {i < text.split('\n').length - 1 && <br />}
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
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
}

const styles = {
  wrapper: {
    display: 'flex',
    gap: 10,
    maxWidth: 580,
    animation: 'slideIn 0.3s ease forwards',
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F97316, #C2410C)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  avatarBot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1E293B, #334155)',
    border: '1.5px solid rgba(249,115,22,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  bubbleUser: {
    background: 'linear-gradient(135deg, #F97316, #EA580C)',
    color: '#fff',
    borderRadius: '18px 18px 4px 18px',
    padding: '10px 16px',
    maxWidth: '100%',
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    wordBreak: 'break-word',
    boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
  },
  bubbleBot: {
    background: 'var(--navy-card)',
    border: '1px solid var(--navy-border)',
    color: 'var(--text-primary)',
    borderRadius: '18px 18px 18px 4px',
    padding: '10px 16px',
    maxWidth: '100%',
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    wordBreak: 'break-word',
  },
  timeStamp: {
    fontSize: 10,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
};

export default function ChatBubble({ role, content, time, onSpeak, onSuggestionClick, isGreeting }) {
  const isUser = role === 'user';
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        animation: 'slideIn 0.3s ease forwards',
      }}
    >
      <div style={{ ...styles.wrapper, flexDirection: isUser ? 'row-reverse' : 'row' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            {time && <span style={styles.timeStamp}>{time}</span>}
            {/* Replay speaker button — only on bot messages */}
            {!isUser && onSpeak && (hovered) && (
              <button
                onClick={onSpeak}
                title="दोबारा सुनें"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  padding: '0 4px',
                  lineHeight: 1,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => e.target.style.color = '#60A5FA'}
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

