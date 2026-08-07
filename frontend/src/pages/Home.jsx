import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roles } from '../data/roles';

export default function Home() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [selectedDomain, setSelectedDomain] = useState('agriculture');

  const handleSelectRole = (roleId) => {
    if (roleId === 'student' || roleId === 'parent') {
      navigate('/student');
    } else if (roleId === 'entrepreneur') {
      navigate('/entrepreneur');
    } else if (roleId === 'farmer') {
      navigate('/advisory', { state: { language: selectedLanguage, domain: 'agriculture' } });
    } else {
      navigate('/advisory', { state: { language: selectedLanguage, domain: selectedDomain } });
    }
  };

  return (
    <div style={{ width: '100%', padding: '2rem 3rem 5rem 3rem' }}>
      
      {/* ========================================================================= */}
      {/* HERO SECTION — FULL WIDTH EDGE-TO-EDGE FIT                                */}
      {/* ========================================================================= */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
        padding: '1.5rem 0 3.5rem 0'
      }}>
        
        {/* LEFT COLUMN */}
        <div>
          {/* Top Pill Badge */}
          <div className="glass-pill" style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.5)', color: '#ffffff' }}>
            <span>✦</span>
            <span>AI FOR RURAL INDIA</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            marginBottom: '1.25rem',
            color: '#ffffff'
          }}>
            Everything You've<br />
            Ever Been.<br />
            <span style={{
              background: 'linear-gradient(90deg, #e0f2fe 0%, #7dd3fc 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              All In One Place.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.18rem',
            color: '#e2e8f0',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '2.25rem',
            fontWeight: 500
          }}>
            Voice-first AI platform for students, farmers, entrepreneurs and families — in your language, even without internet.
          </p>

          {/* 4 Feature Icons Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2.5rem',
            maxWidth: '580px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', marginBottom: '0.3rem' }}>🎙️</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>Voice First</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Speak Naturally</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', marginBottom: '0.3rem' }}>☁️</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>Works Offline</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Answers that matter</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', marginBottom: '0.3rem' }}>🌐</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>In Your Language</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Hindi, Marathi & more</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', marginBottom: '0.3rem' }}>🛡️</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>Private & Safe</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Your data, protected</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
            <button
              onClick={() => navigate('/advisory', { state: { language: selectedLanguage, domain: selectedDomain } })}
              style={{
                background: '#ffffff',
                color: '#0284c7',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s'
              }}
            >
              <span>Start Free</span>
              <span style={{ fontSize: '1.1rem' }}>↗</span>
            </button>

            <button
              onClick={() => navigate('/more')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span>See How It Works</span>
              <span style={{ fontSize: '0.9rem' }}>▶</span>
            </button>
          </div>

          {/* Social Proof Avatars Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
              {['👨‍🌾', '👩‍🎓', '👨‍💼', '👩‍🌾', '👨‍🏫'].map((emoji, idx) => (
                <div key={idx} style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '2px solid #0284c7',
                  marginLeft: '-10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>10,000+</div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Users already growing with hello</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — SMARTPHONE GRAPHIC & FLOATING WHITE GLASS CARDS */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '520px' }}>
          
          {/* Floating White Glass Card 1: Mandi Price */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            top: '0px',
            right: '20px',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '210px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(2, 132, 199, 0.3)'
          }}>
            <small style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 800 }}>Mandi Price</small>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Tomato (Nagaur)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
              ₹1,842 <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/quintal</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>↑ +5.2% today</div>
          </div>

          {/* Floating White Glass Card 2: Scholarships */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            top: '160px',
            right: '0px',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '190px',
            animationDelay: '1s',
            background: 'rgba(255, 255, 255, 0.95)'
          }}>
            <small style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 800 }}>Scholarships</small>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>23 Matches for you 🎓</div>
          </div>

          {/* Floating White Glass Card 3: Weather */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            bottom: '40px',
            left: '10px',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '200px',
            animationDelay: '2s',
            background: 'rgba(255, 255, 255, 0.95)'
          }}>
            <small style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 800 }}>Weather</small>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Nagaur, Rajasthan</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', margin: '0.2rem 0' }}>
              32°C ☀️
            </div>
            <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Sunny & Clear</small>
          </div>

          {/* Floating White Glass Card 4: Offline Ready */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '190px',
            animationDelay: '1.5s',
            background: 'rgba(255, 255, 255, 0.95)'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Offline Ready 📶</div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
              Answers that work without internet
            </div>
          </div>

          {/* Center Phone Frame Mockup */}
          <div style={{
            width: '290px',
            height: '530px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
            borderRadius: '40px',
            border: '8px solid #0f172a',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.4)',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative',
            zIndex: 5
          }}>
            {/* Notch */}
            <div style={{
              width: '100px',
              height: '18px',
              background: '#0f172a',
              borderRadius: '0 0 12px 12px',
              margin: '-1.25rem auto 1rem auto'
            }} />

            {/* App Screen Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '1.15rem' }}>hello 🌾</span>
                <span style={{ fontSize: '0.75rem', color: '#059669', background: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>
                  📶 Offline
                </span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Namaste! 👋</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
                  How can I help you today?
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Speak in Hindi, Marathi or English</p>
              </div>
            </div>

            {/* Mic Hero Button in Phone */}
            <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
                boxShadow: '0 0 30px rgba(2, 132, 199, 0.4)',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: '#ffffff',
                cursor: 'pointer'
              }}>
                🎙️
              </div>
            </div>

            {/* App Screen Footer */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '0.6rem',
              display: 'flex',
              justify: 'space-around',
              fontSize: '0.75rem',
              color: '#475569',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>🏠 Home</span>
              <span>💬 Chat</span>
              <span>🤝 Board</span>
              <span>👤 Profile</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* UNIFIED FEATURE BOX CONTAINER (ELEGANT FULL-WIDTH BOX LAYOUT)             */}
      {/* ========================================================================= */}
      <div className="glass-panel" style={{
        width: '100%',
        padding: '2.5rem',
        marginTop: '2rem',
        background: '#ffffff',
        boxShadow: '0 20px 50px rgba(2, 132, 199, 0.15)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        {/* Banner Title Inside Box */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '2px solid #f1f5f9',
          paddingBottom: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
              Select Your Role to Get Started
            </h2>
            <p style={{ color: '#64748b', margin: '0.4rem 0 0 0', fontSize: '1rem', fontWeight: 500 }}>
              Built for Rural India. Built for Real Life — Students, Farmers, Entrepreneurs & Families.
            </p>
          </div>

          {/* Language Selector */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 700 }}>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                background: 'transparent',
                color: '#0284c7',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </div>

        {/* 5-COLUMN BALANCED FLEX ROW BOXES */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          justify: 'space-between'
        }}>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role.id)}
              style={{
                flex: '1 1 200px',
                minWidth: '210px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(2, 132, 199, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>{role.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>
                  {role.title[selectedLanguage] || role.title.en}
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
                  {role.desc[selectedLanguage] || role.desc.en}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Explore Features</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
