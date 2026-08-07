import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postQuery, postQueryImage } from '../services/api';
import VoiceRecorder from '../components/VoiceRecorder';
import { speakText, stopSpeech } from '../utils/textToSpeech';

export default function AdvisoryWorkspace() {
  const locationState = useLocation().state || {};
  const [language, setLanguage] = useState(locationState.language || 'hi');
  const [domain, setDomain] = useState(locationState.domain || 'agriculture');
  
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: language === 'en' 
        ? "Hello! I am 'hello' — your voice & language rural AI advisor. How can I help you today with Agriculture, Education, Schemes, or Dairy?" 
        : "नमस्ते! मैं 'hello' हूँ — आपका ग्रामीण एआई सलाहकार। आज मैं कृषि, शिक्षा, सरकारी योजनाओं या पशुपालन में आपकी क्या मदद कर सकता हूँ?",
      sources: null,
      followUpQuestions: [
        language === 'en' ? "Tell me about Pune tomato mandi price" : "नागौर में टमाटर और गेहूं का भाव बताएं",
        language === 'en' ? "Engineering colleges after MHT-CET" : "12वीं के बाद इंजीनियरिंग कॉलेज में दाखिला"
      ]
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleResetChat = () => {
    stopSpeech();
    setSpeakingMsgId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: language === 'en' 
          ? "Chat reset. How can I assist you now?" 
          : "बातचीत रीसेट हो गई है। अब मैं आपकी क्या मदद कर सकता हूँ?",
        followUpQuestions: []
      }
    ]);
    setInputText('');
    setImageFile(null);
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText !== null ? overrideText : inputText;
    if (!textToSend.trim() && !imageFile) return;

    setError('');
    setLoading(true);
    stopSpeech();
    setSpeakingMsgId(null);

    const userMsgId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        text: textToSend,
        imagePreview: imageFile ? URL.createObjectURL(imageFile) : null
      }
    ];

    setMessages(newMessages);
    setInputText('');

    // Extract history for API (role: user/assistant)
    const historyPayload = newMessages.map(m => ({
      role: m.role,
      content: m.text
    }));

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('text', textToSend);
        formData.append('domain', domain);
        formData.append('language', language);

        const res = await postQueryImage(formData);
        setImageFile(null);

        const botMsgId = `bot-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            role: 'assistant',
            type: 'image',
            text: res.analysisText,
            followUpQuestions: res.followUpQuestions || [],
            recommendations: res.recommendations || []
          }
        ]);
      } else {
        const res = await postQuery({
          text: textToSend,
          domain,
          language,
          history: historyPayload,
          location: { district: 'Nagaur', state: 'Rajasthan' }
        });

        const botMsgId = `bot-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            role: 'assistant',
            type: 'text',
            text: res.responseText,
            transcript: res.transcript,
            inputType: res.inputType,
            asrProvider: res.asrProvider,
            privacyMasked: res.privacyMasked,
            privacyNote: res.privacyNote,
            enhancedPrompt: res.enhancedPrompt,
            followUpQuestions: res.followUpQuestions || [],
            sources: res.sources
          }
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send query');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioRecorded = async (audioBlob) => {
    setError('');
    setLoading(true);
    stopSpeech();
    setSpeakingMsgId(null);

    const historyPayload = messages.map(m => ({
      role: m.role,
      content: m.text
    }));

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_query.webm');
      formData.append('domain', domain);
      formData.append('language', language);
      formData.append('history', JSON.stringify(historyPayload));
      formData.append('location', JSON.stringify({ district: 'Nagaur', state: 'Rajasthan' }));

      const res = await postQuery(formData);
      const transcribedText = res.transcript || 'Voice query';

      const userMsgId = `user-${Date.now()}`;
      const botMsgId = `bot-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        {
          id: userMsgId,
          role: 'user',
          text: `🎙️ ${transcribedText}`
        },
        {
          id: botMsgId,
          role: 'assistant',
          type: 'text',
          text: res.responseText,
          transcript: res.transcript,
          inputType: 'voice',
          asrProvider: res.asrProvider,
          privacyMasked: res.privacyMasked,
          privacyNote: res.privacyNote,
          enhancedPrompt: res.enhancedPrompt,
          followUpQuestions: res.followUpQuestions || [],
          sources: res.sources
        }
      ]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process voice recording');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSpeak = (msgId, textToSpeak) => {
    if (speakingMsgId === msgId) {
      stopSpeech();
      setSpeakingMsgId(null);
    } else {
      speakText(
        textToSpeak,
        language,
        () => setSpeakingMsgId(msgId),
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(null)
      );
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '1.5rem', fontFamily: 'var(--font-family)' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            AI Advisory Chatbot Workspace
          </h2>
          <small style={{ color: '#94a3b8' }}>Voice & Multi-Turn AI Advisor for Rural Citizens</small>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Domain:</span>
            <select value={domain} onChange={(e) => setDomain(e.target.value)} style={{ background: 'transparent', color: '#38bdf8', border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
              <option value="agriculture" style={{ background: '#0f172a', color: '#fff' }}>🌾 Agriculture</option>
              <option value="education" style={{ background: '#0f172a', color: '#fff' }}>🎓 Education</option>
              <option value="schemes" style={{ background: '#0f172a', color: '#fff' }}>🏛️ Schemes</option>
              <option value="dairy" style={{ background: '#0f172a', color: '#fff' }}>🥛 Dairy</option>
            </select>
          </div>

          <div className="glass-panel" style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Lang:</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ background: 'transparent', color: '#38bdf8', border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
              <option value="hi" style={{ background: '#0f172a', color: '#fff' }}>हिंदी</option>
              <option value="en" style={{ background: '#0f172a', color: '#fff' }}>English</option>
              <option value="mr" style={{ background: '#0f172a', color: '#fff' }}>मराठी</option>
            </select>
          </div>

          <button 
            onClick={handleResetChat}
            className="glass-panel"
            style={{ padding: '0.4rem 0.8rem', color: '#f8fafc', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            🔄 New Chat
          </button>
        </div>
      </div>

      {/* Chat Messages Stream Area */}
      <div 
        className="glass-panel"
        style={{
          height: '560px',
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '1.25rem',
          background: 'rgba(15, 23, 42, 0.6)'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '84%',
                padding: '1rem 1.25rem',
                borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'rgba(30, 41, 59, 0.85)',
                color: '#ffffff',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: msg.role === 'user' ? '0 4px 15px rgba(56,189,248,0.25)' : '0 4px 20px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)'
              }}
            >
              {/* Message Header */}
              <div style={{ fontSize: '0.8rem', opacity: 0.85, marginBottom: '0.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{msg.role === 'user' ? '👤 You' : '🌾 hello Advisor'}</span>
                {msg.privacyMasked && (
                  <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    🔒 PII Protected
                  </span>
                )}
              </div>

              {/* Optional Image Preview */}
              {msg.imagePreview && (
                <img 
                  src={msg.imagePreview} 
                  alt="Uploaded crop" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.2)' }} 
                />
              )}

              {/* Transcribed Voice Badge */}
              {msg.inputType === 'voice' && (
                <div style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: '0.4rem', fontWeight: 600 }}>
                  🎙️ Transcribed via {msg.asrProvider || 'Groq Whisper'}
                </div>
              )}

              {/* Privacy Masking Note */}
              {msg.privacyNote && (
                <div style={{ fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', padding: '0.35rem 0.6rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                  {msg.privacyNote}
                </div>
              )}

              {/* Main Text Content */}
              <div style={{ fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>

              {/* Read Aloud Button for Assistant Messages */}
              {msg.role === 'assistant' && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => handleToggleSpeak(msg.id, msg.text)}
                    style={{
                      background: speakingMsgId === msg.id ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: speakingMsgId === msg.id ? '#f87171' : '#38bdf8',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{speakingMsgId === msg.id ? '⏹️ Stop' : '🔊 Read Aloud'}</span>
                  </button>
                  <small style={{ color: '#64748b', fontSize: '0.7rem' }}>Text-to-Speech</small>
                </div>
              )}

              {/* Interactive Follow-Up Questions Quick Reply Pills */}
              {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                    👉 Click to answer / ask follow-up:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {msg.followUpQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        style={{
                          textAlign: 'left',
                          background: 'rgba(56, 189, 248, 0.08)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          color: '#e2e8f0',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        🔹 {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: 'left' }}>
            <div className="glass-panel" style={{ display: 'inline-block', padding: '0.75rem 1.25rem', color: '#38bdf8', fontSize: '0.9rem', fontStyle: 'italic' }}>
              ⏳ hello Advisor is generating response...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Input Dock Area */}
      <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        
        {/* Voice Recorder Component */}
        <VoiceRecorder onAudioRecorded={handleAudioRecorded} isDisabled={loading} />

        {/* Photo Upload Icon Button */}
        <label 
          style={{
            cursor: 'pointer',
            padding: '0.6rem',
            background: imageFile ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: imageFile ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: imageFile ? '#34d399' : '#94a3b8'
          }}
          title="Upload crop photo for advisory"
        >
          📷
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }}
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </label>

        {/* Text Input */}
        <input 
          type="text"
          placeholder={imageFile ? `Image selected: ${imageFile.name}. Type optional question...` : "Ask a query in Hindi, English, Marathi..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#ffffff',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={loading || (!inputText.trim() && !imageFile)}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
            opacity: (loading || (!inputText.trim() && !imageFile)) ? 0.5 : 1
          }}
        >
          Send ➔
        </button>
      </div>

    </div>
  );
}
