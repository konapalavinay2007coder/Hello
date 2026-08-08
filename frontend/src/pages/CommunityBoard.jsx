import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const shgCircles = [
  {
    id: 1,
    name: "Lakshmi Self Help Group",
    district: "Nagaur",
    memberCount: 14,
    focusArea: "Organic Fertilizer & Dairy"
  },
  {
    id: 2,
    name: "Pragati Mahila Mandal",
    district: "Jaipur",
    memberCount: 22,
    focusArea: "Handicrafts & Pickle Manufacturing"
  },
  {
    id: 3,
    name: "Kisan Kranti Sangathan",
    district: "Pune",
    memberCount: 35,
    focusArea: "Mandi Aggregation & Solar Drying"
  }
];

export default function CommunityBoard() {
  const { language } = useLanguage();
  const t = translations[language]?.community || translations.en.community;

  // Community Q&A state
  const [userQuestion, setUserQuestion] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Ramesh Pawar (Farmer, Nagaur)",
      text: "Has anyone received PM-KISAN 16th installment SMS today?",
      replies: 4,
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Anita Sharma (SHG Leader, Jaipur)",
      text: "Free Mahila Samriddhi loan awareness drive at CSC tomorrow at 10 AM.",
      replies: 7,
      time: "5 hours ago"
    }
  ]);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setPosts([
      {
        id: Date.now(),
        author: "You (Verified User)",
        text: userQuestion,
        replies: 0,
        time: "Just now"
      },
      ...posts
    ]);
    setUserQuestion('');
  };

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

      {/* SECTION 1: SHG Directory */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#062C4D', marginBottom: '1.5rem', borderLeft: '4px solid #0284c7', paddingLeft: '0.75rem' }}>
          {t.sec2Title}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {shgCircles.map((shg) => (
            <div key={shg.id} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(2,132,199,0.06)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#062C4D', fontSize: '1.25rem', fontWeight: 800 }}>{shg.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#4D8FC7', margin: '0.3rem 0' }}>District: <strong style={{ color: '#062C4D' }}>{shg.district}</strong></p>
              <p style={{ fontSize: '0.9rem', color: '#4D8FC7', margin: '0.3rem 0' }}>{t.members} {shg.memberCount}</p>
              <p style={{ fontSize: '0.9rem', color: '#4D8FC7', margin: '0.3rem 0' }}>{t.focus} {shg.focusArea}</p>
              <button style={{ width: '100%', marginTop: '1.25rem', padding: '0.7rem', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#062C4D', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                {t.joinCircle}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Community Discussion Board */}
      <section>
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)'
        }}>
          <h2 style={{ margin: '0 0 1.25rem 0', color: '#062C4D', fontSize: '1.5rem', fontWeight: 800 }}>
            {t.sec3Title}
          </h2>

          <form onSubmit={handleAddPost} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="Ask your village peers a question..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              style={{ flex: 1, padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#062C4D', outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}>
              {t.postQuery}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map((post) => (
              <div key={post.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4D8FC7', marginBottom: '0.4rem' }}>
                  <strong style={{ color: '#062C4D' }}>{post.author}</strong>
                  <span>{post.time}</span>
                </div>
                <p style={{ margin: '0.4rem 0', color: '#062C4D', fontSize: '1.05rem', lineHeight: 1.5 }}>{post.text}</p>
                <small style={{ color: '#0284c7', fontWeight: 800 }}>💬 {post.replies} Replies</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
