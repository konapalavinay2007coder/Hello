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
  const location = useLocation();
  const path = location.pathname;
  const { language, setLanguage } = useLanguage();
  const t = translations[language]?.nav || translations.en.nav;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      background: 'transparent',
      padding: '1rem 3rem',
      borderBottom: 'none',
      boxShadow: 'none'
    }}>
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Left Slot: Logo */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}>
              H
            </div>
            <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#062C4D', letterSpacing: '-0.5px' }}>
              hello
            </span>
          </Link>
        </div>

        {/* Center Slot: Prominent Centered "Try Voice AI" Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link to="/advisory" style={{
            background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.7rem 1.8rem',
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
        </div>

        {/* Right Slot: Settings Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/more" style={{
            background: '#ffffff',
            border: '1.5px solid #0284c7',
            borderRadius: '9999px',
            padding: '0.45rem 1.25rem',
            textDecoration: 'none',
            color: '#062C4D',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
            transition: 'all 0.2s ease'
          }}>
            <span style={{ fontSize: '0.95rem' }}>⚙️</span>
            <span>Settings</span>
          </Link>
        </div>

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
