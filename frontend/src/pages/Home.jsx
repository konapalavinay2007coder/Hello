import React from 'react';
import { useNavigate } from 'react-router-dom';
import { roles } from '../data/roles';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language]?.home || translations.en.home;

  const handleSelectRole = (roleId) => {
    if (roleId === 'student' || roleId === 'parent') {
      navigate('/student');
    } else if (roleId === 'entrepreneur') {
      navigate('/entrepreneur');
    } else if (roleId === 'farmer') {
      navigate('/advisory', { state: { language, domain: 'agriculture' } });
    } else {
      navigate('/advisory', { state: { language, domain: 'agriculture' } });
    }
  };

  return (
    <div style={{ width: '100%', padding: '0 3rem 5rem 3rem', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      
      {/* HERO SECTION — FULL SCREEN VIEWPORT HEIGHT */}
      <div style={{
        width: '100%',
        minHeight: 'calc(100vh - 100px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
        padding: '2rem 0'
      }}>
        
        {/* LEFT COLUMN */}
        <div>
          {/* Headline (Seamless Inline Flow for EN, HI, MR) */}
          <h1 style={{
            fontSize: 'clamp(3.5rem, 6.2vw, 5.8rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-1.5px',
            marginBottom: '2.5rem',
            color: '#062C4D'
          }}>
            {t.heroTitle1} {t.heroTitle2}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #0284c7 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t.heroTitle3}
            </span>
          </h1>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
            <button
              onClick={() => navigate('/advisory', { state: { language, domain: 'agriculture' } })}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '1.15rem 2.8rem',
                borderRadius: '9999px',
                fontSize: '1.2rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 10px 30px rgba(2, 132, 199, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              <span>{t.startFree}</span>
              <span style={{ fontSize: '1.3rem' }}>↗</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — SMARTPHONE GRAPHIC & FLOATING WHITE GLASS CARDS */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '540px' }}>
          
          {/* Floating Glass Card 1 — Top Right (Slight Edge Touch) */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            top: '20px',
            right: 'calc(50% - 245px)',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '195px',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid rgba(2, 132, 199, 0.35)',
            boxShadow: '0 10px 28px rgba(6, 44, 77, 0.15)'
          }}>
            <small style={{ color: '#4D8FC7', fontSize: '0.75rem', fontWeight: 800 }}>Mandi Price</small>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#062C4D' }}>Tomato (Nagaur)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
              ₹1,842 <span style={{ fontSize: '0.75rem', color: '#4D8FC7' }}>/quintal</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>↑ +5.2% today</div>
          </div>

          {/* Floating Glass Card 2 — Middle Right (Slight Edge Touch) */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            top: '180px',
            right: 'calc(50% - 235px)',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '185px',
            animationDelay: '1s',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid rgba(2, 132, 199, 0.35)',
            boxShadow: '0 10px 28px rgba(6, 44, 77, 0.15)'
          }}>
            <small style={{ color: '#4D8FC7', fontSize: '0.75rem', fontWeight: 800 }}>Scholarships</small>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#062C4D' }}>23 Matches for you 🎓</div>
          </div>

          {/* Floating Glass Card 3 — Bottom Left (Slight Edge Touch) */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            bottom: '60px',
            left: 'calc(50% - 235px)',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '190px',
            animationDelay: '2s',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid rgba(2, 132, 199, 0.35)',
            boxShadow: '0 10px 28px rgba(6, 44, 77, 0.15)'
          }}>
            <small style={{ color: '#4D8FC7', fontSize: '0.75rem', fontWeight: 800 }}>Weather</small>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#062C4D' }}>Nagaur, Rajasthan</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', margin: '0.2rem 0' }}>
              32°C ☀️
            </div>
            <small style={{ color: '#4D8FC7', fontSize: '0.75rem' }}>Sunny & Clear</small>
          </div>

          {/* Floating Glass Card 4 — Bottom Right (Slight Edge Touch) */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            bottom: '15px',
            right: 'calc(50% - 225px)',
            zIndex: 10,
            padding: '0.85rem 1.1rem',
            maxWidth: '185px',
            animationDelay: '1.5s',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid rgba(2, 132, 199, 0.35)',
            boxShadow: '0 10px 28px rgba(6, 44, 77, 0.15)'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#062C4D' }}>Offline Ready 📶</div>
            <div style={{ fontSize: '0.75rem', color: '#4D8FC7', marginTop: '0.2rem' }}>
              Answers that work without internet
            </div>
          </div>

          {/* Center Phone Frame Mockup */}
          <div style={{
            width: '290px',
            height: '530px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
            borderRadius: '40px',
            border: '8px solid #062C4D',
            boxShadow: '0 25px 60px rgba(2, 132, 199, 0.25)',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative',
            zIndex: 5
          }}>
            <div style={{
              width: '100px',
              height: '18px',
              background: '#062C4D',
              borderRadius: '0 0 12px 12px',
              margin: '-1.25rem auto 1rem auto'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '1.15rem' }}>hello 🌾</span>
                <span style={{ fontSize: '0.75rem', color: '#059669', background: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>
                  📶 Offline
                </span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#4D8FC7', margin: 0 }}>Namaste! 👋</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#062C4D', margin: '0.3rem 0' }}>
                  How can I help you today?
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#4D8FC7' }}>Speak in Hindi, Marathi or English</p>
              </div>
            </div>

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

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '0.6rem',
              display: 'flex',
              justify: 'space-around',
              fontSize: '0.75rem',
              color: '#4D8FC7',
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

      {/* UNIFIED ROLE SELECTION FEATURE BOX CONTAINER */}
      <div style={{
        width: '100%',
        padding: '2.5rem',
        marginTop: '2rem',
        background: '#ffffff',
        boxShadow: '0 20px 50px rgba(2, 132, 199, 0.12)',
        borderRadius: '24px',
        border: '1px solid #cbd5e1'
      }}>
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
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-0.5px' }}>
              {t.roleHeader}
            </h2>
            <p style={{ color: '#4D8FC7', margin: '0.4rem 0 0 0', fontSize: '1rem', fontWeight: 500 }}>
              {t.roleSub}
            </p>
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
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.5rem 0' }}>
                  {role.id === 'farmer' ? t.roleFarmer : role.id === 'student' ? t.roleStudent : role.id === 'entrepreneur' ? t.roleBiz : role.id === 'mandi' ? t.roleMandi : t.roleComm}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4D8FC7', margin: 0, lineHeight: 1.5 }}>
                  {role.id === 'farmer' ? t.roleFarmerDesc : role.id === 'student' ? t.roleStudentDesc : role.id === 'entrepreneur' ? t.roleBizDesc : role.id === 'mandi' ? t.roleMandiDesc : t.roleCommDesc}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>Explore Module</span>
                <span style={{ fontSize: '1.1rem', color: '#0284c7' }}>➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
