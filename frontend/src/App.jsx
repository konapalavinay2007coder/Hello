import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import AdvisoryWorkspace from './pages/AdvisoryWorkspace';
import StudentHub from './pages/StudentHub';
import EntrepreneurHub from './pages/EntrepreneurHub';
import DomainDashboard from './pages/DomainDashboard';
import CommunityBoard from './pages/CommunityBoard';
import More from './pages/More';

function NavigationBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
      padding: '0.85rem 2.5rem',
      boxShadow: '0 4px 20px rgba(2, 132, 199, 0.08)'
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Left Logo */}
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
            fontSize: '1.2rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}>
            📶
          </div>
          <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            hello
          </span>
        </Link>

        {/* Center Pill Menu */}
        <nav style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '9999px',
          padding: '0.35rem 0.5rem',
          display: 'flex',
          gap: '0.35rem',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <Link to="/" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/' ? '#0284c7' : 'transparent',
            color: path === '/' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            Home
          </Link>

          <Link to="/student" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/student' ? '#0284c7' : 'transparent',
            color: path === '/student' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            Students
          </Link>

          <Link to="/advisory" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/advisory' ? '#0284c7' : 'transparent',
            color: path === '/advisory' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            Farmers
          </Link>

          <Link to="/entrepreneur" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/entrepreneur' ? '#0284c7' : 'transparent',
            color: path === '/entrepreneur' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            Business
          </Link>

          <Link to="/dashboard" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/dashboard' ? '#0284c7' : 'transparent',
            color: path === '/dashboard' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            Mandi Market
          </Link>

          <Link to="/community" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/community' ? '#0284c7' : 'transparent',
            color: path === '/community' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            Community & Schemes
          </Link>

          <Link to="/more" style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: path === '/more' ? '#0284c7' : 'transparent',
            color: path === '/more' ? '#ffffff' : '#475569',
            transition: 'all 0.2s ease'
          }}>
            More
          </Link>
        </nav>

        {/* Right CTA Button */}
        <Link to="/advisory" style={{
          background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.9rem',
          boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span>Try Voice AI</span>
          <span>↗</span>
        </Link>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 45%, #1e3a8a 85%, #0f172a 100%)', color: '#0f172a' }}>
        <NavigationBar />
        
        <main style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/advisory" element={<AdvisoryWorkspace />} />
            <Route path="/student" element={<StudentHub />} />
            <Route path="/entrepreneur" element={<EntrepreneurHub />} />
            <Route path="/dashboard" element={<DomainDashboard />} />
            <Route path="/community" element={<CommunityBoard />} />
            <Route path="/more" element={<More />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
