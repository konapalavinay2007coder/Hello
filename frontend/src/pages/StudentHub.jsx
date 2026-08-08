import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { careerPaths, scholarships, colleges } from '../data/studentHub';
import { courses } from '../data/courses';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function StudentHub() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language]?.student || translations.en.student;

  // State for active stage selection: null (show 3 cards overview), 'discover', 'choose', 'fund', 'prepare'
  const [activeStage, setActiveStage] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [enrolledMap, setEnrolledMap] = useState({});

  // Page Segmentation state for College Finder (3x2 grid = 6 layouts per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(colleges.length / itemsPerPage);
  const paginatedColleges = colleges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Page Segmentation state for Scholarships (3x2 grid = 6 layouts per page)
  const [scholarshipPage, setScholarshipPage] = useState(1);
  const schItemsPerPage = 6;

  const sectionContainerRef = useRef(null);

  const handleSelectStage = (stageKey) => {
    setActiveStage(stageKey);
    setTimeout(() => {
      sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCategoryChange = (catKey) => {
    setSelectedCategory(catKey);
    setScholarshipPage(1);
  };

  const filteredScholarships = scholarships.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory && s.category !== 'general') return false;
    return true;
  });

  const schTotalPages = Math.max(1, Math.ceil(filteredScholarships.length / schItemsPerPage));
  const paginatedScholarships = filteredScholarships.slice((scholarshipPage - 1) * schItemsPerPage, scholarshipPage * schItemsPerPage);

  const handleEnroll = (courseId) => {
    setEnrolledMap({ ...enrolledMap, [courseId]: true });
  };

  return (
    <div style={{ width: '100%', padding: '0 3rem 6rem 3rem', fontFamily: "'Atkinson Hyperlegible', sans-serif", background: '#ffffff', minHeight: '100vh' }}>
      
      {/* ========================================================================= */}
      {/* HERO SECTION: WHITE BACKGROUND & BENTO ASYMMETRIC SKY BLUE LAYOUTS         */}
      {/* ========================================================================= */}
      <div style={{
        width: '100%',
        minHeight: 'calc(100vh - 90px)',
        padding: '2rem 0 3.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        
        {/* Uppercase Category Subtitle */}
        <div style={{
          color: '#0284c7',
          fontWeight: 800,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '0.75rem'
        }}>
          THE HELLO STUDENT ADVANTAGE
        </div>

        {/* Main Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
          fontWeight: 800,
          color: '#062C4D',
          margin: '0 0 2.5rem 0',
          letterSpacing: '-1.5px',
          lineHeight: 1.12,
          maxWidth: '900px'
        }}>
          Build the future <span style={{
            background: 'linear-gradient(90deg, #0284c7 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>you want.</span>
        </h1>



        {/* ========================================================================= */}
        {/* BENTO GRID SKY BLUE LAYOUTS (ASYYMETRIC REFERENCED DESIGN)                */}
        {/* ========================================================================= */}
        <div style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1.75rem',
          textAlign: 'left'
        }}>
          
          {/* TALL LEFT SKY BLUE CARD: Find My Career (Spans 6 cols, full height) */}
          <div
            onClick={() => handleSelectStage('discover')}
            style={{
              gridColumn: 'span 6',
              background: activeStage === 'discover' 
                ? 'linear-gradient(135deg, #c7e2fe 0%, #a5d4ff 100%)' 
                : 'linear-gradient(135deg, #EBF3fa 0%, #D8E8F5 100%)',
              border: activeStage === 'discover' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
              borderRadius: '28px',
              padding: '2.75rem 2.25rem',
              cursor: 'pointer',
              boxShadow: '0 16px 40px rgba(2, 132, 199, 0.08)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              minHeight: '480px'
            }}
          >
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  CAREER DISCOVERY
                </span>
              </div>

              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.85rem 0', letterSpacing: '-0.5px' }}>
                Find My Career
              </h3>
              <p style={{ fontSize: '1.08rem', color: '#062C4D', margin: '0 0 2rem 0', lineHeight: 1.6, opacity: 0.88 }}>
                Explore high-growth tech, solar & agronomist roles, salary benchmarks, and required skill roadmaps tailored for rural innovators.
              </p>
            </div>

            {/* Embedded Sky Blue Visual Graphic Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.35rem 1.5rem',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.1)',
              marginBottom: '1.75rem'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.5rem' }}>
                POPULAR ROLES & SALARIES
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', color: '#062C4D', padding: '0.35rem 0', borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontWeight: 700 }}>Full-Stack Web Dev</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>₹6.5 LPA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', color: '#062C4D', padding: '0.35rem 0', borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontWeight: 700 }}>Soil & Agronomy Expert</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>₹4.6 LPA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', color: '#062C4D', paddingTop: '0.35rem' }}>
                <span style={{ fontWeight: 700 }}>Solar & ITI Technician</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>₹3.6 LPA</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 800, fontSize: '1.05rem' }}>
              <span>Discover Paths</span>
              <span>➔</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 STACKED SKY BLUE CARDS (Spans 6 cols) */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Top Right Card: Find My College */}
            <div
              onClick={() => handleSelectStage('choose')}
              style={{
                flex: 1,
                background: activeStage === 'choose' 
                  ? 'linear-gradient(135deg, #c7e2fe 0%, #a5d4ff 100%)' 
                  : 'linear-gradient(135deg, #EBF3fa 0%, #D8E8F5 100%)',
                border: activeStage === 'choose' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
                borderRadius: '28px',
                padding: '2.25rem 2rem',
                cursor: 'pointer',
                boxShadow: '0 16px 40px rgba(2, 132, 199, 0.08)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    COLLEGE FINDER
                  </span>
                </div>

                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.65rem 0', letterSpacing: '-0.5px' }}>
                  Find My College
                </h3>
                <p style={{ fontSize: '1.02rem', color: '#062C4D', margin: 0, lineHeight: 1.6, opacity: 0.88 }}>
                  Filter government & private institutes by entrance cutoffs, top recruiters, and 50% EBC fee waiver eligibility.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.85rem', color: '#0284c7', fontWeight: 800, fontSize: '1.02rem' }}>
                <span>Explore Colleges</span>
                <span>➔</span>
              </div>
            </div>

            {/* Bottom Right Card: Find Scholarships */}
            <div
              onClick={() => handleSelectStage('fund')}
              style={{
                flex: 1,
                background: activeStage === 'fund' 
                  ? 'linear-gradient(135deg, #c7e2fe 0%, #a5d4ff 100%)' 
                  : 'linear-gradient(135deg, #EBF3fa 0%, #D8E8F5 100%)',
                border: activeStage === 'fund' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
                borderRadius: '28px',
                padding: '2.25rem 2rem',
                cursor: 'pointer',
                boxShadow: '0 16px 40px rgba(2, 132, 199, 0.08)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    SCHOLARSHIP MATCHING
                  </span>
                </div>

                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.65rem 0', letterSpacing: '-0.5px' }}>
                  Find Scholarships
                </h3>
                <p style={{ fontSize: '1.02rem', color: '#062C4D', margin: 0, lineHeight: 1.6, opacity: 0.88 }}>
                  Get matched with ₹15,000 to ₹60,000/yr government schemes with instant Digital Seva pre-filled applications.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.85rem', color: '#0284c7', fontWeight: 800, fontSize: '1.02rem' }}>
                <span>Match Funding</span>
                <span>➔</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION CONTENT DISPLAY AREA (REVEALED ONLY WHEN A CARD IS SELECTED)       */}
      {/* ========================================================================= */}
      <div ref={sectionContainerRef} style={{ scrollMarginTop: '100px' }}>
        
        {/* SECTION 1: FIND MY CAREER */}
        {activeStage === 'discover' && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-1.2px', lineHeight: 1.15 }}>
                Explore High-Demand Career Paths
              </h2>
              <p style={{ color: '#4D8FC7', margin: '0.6rem 0 0 0', fontSize: '1.2rem', fontWeight: 500 }}>
                Real stories, growth benchmarks, and skills required for rural and semi-urban innovators.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.75rem' }}>
              {careerPaths.map((item) => (
                <div key={item.id} style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '1.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 8px 30px rgba(2, 132, 199, 0.06)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: '#062C4D', fontSize: '1.35rem', fontWeight: 800 }}>{item.title}</h3>
                      <span style={{ fontSize: '0.78rem', background: '#e0f2fe', border: '1px solid #0284c7', color: '#0284c7', padding: '0.25rem 0.7rem', borderRadius: '9999px', fontWeight: 800 }}>
                        {item.growth}
                      </span>
                    </div>

                    <p style={{ fontSize: '1.15rem', margin: '0.5rem 0 1rem 0', fontWeight: 800, color: '#0284c7' }}>
                      {t.avgSalary} {item.avgSalary}
                    </p>

                    <div style={{ margin: '1.25rem 0' }}>
                      <button
                        onClick={() => setApplyModal({ name: item.title, amount: item.avgSalary, deadline: 'Open Enrollment' })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1.25rem',
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Apply Now ➔
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                    <small style={{ fontWeight: 800, color: '#062C4D', fontSize: '0.82rem' }}>{t.skillsNeeded}</small>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.45rem' }}>
                      {item.skillsNeeded.map((skill, idx) => (
                        <span key={idx} style={{ fontSize: '0.8rem', background: '#e0f2fe', border: '1px solid #cbd5e1', color: '#062C4D', padding: '0.25rem 0.7rem', borderRadius: '6px', fontWeight: 700 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: FIND MY COLLEGE */}
        {activeStage === 'choose' && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-1.2px', lineHeight: 1.15 }}>
                Smart College & Fee Concession Finder
              </h2>
              <p style={{ color: '#4D8FC7', margin: '0.6rem 0 0 0', fontSize: '1.2rem', fontWeight: 500 }}>
                Compare cutoff percentiles and 50% EBC fee waivers across top government and private institutes.
              </p>
            </div>

            {/* 3x2 Layout Grid per Page (6 cards per page in 3 columns x 2 rows) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {paginatedColleges.map((col) => (
                <div key={col.id} style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '1.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 8px 30px rgba(2, 132, 199, 0.06)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, color: '#062C4D', fontSize: '1.2rem', fontWeight: 800 }}>{col.name}</h3>
                      <span style={{ fontSize: '0.72rem', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#4D8FC7', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700, flexShrink: 0 }}>
                        {col.type}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#4D8FC7', margin: '0 0 1rem 0' }}>
                      Location: {col.location}
                    </p>

                    <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#4D8FC7', marginBottom: '0.35rem' }}>
                        <span>Annual Fees:</span>
                        <span style={{ fontWeight: 700, color: '#062C4D' }}>{col.fees}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#0284c7', fontWeight: 800 }}>
                        <span>With EBC Concession:</span>
                        <span>{col.concession}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#4D8FC7', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed #e2e8f0' }}>
                        <span>Entrance Cutoff:</span>
                        <span style={{ fontWeight: 700, color: '#062C4D' }}>{col.cutoff}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCollege(col)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#062C4D',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    View Full Details & Placement ➔
                  </button>
                </div>
              ))}
            </div>

            {/* Page Segmentation Controls (1, 2, 3, 4) */}
            <div style={{
              display: 'flex',
              justify: 'center',
              alignItems: 'center',
              gap: '0.6rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#062C4D',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ‹ Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    border: currentPage === page ? 'none' : '1.5px solid #cbd5e1',
                    background: currentPage === page ? 'linear-gradient(135deg, #0284c7, #1d4ed8)' : '#ffffff',
                    color: currentPage === page ? '#ffffff' : '#062C4D',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: currentPage === page ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#062C4D',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next ›
              </button>
            </div>
          </section>
        )}

        {/* SECTION 3: FIND SCHOLARSHIPS */}
        {activeStage === 'fund' && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, color: '#062C4D', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.15 }}>
                  Government & Private Scholarships
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#4D8FC7', margin: '0.6rem 0 0 0', fontWeight: 500 }}>
                  Select your category to filter eligible schemes with instant Digital Seva pre-filled application.
                </p>
              </div>

              {/* Category Filter Buttons */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.35rem', borderRadius: '9999px', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '9999px',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: selectedCategory === 'all' ? '#0284c7' : 'transparent',
                      color: selectedCategory === 'all' ? '#ffffff' : '#062C4D'
                    }}
                  >
                    {t.allCat}
                  </button>
                  <button
                    onClick={() => handleCategoryChange('ebc')}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '9999px',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: selectedCategory === 'ebc' ? '#0284c7' : 'transparent',
                      color: selectedCategory === 'ebc' ? '#ffffff' : '#062C4D'
                    }}
                  >
                    {t.ebcCat}
                  </button>
                  <button
                    onClick={() => handleCategoryChange('sc_st')}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '9999px',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: selectedCategory === 'sc_st' ? '#0284c7' : 'transparent',
                      color: selectedCategory === 'sc_st' ? '#ffffff' : '#062C4D'
                    }}
                  >
                    {t.scstCat}
                  </button>
                  <button
                    onClick={() => handleCategoryChange('minority')}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '9999px',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: selectedCategory === 'minority' ? '#0284c7' : 'transparent',
                      color: selectedCategory === 'minority' ? '#ffffff' : '#062C4D'
                    }}
                  >
                    {t.minCat}
                  </button>
                </div>
              </div>

              {/* 3x2 Scholarships Grid Cards (6 per page) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {paginatedScholarships.map((sch) => (
                  <div key={sch.id} style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '1.65rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 8px 30px rgba(2, 132, 199, 0.06)'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#062C4D', fontSize: '1.2rem', fontWeight: 800 }}>{sch.name}</h3>
                      <p style={{ margin: '0.4rem 0', fontWeight: 800, color: '#0284c7', fontSize: '1.15rem' }}>
                        {t.benefit} {sch.amount}
                      </p>
                      <p style={{ fontSize: '0.88rem', color: '#4D8FC7', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.5 }}>
                        <strong>{t.eligibility}</strong> {sch.eligibilityText}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#4D8FC7', fontWeight: 700 }}>Deadline: {sch.deadline}</span>
                      <button 
                        onClick={() => setApplyModal(sch)}
                        style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
                      >
                        {t.applyNow}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Page Segmentation Controls for Scholarships (1, 2, 3, 4) */}
              <div style={{
                display: 'flex',
                justify: 'center',
                alignItems: 'center',
                gap: '0.6rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => {
                    setScholarshipPage(prev => Math.max(prev - 1, 1));
                    sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={scholarshipPage === 1}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: scholarshipPage === 1 ? '#f1f5f9' : '#ffffff',
                    color: scholarshipPage === 1 ? '#94a3b8' : '#062C4D',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: scholarshipPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ‹ Previous
                </button>

                {Array.from({ length: schTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setScholarshipPage(page);
                      sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      border: scholarshipPage === page ? 'none' : '1.5px solid #cbd5e1',
                      background: scholarshipPage === page ? 'linear-gradient(135deg, #0284c7, #1d4ed8)' : '#ffffff',
                      color: scholarshipPage === page ? '#ffffff' : '#062C4D',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: scholarshipPage === page ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setScholarshipPage(prev => Math.min(prev + 1, schTotalPages));
                    sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={scholarshipPage === schTotalPages}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: scholarshipPage === schTotalPages ? '#f1f5f9' : '#ffffff',
                    color: scholarshipPage === schTotalPages ? '#94a3b8' : '#062C4D',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: scholarshipPage === schTotalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next ›
                </button>
              </div>
          </section>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: COLLEGE DETAIL DRAWER                                            */}
      {/* ========================================================================= */}
      {selectedCollege && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 44, 77, 0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2.25rem', borderRadius: '24px', maxWidth: '540px', width: '90%', color: '#062C4D', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ color: '#062C4D', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>{selectedCollege.name}</h3>
              <button onClick={() => setSelectedCollege(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#062C4D' }}>✕</button>
            </div>
            
            <p style={{ color: '#4D8FC7', margin: '0.4rem 0' }}><strong>Location:</strong> {selectedCollege.location}</p>
            <p style={{ color: '#4D8FC7', margin: '0.4rem 0' }}><strong>Type:</strong> {selectedCollege.type}</p>
            <p style={{ color: '#4D8FC7', margin: '0.4rem 0' }}><strong>Standard Annual Fees:</strong> {selectedCollege.fees}</p>
            <p style={{ color: '#0284c7', fontWeight: 800, margin: '0.4rem 0' }}><strong>After EBC Concession:</strong> {selectedCollege.concession}</p>
            <p style={{ color: '#4D8FC7', margin: '0.4rem 0' }}><strong>Cutoff Percentile:</strong> {selectedCollege.cutoff}</p>
            <p style={{ color: '#4D8FC7', margin: '0.4rem 0 1.5rem 0' }}><strong>Top Campus Recruiters:</strong> {selectedCollege.topRecruiters}</p>

            <button onClick={() => setSelectedCollege(null)} style={{ width: '100%', padding: '0.75rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800 }}>
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INSTANT PRE-FILL APPLICATION CONFIRMATION                        */}
      {/* ========================================================================= */}
      {applyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 44, 77, 0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2.25rem', borderRadius: '24px', maxWidth: '480px', width: '90%', textAlign: 'center', color: '#062C4D', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ color: '#0284c7', margin: '0.5rem 0', fontSize: '1.4rem', fontWeight: 800 }}>Application Pre-filled!</h3>
            <p style={{ color: '#4D8FC7', fontSize: '0.95rem', lineHeight: 1.55 }}>
              Your verified profile details for <strong>{applyModal.name}</strong> have been routed to the official Digital Seva Kendra portal.
            </p>
            <div style={{ marginTop: '1.75rem' }}>
              <button onClick={() => setApplyModal(null)} style={{ padding: '0.75rem 2rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800 }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
