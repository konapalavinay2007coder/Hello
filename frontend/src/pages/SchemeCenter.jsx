import React, { useState } from 'react';
import { formTemplates } from '../data/formTemplates';
import { scholarships } from '../data/studentHub';

export default function SchemeCenter() {
  const [selectedForm, setSelectedForm] = useState(null);
  const [formDataState, setFormDataState] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleStartWizard = (form) => {
    setSelectedForm(form);
    setFormDataState({});
    setSubmittedSuccess(false);
  };

  const handleSubmitWizard = (e) => {
    e.preventDefault();
    setSubmittedSuccess(true);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '2px solid #e65100', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#e65100' }}>🏛️ Scheme & Form Auto-Fill Center</h2>
        <p style={{ margin: '0.4rem 0 0 0', color: '#555' }}>
          Simulated assisted voice form filling for government welfare schemes and financial aid.
        </p>
      </div>

      {/* Available Form Templates */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3>Available Government Form Wizards</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {formTemplates.map((form) => (
            <div key={form.id} style={{ border: '1px solid #ffcc80', borderRadius: '8px', padding: '1rem', background: '#fffde7' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#e65100' }}>{form.name}</h4>
              <small style={{ color: '#666', display: 'block', marginBottom: '0.4rem' }}>Dept: {form.department}</small>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2e7d32', margin: '0.4rem 0' }}>
                Benefit: {form.benefit}
              </p>

              <button 
                onClick={() => handleStartWizard(form)}
                style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', background: '#e65100', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🎙️ Start Voice Auto-Fill Form Wizard →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Form Wizard Modal */}
      {selectedForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', maxWidth: '520px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#e65100' }}>{selectedForm.name}</h3>
              <button onClick={() => setSelectedForm(null)} style={{ cursor: 'pointer' }}>✕</button>
            </div>

            {!submittedSuccess ? (
              <form onSubmit={handleSubmitWizard}>
                <div style={{ background: '#fff3e0', padding: '0.5rem 0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem', color: '#e65100' }}>
                  🎙️ Simulated Voice Slot Filling: Speak field values or type them in below.
                </div>

                {selectedForm.fields.map((field) => (
                  <div key={field.id} style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                      {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                    </label>
                    <input 
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={formDataState[field.id] || ''}
                      onChange={(e) => setFormDataState({ ...formDataState, [field.id]: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', fontSize: '0.95rem' }}
                    />
                  </div>
                ))}

                <button 
                  type="submit"
                  style={{ width: '100%', padding: '0.66rem', background: '#e65100', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem' }}
                >
                  Submit Form Application
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h3 style={{ color: '#2e7d32' }}>Application Submitted Successfully!</h3>
                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                  Reference Number: <strong>RAJ-2026-{Math.floor(100000 + Math.random() * 900000)}</strong>
                </p>
                <small style={{ color: '#777' }}>A confirmation SMS has been dispatched to applicant mobile number.</small>
                <div style={{ marginTop: '1.5rem' }}>
                  <button onClick={() => setSelectedForm(null)} style={{ padding: '0.5rem 1.25rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Close Wizard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
