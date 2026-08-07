import React, { useState } from 'react';
import { careerPaths, scholarships, colleges } from '../data/studentHub';
import { courses } from '../data/courses';

export default function StudentHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  
  // Skill Academy states
  const [activeCourse, setActiveCourse] = useState(null);
  const [enrolledMap, setEnrolledMap] = useState({});

  const filteredScholarships = scholarships.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory && s.category !== 'general') return false;
    return true;
  });

  const handleEnroll = (courseId) => {
    setEnrolledMap({ ...enrolledMap, [courseId]: true });
  };

  return (
    <div style={{ width: '100%', padding: '2rem 3rem 5rem 3rem', fontFamily: 'var(--font-family)' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '9999px',
          padding: '0.35rem 1rem',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <span>🎓</span>
          <span>STUDENT & SKILLS ACADEMY</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-1px' }}>
          Career Guidance, Scholarships & Skills
        </h1>
        <p style={{ color: '#e2e8f0', margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: 500 }}>
          Career path discovery, scholarship matcher, college fee concessions, and free vocational video courses.
        </p>
      </div>

      {/* SECTION 1: Career Path Discovery */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8', paddingLeft: '0.75rem' }}>
          1. Career Path Discovery
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {careerPaths.map((item) => (
            <div key={item.id} style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(10px)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>{item.title}</h3>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.4)', color: '#ffffff', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                    {item.growth}
                  </span>
                </div>

                <p style={{ fontSize: '1.1rem', margin: '0.75rem 0', fontWeight: 800, color: '#38bdf8' }}>
                  Avg Salary: {item.avgSalary}
                </p>

                <p style={{ fontSize: '0.9rem', color: '#e2e8f0', background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', fontStyle: 'italic', margin: '1rem 0', lineHeight: 1.5 }}>
                  "{item.story}"
                </p>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <small style={{ fontWeight: 700, color: '#e2e8f0' }}>Key Skills Needed:</small>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {item.skillsNeeded.map((skill, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: 700 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Smart Scholarship Matcher */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.5rem', fontWeight: 800 }}>
                2. Smart Scholarship Matcher
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#e2e8f0', margin: '0.3rem 0 0 0' }}>
                Filter government scholarship schemes based on category and family income.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.4)', padding: '0.5rem 1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>Category: </label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ background: 'transparent', color: '#ffffff', border: 'none', fontWeight: 800, outline: 'none', cursor: 'pointer' }}>
                <option value="all" style={{ background: '#0f172a', color: '#fff' }}>All Categories</option>
                <option value="ebc" style={{ background: '#0f172a', color: '#fff' }}>EBC / General</option>
                <option value="sc_st" style={{ background: '#0f172a', color: '#fff' }}>SC / ST</option>
                <option value="minority" style={{ background: '#0f172a', color: '#fff' }}>Minority</option>
              </select>
            </div>
          </div>

          {/* Scholarships Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredScholarships.map((sch) => (
              <div key={sch.id} style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>{sch.name}</h3>
                  <p style={{ margin: '0.4rem 0', fontWeight: 800, color: '#38bdf8', fontSize: '1.15rem' }}>
                    Benefit: {sch.amount}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.5 }}>
                    Eligibility: {sch.eligibilityText}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <span style={{ color: '#e0f2fe', fontWeight: 700 }}>Deadline: {sch.deadline}</span>
                  <button 
                    onClick={() => setApplyModal(sch)}
                    style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: College Comparison Table */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8', paddingLeft: '0.75rem' }}>
          3. College Fee Concession & Cutoff Finder
        </h2>
        
        <div style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '16px',
          overflowX: 'auto',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(2, 132, 199, 0.4)', color: '#ffffff', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <th style={{ padding: '1.1rem' }}>College Name</th>
                <th style={{ padding: '1.1rem' }}>Type</th>
                <th style={{ padding: '1.1rem' }}>Annual Fees</th>
                <th style={{ padding: '1.1rem' }}>EBC Concession Fee</th>
                <th style={{ padding: '1.1rem' }}>Cutoff</th>
                <th style={{ padding: '1.1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((col) => (
                <tr key={col.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <td style={{ padding: '1.1rem' }}>
                    <strong style={{ color: '#ffffff' }}>{col.name}</strong><br />
                    <small style={{ color: '#e2e8f0' }}>{col.location}</small>
                  </td>
                  <td style={{ padding: '1.1rem', color: '#ffffff' }}>{col.type}</td>
                  <td style={{ padding: '1.1rem', color: '#ffffff' }}>{col.fees}</td>
                  <td style={{ padding: '1.1rem', color: '#38bdf8', fontWeight: 800 }}>{col.concession}</td>
                  <td style={{ padding: '1.1rem', color: '#ffffff' }}>{col.cutoff}</td>
                  <td style={{ padding: '1.1rem' }}>
                    <button 
                      onClick={() => setSelectedCollege(col)}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.4)', color: '#ffffff', borderRadius: '8px' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: Skill Academy Video Courses */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8', paddingLeft: '0.75rem' }}>
          4. Free Vocational & Technical Skill Academy
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <div key={course.id} style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <div style={{ background: 'rgba(2, 132, 199, 0.3)', padding: '1.5rem 1rem', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ fontSize: '2.4rem' }}>
                    {course.category === 'tech' ? '💻' : course.category === 'business' ? '📱' : course.category === 'agri' ? '🌾' : '☀️'}
                  </div>
                  <h3 style={{ margin: '0.5rem 0 0 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>{course.title}</h3>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    <span>⏱️ {course.duration}</span>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>⭐ {course.rating} / 5</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#e2e8f0', height: '48px', overflow: 'hidden', lineHeight: 1.5 }}>
                    {course.description}
                  </p>

                  <small style={{ color: '#ffffff', fontWeight: 700, display: 'block', marginTop: '0.85rem' }}>
                    Instructor: {course.instructor}
                  </small>
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                {enrolledMap[course.id] ? (
                  <button 
                    onClick={() => setActiveCourse(course)}
                    style={{ width: '100%', padding: '0.7rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
                  >
                    ▶️ Resume Learning
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.4)', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
                  >
                    Free Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College Detail Modal */}
      {selectedCollege && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '2rem', borderRadius: '16px', maxWidth: '520px', width: '90%', color: '#ffffff' }}>
            <h3 style={{ color: '#ffffff', margin: '0 0 1rem 0' }}>{selectedCollege.name}</h3>
            <p style={{ color: '#e2e8f0' }}><strong>Location:</strong> {selectedCollege.location}</p>
            <p style={{ color: '#e2e8f0' }}><strong>Annual Fees:</strong> {selectedCollege.fees} (After EBC: <span style={{ color: '#38bdf8', fontWeight: 800 }}>{selectedCollege.concession}</span>)</p>
            <p style={{ color: '#e2e8f0' }}><strong>Cutoff:</strong> {selectedCollege.cutoff}</p>
            <p style={{ color: '#e2e8f0' }}><strong>Top Recruiters:</strong> {selectedCollege.topRecruiters}</p>
            <button onClick={() => setSelectedCollege(null)} style={{ padding: '0.6rem 1.4rem', marginTop: '1.25rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>Close</button>
          </div>
        </div>
      )}

      {/* Video Course Modal */}
      {activeCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '1.5rem', borderRadius: '16px', maxWidth: '680px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff' }}>{activeCourse.title}</h3>
              <button onClick={() => setActiveCourse(null)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src={`https://www.youtube.com/embed/${activeCourse.youtubeVideoId}`}
                title={activeCourse.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Apply Success Modal */}
      {applyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '2rem', borderRadius: '16px', maxWidth: '460px', width: '90%', textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '3rem' }}>✅</div>
            <h3 style={{ color: '#38bdf8', margin: '0.75rem 0' }}>Application Pre-filled!</h3>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>Your application for <strong>{applyModal.name}</strong> has been routed to Digital Seva Kendra portal.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <button onClick={() => setApplyModal(null)} style={{ padding: '0.6rem 1.5rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
