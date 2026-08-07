import React from 'react';
import { useVoiceInput } from '../hooks/useVoiceInput';

export default function VoiceRecorder({ onAudioRecorded, disabled = false }) {
  const {
    isRecording,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording
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
    <div style={{ display: 'inline-block', margin: '0.5rem 0' }}>
      {!isRecording ? (
        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            background: '#e0e0e0',
            border: '1px solid #999',
            borderRadius: '4px'
          }}
        >
          🎙️ Record Voice Query (Speak)
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            🔴 Recording... ({recordingTime}s)
          </span>
          <button
            type="button"
            onClick={handleStopAndSend}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              background: '#ffcdd2',
              border: '1px solid #e57373',
              borderRadius: '4px'
            }}
          >
            ⏹️ Stop & Send Voice Query
          </button>
        </div>
      )}
    </div>
  );
}
