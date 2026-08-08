import React, { useState, useEffect } from 'react';
import { getDirectory } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function More() {
  const { language, setLanguage, fontSize, setFontSize } = useLanguage();
  const t = translations[language]?.more || translations.en.more;

  const [activeTab, setActiveTab] = useState('directory_help');
  
  // Directory & Help States
  const [type, setType] = useState('');
  const [district, setDistrict] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Settings States
  const [offlineStatus, setOfflineStatus] = useState('Enabled (Pre-seeded)');

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const res = await getDirectory({ type, district });
      setEntries(res.data || []);
    } catch (err) {
      console.error('Failed to fetch directory entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'directory_help') {
      fetchDirectory();
    }
  }, [activeTab]);

  const faqs = [
    {
      q: "Does 'hello' work when internet signal is disconnected?",
      a: "Yes! 'hello' has a built-in offline mode. If 2G or mobile signal dies, it serves cached Mandi prices, weather advisories, and government scheme helplines directly from your browser memory."
    },
    {
      q: "How does Privacy Masking protect my bank account and phone number?",
      a: "Before your spoken or typed message reaches the AI, our regex privacy layer strips phone numbers, 12-digit Aadhaar sequences, and bank accounts, replacing them with safe tokens like [PHONE_REMOVED]."
    },
    {
      q: "What is Kisan Call Centre helpline number?",
      a: "Kisan Call Centre toll-free helpline number is 1800-180-1551 (available 6:00 AM to 10:00 PM daily in 22 regional Indian languages)."
    }
  ];

  const handleClearCache = () => {
    localStorage.removeItem('hello_offline_cache');
    alert('Offline cache cleared successfully!');
  };

  return (
    <div style={{ width: '100%', padding: '2rem 3rem 5rem 3rem', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        {t.badge && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '9999px',
            padding: '0.35rem 1rem',
            color: '#4D8FC7',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <span>{t.badge}</span>
          </div>
        )}

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-1px' }}>
          {t.title}
        </h1>
        {t.subtitle && (
          <p style={{ color: '#4D8FC7', margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: 500 }}>
            {t.subtitle}
          </p>
        )}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <button
          onClick={() => setActiveTab('directory_help')}
          style={{
            padding: '0.75rem 1.8rem',
            fontSize: '0.98rem',
            fontWeight: 800,
            background: activeTab === 'directory_help' ? '#0284c7' : 'rgba(255, 255, 255, 0.8)',
            color: activeTab === 'directory_help' ? '#ffffff' : '#062C4D',
            border: activeTab === 'directory_help' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'directory_help' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          {t.tab1}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '0.75rem 1.8rem',
            fontSize: '0.98rem',
            fontWeight: 800,
            background: activeTab === 'settings' ? '#0284c7' : 'rgba(255, 255, 255, 0.8)',
            color: activeTab === 'settings' ? '#ffffff' : '#062C4D',
            border: activeTab === 'settings' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'settings' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none'
          }}
        >
          {t.tab2}
        </button>
      </div>

      {/* SECTION 1: Directory & Helpline */}
      {activeTab === 'directory_help' && (
        <div>
          {/* Toll-Free Banner */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '1.75rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justify: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
          }}>
            <div>
              <h3 style={{ margin: 0, color: '#062C4D', fontSize: '1.4rem', fontWeight: 800 }}>{t.kccTitle}</h3>
              <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.95rem', color: '#4D8FC7' }}>{t.kccSub}</p>
            </div>
            <a 
              href="tel:18001801551" 
              style={{ padding: '0.85rem 1.8rem', background: '#0284c7', color: '#ffffff', textDecoration: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)' }}
            >
              {t.callBtn}
            </a>
          </div>

          {/* Infrastructure Directory Search */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#062C4D', marginBottom: '1.5rem', borderLeft: '4px solid #0284c7', paddingLeft: '0.75rem' }}>
              {t.dirTitle}
            </h2>

            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
            }}>
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#062C4D' }}>{t.filterType} </label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.6rem 0.9rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#062C4D', outline: 'none', marginLeft: '0.4rem', fontFamily: 'inherit' }}>
                  <option value="">{t.allTypes}</option>
                  <option value="KCC">KCC (Kisan Call Centre)</option>
                  <option value="CSC">CSC (Common Service Centre)</option>
                  <option value="SHG">SHG (Self Help Group)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#062C4D' }}>District: </label>
                <input
                  type="text"
                  placeholder="e.g. Nagaur, Jaipur, Pune"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ padding: '0.6rem 0.9rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#062C4D', outline: 'none', marginLeft: '0.4rem', fontFamily: 'inherit' }}
                />
              </div>

              <button onClick={fetchDirectory} style={{ padding: '0.65rem 1.6rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}>
                {t.searchBtn}
              </button>
            </div>

            {loading ? <p style={{ color: '#4D8FC7' }}>Loading directory entries...</p> : (
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                overflowX: 'auto',
                boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#e0f2fe', color: '#062C4D', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '1.1rem' }}>Type</th>
                      <th style={{ padding: '1.1rem' }}>Name</th>
                      <th style={{ padding: '1.1rem' }}>Phone / Helpline</th>
                      <th style={{ padding: '1.1rem' }}>Address</th>
                      <th style={{ padding: '1.1rem' }}>District</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((item) => (
                      <tr key={item._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1.1rem', color: '#062C4D', fontWeight: 800 }}>{item.type}</td>
                        <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>{item.name}</td>
                        <td style={{ padding: '1.1rem' }}><a href={`tel:${item.phone}`} style={{ color: '#0284c7', fontWeight: 800, textDecoration: 'none' }}>{item.phone}</a></td>
                        <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>{item.address}</td>
                        <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>{item.district} ({item.state})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>


        </div>
      )}

      {/* SECTION 2: Accessibility & Settings */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#062C4D', fontSize: '1.5rem', fontWeight: 800 }}>
              {t.settingsTitle}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, color: '#062C4D', marginBottom: '0.5rem' }}>
                  {t.fontSizeLabel} {fontSize}px
                </label>
                <input 
                  type="range" 
                  min="14" 
                  max="24" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value)}
                  style={{ width: '100%' }}
                />
                <small style={{ color: '#4D8FC7' }}>Adjust text size for low-vision rural users.</small>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, color: '#062C4D', marginBottom: '0.5rem' }}>
                  {t.langPrefLabel}
                </label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#062C4D', outline: 'none', fontFamily: 'inherit' }}
                >
                  <option value="en">English 🇬🇧</option>
                  <option value="hi">हिंदी (Hindi) 🇮🇳</option>
                  <option value="mr">मराठी (Marathi) 🇮🇳</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, color: '#062C4D', marginBottom: '0.5rem' }}>
                  {t.cacheStatusLabel}
                </label>
                <p style={{ margin: '0 0 0.85rem 0', color: '#0284c7', fontWeight: 800 }}>
                  {offlineStatus}
                </p>
                <button 
                  onClick={handleClearCache}
                  style={{ padding: '0.7rem 1.4rem', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#062C4D', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}
                >
                  {t.clearCacheBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
