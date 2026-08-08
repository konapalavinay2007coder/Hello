import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { translations } from './data/translations';

import Home from './pages/Home';
import AdvisoryWorkspace from './pages/AdvisoryWorkspace';
import StudentHub from './pages/StudentHub';
import EntrepreneurHub from './pages/EntrepreneurHub';
import DomainDashboard from './pages/DomainDashboard';
import More from './pages/More';

function NavigationBar() {
  const { language } = useLanguage();
  const t = translations[language]?.nav || translations.en.nav;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      background: 'rgba(207, 231, 251, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(2, 132, 199, 0.15)',
      padding: '0.65rem 1rem',
      boxShadow: '0 4px 20px rgba(2, 132, 199, 0.08)'
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Left: Logo (redirects to Home) */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}>
            H
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#062C4D', letterSpacing: '-0.5px' }}>
            hello
          </span>
        </Link>

        {/* Center: Hello AI Button */}
        <Link to="/advisory" style={{
          background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '0.65rem 1.8rem',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: '0.98rem',
          boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease'
        }}>
          <span>{t.tryVoice}</span>
          <span>↗</span>
        </Link>

        {/* Right: Settings Button */}
        <Link to="/more" style={{
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1.5px solid rgba(2, 132, 199, 0.3)',
          borderRadius: '9999px',
          padding: '0.45rem 1.1rem',
          textDecoration: 'none',
          color: '#062C4D',
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '0.9rem' }}>⚙️</span>
          <span>Settings</span>
        </Link>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', width: '100%', background: '#cfe7fb', color: '#062C4D', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
          <NavigationBar />
          
          <main style={{ width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/advisory" element={<AdvisoryWorkspace />} />
              <Route path="/student" element={<StudentHub />} />
              <Route path="/entrepreneur" element={<EntrepreneurHub />} />
              <Route path="/dashboard" element={<DomainDashboard />} />
              <Route path="/more" element={<More />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
