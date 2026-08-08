import React, { useState, useEffect } from 'react';
import { getMandiPrices } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function DomainDashboard() {
  const { language } = useLanguage();
  const t = translations[language]?.dashboard || translations.en.dashboard;

  const [commodity, setCommodity] = useState('Tomato');
  const [district, setDistrict] = useState('Pune');
  const [mandiData, setMandiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mandiRes = await getMandiPrices({ commodity, district });
      setMandiData(mandiRes.data?.data || mandiRes.data || []);
    } catch (err) {
      console.error('Error fetching mandi prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', padding: '2rem 3rem 5rem 3rem', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
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

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-1px' }}>
          {t.title}
        </h1>
        <p style={{ color: '#4D8FC7', margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: 500 }}>
          {t.subtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
      }}>
        <div>
          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#062C4D', display: 'block', marginBottom: '0.4rem' }}>{t.commodityLabel} </label>
          <input
            type="text"
            placeholder="e.g. Tomato, Wheat, Onion"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            style={{ padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#062C4D', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#062C4D', display: 'block', marginBottom: '0.4rem' }}>{t.districtLabel} </label>
          <input
            type="text"
            placeholder="e.g. Nagaur, Pune, Jaipur"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{ padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#062C4D', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }}
          />
        </div>

        <button 
          onClick={fetchData} 
          style={{ marginTop: 'auto', padding: '0.85rem 1.8rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)' }}
        >
          {t.fetchBtn}
        </button>
      </div>

      {/* Mandi Market Commodity Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '20px',
        overflowX: 'auto',
        boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #cbd5e1' }}>
          <h2 style={{ margin: 0, color: '#062C4D', fontSize: '1.4rem', fontWeight: 800 }}>
            {t.tableTitle} ({mandiData.length} records)
          </h2>
        </div>

        {loading ? <p style={{ padding: '1.5rem', color: '#4D8FC7' }}>Loading live Agmarknet records...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#e0f2fe', color: '#062C4D', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '1.1rem' }}>{t.thCommodity}</th>
                <th style={{ padding: '1.1rem' }}>{t.thMarket}</th>
                <th style={{ padding: '1.1rem' }}>{t.thDistrict}</th>
                <th style={{ padding: '1.1rem' }}>{t.thMin}</th>
                <th style={{ padding: '1.1rem' }}>{t.thMax}</th>
                <th style={{ padding: '1.1rem' }}>{t.thModal}</th>
                <th style={{ padding: '1.1rem' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {mandiData.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1.1rem', color: '#062C4D', fontWeight: 800 }}>{item.commodity}</td>
                  <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>{item.marketName}</td>
                  <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>{item.district} ({item.state})</td>
                  <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>₹{item.minPrice}</td>
                  <td style={{ padding: '1.1rem', color: '#4D8FC7' }}>₹{item.maxPrice}</td>
                  <td style={{ padding: '1.1rem', color: '#0284c7', fontWeight: 800 }}>₹{item.modalPrice}</td>
                  <td style={{ padding: '1.1rem' }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.marketName || 'Mandi'}, ${item.district}, ${item.state || 'India'}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#0284c7',
                        fontWeight: 800,
                        textDecoration: 'none',
                        background: '#e0f2fe',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        display: 'inline-block'
                      }}
                    >
                      View Map ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
