import React, { useState } from 'react';
import { businessIdeas, loanOptions } from '../data/entrepreneurHub';

export default function EntrepreneurHub() {
  const [selectedBudget, setSelectedBudget] = useState('0_5000');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [listingSuccess, setListingSuccess] = useState(false);
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const filteredIdeas = businessIdeas.filter(item => {
    if (selectedBudget !== 'all' && item.budgetCategory !== selectedBudget) return false;
    if (selectedSkill !== 'all' && item.skillCategory !== selectedSkill) return false;
    return true;
  });

  const handlePublishListing = (e) => {
    e.preventDefault();
    if (!productTitle) return;
    setListingSuccess(true);
    setTimeout(() => {
      setListingSuccess(false);
      setProductTitle('');
      setProductPrice('');
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'var(--font-family)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-pill" style={{ marginBottom: '0.75rem' }}>
          <span>💼</span>
          <span>ENTREPRENEURSHIP HUB</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
          Micro-Business & Rural Marketplace
        </h2>
        <p style={{ color: '#94a3b8', margin: '0.4rem 0 0 0', fontSize: '1rem' }}>
          Discover low-investment business ideas, apply for Mudra loans, and list your handmade/agri products.
        </p>
      </div>

      {/* 1. Low-Investment Business Idea Generator */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'rgba(192, 132, 252, 0.3)' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#c084fc', fontSize: '1.4rem', fontWeight: 700 }}>
            1. Micro-Business Idea Generator
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: 0 }}>Select your available investment budget and skill set:</p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', margin: '1.25rem 0' }}>
            <div className="glass-panel" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Budget: </label>
              <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)} style={{ background: 'transparent', color: '#c084fc', border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
                <option value="all" style={{ background: '#0f172a', color: '#fff' }}>Any Investment</option>
                <option value="0_5000" style={{ background: '#0f172a', color: '#fff' }}>₹0 - ₹5,000 (Micro Startup)</option>
                <option value="5000_20000" style={{ background: '#0f172a', color: '#fff' }}>₹5,000 - ₹20,000 (Small Unit)</option>
                <option value="20000_50000" style={{ background: '#0f172a', color: '#fff' }}>₹20,000 - ₹50,000 (Commercial Bed)</option>
              </select>
            </div>

            <div className="glass-panel" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Skill: </label>
              <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} style={{ background: 'transparent', color: '#c084fc', border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
                <option value="all" style={{ background: '#0f172a', color: '#fff' }}>All Skills</option>
                <option value="tailoring" style={{ background: '#0f172a', color: '#fff' }}>Tailoring & Crafts</option>
                <option value="cooking" style={{ background: '#0f172a', color: '#fff' }}>Food & Pickles</option>
                <option value="electrical" style={{ background: '#0f172a', color: '#fff' }}>Solar & Electrical</option>
                <option value="farming" style={{ background: '#0f172a', color: '#fff' }}>Organic Farming</option>
              </select>
            </div>
          </div>

          {/* Business Ideas Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            {filteredIdeas.map((idea) => (
              <div key={idea.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontSize: '1.15rem' }}>{idea.name}</h4>
                <p style={{ margin: '0.3rem 0', fontWeight: 800, color: '#34d399', fontSize: '1.1rem' }}>
                  Est. Income: {idea.monthlyIncome}
                </p>
                <small style={{ color: '#94a3b8' }}>Initial Investment: {idea.investment} | ROI: {idea.roiPeriod}</small>
                
                <div style={{ marginTop: '0.85rem', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#c084fc' }}>Execution Plan:</strong>
                  <ol style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.2rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {idea.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Rural Marketplace Product Listing Simulator */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#38bdf8', fontSize: '1.4rem', fontWeight: 700 }}>
            2. Sell on Rural Digital Seva Marketplace
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Post your homemade pickles, handicraft, or vermicompost to sell directly to buyers in your district.
          </p>

          <form onSubmit={handlePublishListing} style={{ display: 'grid', gap: '1rem', maxWidth: '540px', marginTop: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>Product Title: </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Homemade Mango Pickle 500g Jar" 
                value={productTitle} 
                onChange={(e) => setProductTitle(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>Selling Price (₹): </label>
              <input 
                type="text" 
                required
                placeholder="e.g. ₹150 per jar" 
                value={productPrice} 
                onChange={(e) => setProductPrice(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #c084fc, #a855f7)', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '0.95rem' }}>
              🚀 Publish to Marketplace
            </button>
          </form>

          {listingSuccess && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', color: '#34d399', borderRadius: '8px', fontWeight: 600 }}>
              🎉 Product <strong>"{productTitle}"</strong> published successfully to Marketplace!
            </div>
          )}
        </div>
      </section>

      {/* 3. Mudra Loan & Capital Finder */}
      <section>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', marginBottom: '1.25rem', borderLeft: '4px solid #34d399', paddingLeft: '0.75rem' }}>
          3. Mudra & Government Business Loans
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {loanOptions.map((loan) => (
            <div key={loan.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontSize: '1.2rem' }}>{loan.name}</h4>
              <p style={{ fontWeight: 800, color: '#34d399', margin: '0.3rem 0', fontSize: '1.1rem' }}>
                Max Amount: {loan.maxAmount}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0.2rem 0' }}>Interest: {loan.interestRate}</p>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0.2rem 0' }}>Collateral: <strong>{loan.collateral}</strong></p>
              <a href={loan.applyLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, display: 'inline-block', marginTop: '0.75rem', textDecoration: 'none' }}>
                Apply at Bank Portal →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
