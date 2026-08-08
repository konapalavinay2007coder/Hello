import React, { useState, useRef } from 'react';
import { businessIdeas, loanOptions } from '../data/entrepreneurHub';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function EntrepreneurHub() {
  const { language } = useLanguage();
  const t = translations[language]?.entrepreneur || translations.en.entrepreneur;

  // Active stage state: null (show 3 cards overview), 'discover', 'sell', 'fund'
  const [activeStage, setActiveStage] = useState(null);
  
  // Business Ideas Filter state
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [expandedIdeaId, setExpandedIdeaId] = useState(null);

  // Marketplace Form state
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Crafts');
  const [listingSuccess, setListingSuccess] = useState(false);

  const sectionContainerRef = useRef(null);

  const handleSelectStage = (stageKey) => {
    setActiveStage(stageKey);
    setTimeout(() => {
      sectionContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const filteredIdeas = businessIdeas.filter(item => {
    if (selectedBudget !== 'all' && item.budgetCategory !== selectedBudget) return false;
    if (selectedSkill !== 'all' && item.skillCategory !== selectedSkill) return false;
    return true;
  });

  const handlePublishListing = (e) => {
    e.preventDefault();
    if (!productTitle.trim() || !productPrice.trim()) return;
    setListingSuccess(true);
    setTimeout(() => {
      setListingSuccess(false);
      setProductTitle('');
      setProductPrice('');
    }, 4000);
  };

  const toggleExpandIdea = (id) => {
    setExpandedIdeaId(expandedIdeaId === id ? null : id);
  };

  return (
    <div style={{ width: '100%', padding: '0 3rem 6rem 3rem', fontFamily: "'Atkinson Hyperlegible', sans-serif", background: '#ffffff', minHeight: '100vh' }}>
      
      {/* ========================================================================= */}
      {/* HERO SECTION: FOCUSED ON ONE GOAL                                         */}
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
        
        {/* Uppercase Category Badge */}
        <div style={{
          color: '#0284c7',
          fontWeight: 800,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '0.75rem'
        }}>
          RURAL BUSINESS & MICRO-ENTERPRISE HUB
        </div>

        {/* Main Single Goal Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
          fontWeight: 800,
          color: '#062C4D',
          margin: '0 0 2.5rem 0',
          letterSpacing: '-1.5px',
          lineHeight: 1.12,
          maxWidth: '920px'
        }}>
          Turn your skills into <span style={{
            background: 'linear-gradient(90deg, #0284c7 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>sustainable income.</span>
        </h1>

        {/* ========================================================================= */}
        {/* THREE LARGE BENTO SKY BLUE GOAL CARDS                                     */}
        {/* ========================================================================= */}
        <div style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1.75rem',
          textAlign: 'left'
        }}>
          
          {/* TALL LEFT SKY BLUE CARD: Find a Business Idea (Spans 6 cols) */}
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
                  DISCOVER & START
                </span>
              </div>

              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.85rem 0', letterSpacing: '-0.5px' }}>
                Find a Business Idea
              </h3>
              <p style={{ fontSize: '1.08rem', color: '#062C4D', margin: '0 0 2rem 0', lineHeight: 1.6, opacity: 0.88 }}>
                Explore low-investment micro-enterprises tailored for your skills, complete with monthly income benchmarks and ROI estimates.
              </p>
            </div>

            {/* Embedded Sky Blue Visual Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.35rem 1.5rem',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.1)',
              marginBottom: '1.75rem'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.5rem' }}>
                POPULAR RURAL VENTURES
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', color: '#062C4D', padding: '0.35rem 0', borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontWeight: 700 }}>Solar & Battery Servicing</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>₹28,000/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', color: '#062C4D', padding: '0.35rem 0', borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontWeight: 700 }}>Tailoring & Eco-Bags</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>₹18,000/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', color: '#062C4D', paddingTop: '0.35rem' }}>
                <span style={{ fontWeight: 700 }}>Organic Fertilizer Unit</span>
                <span style={{ fontWeight: 800, color: '#0284c7' }}>₹22,000/mo</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 800, fontSize: '1.05rem' }}>
              <span>Explore Ideas</span>
              <span>➔</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 STACKED SKY BLUE CARDS (Spans 6 cols) */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Top Right Card: Sell My Product */}
            <div
              onClick={() => handleSelectStage('sell')}
              style={{
                flex: 1,
                background: activeStage === 'sell' 
                  ? 'linear-gradient(135deg, #c7e2fe 0%, #a5d4ff 100%)' 
                  : 'linear-gradient(135deg, #EBF3fa 0%, #D8E8F5 100%)',
                border: activeStage === 'sell' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
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
                    MARKETPLACE SIMULATOR
                  </span>
                </div>

                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.65rem 0', letterSpacing: '-0.5px' }}>
                  Sell My Product
                </h3>
                <p style={{ fontSize: '1.02rem', color: '#062C4D', margin: 0, lineHeight: 1.6, opacity: 0.88 }}>
                  Pre-list your handmade pickles, handicrafts, or solar items for local village buyers in 3 simple guided steps.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.85rem', color: '#0284c7', fontWeight: 800, fontSize: '1.02rem' }}>
                <span>List Product</span>
                <span>➔</span>
              </div>
            </div>

            {/* Bottom Right Card: Find Funding */}
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
                    MUDRA CAPITAL FINDER
                  </span>
                </div>

                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.65rem 0', letterSpacing: '-0.5px' }}>
                  Find Funding
                </h3>
                <p style={{ fontSize: '1.02rem', color: '#062C4D', margin: 0, lineHeight: 1.6, opacity: 0.88 }}>
                  Compare Mudra Shishu, Kishor, and Tarun collateral-free loans with low interest rates for micro-capital.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.85rem', color: '#0284c7', fontWeight: 800, fontSize: '1.02rem' }}>
                <span>Compare Loans</span>
                <span>➔</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION CONTENT DISPLAY AREA (REVEALED ON DEMAND FOR SELECTED TASK)        */}
      {/* ========================================================================= */}
      <div ref={sectionContainerRef} style={{ scrollMarginTop: '100px' }}>
        
        {/* TASK 1: FIND A BUSINESS IDEA */}
        {activeStage === 'discover' && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-1.2px', lineHeight: 1.15 }}>
                Low-Investment Business Generator
              </h2>
              <p style={{ color: '#4D8FC7', margin: '0.6rem 0 0 0', fontSize: '1.2rem', fontWeight: 500 }}>
                Filter by your available budget and skill area to discover proven micro-enterprise roadmaps.
              </p>

              {/* Guided Filters Row */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.5rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 1.1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.88rem', color: '#4D8FC7', fontWeight: 700 }}>Initial Investment:</label>
                  <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)} style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 800, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                    <option value="all">Any Budget</option>
                    <option value="0_5000">₹0 - ₹5,000</option>
                    <option value="5000_20000">₹5,000 - ₹20,000</option>
                    <option value="20000_50000">₹20,000 - ₹50,000</option>
                  </select>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 1.1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.88rem', color: '#4D8FC7', fontWeight: 700 }}>Skill Focus:</label>
                  <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} style={{ background: 'transparent', color: '#0284c7', border: 'none', fontWeight: 800, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                    <option value="all">All Skills</option>
                    <option value="tailoring">Tailoring & Crafts</option>
                    <option value="cooking">Food & Pickles</option>
                    <option value="electrical">Solar & Electrical</option>
                    <option value="farming">Organic Farming</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2 Grids Per Row Business Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.75rem' }}>
              {filteredIdeas.map((idea) => {
                const isExpanded = expandedIdeaId === idea.id;
                return (
                  <div key={idea.id} style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '20px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 8px 30px rgba(2, 132, 199, 0.06)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <h3 style={{ margin: 0, color: '#062C4D', fontSize: '1.4rem', fontWeight: 800 }}>{idea.name}</h3>
                        <span style={{ fontSize: '0.78rem', background: '#e0f2fe', border: '1px solid #0284c7', color: '#0284c7', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontWeight: 800 }}>
                          ROI: {idea.roiPeriod}
                        </span>
                      </div>

                      <p style={{ margin: '0.4rem 0 1rem 0', fontWeight: 800, color: '#0284c7', fontSize: '1.25rem' }}>
                        Estimated Income: {idea.monthlyIncome}
                      </p>

                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4D8FC7' }}>
                          <span>Initial Capital Needed:</span>
                          <span style={{ fontWeight: 800, color: '#062C4D' }}>{idea.investment}</span>
                        </div>
                      </div>

                      {/* Progressive Disclosure: 4-Step Execution Plan on Demand */}
                      {isExpanded && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.92rem' }}>
                          <strong style={{ color: '#062C4D', display: 'block', marginBottom: '0.5rem' }}>4-Step Execution Roadmap:</strong>
                          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#4D8FC7', lineHeight: 1.6 }}>
                            {idea.steps.map((step, idx) => (
                              <li key={idx} style={{ marginBottom: '0.35rem' }}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpandIdea(idea.id)}
                      style={{
                        width: '100%',
                        marginTop: '1.25rem',
                        padding: '0.75rem',
                        background: isExpanded ? '#062C4D' : '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: isExpanded ? '#ffffff' : '#062C4D',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isExpanded ? 'Hide Roadmap ▲' : 'View 4-Step Execution Plan ➔'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TASK 2: SELL MY PRODUCT */}
        {activeStage === 'sell' && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 12px 35px rgba(2, 132, 199, 0.08)' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#062C4D', margin: '0 0 0.5rem 0' }}>
                Rural Marketplace Listing Form
              </h2>
              <p style={{ color: '#4D8FC7', fontSize: '1.05rem', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
                Pre-list your produce, pickles, or handicrafts to connect directly with local buyers.
              </p>

              <form onSubmit={handlePublishListing} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#062C4D', marginBottom: '0.45rem' }}>
                    1. Product Category
                  </label>
                  <select 
                    value={productCategory} 
                    onChange={(e) => setProductCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#062C4D', fontWeight: 700, fontSize: '0.98rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <option value="Food & Pickles">Food & Pickles</option>
                    <option value="Crafts & Textiles">Crafts & Textiles</option>
                    <option value="Solar & Tech Items">Solar & Tech Equipment</option>
                    <option value="Organic Produce">Organic Farm Produce</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#062C4D', marginBottom: '0.45rem' }}>
                    2. Product Title & Unit Details
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Homemade Mango Pickle 500g Jar" 
                    value={productTitle} 
                    onChange={(e) => setProductTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#062C4D', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#062C4D', marginBottom: '0.45rem' }}>
                    3. Price per Unit (₹)
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. ₹150 per jar" 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#062C4D', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  type="submit" 
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
                    marginTop: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Publish Listing ➔
                </button>
              </form>

              {listingSuccess && (
                <div style={{ marginTop: '1.5rem', padding: '1.1rem', background: '#d1fae5', border: '1px solid #059669', color: '#059669', borderRadius: '14px', fontWeight: 800, fontSize: '0.98rem', textAlign: 'center' }}>
                  Product "{productTitle}" successfully pre-listed on the Rural Marketplace!
                </div>
              )}
            </div>
          </section>
        )}

        {/* TASK 3: FIND FUNDING */}
        {activeStage === 'fund' && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: 800, color: '#062C4D', margin: 0, letterSpacing: '-1.2px', lineHeight: 1.15 }}>
                Mudra Micro-Capital Loans
              </h2>
              <p style={{ color: '#4D8FC7', margin: '0.6rem 0 0 0', fontSize: '1.2rem', fontWeight: 500 }}>
                Compare collateral-free Mudra credit schemes backed by government guarantee.
              </p>
            </div>

            {/* 2 Grids Per Row Loan Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.75rem' }}>
              {loanOptions.map((loan) => (
                <div key={loan.id} style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 8px 30px rgba(2, 132, 199, 0.06)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, color: '#062C4D', fontSize: '1.4rem', fontWeight: 800 }}>{loan.name}</h3>
                      <span style={{ fontSize: '0.78rem', background: '#d1fae5', border: '1px solid #059669', color: '#059669', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontWeight: 800 }}>
                        Collateral-Free
                      </span>
                    </div>

                    <p style={{ margin: '0.4rem 0 1rem 0', fontWeight: 800, color: '#0284c7', fontSize: '1.25rem' }}>
                      Max Amount: {loan.maxAmount}
                    </p>

                    <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4D8FC7', marginBottom: '0.4rem' }}>
                        <span>Interest Rate:</span>
                        <span style={{ fontWeight: 800, color: '#062C4D' }}>{loan.interestRate}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4D8FC7' }}>
                        <span>Collateral Required:</span>
                        <span style={{ fontWeight: 800, color: '#062C4D' }}>{loan.collateral}</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={loan.applyLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      padding: '0.8rem',
                      background: '#0284c7',
                      color: '#ffffff',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                      display: 'block'
                    }}
                  >
                    Apply via Bank Portal ↗
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
