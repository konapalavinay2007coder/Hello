import React, { useState } from 'react';

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(null);

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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '2px solid #0288d1', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#0288d1' }}>📞 Help, Support & Toll-Free Helplines</h2>
        <p style={{ margin: '0.4rem 0 0 0', color: '#555' }}>
          Frequently asked questions, helpline numbers, and system user guides.
        </p>
      </div>

      {/* Direct Call Helplines Banner */}
      <div style={{ background: '#e1f5fe', border: '1px solid #b3e5fc', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#01579b' }}>🌾 Kisan Call Centre (Government Helpline)</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#0277bd' }}>Free agricultural advice in Hindi, Marathi, Rajasthani, and 19 other languages.</p>
        </div>
        <a 
          href="tel:18001801551" 
          style={{ padding: '0.6rem 1.25rem', background: '#0288d1', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.05rem' }}
        >
          📞 Call 1800-180-1551
        </a>
      </div>

      {/* FAQ Accordion */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Frequently Asked Questions</h3>
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
