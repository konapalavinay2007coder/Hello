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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/student', label: 'Student' },
    { to: '/entrepreneur', label: 'Business' },
    { to: '/dashboard', label: 'Mandi' },
  ];

  const isActive = (to) => {
    if (to === '/') return path === '/';
    return path.startsWith(to);
  };

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
      padding: '0.65rem 2rem',
      boxShadow: '0 4px 20px rgba(2, 132, 199, 0.08)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>

        {/* Left: Logo */}
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

        {/* Center: Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '12px',
          padding: '0.3rem',
          border: '1px solid rgba(2, 132, 199, 0.12)'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: isActive(link.to) ? 800 : 600,
                color: isActive(link.to) ? '#ffffff' : '#062C4D',
                background: isActive(link.to)
                  ? 'linear-gradient(135deg, #0284c7, #1d4ed8)'
                  : 'transparent',
                boxShadow: isActive(link.to)
                  ? '0 4px 12px rgba(2, 132, 199, 0.3)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Hello AI + Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <Link to="/advisory" style={{
            background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.55rem 1.4rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}>
            <span>{t.tryVoice}</span>
            <span>↗</span>
          </Link>

          <Link to="/more" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1.5px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '9999px',
            padding: '0.45rem 1rem',
            textDecoration: 'none',
            color: '#062C4D',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '0.9rem' }}>⚙️</span>
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
