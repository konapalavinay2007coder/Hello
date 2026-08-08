import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { postQuery, postQueryImage } from '../services/api';
import VoiceRecorder from '../components/VoiceRecorder';
import { speakText, stopSpeech } from '../utils/textToSpeech';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function AdvisoryWorkspace() {
  const locationState = useLocation().state || {};
  const { language } = useLanguage();
  const t = translations[language]?.advisory || translations.en.advisory;

  const [domain, setDomain] = useState(locationState.domain || 'agriculture');
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  // ChatGPT Edge-to-Edge Collapsible Sidebar state (closed by default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat Threads History State
  const [threads, setThreads] = useState([
    { id: 't1', title: 'Pune Tomato Mandi Prices', domain: 'agriculture', date: 'Today' },
    { id: 't2', title: '12th Engineering Colleges', domain: 'education', date: 'Yesterday' },
    { id: 't3', title: 'Mudra Loan Business Plan', domain: 'schemes', date: '3 days ago' }
  ]);
  const [activeThreadId, setActiveThreadId] = useState('t1');

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: language === 'en' 
        ? "Hello! I am 'helloAI' — your voice & language AI advisor. How can I help you today with Agriculture, Education, Business, or Dairy?" 
        : language === 'mr'
        ? "नमस्कार! मी 'helloAI' आहे — तुमचा व्हॉइस एआय सल्लागार. आज मी तुम्हाला कृषी, शिक्षण, व्यापार किंवा दुग्धव्यवसायात कशी मदत करू शकतो?"
        : "नमस्ते! मैं 'helloAI' हूँ — आपका एआई सलाहकार। आज मैं कृषि, शिक्षा, व्यापार या पशुपालन में आपकी क्या मदद कर सकता हूँ?",
      sources: null,
      followUpQuestions: [
        language === 'en' ? "Tell me about Pune tomato mandi price" : language === 'mr' ? "पुण्यातील टोमॅटो आणि गव्हाचा भाव सांगा" : "नागौर में टमाटर और गेहूं का भाव बताएं",
        language === 'en' ? "Engineering colleges after 12th" : language === 'mr' ? "१२ वी नंतर इंजिनिअरिंग कॉलेज प्रवेश" : "12वीं के बाद इंजीनियरिंग कॉलेज में दाखिला"
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

  const getRedirectTarget = (msg) => {
    if (!msg || msg.role !== 'assistant' || (msg.id && String(msg.id).startsWith('welcome'))) return null;
    const fullText = (msg.text + ' ' + (msg.transcript || '') + ' ' + (msg.enhancedPrompt || '')).toLowerCase();

    // 1. Education / Student / Scholarship / College
    if (
      fullText.includes('student') || 
      fullText.includes('education') || 
      fullText.includes('college') || 
      fullText.includes('scholarship') || 
      fullText.includes('degree') || 
      fullText.includes('school') || 
      fullText.includes('university') || 
      fullText.includes('12th') || 
      fullText.includes('admission') ||
      fullText.includes('छात्र') ||
      fullText.includes('विद्यार्थी') ||
      fullText.includes('कॉलेज') ||
      fullText.includes('छात्रवृत्ति') ||
      fullText.includes('इंजिनिअरिंग')
    ) {
      return {
        path: '/student',
        label: language === 'hi' 
          ? 'विद्यार्थी हब और छात्रवृत्ति पर जाएं ➔' 
          : language === 'mr' 
          ? 'विद्यार्थी हब आणि शिष्यवृत्ती पहा ➔' 
          : 'Click Here to Explore Student Hub & Scholarships ➔'
      };
    }

    // 2. Business / Entrepreneur / Loan / Mudra / Product
    if (
      fullText.includes('business') || 
      fullText.includes('entrepreneur') || 
      fullText.includes('loan') || 
      fullText.includes('mudra') || 
      fullText.includes('capital') || 
      fullText.includes('venture') || 
      fullText.includes('marketplace') || 
      fullText.includes('pickle') || 
      fullText.includes('handicraft') ||
      fullText.includes('व्यापार') ||
      fullText.includes('ऋण') ||
      fullText.includes('लोन') ||
      fullText.includes('उद्योजक')
    ) {
      return {
        path: '/entrepreneur',
        label: language === 'hi' 
          ? 'व्यापार योजना और ऋण हब पर जाएं ➔' 
          : language === 'mr' 
          ? 'व्यवसाय कल्पना आणि कर्ज हब पहा ➔' 
          : 'Click Here to Explore Business Ideas & Capital ➔'
      };
    }

    // 3. Mandi Market / Crop Prices / Arrival
    if (
      fullText.includes('mandi') || 
      fullText.includes('price') || 
      fullText.includes('rate') || 
      fullText.includes('crop') || 
      fullText.includes('tomato') || 
      fullText.includes('wheat') || 
      fullText.includes('onion') || 
      fullText.includes('potato') || 
      fullText.includes('quintal') || 
      fullText.includes('agmarknet') ||
      fullText.includes('मंडी') ||
      fullText.includes('भाव') ||
      fullText.includes('फसल') ||
      fullText.includes('बाजार')
    ) {
      return {
        path: '/dashboard',
        label: language === 'hi' 
          ? 'लाइव मंडी भाव बोर्ड पर जाएं ➔' 
          : language === 'mr' 
          ? 'थेट मंदी भाव बोर्ड पहा ➔' 
          : 'Click Here to Explore Live Mandi Market Prices ➔'
      };
    }

    // 4. Helplines / Kisan Call Centre / CSC / Directory / Settings
    if (
      fullText.includes('helpline') || 
      fullText.includes('kisan call') || 
      fullText.includes('kcc') || 
      fullText.includes('csc') || 
      fullText.includes('directory') || 
      fullText.includes('contact') || 
      fullText.includes('phone') ||
      fullText.includes('हेल्पलाइन') ||
      fullText.includes('संपर्क')
    ) {
      return {
        path: '/more',
        label: language === 'hi' 
          ? 'हेल्पलाइन और निर्देशिका पर जाएं ➔' 
          : language === 'mr' 
          ? 'हेल्पलाईन आणि निर्देशिका पहा ➔' 
          : 'Click Here to Explore Helplines & System Directory ➔'
      };
    }

    // No relevant match -> Do NOT show any button!
    return null;
  };

  const handleNewChat = () => {
    stopSpeech();
    setSpeakingMsgId(null);
    const newId = `t-${Date.now()}`;
    const newThread = {
      id: newId,
      title: 'New Conversation',
      domain: domain,
      date: 'Just now'
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: language === 'en' 
          ? "New conversation started. How can I assist you?" 
          : language === 'mr'
          ? "नवीन चॅट सुरू झाले आहे. मी तुम्हाला काय मदत करू?"
          : "नयी बातचीत शुरू हुई। मैं आपकी क्या मदद कर सकता हूँ?",
        followUpQuestions: []
      }
    ]);
    setInputText('');
    setImageFile(null);
  };

  const handleSelectThread = (thread) => {
    setActiveThreadId(thread.id);
    setDomain(thread.domain);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLike = (id, type) => {
    setLikedMap(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText !== null ? overrideText : inputText;
    if (!textToSend.trim() && !imageFile) return;

    setError('');
    setLoading(true);
    stopSpeech();
    setSpeakingMsgId(null);

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        time: currentTime,
        text: textToSend,
        imagePreview: imageFile ? URL.createObjectURL(imageFile) : null
      }
    ];

    setMessages(newMessages);
    setInputText('');

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId && (t.title === 'New Conversation' || t.title === 'Pune Tomato Mandi Prices')) {
        return { ...t, title: textToSend.slice(0, 26) + (textToSend.length > 26 ? '...' : '') };
      }
      return t;
    }));

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

        // Update user message with privacy status if detected
        if (res.privacyMasked) {
          setMessages(prev => prev.map(m => m.id === userMsgId ? { 
            ...m, 
            privacyMasked: true, 
            privacyNote: res.privacyNote || '🔒 Privacy Protection Active: 12-Digit Aadhaar / PII digits masked.' 
          } : m));
        }

        const botMsgId = `bot-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            role: 'assistant',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'image',
            text: res.analysisText,
            privacyMasked: res.privacyMasked,
            privacyNote: res.privacyNote,
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

        if (res.privacyMasked) {
          setMessages(prev => prev.map(m => m.id === userMsgId ? { 
            ...m, 
            privacyMasked: true, 
            privacyNote: res.privacyNote || '🔒 Privacy Protection Active: PII / sensitive digits masked.' 
          } : m));
        }

        const botMsgId = `bot-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            role: 'assistant',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
            text: res.responseText,
            transcript: res.transcript,
            inputType: res.inputType,
            asrProvider: res.asrProvider,
            privacyMasked: res.privacyMasked,
            privacyNote: res.privacyNote,
            enhancedPrompt: res.enhancedPrompt,
            followUpQuestions: res.followUpQuestions || [],
            referenceLink: res.referenceLink || null,
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
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const userMsgId = `user-${Date.now()}`;
      const botMsgId = `bot-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        {
          id: userMsgId,
          role: 'user',
          time: currentTime,
          text: transcribedText
        },
        {
          id: botMsgId,
          role: 'assistant',
          time: currentTime,
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
    <div style={{
      width: '100%',
      height: 'calc(100vh - 80px)',
      display: 'flex',
      fontFamily: "'Atkinson Hyperlegible', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      paddingRight: '2rem',
      paddingBottom: '1.25rem'
    }}>
      
      {/* ========================================================================= */}
      {/* EDGE-TO-EDGE CHATGPT SIDEBAR (TOUCHES LEFT BORDER)                        */}
      {/* ========================================================================= */}
      <aside style={{
        width: isSidebarOpen ? '280px' : '64px',
        height: '100%',
        background: '#ffffff',
        borderRight: '1px solid #cbd5e1',
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        padding: isSidebarOpen ? '1.25rem 1rem' : '1rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        boxShadow: '4px 0 25px rgba(2, 132, 199, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        zIndex: 50,
        overflow: 'hidden'
      }}>
        
        {/* EXPANDED SIDEBAR CONTENT */}
        {isSidebarOpen ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            
            {/* Top Header: Brand Logo + Collapse Toggle Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0 0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  H
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#062C4D', letterSpacing: '-0.5px' }}>
                  hello <span style={{ color: '#0284c7' }}>AI</span>
                </span>
              </div>

              {/* Collapse Sidebar Button Icon */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                title="Collapse sidebar"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#062C4D',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}
              >
                ◧
              </button>
            </div>

            {/* + New Chat Button */}
            <button 
              onClick={handleNewChat}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.92rem',
                fontWeight: 800,
                marginBottom: '1.25rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
              <span>New chat</span>
            </button>




            {/* Chats List (ChatGPT Recent History) */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingRight: '0.2rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4D8FC7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.25rem', paddingLeft: '0.2rem' }}>
                Chats
              </label>
              {threads.map((tItem) => {
                const isActive = tItem.id === activeThreadId;
                return (
                  <div
                    key={tItem.id}
                    onClick={() => handleSelectThread(tItem)}
                    style={{
                      padding: '0.65rem 0.75rem',
                      background: isActive ? '#e0f2fe' : 'transparent',
                      border: isActive ? '1px solid #0284c7' : '1px solid transparent',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#0284c7' : '#062C4D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tItem.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom ChatGPT Style User Profile Footer */}
            <div style={{ paddingTop: '0.85rem', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#062C4D', color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  U
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#062C4D' }}>Verified User</div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>Free Plan</div>
                </div>
              </div>

              <Link to="/more" title="Settings" style={{ color: '#4D8FC7', textDecoration: 'none', fontSize: '1.1rem' }}>
                ⚙️
              </Link>
            </div>

          </div>
        ) : (
          /* COLLAPSED SIDEBAR CONTENT (NARROW STRIP WITH EXPAND BUTTON) */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', height: '100%' }}>
            
            {/* Expand Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              title="Expand sidebar"
              style={{
                background: '#e0f2fe',
                border: '1px solid #0284c7',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0284c7',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)'
              }}
            >
              ◧
            </button>

            {/* Quick New Chat Button Icon */}
            <button
              onClick={handleNewChat}
              title="New Chat"
              style={{
                background: '#062C4D',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}
            >
              +
            </button>

            <div style={{ borderTop: '1px solid #e2e8f0', width: '100%', margin: '0.5rem 0' }} />

            <Link to="/more" title="Settings" style={{ marginTop: 'auto', fontSize: '1.2rem', textDecoration: 'none' }}>
              ⚙️
            </Link>
          </div>
        )}

      </aside>

      {/* ========================================================================= */}
      {/* MAIN CHATGPT WORKSPACE PANEL (RESPONSIVE TO SIDEBAR STATE)                 */}
      {/* ========================================================================= */}
      <main style={{
        flex: 1,
        marginLeft: '1.25rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #cbd5e1',
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        
        {/* Floating Expand Toggle Button when sidebar is collapsed */}
        {!isSidebarOpen && (
          <div style={{ padding: '0.85rem 1.25rem 0 1.25rem' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              title="Expand sidebar"
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#0284c7',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)'
              }}
            >
              <span>◧</span>
              <span>Expand</span>
            </button>
          </div>
        )}

        {/* Conversation Stream Scroll Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Conversational Message Card */}
              <div
                style={{
                  width: msg.role === 'user' ? 'auto' : '100%',
                  maxWidth: msg.role === 'user' ? '75%' : '100%',
                  padding: '1.35rem 1.6rem',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #0284c7, #1d4ed8)' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#062C4D',
                  border: msg.role === 'user' ? 'none' : '1px solid #cbd5e1',
                  boxShadow: msg.role === 'user' ? '0 6px 20px rgba(2,132,199,0.3)' : '0 6px 24px rgba(6, 44, 77, 0.05)'
                }}
              >
                {/* Meta Header */}
                <div style={{ fontSize: '0.82rem', opacity: 0.88, marginBottom: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{msg.role === 'user' ? 'You' : 'helloAI Advisor'}</span>
                    {msg.time && <span style={{ opacity: 0.65, fontWeight: 500 }}>• {msg.time}</span>}
                    {msg.privacyMasked && (
                      <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                        PII Protected
                      </span>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {msg.imagePreview && (
                  <img 
                    src={msg.imagePreview} 
                    alt="Uploaded preview" 
                    style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', marginBottom: '0.75rem' }} 
                  />
                )}

                {/* Transcribed Voice Badge */}
                {msg.inputType === 'voice' && (
                  <div style={{ fontSize: '0.78rem', background: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.6rem', borderRadius: '6px', marginBottom: '0.6rem', fontWeight: 800, display: 'inline-block' }}>
                    Transcribed via {msg.asrProvider || 'Whisper'}
                  </div>
                )}

                {/* Privacy Note */}
                {msg.privacyNote && (
                  <div style={{ fontSize: '0.82rem', background: '#fef3c7', border: '1px solid #fde047', color: '#b45309', padding: '0.45rem 0.8rem', borderRadius: '8px', marginBottom: '0.65rem' }}>
                    {msg.privacyNote}
                  </div>
                )}

                {/* Main Advisory Text Body */}
                <div style={{ fontSize: '1.05rem', lineHeight: '1.65', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                {/* Scorecard / Official Reference Link Card */}
                {msg.referenceLink && (
                  <div style={{
                    marginTop: '0.85rem',
                    padding: '0.85rem 1.1rem',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(29, 78, 216, 0.04))',
                    border: '1.5px solid rgba(2, 132, 199, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.1)'
                  }}>
                    <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.92rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{msg.referenceLink.title || '📄 Scorecard Reference & Format'}</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#4D8FC7', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
                      {msg.referenceLink.description}
                    </p>
                    <a 
                      href={msg.referenceLink.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '0.45rem 1.1rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        boxShadow: '0 3px 10px rgba(2, 132, 199, 0.25)'
                      }}
                    >
                      <span>View Sample MHT-CET Scorecard</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}

                {/* Smart Central Point Redirection CTA Button */}
                {msg.role === 'assistant' && (() => {
                  const redirectTarget = getRedirectTarget(msg);
                  if (!redirectTarget) return null;
                  return (
                    <div style={{ marginTop: '1.1rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
                      <Link
                        to={redirectTarget.path}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.4rem',
                          background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          textDecoration: 'none',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{redirectTarget.label}</span>
                      </Link>
                    </div>
                  );
                })()}

                {/* Action Controls Toolbar */}
                {msg.role === 'assistant' && (
                  <div style={{ marginTop: '1.1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        style={{
                          background: speakingMsgId === msg.id ? '#fee2e2' : '#e0f2fe',
                          border: 'none',
                          color: speakingMsgId === msg.id ? '#dc2626' : '#0284c7',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{speakingMsgId === msg.id ? 'Stop' : 'Read Aloud'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        style={{
                          background: copiedId === msg.id ? '#d1fae5' : '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: copiedId === msg.id ? '#059669' : '#4D8FC7',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleToggleLike(msg.id, 'up')}
                        style={{
                          background: likedMap[msg.id] === 'up' ? '#e0f2fe' : 'transparent',
                          border: '1px solid #cbd5e1',
                          color: likedMap[msg.id] === 'up' ? '#0284c7' : '#4D8FC7',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        Helpful
                      </button>

                      <button
                        onClick={() => handleToggleLike(msg.id, 'down')}
                        style={{
                          background: likedMap[msg.id] === 'down' ? '#fee2e2' : 'transparent',
                          border: '1px solid #cbd5e1',
                          color: likedMap[msg.id] === 'down' ? '#dc2626' : '#4D8FC7',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        Unhelpful
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'inline-block', padding: '0.9rem 1.4rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', color: '#0284c7', fontSize: '0.95rem', fontWeight: 800 }}>
                helloAI Advisor is formulating response...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div style={{ margin: '0 1.75rem 0.5rem 1.75rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Pinned Bottom Input Bar (ChatGPT / Gemini Style) */}
        <div style={{
          padding: '1.2rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff'
        }}>
          <div style={{
            width: '100%',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '20px',
            padding: '0.65rem 1.1rem',
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.06)'
          }}>
            
            {/* Voice Recorder */}
            <VoiceRecorder onAudioRecorded={handleAudioRecorded} disabled={loading} />

            {/* Photo Upload Button */}
            <label 
              style={{
                cursor: 'pointer',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: imageFile ? '#e0f2fe' : '#ffffff',
                border: imageFile ? '2px solid #0284c7' : '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)',
                flexShrink: 0
              }}
              title="Upload crop photo for advisory"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#062C4D" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => setImageFile(e.target.files[0] || null)}
              />
            </label>

            {/* Main Text Input */}
            <input 
              type="text"
              placeholder={imageFile ? `Image attached: ${imageFile.name}. Type question...` : "Ask in हिंदी, English, मराठी..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                padding: '0.65rem 0.5rem',
                color: '#062C4D',
                fontSize: '1rem',
                fontWeight: 500,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />

            {/* Send Primary Button */}
            <button
              onClick={() => handleSend()}
              disabled={loading || (!inputText.trim() && !imageFile)}
              style={{
                background: '#062C4D',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.6rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: (loading || (!inputText.trim() && !imageFile)) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(6, 44, 77, 0.3)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              Send
            </button>
          </div>
        </div>

      </main>

    </div>
  );
}
