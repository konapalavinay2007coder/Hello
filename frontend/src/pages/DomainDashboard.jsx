import React, { useState, useEffect } from 'react';
import { getMandiPrices, getWeather } from '../services/api';

export default function DomainDashboard() {
  const [commodity, setCommodity] = useState('Tomato');
  const [district, setDistrict] = useState('Nagaur');
  const [mandiData, setMandiData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mandiRes, weatherRes] = await Promise.allSettled([
        getMandiPrices({ commodity, district }),
        getWeather({ district, state: 'Rajasthan' })
      ]);

      if (mandiRes.status === 'fulfilled') {
        setMandiData(mandiRes.value.data?.data || []);
      }
      if (weatherRes.status === 'fulfilled') {
        setWeatherData(weatherRes.value.data?.data || null);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'var(--font-family)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-pill" style={{ marginBottom: '0.75rem' }}>
          <span>📊</span>
          <span>MANDI MARKET & WEATHER</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
          Real-Time Mandi Prices & Weather
        </h2>
        <p style={{ color: '#94a3b8', margin: '0.4rem 0 0 0', fontSize: '1rem' }}>
          100% live government Agmarknet APMC arrivals and Open-Meteo geocoded weather forecasts.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Commodity: </label>
          <input
            type="text"
            placeholder="e.g. Tomato, Wheat, Onion"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            style={{ padding: '0.5rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>District: </label>
          <input
            type="text"
            placeholder="e.g. Nagaur, Pune, Jaipur"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{ padding: '0.5rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
          />
        </div>

        <button 
          onClick={fetchData} 
          style={{ marginTop: 'auto', padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #2563eb, #38bdf8)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
        >
          Fetch Live Data
        </button>
      </div>

      {/* Weather Card Widget */}
      {weatherData && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          <small style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.8rem' }}>LIVE WEATHER ADVISORY</small>
          <h3 style={{ margin: '0.3rem 0 0.5rem 0', color: '#ffffff', fontSize: '1.3rem' }}>
            Today's Weather — {weatherData.location?.district}, {weatherData.location?.state}
          </h3>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', margin: '0.75rem 0' }}>
            <div>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24' }}>{weatherData.temperature}°C</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff' }}>Condition: {weatherData.condition}</div>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Summary: {weatherData.summary}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mandi Market Commodity Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.2rem', fontWeight: 700 }}>
            Mandi Commodity Market Prices ({mandiData.length} records)
          </h3>
        </div>

        {loading ? <p style={{ padding: '1.5rem', color: '#94a3b8' }}>Loading live Agmarknet records...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#38bdf8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem' }}>Commodity</th>
                <th style={{ padding: '1rem' }}>Market Name</th>
                <th style={{ padding: '1rem' }}>District</th>
                <th style={{ padding: '1rem' }}>Min Price (₹)</th>
                <th style={{ padding: '1rem' }}>Max Price (₹)</th>
                <th style={{ padding: '1rem' }}>Modal Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {mandiData.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '1rem', color: '#ffffff', fontWeight: 700 }}>{item.commodity}</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>{item.marketName}</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>{item.district} ({item.state})</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>₹{item.minPrice}</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>₹{item.maxPrice}</td>
                  <td style={{ padding: '1rem', color: '#34d399', fontWeight: 800 }}>₹{item.modalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
