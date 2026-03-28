import React from 'react';
import { getModules } from '../data/modulesData';

const styles = {
  bar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'rgba(15, 23, 42, 0.95)',
    borderBottom: '1px solid var(--navy-border)',
    backdropFilter: 'blur(12px)',
    overflowX: 'auto',
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1.5px solid transparent',
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    flexShrink: 0,
  },
};

export default function ModuleSelector({ activeModule, onSwitch, language = 'hi' }) {
  const modules = getModules(language);
  return (
    <div style={styles.bar}>
      <span style={styles.label}>विषय:</span>
      {Object.values(modules).map((mod) => {
        const isActive = mod.id === activeModule;
        return (
          <button
            key={mod.id}
            id={`module-switch-${mod.id}`}
            style={{
              ...styles.chip,
              background: isActive ? mod.color + '20' : 'transparent',
              borderColor: isActive ? mod.color + '60' : 'var(--navy-border)',
              color: isActive ? mod.color : 'var(--text-secondary)',
            }}
            onClick={() => !isActive && onSwitch(mod.id)}
          >
            {mod.icon} {mod.title}
          </button>
        );
      })}
    </div>
  );
}
