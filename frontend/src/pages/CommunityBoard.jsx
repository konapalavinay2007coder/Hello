import React, { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost, addCommunityAnswer, upvoteCommunityAnswer } from '../services/api';
import { formTemplates } from '../data/formTemplates';
import { communityPosts as staticPosts } from '../data/communityPosts';

export default function CommunityBoard() {
  const [activeTab, setActiveTab] = useState('community');
  const [posts, setPosts] = useState(staticPosts);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerTextMap, setAnswerTextMap] = useState({});
  const [loading, setLoading] = useState(false);

  // Scheme Auto-Fill Wizard States
  const [selectedForm, setSelectedForm] = useState(null);
  const [formDataState, setFormDataState] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getCommunityPosts();
      if (res.data && res.data.length > 0) {
        setPosts(res.data);
      }
    } catch (err) {
      console.warn('[Community] Using cached community posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await createCommunityPost({
        questionText: newQuestion,
        domain: 'agriculture',
        location: { district: 'Nagaur' }
      });
      setNewQuestion('');
      fetchPosts();
    } catch (err) {
      const newPost = {
        _id: `post-${Date.now()}`,
        questionText: newQuestion,
        location: { district: 'Nagaur' },
        domain: 'agriculture',
        answers: []
      };
      setPosts([newPost, ...posts]);
      setNewQuestion('');
    }
  };

  const handleAddAnswer = async (postId) => {
    const text = answerTextMap[postId];
    if (!text || !text.trim()) return;

    try {
      await addCommunityAnswer(postId, { text, authorName: 'CSC Operator' });
      setAnswerTextMap({ ...answerTextMap, [postId]: '' });
      fetchPosts();
    } catch (err) {
      setPosts(posts.map(p => p.id === postId || p._id === postId ? {
        ...p,
        answers: [...(p.answers || []), { id: `ans-${Date.now()}`, text, authorName: 'CSC Operator', upvotes: 1 }]
      } : p));
      setAnswerTextMap({ ...answerTextMap, [postId]: '' });
    }
  };

  const handleUpvote = async (postId, answerId) => {
    try {
      await upvoteCommunityAnswer(postId, answerId);
      fetchPosts();
    } catch (err) {
      setPosts(posts.map(p => p.id === postId || p._id === postId ? {
        ...p,
        answers: (p.answers || []).map(a => a.id === answerId || a._id === answerId ? { ...a, upvotes: (a.upvotes || 0) + 1 } : a)
      } : p));
    }
  };

  const handleStartWizard = (form) => {
    setSelectedForm(form);
    setFormDataState({});
    setSubmittedSuccess(false);
  };

  const handleSubmitWizard = (e) => {
    e.preventDefault();
    setSubmittedSuccess(true);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'var(--font-family)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-pill" style={{ marginBottom: '0.75rem' }}>
          <span>🤝</span>
          <span>COMMUNITY & SCHEMES</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
          Village Q&A Board & Welfare Schemes
        </h2>
        <p style={{ color: '#94a3b8', margin: '0.4rem 0 0 0', fontSize: '1rem' }}>
          Village Q&A community board, expert answers, and government welfare scheme auto-fill form wizards.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('community')}
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: activeTab === 'community' ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'rgba(15, 23, 42, 0.8)',
            color: activeTab === 'community' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'community' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'community' ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none'
          }}
        >
          🤝 Village Community Q&A Board
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: activeTab === 'schemes' ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'rgba(15, 23, 42, 0.8)',
            color: activeTab === 'schemes' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'schemes' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: activeTab === 'schemes' ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none'
          }}
        >
          🏛️ Schemes & Assisted Form Wizards
        </button>
      </div>

      {/* TAB 1: Village Community Q&A Board */}
      {activeTab === 'community' && (
        <div>
          {/* Post Question Form */}
          <form onSubmit={handleCreatePost} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1.2rem', fontWeight: 700 }}>Ask a Community Question</h3>
            <textarea
              rows="2"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', outline: 'none' }}
              placeholder="Ask a question for Nagaur / Pune farmers & villagers..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <button type="submit" style={{ marginTop: '0.75rem', padding: '0.6rem 1.25rem', background: '#38bdf8', color: '#070b14', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
              Submit Question
            </button>
          </form>

          {/* Questions List */}
          {loading ? <p style={{ color: '#94a3b8' }}>Loading community posts...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {posts.map((post) => (
                <div key={post.id || post._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontSize: '1.2rem' }}>❓ {post.questionText}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
                    By: {post.authorName || 'Village Resident'} ({post.authorDistrict || post.location?.district || 'Nagaur'})
                  </p>

                  {/* Answers */}
                  <div style={{ paddingLeft: '0.75rem', borderLeft: '3px solid rgba(56, 189, 248, 0.3)' }}>
                    <h5 style={{ margin: '0 0 0.75rem 0', color: '#cbd5e1' }}>Answers ({post.answers?.length || 0}):</h5>
                    {post.answers?.map((ans) => (
                      <div key={ans.id || ans._id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: ans.isExpert ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.08)', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.6rem' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.5 }}>{ans.text}</p>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span>By: <strong style={{ color: '#fff' }}>{ans.authorName}</strong> {ans.isExpert && '🏅 (Certified Expert)'}</span>
                          <span>Upvotes: <strong style={{ color: '#34d399' }}>{ans.upvotes || 0}</strong></span>
                          <button 
                            onClick={() => handleUpvote(post.id || post._id, ans.id || ans._id)}
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', borderRadius: '4px', fontWeight: 700 }}
                          >
                            👍 Upvote
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Answer */}
                    <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Write an answer..."
                        value={answerTextMap[post.id || post._id] || ''}
                        onChange={(e) => setAnswerTextMap({ ...answerTextMap, [post.id || post._id]: e.target.value })}
                        style={{ flex: 1, padding: '0.6rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                      />
                      <button onClick={() => handleAddAnswer(post.id || post._id)} style={{ padding: '0.6rem 1.25rem', background: '#38bdf8', color: '#070b14', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Government Welfare Schemes */}
      {activeTab === 'schemes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {formTemplates.map((form) => (
              <div key={form.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontSize: '1.2rem' }}>{form.name}</h4>
                  <small style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Dept: {form.department}</small>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', margin: '0.5rem 0' }}>
                    Benefit: {form.benefit}
                  </p>
                </div>

                <button 
                  onClick={() => handleStartWizard(form)}
                  style={{ marginTop: '1.25rem', width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
                >
                  🎙️ Start Voice Auto-Fill Form Wizard →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Wizard Modal */}
      {selectedForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '540px', width: '90%', maxHeight: '90vh', overflowY: 'auto', background: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff' }}>{selectedForm.name}</h3>
              <button onClick={() => setSelectedForm(null)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem' }}>✕</button>
            </div>

            {!submittedSuccess ? (
              <form onSubmit={handleSubmitWizard}>
                <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#38bdf8' }}>
                  🎙️ Simulated Voice Slot Filling: Speak field values or type them in below.
                </div>

                {selectedForm.fields.map((field) => (
                  <div key={field.id} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>
                      {field.label} {field.required && <span style={{ color: '#f87171' }}>*</span>}
                    </label>
                    <input 
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={formDataState[field.id] || ''}
                      onChange={(e) => setFormDataState({ ...formDataState, [field.id]: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                ))}

                <button 
                  type="submit"
                  style={{ width: '100%', padding: '0.75rem', background: '#34d399', color: '#070b14', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', marginTop: '0.5rem' }}
                >
                  Submit Form Application
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h3 style={{ color: '#34d399', margin: '0.75rem 0' }}>Application Submitted Successfully!</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Reference Number: <strong>RAJ-2026-{Math.floor(100000 + Math.random() * 900000)}</strong>
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <button onClick={() => setSelectedForm(null)} style={{ padding: '0.6rem 1.5rem', background: '#38bdf8', color: '#070b14', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                    Close Wizard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
