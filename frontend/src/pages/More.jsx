import React, { useState, useEffect } from 'react';
import { getDirectory } from '../services/api';

export default function More() {
  const [activeTab, setActiveTab] = useState('directory_help');
  
  // Directory & Help States
  const [type, setType] = useState('');
  const [district, setDistrict] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Settings States
  const [fontSize, setFontSize] = useState('16');
  const [defaultLang, setDefaultLang] = useState('hi');
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'var(--font-family)' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-pill" style={{ marginBottom: '0.75rem' }}>
          <span>📌</span>
          <span>MORE & SYSTEM SETTINGS</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
          Directory, Settings & About hello
        </h2>
        <p style={{ color: '#94a3b8', margin: '0.4rem 0 0 0', fontSize: '1rem' }}>
          Access contact directory, helplines, system settings, accessibility tools, and project architecture.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('directory_help')}
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: activeTab === 'directory_help' ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'rgba(15, 23, 42, 0.8)',
            color: activeTab === 'directory_help' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'directory_help' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'directory_help' ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none'
          }}
        >
          📞 Directory & Helpline
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: activeTab === 'settings' ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'rgba(15, 23, 42, 0.8)',
            color: activeTab === 'settings' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'settings' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'settings' ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none'
          }}
        >
          ⚙️ Accessibility & Settings
        </button>

        <button
          onClick={() => setActiveTab('about')}
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: activeTab === 'about' ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'rgba(15, 23, 42, 0.8)',
            color: activeTab === 'about' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'about' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'about' ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none'
          }}
        >
          ℹ️ About hello POC
        </button>
      </div>

      {/* SECTION 1: Directory & Helpline */}
      {activeTab === 'directory_help' && (
        <div>
          {/* Toll-Free Banner */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <div>
              <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.25rem' }}>🌾 Kisan Call Centre (Government Helpline)</h3>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>Free agricultural advice in Hindi, Marathi, Rajasthani, and 19 other regional languages.</p>
            </div>
            <a 
              href="tel:18001801551" 
              style={{ padding: '0.75rem 1.5rem', background: '#38bdf8', color: '#070b14', textDecoration: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem' }}
            >
              📞 Call 1800-180-1551
            </a>
          </div>

          {/* Infrastructure Directory Search */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1.25rem', borderLeft: '4px solid #38bdf8', paddingLeft: '0.75rem' }}>
              Search Nearby Services Directory (KCC / CSC / SHG)
            </h3>

            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Filter by Type: </label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}>
                  <option value="">All Types</option>
                  <option value="KCC">KCC (Kisan Call Centre)</option>
                  <option value="CSC">CSC (Common Service Centre)</option>
                  <option value="SHG">SHG (Self Help Group)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>District: </label>
                <input
                  type="text"
                  placeholder="e.g. Nagaur, Jaipur, Pune"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ padding: '0.4rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <button onClick={fetchDirectory} style={{ padding: '0.5rem 1.25rem', background: '#38bdf8', color: '#070b14', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                Search Directory
              </button>
            </div>

            {loading ? <p style={{ color: '#94a3b8' }}>Loading directory entries...</p> : (
              <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#38bdf8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '1rem' }}>Type</th>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Phone / Helpline</th>
                      <th style={{ padding: '1rem' }}>Address</th>
                      <th style={{ padding: '1rem' }}>District</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((item) => (
                      <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '1rem', color: '#ffffff', fontWeight: 700 }}>{item.type}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{item.name}</td>
                        <td style={{ padding: '1rem' }}><a href={`tel:${item.phone}`} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>{item.phone}</a></td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{item.address}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{item.district} ({item.state})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* FAQs Accordion */}
          <section>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1.25rem', borderLeft: '4px solid #38bdf8', paddingLeft: '0.75rem' }}>
              Frequently Asked Questions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} className="glass-panel" style={{ overflow: 'hidden' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{ width: '100%', textAlign: 'left', padding: '1rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: '#38bdf8' }}>{openFaq === idx ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === idx && (
                    <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* SECTION 2: Accessibility & Settings */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '600px' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#38bdf8', fontSize: '1.3rem' }}>
              System Settings & Accessibility
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  🔤 Base Font Size: {fontSize}px
                </label>
                <input 
                  type="range" 
                  min="14" 
                  max="24" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value)}
                  style={{ width: '100%' }}
                />
                <small style={{ color: '#94a3b8' }}>Adjust text size for low-vision rural users.</small>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  🌐 Default Language Preference
                </label>
                <select 
                  value={defaultLang} 
                  onChange={(e) => setDefaultLang(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="hi" style={{ background: '#0f172a', color: '#fff' }}>हिंदी (Hindi)</option>
                  <option value="en" style={{ background: '#0f172a', color: '#fff' }}>English</option>
                  <option value="mr" style={{ background: '#0f172a', color: '#fff' }}>मराठी (Marathi)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  📶 Offline Advisory Cache Status
                </label>
                <p style={{ margin: '0 0 0.75rem 0', color: '#34d399', fontWeight: 800 }}>
                  {offlineStatus}
                </p>
                <button 
                  onClick={handleClearCache}
                  style={{ padding: '0.6rem 1.25rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Clear Offline Cache Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: About hello POC */}
      {activeTab === 'about' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: '#ffffff', fontSize: '1.4rem' }}>🌾 About hello v2.1 (POC System Architecture)</h3>
          
          <p style={{ lineHeight: 1.6, color: '#cbd5e1', fontSize: '1rem' }}>
            <strong>hello</strong> is a human-centered, voice-first AI advisory platform designed for rural India. Built specifically to eliminate barriers of digital literacy and poor 2G connectivity.
          </p>

          <h4 style={{ color: '#38bdf8', marginTop: '1.5rem', fontSize: '1.15rem' }}>Key Architectural Highlights:</h4>
          <ul style={{ lineHeight: 1.7, color: '#e2e8f0', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
            <li><strong>Multi-Model AI Resilience:</strong> Primary Gemini 2.5/2.0/1.5 Flash models with automatic 770ms fallback to Groq Llama-3.3 70B (`TEXT_API`).</li>
            <li><strong>Privacy First:</strong> Automated regex middleware masking Aadhaar, phone numbers, and bank account numbers prior to LLM submission.</li>
            <li><strong>Offline Capability:</strong> Service worker & localStorage caching allows full advisory playback during signal loss.</li>
            <li><strong>Real-Time Government APIs:</strong> Direct live queries to Agmarknet data.gov.in and Open-Meteo weather geocoding.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
