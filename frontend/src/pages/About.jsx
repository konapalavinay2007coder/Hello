import React from 'react';

export default function About() {
  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>About hello — Human-Centered AI for Rural Communities (PS07)</h2>

      <p>
        <strong>hello</strong> is a voice-first, language-first AI advisor designed to provide practical, livelihood-relevant advisory for rural citizens across India.
      </p>

      <hr />

      <h3>Core Design Pillars</h3>
      <ul>
        <li><strong>Language-First:</strong> Voice in regional language goes in; voice in the same language comes out.</li>
        <li><strong>Zero Assumptions on Digital Fluency:</strong> Designed for high contrast, mic + camera interaction.</li>
        <li><strong>Spectrum Connectivity:</strong> Works online with Gemini Flash & Groq Whisper, degrades gracefully to offline MongoDB/WebLLM cached data.</li>
        <li><strong>Livelihood Relevant:</strong> Connects citizens directly to real APMC mandi prices, weather forecasts, and government scheme helplines (Kisan Call Centre 1800-180-1551).</li>
      </ul>

      <h3>Two Surfaces, One Brain</h3>
      <p>
        1. <strong>Web Dashboard (This surface):</strong> Designed for Common Service Centre (CSC) operators & intermediaries to assist multiple villagers.
        <br />
        2. <strong>PWA App (Mobile surface):</strong> Minimalist mic + camera client for direct farmer use.
      </p>
    </div>
  );
}
