import { useState, useEffect } from 'react';
import { blank, compute, cur, pct, Profile, ComputedResult, CATS } from '@/lib/ffic-engine';

function CountUpNumber({ target, style }: any) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  return (
    <div style={style}>
      ${count.toLocaleString()}
    </div>
  );
}

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
    const sampleResult = compute(blank('Sample Plan'));

    return (
      <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {/* Hero Section */}
        <section style={{
          background: 'radial-gradient(ellipse 80% 70% at 15% 10%, #16345a 0%, transparent 60%), linear-gradient(135deg, #102a4a 0%, #0b1f38 55%, #0d2644 100%)',
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 2rem)',
          textAlign: 'center',
        }}>
          <img src="https://mettlehq.com/wp-content/uploads/2023/06/NEO_LOGO_HORIZ_WHITE-1.png" alt="NEO" style={{ height: '44px', marginBottom: '2rem' }} />

          <div style={{
            display: 'inline-block',
            background: 'rgba(94,200,245,0.08)',
            border: '1px solid rgba(94,200,245,0.35)',
            borderRadius: '999px',
            padding: '7px 16px',
            marginBottom: '2rem',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5ec8f5' }}>
              Financial Freedom Independence Calculator
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(34px, 5.4vw, 60px)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxWidth: '18ch',
            marginBottom: '1.5rem',
          }}>
            Find the exact number you need to <span style={{ color: '#5ec8f5' }}>walk away from work.</span>
          </h1>

          <p style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.78)',
            maxWidth: '56ch',
            marginBottom: '3rem',
          }}>
            A guided calculator that maps your income, spending, and net worth to your freedom number — and the years it'll take to get there.
          </p>

          {/* Example Card */}
          <div style={{
            width: 'min(100%, 420px)',
            padding: '26px 30px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5ec8f5' }}>
              Example · A Freedom Number
            </div>
            <CountUpNumber target={sampleResult.futureSavingsNeeded} style={{
              fontSize: 'clamp(38px, 5vw, 50px)',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }} />
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)' }}>
              25 years · 10% savings rate · <span style={{ fontWeight: 600, color: '#ffb38a' }}>Needs adjustment</span>
            </div>
          </div>

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
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#8ad8f8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#5BCBF5'}
          >
            Start your plan →
          </button>
        </section>

        {/* See it Before You Build It */}
        <section style={{ background: '#f3f2f2', padding: 'clamp(4rem, 8vw, 6rem) 2rem' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem', maxWidth: '800px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0088b0', marginBottom: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #201e1d', borderBottom: '1px solid #201e1d', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>See it before you build it</span>
                <span style={{ color: '#666' }}>An example household</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 800, color: '#0A2540', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                Here's what your plan will look like
              </h2>
              <p style={{ fontSize: '16px', color: '#666' }}>A two-income family of four, 25 years from retirement.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <MetricCard label="Net Worth" value={cur(sampleResult.netWorth)} sub="Assets minus liabilities" tone="pos" />
              <MetricCard label="Savings Rate" value={`${sampleResult.savingsRate.toFixed(1)}%`} sub="Of after-tax income" tone="pos" />
              <MetricCard label="Years to Freedom" value="25" sub="Retiring at 67" tone="ink" />
              <MetricCard label="Shortfall" value={cur(sampleResult.shortfall)} sub="Gap to close" tone="neg" />
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ fontSize: '64px', fontWeight: 700, color: '#0088b0' }}>76%</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0088b0', marginBottom: '0.5rem' }}>
                    Savings Projection
                  </div>
                  <div style={{ fontSize: '16px', color: '#666', fontWeight: 500 }}>
                    Growth over 25 years → $2.5M
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* From Messy Numbers to Clear Plan */}
        <section style={{ background: '#fff', padding: 'clamp(4rem, 8vw, 6rem) 2rem' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 800, color: '#0A2540', lineHeight: 1.2, marginBottom: '3rem', textAlign: 'center' }}>
              From messy numbers to a clear plan
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {[
                { num: '1', title: 'Income', body: 'Map every dollar you earn — W-2, 1099, side hustle, passive.' },
                { num: '2', title: 'Spending', body: 'Today vs. tomorrow — categorize what leaves, what stays.' },
                { num: '3', title: 'Net Worth', body: 'Assets, debts, and everything in between — the real picture.' },
                { num: '4', title: 'Freedom Number', body: 'The exact savings target — and the years to reach it.' },
              ].map((step) => (
                <div key={step.num} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '72px', fontWeight: 600, color: '#0088b0', marginBottom: '0.5rem' }}>
                    {step.num}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '0.75rem' }}>
                    Step {step.num}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
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
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#8ad8f8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#5BCBF5'}
              >
                Start your plan →
              </button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section style={{ background: '#f3f2f2', padding: '2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', fontSize: '12px', color: '#666' }}>
            <strong>Disclaimer:</strong> This is not financial advice — this is intended as a worksheet for you to review with your licensed liability and financial advisors.
          </div>
        </section>
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
  const updatePerson = (index: number, updates: any) => {
    const updated = { ...plan, people: [...plan.people] };
    updated.people[index] = { ...updated.people[index], ...updates };
    updatePlan(updated);
  };

  const addPerson = () => {
    const updated = { ...plan, people: [...plan.people, { name: '', age: 0, lifetimeMoneyEarned: 0, incomes: { w2: 0, socialSecurity1099: 0, bonusCommissions: 0, k1ScheduleE: 0, taxFreeIncome: 0 } }] };
    updatePlan(updated);
  };

  const removePerson = (index: number) => {
    const updated = { ...plan, people: plan.people.filter((_: any, i: number) => i !== index) };
    updatePlan(updated);
  };

  const updateJobHours = (key: string, value: number) => {
    const updated = { ...plan, jobRelatedHours: { ...plan.jobRelatedHours, [key]: value } };
    updatePlan(updated);
  };

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 1 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>My Money</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>2026 Tax Year</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '3rem' }}>
        {/* Forms */}
        <div>
          {/* People Section */}
          {plan.people.map((person: any, idx: number) => (
            <div key={idx} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e0ddd9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540' }}>
                  Person {idx + 1}
                </h3>
                {plan.people.length > 1 && (
                  <button
                    onClick={() => removePerson(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d6006c',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'underline'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updatePerson(idx, { name: e.target.value })}
                  placeholder="Name"
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
                <div>
                  <input
                    type="number"
                    value={person.age}
                    onChange={(e) => updatePerson(idx, { age: Number(e.target.value) })}
                    placeholder="Age"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    min="0"
                    max="120"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                  Lifetime Money Earned
                </label>
                <input
                  type="number"
                  value={person.lifetimeMoneyEarned}
                  onChange={(e) => updatePerson(idx, { lifetimeMoneyEarned: Number(e.target.value) })}
                  placeholder="$0"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  min="0"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A2540', marginBottom: '1rem', display: 'block', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                  Income Sources · Annual
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    ['w2', 'W-2 Income'],
                    ['socialSecurity1099', '1099 / Social Security'],
                    ['bonusCommissions', 'Bonus / Commissions'],
                    ['k1ScheduleE', 'K-1 / Schedule E'],
                    ['taxFreeIncome', 'Tax Free Income'],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label style={{ fontSize: '12px', color: '#666', marginBottom: '0.3rem', display: 'block' }}>
                        {label}
                      </label>
                      <input
                        type="number"
                        value={person.incomes[key as keyof typeof person.incomes] || 0}
                        onChange={(e) => updatePerson(idx, { incomes: { ...person.incomes, [key]: Number(e.target.value) } })}
                        placeholder="$0"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addPerson}
            style={{
              background: 'none',
              border: '1px solid #0088b0',
              color: '#0088b0',
              padding: '10px 18px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '2px',
              cursor: 'pointer',
              marginBottom: '2rem',
              textTransform: 'uppercase',
            }}
          >
            + Add person
          </button>

          {/* Hours Worked Weekly */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e0ddd9' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A2540', marginBottom: '1rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hours Worked Weekly
            </label>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '0.3rem', display: 'block' }}>
                Base Hours / Week
              </label>
              <input
                type="number"
                value={plan.hoursWorkedWeekly}
                onChange={(e) => updatePlan({ hoursWorkedWeekly: Number(e.target.value) })}
                placeholder="40"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                min="0"
              />
            </div>

            <div style={{ fontSize: '11px', color: '#0088b0', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem', marginTop: '1.5rem' }}>
              Job-Related Hours
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                ['commuting', 'Commuting'],
                ['costuming', 'Costuming'],
                ['meals', 'Meals'],
                ['decompression', 'Decompression'],
                ['escapeEntertainment', 'Escape Entertainment'],
                ['vacationsAndRewards', 'Vacations and Rewards'],
                ['jobRelatedIllness', 'Job-Related Illness'],
                ['servants', 'Servants'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#666', marginBottom: '0.3rem', display: 'block' }}>
                    {label}
                  </label>
                  <input
                    type="number"
                    value={plan.jobRelatedHours[key] || 0}
                    onChange={(e) => updateJobHours(key, Number(e.target.value))}
                    placeholder="0"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tax Filing */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A2540', marginBottom: '1rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tax Filing
            </label>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '0.3rem', display: 'block' }}>
                Filing Status
              </label>
              <select
                value={plan.filingStatus}
                onChange={(e) => updatePlan({ filingStatus: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                <option value="single">Single</option>
                <option value="married_jointly">Married Filing Jointly</option>
                <option value="married_separately">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '0.3rem', display: 'block' }}>
                State Tax Rate (%)
              </label>
              <input
                type="number"
                value={(plan.stateTaxRate * 100).toFixed(1)}
                onChange={(e) => updatePlan({ stateTaxRate: Number(e.target.value) / 100 })}
                placeholder="5"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                min="0"
                max="50"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Results Rail */}
        <div style={{ background: '#e9f8ff', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
            Results
          </div>
          {[
            ['Total Income', result.totalIncome, 'ink'],
            ['Net After-Tax', result.afterTaxIncome, 'pos'],
            ['Federal Tax', result.federalTax, 'tax'],
            ['State Tax', result.stateTax, 'tax'],
            ['Effective Tax Rate', `${result.effectiveRate.toFixed(1)}%`, 'tax'],
            ['Job Hours / Week', result.jobHours.toFixed(1), 'neg'],
            ['Hourly Wage', cur(result.hourlyWage), 'ink'],
            ['After-Tax Hourly', cur(result.afterTaxHourly), 'pos'],
          ].map(([label, value, tone]) => (
            <div key={label} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #cbeeff' }}>
              <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                {label}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: tone === 'pos' ? '#0088b0' : tone === 'neg' ? '#d6006c' : tone === 'tax' ? '#9b9797' : '#0A2540', fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepExpenses({ plan, result, updatePlan }: any) {
  const updateExpense = (catKey: string, itemKey: string, field: 'today' | 'tomorrow', value: number) => {
    const updated = { ...plan, expenses: { ...plan.expenses } };
    updated.expenses[catKey] = { ...plan.expenses[catKey] };
    updated.expenses[catKey][itemKey] = {
      ...updated.expenses[catKey][itemKey],
      [field]: value
    };
    updatePlan(updated);
  };

  const getCategoryTotal = (catKey: string, field: 'today' | 'tomorrow') => {
    return Object.values(plan.expenses[catKey] || {}).reduce((sum: number, exp: any) => sum + (exp[field] || 0), 0);
  };

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 2 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>My Expenses</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Standard of Living (available monthly dollars): <strong>{cur(result.standardOfLiving)}</strong> <em style={{ fontSize: '12px', color: '#999' }}>do not include savings</em>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '3rem' }}>
        <div>
          {CATS.map((category) => {
            const catExpenses = plan.expenses[category.key] || {};
            const todayTotal = getCategoryTotal(category.key, 'today');
            const tomorrowTotal = getCategoryTotal(category.key, 'tomorrow');

            return (
              <div key={category.key} style={{ background: '#fff', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #e0ddd9', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderBottom: '1px solid #e0ddd9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                    {category.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#0088b0', fontWeight: 600 }}>
                    {cur(todayTotal)} / {cur(tomorrowTotal)}
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  {category.items.map(([itemKey, itemLabel]) => {
                    const expense = catExpenses[itemKey] || { today: 0, tomorrow: 0 };
                    return (
                      <div key={itemKey} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                        <label style={{ fontSize: '12px', color: '#666' }}>
                          {itemLabel}
                        </label>
                        <input
                          type="number"
                          value={expense.today || 0}
                          onChange={(e) => updateExpense(category.key, itemKey, 'today', Number(e.target.value))}
                          placeholder="$0"
                          style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                          min="0"
                        />
                        <input
                          type="number"
                          value={expense.tomorrow || 0}
                          onChange={(e) => updateExpense(category.key, itemKey, 'tomorrow', Number(e.target.value))}
                          placeholder="$0"
                          style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                          min="0"
                        />
                      </div>
                    );
                  })}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e0ddd9', marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0A2540', textTransform: 'uppercase' }}>Subtotal</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0088b0' }}>{cur(todayTotal)}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0088b0' }}>{cur(tomorrowTotal)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#e9f8ff', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1.5rem' }}>
            Summary
          </div>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Total Monthly Today
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0088b0', fontVariantNumeric: 'tabular-nums' }}>
              {cur(result.monthlyExpensesToday)}
            </div>
          </div>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Total Monthly Tomorrow
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0088b0', fontVariantNumeric: 'tabular-nums' }}>
              {cur(result.monthlyExpensesTomorrow)}
            </div>
          </div>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Annual Today
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0088b0', fontVariantNumeric: 'tabular-nums' }}>
              {cur(result.annualExpensesToday)}
            </div>
          </div>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Surplus / Shortfall
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: result.surplus >= 0 ? '#0088b0' : '#d6006c', fontVariantNumeric: 'tabular-nums' }}>
              {cur(result.surplus)}
            </div>
          </div>
        </div>
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
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Assets, debts, and everything in between — the real picture</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem', color: '#0A2540' }}>Cash Accounts</h3>
            <input
              type="number"
              value={plan.cashAccounts[0]?.balance || 0}
              onChange={(e) => {
                const updated = { ...plan, cashAccounts: [...plan.cashAccounts] };
                if (!updated.cashAccounts[0]) updated.cashAccounts[0] = { id: 'cash-1', bank: 'Bank', balance: 0 };
                updated.cashAccounts[0].balance = Number(e.target.value);
                updatePlan(updated);
              }}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              placeholder="$0"
              min="0"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem', color: '#0A2540' }}>Investments</h3>
            <input
              type="number"
              value={plan.investments[0]?.marketValue || 0}
              onChange={(e) => {
                const updated = { ...plan, investments: [...plan.investments] };
                if (!updated.investments[0]) updated.investments[0] = { id: 'inv-1', description: '', assets: '', marketValue: 0, pledged: false, taxStatus: 'taxable' };
                updated.investments[0].marketValue = Number(e.target.value);
                updatePlan(updated);
              }}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              placeholder="$0"
              min="0"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem', color: '#0A2540' }}>Debts</h3>
            <input
              type="number"
              value={plan.debts[0]?.unpaidBalance || 0}
              onChange={(e) => {
                const updated = { ...plan, debts: [...plan.debts] };
                if (!updated.debts[0]) updated.debts[0] = { id: 'debt-1', whoYouOwe: '', collateral: 0, type: '', creditLine: 0, originalAmount: 0, unpaidBalance: 0, monthlyPayment: 0, payOffAtRetirement: false };
                updated.debts[0].unpaidBalance = Number(e.target.value);
                updatePlan(updated);
              }}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              placeholder="$0"
              min="0"
            />
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem', color: '#0A2540' }}>Real Estate Value</h3>
            <input
              type="number"
              value={plan.realEstate[0]?.marketValue || 0}
              onChange={(e) => {
                const updated = { ...plan, realEstate: [...plan.realEstate] };
                if (!updated.realEstate[0]) updated.realEstate[0] = { id: 're-1', description: '', title: '', type: 'personal', dateAcquired: '', cost: 0, marketValue: 0, originalLoan: 0, unpaidBalance: 0, monthlyPayment: 0 };
                updated.realEstate[0].marketValue = Number(e.target.value);
                updatePlan(updated);
              }}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              placeholder="$0"
              min="0"
            />
          </div>
        </div>

        <div style={{ background: '#e9f8ff', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
            Net Worth
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Total Assets</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0' }}>{cur(result.totalAssets)}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Total Liabilities</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d6006c' }}>{cur(result.totalLiabilities)}</div>
          </div>
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Net Worth</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0088b0' }}>{cur(result.netWorth)}</div>
          </div>
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
        {/* Assets */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0088b0', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            Assets
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e0ddd9' }}>
            <span>Cash on Hand</span>
            <span style={{ fontWeight: 600 }}>{cur(plan.cashAccounts[0]?.balance || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e0ddd9' }}>
            <span>Investments</span>
            <span style={{ fontWeight: 600 }}>{cur(plan.investments[0]?.marketValue || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e0ddd9' }}>
            <span>Real Estate</span>
            <span style={{ fontWeight: 600 }}>{cur(plan.realEstate[0]?.marketValue || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#0088b0', paddingTop: '1rem', borderTop: '2px solid #0088b0' }}>
            <span>Total Assets</span>
            <span>{cur(result.totalAssets)}</span>
          </div>
        </div>

        {/* Liabilities */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#d6006c', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            Liabilities
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e0ddd9' }}>
            <span>Debts</span>
            <span style={{ fontWeight: 600 }}>{cur(plan.debts[0]?.unpaidBalance || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#d6006c', paddingTop: '1rem', borderTop: '2px solid #d6006c' }}>
            <span>Total Liabilities</span>
            <span>{cur(result.totalLiabilities)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#0088b0', marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid #0088b0' }}>
            <span>NET WORTH</span>
            <span>{cur(result.netWorth)}</span>
          </div>
        </div>
      </div>

      <div style={{ background: '#e9f8ff', padding: '1.5rem', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Lifetime Wealth Saved
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0088b0' }}>
              {result.lifetimeWealthPercent.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Monthly Cash Flow
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0088b0' }}>
              {cur(result.monthlyCashFlow)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Months Covered
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0088b0' }}>
              {result.monthsCovered.toFixed(1)}
            </div>
          </div>
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Desired Monthly Retirement Income
          </label>
          <input
            type="number"
            value={plan.desiredMonthlyRetirementIncome}
            onChange={(e) => updatePlan({ desiredMonthlyRetirementIncome: Number(e.target.value) })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="$0"
            min="0"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>What you want to spend monthly</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Expected Retirement Income
          </label>
          <input
            type="number"
            value={plan.monthlyRetirementIncome}
            onChange={(e) => updatePlan({ monthlyRetirementIncome: Number(e.target.value) })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="$0"
            min="0"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Pension, part-time work, etc.</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Social Security Monthly
          </label>
          <input
            type="number"
            value={plan.socialSecurityMonthly}
            onChange={(e) => updatePlan({ socialSecurityMonthly: Number(e.target.value) })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="$0"
            min="0"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Expected monthly benefit</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Retirement Age
          </label>
          <input
            type="number"
            value={plan.retirementAge}
            onChange={(e) => updatePlan({ retirementAge: Number(e.target.value) })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="65"
            min="50"
            max="100"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Age you plan to retire</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Life Expectancy
          </label>
          <input
            type="number"
            value={plan.deathAge}
            onChange={(e) => updatePlan({ deathAge: Number(e.target.value) })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="90"
            min="60"
            max="110"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Plan conservatively</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Inflation Rate (%)
          </label>
          <input
            type="number"
            value={(plan.inflationRate * 100).toFixed(2)}
            onChange={(e) => updatePlan({ inflationRate: Number(e.target.value) / 100 })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="3.5"
            min="0"
            max="10"
            step="0.1"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Historical: 2.5-3.5%</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Withdrawal Rate (%)
          </label>
          <input
            type="number"
            value={(plan.withdrawalRate * 100).toFixed(1)}
            onChange={(e) => updatePlan({ withdrawalRate: Number(e.target.value) / 100 })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="4"
            min="1"
            max="8"
            step="0.1"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Conservative to aggressive</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Projected Growth Rate (%)
          </label>
          <input
            type="number"
            value={(plan.projectedGrowthRate * 100).toFixed(2)}
            onChange={(e) => updatePlan({ projectedGrowthRate: Number(e.target.value) / 100 })}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem' }}
            placeholder="5"
            min="-10"
            max="20"
            step="0.1"
          />
          <div style={{ fontSize: '11px', color: '#999' }}>Typical: 5-8%</div>
        </div>
      </div>

      {/* Results */}
      <div style={{ background: '#e9f8ff', padding: '2rem', borderRadius: '8px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
            Your Financial Independence Number
          </div>
          <div style={{ fontSize: 'clamp(44px, 7vw, 72px)', fontWeight: 700, color: '#0088b0', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
            {cur(result.futureSavingsNeeded)}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
            The total nest egg you need to retire on your terms
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Need from Savings (Monthly)
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0088b0' }}>
              {cur(result.needFromSavings)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Inflation-Adjusted
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0088b0' }}>
              {cur(result.inflationAdjustedNeed / 12)}/mo
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #cbeeff' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Current Liquid Savings
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0' }}>
              {cur(result.currentLiquidSavings)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Projected Savings
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0' }}>
              {cur(result.projectedSavings)}
            </div>
          </div>
        </div>

        {result.shortfall > 0 ? (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#d6006c', marginBottom: '0.5rem' }}>
              ⚠ Shortfall: {cur(result.shortfall)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Additional monthly savings needed: <strong>{cur(result.extraMonthlySavings)}/mo</strong>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #cbeeff' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0088b0' }}>
              ✓ You're on track for financial freedom!
            </div>
          </div>
        )}
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
