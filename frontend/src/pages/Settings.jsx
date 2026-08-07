import React, { useState } from 'react';

export default function Settings() {
  const [fontSize, setFontSize] = useState('medium');
  const [defaultLanguage, setDefaultLanguage] = useState('hi');

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Settings & Accessibility</h2>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h3>Accessibility Controls</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Font Size Preference: </label>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium (Default)</option>
            <option value="large">Large (High Contrast / Accessible)</option>
            <option value="xlarge">Extra Large ("I can't see the text properly")</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Default Interface Language: </label>
          <select value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)}>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h3>System & Offline Cache Status</h3>
        <p>• Offline Market Data: <span style={{ color: 'green' }}>Synced (Warm)</span></p>
        <p>• Weather Cache: <span style={{ color: 'green' }}>Synced (Warm)</span></p>
        <p>• Government Schemes Seed: <span style={{ color: 'green' }}>15 Schemes Cached</span></p>
      </div>
    </div>
  );
}
