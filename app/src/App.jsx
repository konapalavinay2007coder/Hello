import React, { useState, useEffect } from 'react';
import { initOfflineCache, getCachedResponse, saveToCache } from './services/offlineCache';

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [language, setLanguage] = useState('hi');
  const [domain, setDomain] = useState('agriculture');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    initOfflineCache();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Web Speech API Voice Recognition
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsRecording(false);
      handleProcessQuery(speechToText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleProcessQuery = async (queryText) => {
    if (!queryText.trim()) return;

    setLoading(true);
    setResponse(null);

    // If Offline Mode: query local cache immediately!
    if (!isOnline) {
      setTimeout(() => {
        const cached = getCachedResponse(queryText);
        setResponse({
          type: 'offline',
          text: cached.responseText,
          isOffline: true
        });
        setLoading(false);
        speakText(cached.responseText);
      }, 600);
      return;
    }

    // If Online Mode: call live backend server
    try {
      const res = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: queryText,
          domain,
          language
        })
      });

      const data = await res.json();
      const responseText = data.responseText || 'सलाह प्राप्त हुई।';

      // Save live response to offline cache
      saveToCache(queryText, responseText);

      setResponse({
        type: 'online',
        text: responseText,
        followUpQuestions: data.followUpQuestions || [],
        isOffline: false
      });

      speakText(responseText);
    } catch (err) {
      // Fallback to offline cache if network call fails
      const cached = getCachedResponse(queryText);
      setResponse({
        type: 'offline',
        text: cached.responseText,
        isOffline: true
      });
      speakText(cached.responseText);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#_`]/g, ''));
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      
      {/* Network Status Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isOnline ? '#e8f5e9' : '#fff3e0', padding: '0.6rem 1rem', borderRadius: '8px', border: isOnline ? '1px solid #a5d6a7' : '1px solid #ffe0b2', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: isOnline ? '#2e7d32' : '#e65100' }}>
          <span>{isOnline ? '🟢 Online Mode (Live AI)' : '📶 Offline Mode (Cached Data)'}</span>
        </div>
        
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      {/* App Branding */}
      <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1b5e20' }}>hello 🌾</h1>
        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
          Farmer Voice AI Advisor (किसान एआई सलाहकार)
        </p>
      </div>

      {/* Massive Mic Touch Control (Hero Element) */}
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <button
          onClick={handleMicClick}
          disabled={isRecording || loading}
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: isRecording ? '#e53935' : '#2e7d32',
            color: '#ffffff',
            border: 'none',
            boxShadow: isRecording ? '0 0 20px rgba(229,57,53,0.6)' : '0 6px 16px rgba(46,125,50,0.3)',
            cursor: 'pointer',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            transition: 'transform 0.15s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '3rem' }}>🎙️</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
            {isRecording ? 'सुन रहा हूँ...' : 'बोलकर पूछें'}
          </span>
        </button>

        {isRecording && (
          <p style={{ color: '#e53935', fontWeight: 'bold', marginTop: '0.75rem', animation: 'pulse 1s infinite' }}>
            🔴 बोलना शुरू करें (Recording...)
          </p>
        )}
      </div>

      {/* Spoken / Typed Transcript Display */}
      {transcript && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <small style={{ color: '#666', fontWeight: 'bold' }}>आपका प्रश्न (Your Voice Input):</small>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '1.05rem', color: '#111' }}>"{transcript}"</p>
        </div>
      )}

      {/* Text Input Fallback */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text"
          placeholder="यहाँ लिखें (Type question here)..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleProcessQuery(transcript)}
          style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.95rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={() => handleProcessQuery(transcript)}
          disabled={loading || !transcript.trim()}
          style={{ padding: '0.6rem 1rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          पूछें ➔
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#2e7d32', fontStyle: 'italic' }}>
          ⏳ जवाब तैयार किया जा रहा है... (Processing advice)
        </div>
      )}

      {/* AI Advisory Response Card */}
      {response && (
        <div style={{ background: '#ffffff', border: '1px solid #a5d6a7', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 3px 8px rgba(0,0,0,0.06)' }}>
          {response.isOffline && (
            <div style={{ background: '#fff3e0', color: '#e65100', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.6rem' }}>
              📶 ऑफलाइन मोड: कैश मेमोरी से सलाह दिखाई जा रही है
            </div>
          )}

          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1b5e20' }}>🌾 सलाह (AI Advisory):</h4>
          
          <p style={{ fontSize: '1.05rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>
            {response.text}
          </p>

          <button
            onClick={() => speakText(response.text)}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#e8f5e9', border: '1px solid #81c784', color: '#2e7d32', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔊 दोबारा सुनें (Replay Voice)
          </button>

          {/* Follow Up Questions */}
          {response.followUpQuestions?.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #ccc' }}>
              <small style={{ fontWeight: 'bold', color: '#1565c0' }}>आगे पूछें (Quick Follow-up):</small>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                {response.followUpQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(q);
                      handleProcessQuery(q);
                    }}
                    style={{ textAlign: 'left', padding: '0.4rem 0.6rem', fontSize: '0.85rem', background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '4px', cursor: 'pointer', color: '#0d47a1' }}
                  >
                    👉 {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
