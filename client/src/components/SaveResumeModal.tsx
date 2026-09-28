import { useState } from 'react';
import { savePlanLocally, getSavedPlans, deletePlan, exportPlanAsJSON } from '@/lib/calculator-storage';

interface SaveResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (email: string, planName: string) => Promise<void>;
  onLoad?: (email: string) => Promise<void>;
  currentPlanData?: any;
}

export function SaveResumeModal({ isOpen, onClose, onSave, onLoad, currentPlanData }: SaveResumeModalProps) {
  const [mode, setMode] = useState<'login' | 'save' | 'load' | 'manage'>('login');
  const [email, setEmail] = useState('');
  const [planName, setPlanName] = useState('My Financial Plan');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [savedPlans, setSavedPlans] = useState(getSavedPlans());

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!currentPlanData) throw new Error('No plan data to save');
      savePlanLocally(email, planName, currentPlanData);
      setMessage('✓ Plan saved! You can download it as JSON or load it later.');
      setTimeout(() => {
        setEmail('');
        setPlanName('My Financial Plan');
        setSavedPlans(getSavedPlans());
        onClose();
      }, 2000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const plans = getSavedPlans(email);
      if (plans.length === 0) {
        setMessage('No saved plans found for this email.');
      } else {
        setSavedPlans(plans);
        setMode('manage');
        setMessage('');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPlan = (plan: any) => {
    exportPlanAsJSON(plan.data, plan.name);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Delete this plan?')) {
      deletePlan(planId);
      setSavedPlans(getSavedPlans());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#0088b0' }}>Save Your Plan</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#999',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {mode === 'login' && (
          <div>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Save your calculator results to come back and edit them later. No password needed — just your email!
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button
                onClick={() => setMode('save')}
                style={{
                  background: '#0088b0',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                💾 Save Current Plan
              </button>
              <button
                onClick={() => setMode('load')}
                style={{
                  background: '#e9f8ff',
                  color: '#0088b0',
                  border: '2px solid #0088b0',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                📂 Load Saved Plans
              </button>
            </div>
          </div>
        )}

        {mode === 'save' && (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="My Financial Plan"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {message && (
              <p style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '1rem',
                background: message.includes('Error') ? '#fee' : '#efe',
                color: message.includes('Error') ? '#c33' : '#3c3',
                fontSize: '14px',
              }}>
                {message}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  background: '#f3f2f2',
                  color: '#333',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !email || !planName}
                style={{
                  background: loading ? '#ccc' : '#0088b0',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: loading ? 'default' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {loading ? 'Saving...' : '💾 Save Plan'}
              </button>
            </div>
          </form>
        )}

        {mode === 'manage' && (
          <div>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              {savedPlans.length} saved plan{savedPlans.length !== 1 ? 's' : ''} for {email}
            </p>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {savedPlans.map((plan: any) => (
                <div key={plan.id} style={{
                  background: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #e0ddd9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#333', marginBottom: '0.25rem' }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Saved {new Date(plan.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleExportPlan(plan)}
                      style={{
                        background: '#0088b0',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      📥 Export
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      style={{
                        background: '#fee',
                        color: '#c33',
                        border: '1px solid #fcc',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setMode('load')}
              style={{
                background: '#f3f2f2',
                color: '#333',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%',
              }}
            >
              ← Back
            </button>
          </div>
        )}

        {mode === 'load' && (
          <form onSubmit={handleLoad}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
                We'll send you a magic link to access your saved plans.
              </p>
            </div>
            {message && (
              <p style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '1rem',
                background: message.includes('Error') ? '#fee' : '#efe',
                color: message.includes('Error') ? '#c33' : '#3c3',
                fontSize: '14px',
              }}>
                {message}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  background: '#f3f2f2',
                  color: '#333',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  background: loading ? '#ccc' : '#0088b0',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: loading ? 'default' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {loading ? 'Sending...' : '📂 Load Plans'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
