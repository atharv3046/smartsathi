import React from 'react';

export default function Logo({ isMobile, dark = false, showSubtitle = false }) {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? 10 : 14,
    flexShrink: 0,
    textDecoration: 'none',
  };

  const iconSize = isMobile ? 36 : 46;
  const fontSizeIcon = isMobile ? 22 : 28;
  const textColor = dark ? '#ffffff' : '#3c6e47'; // var(--primary) is close to #3c6e47

  return (
    <div style={containerStyle}>
      {/* Icon */}
      <div style={{
        position: 'relative',
        width: iconSize,
        height: iconSize,
        background: '#3c6e47', // Dark Green
        borderRadius: isMobile ? 10 : 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          color: '#ffffff',
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          fontSize: fontSizeIcon,
          fontWeight: 700,
          lineHeight: 1,
        }}>स</span>
        {/* Orange dot */}
        <div style={{
          position: 'absolute',
          top: isMobile ? -3 : -4,
          right: isMobile ? -3 : -4,
          width: isMobile ? 10 : 12,
          height: isMobile ? 10 : 12,
          background: '#e67e22', // Orange color
          borderRadius: '50%',
          border: `2px solid ${dark ? '#1a202c' : '#ffffff'}`
        }}></div>
      </div>

      {/* Text */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: isMobile ? 0 : 2,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: isMobile ? 20 : 26,
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          lineHeight: 1,
        }}>
          <span style={{ fontWeight: 400, color: textColor }}>smart</span>
          <span style={{ color: '#e67e22', fontWeight: 600, margin: '0 2px' }}>_</span>
          <span style={{ fontWeight: 700, color: textColor, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>साथी</span>
        </div>
        
        {showSubtitle && !isMobile && (
          <div style={{
            fontSize: 11,
            color: '#76947a',
            marginTop: 4,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            Your digital companion • Made for Bharat
          </div>
        )}
      </div>
    </div>
  );
}
