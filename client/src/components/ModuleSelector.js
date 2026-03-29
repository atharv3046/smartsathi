import React from 'react';
import { getModules } from '../data/modulesData';

const styles = {
  bar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-card)',
    overflowX: 'auto',
  },
  chip: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    whiteSpace: 'nowrap',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    flexShrink: 0,
    background: 'transparent',
  },
};

export default function ModuleSelector({ activeModule, onSwitch, language = 'hi' }) {
  const modules = getModules(language);
  return (
    <div style={styles.bar}>
      {Object.values(modules).map((mod) => {
        const isActive = mod.id === activeModule;
        return (
          <button
            key={mod.id}
            id={`module-switch-${mod.id}`}
            className={`module-tab ${isActive ? 'active' : ''}`}
            style={{
              ...styles.chip,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
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
