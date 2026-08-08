import React from 'react';
import { useVoiceInput } from '../hooks/useVoiceInput';

export default function VoiceRecorder({ onAudioRecorded, disabled = false }) {
  const {
    isRecording,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording
  } = useVoiceInput();

  const handleStopAndSend = () => {
    stopRecording();
  };

  React.useEffect(() => {
    if (audioBlob && !isRecording) {
      onAudioRecorded(audioBlob);
    }
  }, [audioBlob, isRecording]);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {!isRecording ? (
        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          title="Record Voice Query (Speak)"
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#D8E8F5',
            border: '2px solid #0284c7',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
        >
          {/* Crisp SVG Microphone Icon in #062C4D */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#062C4D" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.88rem' }}>
            🔴 {recordingTime}s
          </span>
          <button
            type="button"
            onClick={handleStopAndSend}
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              borderRadius: '9999px'
            }}
          >
            ⏹️ Stop & Send
          </button>
        </div>
      )}
    </div>
  );
}
