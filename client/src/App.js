import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import ScamChecker from './components/ScamChecker';
import ScreenshotAnalyzer from './components/ScreenshotAnalyzer';
import './index.css';

import { getModules } from './data/modulesData';

// ─── App Component ────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('welcome'); // 'welcome' | 'chat' | 'scam-checker' | 'screenshot'
  const [activeModule, setActiveModule] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [confusionLevel, setConfusionLevel] = useState(0);
  const [language, setLanguage] = useState('hi'); // 'hi' | 'mr' | 'ta' | 'bn' | 'en'

  const startModule = useCallback((moduleId) => {
    const modules = getModules(language);
    const mod = modules[moduleId];
    if (!mod) return;
    setActiveModule(moduleId);
    setConfusionLevel(0);
    setMessageHistory([{ role: 'assistant', content: mod.greeting }]);
    setView('chat');
  }, [language]);

  const goToScamChecker = useCallback(() => {
    setView('scam-checker');
  }, []);

  const goToScreenshotAnalyzer = useCallback(() => {
    setView('screenshot');
  }, []);

  const goHome = useCallback(() => {
    setView('welcome');
    setActiveModule(null);
    setMessageHistory([]);
    setConfusionLevel(0);
  }, []);

  const handleModuleSwitch = useCallback((moduleId) => {
    startModule(moduleId);
  }, [startModule]);

  const handleConfusion = useCallback(() => {
    setConfusionLevel((prev) => Math.min(prev + 1, 2));
  }, []);

  const handleLanguageSwitch = useCallback((langCode) => {
    setLanguage((prevLang) => {
      if (prevLang === langCode) return prevLang;
      
      setMessageHistory((prevHistory) => {
        if (prevHistory.length > 0 && activeModule) {
          const oldGreeting = getModules(prevLang)[activeModule]?.greeting;
          const newGreeting = getModules(langCode)[activeModule]?.greeting;
          
          if (prevHistory[0].content === oldGreeting) {
            const newHistory = [...prevHistory];
            newHistory[0] = { ...newHistory[0], content: newGreeting };
            return newHistory;
          }
        }
        return prevHistory;
      });
      
      return langCode;
    });
  }, [activeModule]);

  return (
    <div className="app">
      {view === 'welcome' && (
        <div key="welcome" className="page-fade" style={{ display: 'contents' }}>
          <WelcomeScreen
            onStartModule={startModule}
            onScamChecker={goToScamChecker}
            onScreenshotAnalyzer={goToScreenshotAnalyzer}
            language={language}
            onLanguageSwitch={handleLanguageSwitch}
          />
        </div>
      )}
      {view === 'chat' && (
        <div key="chat" className="page-fade" style={{ display: 'contents' }}>
          <ChatWindow
            module={activeModule}
            messageHistory={messageHistory}
            setMessageHistory={setMessageHistory}
            confusionLevel={confusionLevel}
            onConfusion={handleConfusion}
            onModuleSwitch={handleModuleSwitch}
            onBack={goHome}
            onScreenshotAnalyzer={goToScreenshotAnalyzer}
            language={language}
            onLanguageSwitch={handleLanguageSwitch}
          />
        </div>
      )}
      {view === 'scam-checker' && (
        <div key="scam" className="page-fade" style={{ display: 'contents' }}>
          <ScamChecker
            onBack={goHome}
            language={language}
            onLanguageSwitch={handleLanguageSwitch}
          />
        </div>
      )}
      {view === 'screenshot' && (
        <div key="screenshot" className="page-fade" style={{ display: 'contents' }}>
          <ScreenshotAnalyzer
            onBack={goHome}
            language={language}
            onLanguageSwitch={handleLanguageSwitch}
            messageHistory={messageHistory}
          />
        </div>
      )}
    </div>
  );
}
