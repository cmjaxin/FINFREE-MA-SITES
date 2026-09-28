import { useState, useEffect } from 'react';
import { blank, compute, cur, pct, Profile, ComputedResult, CATS } from '@/lib/ffic-engine';

interface FreedomCalculatorProps {
  advisorName?: string;
  advisorPhoto?: string;
  youCanBookUrl?: string;
  showAdvisorBar?: boolean;
}

export default function FreedomCalculator({
  advisorName = 'Your Advisor',
  advisorPhoto,
  youCanBookUrl = '#',
  showAdvisorBar = false
}: FreedomCalculatorProps) {
  const [plans, setPlans] = useState<Profile[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [dark, setDark] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('ffic_plans');
    const savedTheme = localStorage.getItem('ffic_theme');
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (e) {
        console.error('Failed to load plans:', e);
      }
    }
    if (savedTheme === 'dark') {
      setDark(true);
    }
  }, []);

  // Save to localStorage whenever plans change
  useEffect(() => {
    localStorage.setItem('ffic_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('ffic_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const currentPlan = plans.find(p => p.id === currentPlanId);
  const result = currentPlan ? compute(currentPlan) : null;

  const createNewPlan = () => {
    let name = 'My Financial Plan';
    let counter = 2;
    while (plans.some(p => p.name === name)) {
      name = `My Financial Plan ${counter}`;
      counter++;
    }
    const newPlan = blank(name);
    setPlans([...plans, newPlan]);
    setCurrentPlanId(newPlan.id);
    setStep(0);
  };

  const updatePlan = (updates: Partial<Profile>) => {
    if (!currentPlan) return;
    const updated = { ...currentPlan, ...updates, updatedAt: new Date().toISOString() };
    setPlans(plans.map(p => p.id === currentPlan.id ? updated : p));
  };

  const markStepComplete = (stepNum: number) => {
    if (!currentPlan) return;
    const completed = new Set(currentPlan.completedSteps);
    completed.add(stepNum);
    updatePlan({ completedSteps: Array.from(completed) });
  };

  const goToStep = (stepNum: number) => {
    setStep(stepNum);
  };

  const nextStep = () => {
    if (step < 5) {
      markStepComplete(step);
      setStep(step + 1);
      showToast(getStepCompleteMessage(step), 'success');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const getStepCompleteMessage = (stepNum: number): string => {
    const messages: Record<number, string> = {
      0: 'Income & tax analysis complete',
      1: 'Expense breakdown complete',
      2: 'Net worth calculated',
      3: 'Personal balance sheet ready',
      4: 'Your financial plan is ready',
    };
    return messages[stepNum] || 'Step complete';
  };

  if (!currentPlan || !result) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f2f2', padding: '2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#0A2540', marginBottom: '1rem' }}>Financial Freedom Independence Calculator</h1>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Map your income, spending, and net worth to your freedom number.
          </p>
          <button
            onClick={createNewPlan}
            style={{
              background: '#5BCBF5',
              color: '#0b1f38',
              border: 'none',
              padding: '16px 36px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            Start Your Plan →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#1c1b1a' : '#f3f2f2', color: dark ? '#eeeceb' : '#201e1d' }}>
      {/* Header */}
      <div style={{
        background: dark ? '#282625' : '#fff',
        borderBottom: '1px solid ' + (dark ? '#3a3835' : '#e0ddd9'),
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div
          onClick={() => {
            setCurrentPlanId(null);
            setStep(0);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: '18px', fontWeight: 600 }}>Financial Freedom</div>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0088b0' }}>
            INDEPENDENCE CALCULATOR
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>{currentPlan.name}</span>
          <span style={{ fontSize: '13px', color: '#0088b0' }}>✓ Saved</span>
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '8px',
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div style={{
        background: dark ? '#282625' : '#fff',
        padding: '16px 20px',
        display: 'flex',
        gap: '1px',
        borderBottom: '1px solid ' + (dark ? '#3a3835' : '#e0ddd9'),
        overflowX: 'auto',
      }}>
        {['Money', 'Expenses', 'Net Worth', 'PIN', 'FIN', 'Dashboard'].map((name, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            style={{
              flex: '1',
              minWidth: '140px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              background: step === i ? '#0088b0' : currentPlan.completedSteps.includes(i) ? '#e9f8ff' : '#e0ddd9',
              color: step === i ? '#fff' : currentPlan.completedSteps.includes(i) ? '#004961' : dark ? '#8a8a8a' : '#666',
            }}
          >
            {i + 1} {name} {currentPlan.completedSteps.includes(i) && '✓'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        {step === 0 && <StepMoney plan={currentPlan} result={result} updatePlan={updatePlan} />}
        {step === 1 && <StepExpenses plan={currentPlan} result={result} updatePlan={updatePlan} />}
        {step === 2 && <StepNetWorth plan={currentPlan} result={result} updatePlan={updatePlan} />}
        {step === 3 && <StepPIN plan={currentPlan} result={result} />}
        {step === 4 && <StepFIN plan={currentPlan} result={result} updatePlan={updatePlan} />}
        {step === 5 && <StepDashboard plan={currentPlan} result={result} youCanBookUrl={youCanBookUrl} advisorName={advisorName} />}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '1rem' }}>
          <button
            onClick={() => {
              if (step === 0) {
                setCurrentPlanId(null);
                setStep(0);
              } else {
                setStep(step - 1);
              }
            }}
            style={{
              background: 'none',
              border: `1px solid ${dark ? '#3a3835' : '#d0ccc8'}`,
              color: dark ? '#eeeceb' : '#0088b0',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            {step === 0 ? '← Home' : '← Back'}
          </button>
          {step < 5 && (
            <button
              onClick={nextStep}
              style={{
                background: '#5BCBF5',
                color: '#0b1f38',
                border: 'none',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Next Step →
            </button>
          )}
          {step === 5 && (
            <button
              onClick={() => {
                setCurrentPlanId(null);
                setStep(0);
              }}
              style={{
                background: '#5BCBF5',
                color: '#0b1f38',
                border: 'none',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Save & Return Home
            </button>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: t.type === 'success' ? '#e9f8ff' : '#fff1f4',
              color: t.type === 'success' ? '#004961' : '#790e3d',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            {t.type === 'success' ? '✓' : '!'} {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// Step components (simplified for now)
function StepMoney({ plan, result, updatePlan }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 1 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>My Money</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>2026 Tax Year</p>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <p>Income setup form goes here...</p>
      </div>
    </div>
  );
}

function StepExpenses({ plan, result, updatePlan }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 2 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>My Expenses</h2>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <p>Expense tracking goes here...</p>
      </div>
    </div>
  );
}

function StepNetWorth({ plan, result, updatePlan }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 3 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Net Worth</h2>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <p>Net worth tracking goes here...</p>
      </div>
    </div>
  );
}

function StepPIN({ plan, result }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 4 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Personal Balance Sheet</h2>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <p>Personal balance sheet goes here...</p>
      </div>
    </div>
  );
}

function StepFIN({ plan, result, updatePlan }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 5 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Financial Independence Number</h2>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <p>FIN calculation inputs go here...</p>
      </div>
    </div>
  );
}

function StepDashboard({ plan, result, youCanBookUrl, advisorName }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 6 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '3rem', lineHeight: 1.05 }}>Your Financial Summary</h2>

      {/* Key metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem',
      }}>
        <MetricCard label="Net Worth" value={cur(result.netWorth)} sub={`${result.lifetimeWealthPercent.toFixed(1)}% of lifetime earnings`} tone="pos" />
        <MetricCard label="Annual Expenses" value={cur(result.annualExpensesToday)} tone="ink" />
        <MetricCard label="Potential Savings" value={`${result.savingsRate.toFixed(1)}% · ${cur(result.monthlyCashFlow)}/mo`} tone="pos" />
        <MetricCard label="Effective Tax Rate" value={`${result.effectiveRate.toFixed(1)}%`} sub={`${cur(result.federalTax + result.stateTax)} total tax`} tone="tax" />
        <MetricCard label="Monthly Cash Flow" value={cur(result.monthlyCashFlow)} sub={`${result.monthsCovered.toFixed(1)} months covered`} tone="pos" />
        <MetricCard label="FIN Number" value={cur(result.futureSavingsNeeded)} sub={result.shortfall > 0 ? `−${cur(result.shortfall)} shortfall` : `+${cur(result.projectedSavings - result.futureSavingsNeeded)} surplus`} tone={result.shortfall > 0 ? 'neg' : 'pos'} />
      </div>

      {/* Schedule CTA */}
      <div style={{
        background: '#e9f8ff',
        border: '1px solid #99e0ff',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '3rem',
      }}>
        <h3 style={{ color: '#0088b0', marginBottom: '1rem' }}>Ready to talk about your plan?</h3>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Schedule a consultation with {advisorName} to review your results and explore next steps.
        </p>
        <a
          href={youCanBookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#0088b0',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Schedule a Consultation →
        </a>
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '2rem', textAlign: 'center' }}>
        <strong>Disclaimer:</strong> This is not financial advice — this is intended as a worksheet for you to review with your licensed liability and financial advisors.
      </p>
    </div>
  );
}

function MetricCard({ label, value, sub, tone }: any) {
  const toneColors: Record<string, { mark: string; label: string; value: string }> = {
    pos: { mark: '#0088b0', label: '#0088b0', value: '#006786' },
    neg: { mark: '#d6006c', label: '#d6006c', value: '#aa0b56' },
    tax: { mark: '#9b9797', label: '#9b9797', value: '#605d5d' },
    ink: { mark: '#201e1d', label: '#201e1d', value: '#201e1d' },
  };
  const colors = toneColors[tone] || toneColors.ink;

  return (
    <div>
      <div style={{
        width: '28px',
        height: '3px',
        background: colors.mark,
        marginBottom: '0.75rem',
      }} />
      <div style={{
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: colors.label,
        marginBottom: '0.25rem',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '30px',
        fontWeight: 600,
        color: colors.value,
        lineHeight: 1.05,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: '13px',
          color: '#999',
          marginTop: '0.5rem',
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}
