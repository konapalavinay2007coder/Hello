import React, { useState, useEffect } from 'react';
import { getDirectory } from '../services/api';

export default function Directory() {
  const [type, setType] = useState('');
  const [district, setDistrict] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
    fetchDirectory();
  }, []);

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

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ borderBottom: '2px solid #0288d1', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#0288d1' }}>📞 Directory & Help Center</h2>
        <p style={{ margin: '0.4rem 0 0 0', color: '#555' }}>
          Toll-free helplines, nearby KCC / CSC / SHG infrastructure contacts, and system FAQs.
        </p>
      </div>

      {/* SECTION 1: Direct Toll-Free Helplines Banner */}
      <div style={{ background: '#e1f5fe', border: '1px solid #b3e5fc', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#01579b' }}>🌾 Kisan Call Centre (Government Helpline)</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#0277bd' }}>Free agricultural advice in Hindi, Marathi, Rajasthani, and 19 other regional languages.</p>
        </div>
        <a 
          href="tel:18001801551" 
          style={{ padding: '0.6rem 1.25rem', background: '#0288d1', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.05rem' }}
        >
          📞 Call 1800-180-1551
        </a>
      </div>

      {/* SECTION 2: Searchable Infrastructure Contacts Directory */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ borderLeft: '4px solid #0288d1', paddingLeft: '0.5rem', color: '#01579b' }}>
          1. Search Nearby Services Directory (KCC / CSC / SHG)
        </h3>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', margin: '1rem 0', background: '#f5f5f5', padding: '0.75rem', borderRadius: '6px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Filter by Type: </label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.4rem', marginLeft: '0.3rem' }}>
              <option value="">All Types</option>
              <option value="KCC">KCC (Kisan Call Centre)</option>
              <option value="CSC">CSC (Common Service Centre)</option>
              <option value="SHG">SHG (Self Help Group)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>District: </label>
            <input
              type="text"
              placeholder="e.g. Nagaur, Jaipur, Pune"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{ padding: '0.4rem', marginLeft: '0.3rem' }}
            />
          </div>

          <button onClick={fetchDirectory} style={{ padding: '0.4rem 1rem', background: '#0288d1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Search Directory
          </button>
        </div>

        {loading ? <p>Loading directory entries...</p> : (
          <div>
            {entries.length === 0 ? (
              <p>No directory contacts found matching search filter.</p>
            ) : (
              <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                <thead>
                  <tr style={{ background: '#0288d1', color: '#fff' }}>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Phone / Helpline</th>
                    <th>Address</th>
                    <th>District</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((item) => (
                    <tr key={item._id}>
                      <td><strong>{item.type}</strong></td>
                      <td>{item.name}</td>
                      <td><a href={`tel:${item.phone}`} style={{ color: '#0288d1', fontWeight: 'bold' }}>{item.phone}</a></td>
                      <td>{item.address}</td>
                      <td>{item.district} ({item.state})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      {/* SECTION 3: System FAQs */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ borderLeft: '4px solid #0288d1', paddingLeft: '0.5rem', color: '#01579b' }}>
          2. Frequently Asked Questions
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', textAlign: 'left', padding: '0.85rem 1rem', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{faq.q}</span>
                <span>{openFaq === idx ? '▲' : '▼'}</span>
              </button>
              {openFaq === idx && (
                <div style={{ padding: '1rem', background: '#fff', fontSize: '0.9rem', color: '#444', lineHeight: '1.5' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
