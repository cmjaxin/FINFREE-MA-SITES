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
    const samplePlan = blank('Sample Plan');
    // Populate with realistic sample data
    samplePlan.people[0] = {
      name: 'You',
      age: 42,
      lifetimeMoneyEarned: 2400000,
      incomes: { w2: 120000, socialSecurity1099: 0, bonusCommissions: 15000, k1ScheduleE: 8000, taxFreeIncome: 0 }
    };
    samplePlan.hoursWorkedWeekly = 45;
    samplePlan.filingStatus = 'married_jointly';
    samplePlan.stateTaxRate = 0.05;
    samplePlan.expenses = {
      housing: { mortgage: { today: 2800, tomorrow: 2800 }, realEstateTaxes: { today: 400, tomorrow: 400 }, electric: { today: 150, tomorrow: 150 }, other: { today: 0, tomorrow: 0 }, gas: { today: 80, tomorrow: 80 }, waterSewer: { today: 60, tomorrow: 60 }, phoneInternet: { today: 120, tomorrow: 120 }, cableSatellite: { today: 0, tomorrow: 0 }, trash: { today: 30, tomorrow: 30 }, homeRepairs: { today: 200, tomorrow: 200 }, yardWork: { today: 100, tomorrow: 100 }, mortgage2: { today: 0, tomorrow: 0 }, mortgage3: { today: 0, tomorrow: 0 } },
      auto: { carLoan: { today: 450, tomorrow: 450 }, gasoline: { today: 300, tomorrow: 300 }, parking: { today: 0, tomorrow: 0 }, licenseTabs: { today: 30, tomorrow: 30 }, repairs: { today: 100, tomorrow: 100 } },
      otherTransportation: { bus: { today: 0, tomorrow: 0 }, train: { today: 0, tomorrow: 0 } },
      food: { groceries: { today: 900, tomorrow: 900 }, eatingOut: { today: 400, tomorrow: 400 }, schoolLunches: { today: 50, tomorrow: 50 } },
      clothes: { adults: { today: 100, tomorrow: 100 }, kids: { today: 80, tomorrow: 80 } },
      entertainment: { movies: { today: 80, tomorrow: 100 }, recreationTravel: { today: 300, tomorrow: 500 }, recreationalVehicles: { today: 0, tomorrow: 0 }, other: { today: 50, tomorrow: 50 } },
      kidsActivities: { school: { today: 200, tomorrow: 200 }, lessons: { today: 100, tomorrow: 100 }, camp: { today: 0, tomorrow: 0 }, sports: { today: 150, tomorrow: 150 }, friends: { today: 50, tomorrow: 50 } },
      charity: { donations: { today: 200, tomorrow: 200 }, church: { today: 0, tomorrow: 0 } },
      medicalDental: { premiums: { today: 400, tomorrow: 400 }, copays: { today: 100, tomorrow: 100 }, prescriptions: { today: 50, tomorrow: 50 }, vitamins: { today: 30, tomorrow: 30 } },
      insurance: { auto: { today: 100, tomorrow: 100 }, life: { today: 60, tomorrow: 60 }, health: { today: 200, tomorrow: 200 }, home: { today: 80, tomorrow: 80 }, disability: { today: 0, tomorrow: 0 }, ltc: { today: 0, tomorrow: 0 } },
      allowances: { grownups: { today: 0, tomorrow: 0 }, children: { today: 100, tomorrow: 100 } },
      personal: { haircuts: { today: 60, tomorrow: 60 }, laundry: { today: 40, tomorrow: 40 }, gifts: { today: 150, tomorrow: 150 }, subscriptions: { today: 50, tomorrow: 50 } },
      debtPayments: { studentLoans: { today: 300, tomorrow: 0 }, homeEquity: { today: 0, tomorrow: 0 }, creditCards: { today: 200, tomorrow: 200 }, otherLoans: { today: 0, tomorrow: 0 } },
      other: { other: { today: 100, tomorrow: 100 } }
    };
    samplePlan.cashAccounts = [{ id: 'cash-1', bank: 'Savings', balance: 85000 }];
    samplePlan.investments = [{ id: 'inv-1', description: 'Brokerage', marketValue: 450000, taxStatus: 'taxable', pledged: false, assets: '' }];
    samplePlan.debts = [{ id: 'debt-1', whoYouOwe: 'Bank', type: 'Auto', creditLine: 0, originalAmount: 35000, unpaidBalance: 18000, monthlyPayment: 450, payOffAtRetirement: false, collateral: 0 }];
    samplePlan.desiredMonthlyRetirementIncome = 6000;
    samplePlan.retirementAge = 67;
    samplePlan.deathAge = 90;
    samplePlan.projectedGrowthRate = 0.07;
    const sampleResult = compute(samplePlan);

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
                    value={person.age || ''}
                    onChange={(e) => updatePerson(idx, { age: e.target.value === '' ? 0 : Number(e.target.value) })}
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
                  value={person.lifetimeMoneyEarned || ''}
                  onChange={(e) => updatePerson(idx, { lifetimeMoneyEarned: e.target.value === '' ? 0 : Number(e.target.value) })}
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
                        value={person.incomes[key as keyof typeof person.incomes] || ''}
                        onChange={(e) => updatePerson(idx, { incomes: { ...person.incomes, [key]: e.target.value === '' ? 0 : Number(e.target.value) } })}
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
                value={plan.hoursWorkedWeekly || ''}
                onChange={(e) => updatePlan({ hoursWorkedWeekly: e.target.value === '' ? 0 : Number(e.target.value) })}
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
                    value={plan.jobRelatedHours[key] || ''}
                    onChange={(e) => updateJobHours(key, e.target.value === '' ? 0 : Number(e.target.value))}
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
                          value={expense.today || ''}
                          onChange={(e) => updateExpense(category.key, itemKey, 'today', e.target.value === '' ? 0 : Number(e.target.value))}
                          placeholder="$0"
                          style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                          min="0"
                        />
                        <input
                          type="number"
                          value={expense.tomorrow || ''}
                          onChange={(e) => updateExpense(category.key, itemKey, 'tomorrow', e.target.value === '' ? 0 : Number(e.target.value))}
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
  const addScheduleItem = (scheduleKey: string) => {
    const updated = { ...plan, [scheduleKey]: [...(plan[scheduleKey] || [])] };
    const uid = () => Math.random().toString(36).slice(2, 10);

    if (scheduleKey === 'debts') {
      updated.debts.push({ id: uid(), whoYouOwe: '', collateral: 0, type: '', creditLine: 0, originalAmount: 0, unpaidBalance: 0, monthlyPayment: 0, payOffAtRetirement: false });
    } else if (scheduleKey === 'investments') {
      updated.investments.push({ id: uid(), description: '', assets: '', marketValue: 0, pledged: false, taxStatus: 'taxable' });
    } else if (scheduleKey === 'cashAccounts') {
      updated.cashAccounts.push({ id: uid(), bank: '', balance: 0 });
    } else if (scheduleKey === 'realEstate') {
      updated.realEstate.push({ id: uid(), description: '', title: '', type: 'personal', dateAcquired: '', cost: 0, marketValue: 0, originalLoan: 0, unpaidBalance: 0, monthlyPayment: 0 });
    }
    updatePlan(updated);
  };

  const updateScheduleItem = (scheduleKey: string, index: number, field: string, value: any) => {
    const updated = { ...plan, [scheduleKey]: [...plan[scheduleKey]] };
    updated[scheduleKey][index] = { ...updated[scheduleKey][index], [field]: value };
    updatePlan(updated);
  };

  const removeScheduleItem = (scheduleKey: string, index: number) => {
    const updated = { ...plan, [scheduleKey]: plan[scheduleKey].filter((_: any, i: number) => i !== index) };
    updatePlan(updated);
  };

  const ScheduleSection = ({ title, items, scheduleKey, fields }: any) => (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e0ddd9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A2540', margin: 0 }}>
          {title}
        </h3>
        <button
          onClick={() => addScheduleItem(scheduleKey)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0088b0',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          + Add
        </button>
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
          No items yet
        </div>
      ) : (
        items.map((item: any, idx: number) => (
          <div key={item.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: idx < items.length - 1 ? '1px solid #e0ddd9' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2540' }}>
                {title} {idx + 1}
              </div>
              <button
                onClick={() => removeScheduleItem(scheduleKey, idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d6006c',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                ✕ Remove
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {fields.map((field: any) => (
                <div key={field.key}>
                  <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={item[field.key] || ''}
                      onChange={(e) => updateScheduleItem(scheduleKey, idx, field.key, e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    >
                      {field.options?.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      key={`input-${item.id}-${field.key}`}
                      type={field.type || 'text'}
                      defaultValue={item[field.key] || ''}
                      onBlur={(e) => {
                        const val = e.target.value;
                        updateScheduleItem(scheduleKey, idx, field.key, field.type === 'number' ? (val === '' ? 0 : Number(val)) : val);
                      }}
                      placeholder={field.placeholder || ''}
                      style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                      min={field.min}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 3 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Net Worth</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Schedules 1–7: a complete picture of what you own and owe.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '3rem' }}>
        <div>
          <ScheduleSection
            title="Debts / Credit Lines"
            items={plan.debts}
            scheduleKey="debts"
            fields={[
              { key: 'whoYouOwe', label: 'Who You Owe', type: 'text', placeholder: 'Bank name' },
              { key: 'type', label: 'Type', type: 'text', placeholder: 'Auto Loan' },
              { key: 'creditLine', label: 'Credit Line $', type: 'number' },
              { key: 'originalAmount', label: 'Original Amt $', type: 'number' },
              { key: 'unpaidBalance', label: 'Unpaid Bal $', type: 'number' },
              { key: 'monthlyPayment', label: 'Mo. Payment $', type: 'number' },
            ]}
          />

          <ScheduleSection
            title="Investments (Liquid)"
            items={plan.investments}
            scheduleKey="investments"
            fields={[
              { key: 'description', label: 'Description', type: 'text' },
              { key: 'marketValue', label: 'Market Value $', type: 'number' },
              { key: 'growthRate', label: 'Annual Growth %', type: 'number' },
              { key: 'taxStatus', label: 'Tax Status', type: 'select', options: ['Taxable', 'Tax Deferred', 'Tax Free'] },
            ]}
          />

          <ScheduleSection
            title="Cash Accounts"
            items={plan.cashAccounts}
            scheduleKey="cashAccounts"
            fields={[
              { key: 'bank', label: 'Bank', type: 'text' },
              { key: 'balance', label: 'Balance $', type: 'number' },
              { key: 'growthRate', label: 'Interest Rate %', type: 'number' },
            ]}
          />

          <ScheduleSection
            title="Real Estate"
            items={plan.realEstate}
            scheduleKey="realEstate"
            fields={[
              { key: 'description', label: 'Description', type: 'text' },
              { key: 'marketValue', label: 'Market Value $', type: 'number' },
              { key: 'growthRate', label: 'Annual Appreciation %', type: 'number' },
              { key: 'unpaidBalance', label: 'Unpaid Balance $', type: 'number' },
              { key: 'monthlyPayment', label: 'Mo. Payment $', type: 'number' },
            ]}
          />
        </div>

        <div style={{ background: '#e9f8ff', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1.5rem' }}>
            Net Worth Summary
          </div>
          {[
            ['Total Assets', result.totalAssets, 'ink'],
            ['Total Liabilities', result.totalLiabilities, 'neg'],
            ['Net Worth', result.netWorth, 'pos'],
          ].map(([label, value, tone]) => (
            <div key={label} style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: label === 'Net Worth' ? 'none' : '1px solid #cbeeff' }}>
              <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                {label}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: tone === 'pos' ? '#0088b0' : tone === 'neg' ? '#d6006c' : '#0A2540', fontVariantNumeric: 'tabular-nums' }}>
                {cur(value as number)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPIN({ plan, result }: any) {
  const dotLedger = (label: string, value: number, isBold = false) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: isBold ? '14px' : '13px', color: '#0A2540', marginBottom: '0.8rem', fontWeight: isBold ? 700 : 400 }}>
      <span>{label}</span>
      <span style={{ flex: 1, borderBottom: `1px dotted ${isBold ? '#0A2540' : '#ccc'}`, marginLeft: '0.5rem', marginRight: '0.5rem' }} />
      <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{cur(value)}</span>
    </div>
  );

  const assetTotals = {
    realEstate: (plan.realEstate || []).reduce((sum: number, r: any) => sum + (r.marketValue || 0), 0),
    investments: (plan.investments || []).reduce((sum: number, i: any) => sum + (i.marketValue || 0), 0),
    cashAccounts: (plan.cashAccounts || []).reduce((sum: number, c: any) => sum + (c.balance || 0), 0),
    liabilities: (plan.debts || []).reduce((sum: number, d: any) => sum + (d.unpaidBalance || 0), 0),
  };

  const totalAssets = assetTotals.realEstate + assetTotals.investments + assetTotals.cashAccounts;

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 4 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Personal Balance Sheet</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Your complete financial snapshot — assets and liabilities at a glance.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Assets */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#0088b0', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            Assets
          </h3>
          {dotLedger('Real Estate (Market Value)', assetTotals.realEstate)}
          {dotLedger('Investments (Liquid)', assetTotals.investments)}
          {dotLedger('Cash & Accounts', assetTotals.cashAccounts)}
          <div style={{ borderTop: '2px solid #0A2540', paddingTop: '1rem', marginTop: '1rem' }}>
            {dotLedger('Total Assets', totalAssets, true)}
          </div>
        </div>

        {/* Liabilities */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#d6006c', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            Liabilities
          </h3>
          {dotLedger('Debts & Credit Lines', assetTotals.liabilities)}
          <div style={{ borderTop: '2px solid #d6006c', paddingTop: '1rem', marginTop: '1rem' }}>
            {dotLedger('Total Liabilities', assetTotals.liabilities, true)}
          </div>
        </div>
      </div>

      {/* Net Worth Summary */}
      <div style={{ background: 'linear-gradient(135deg, #e9f8ff 0%, #f0fbff 100%)', padding: '2.5rem', borderRadius: '8px', border: '1px solid #cbeeff', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          NET WORTH
        </div>
        <div style={{ fontSize: 'clamp(42px, 6vw, 60px)', fontWeight: 700, color: '#0088b0', marginBottom: '1rem', fontVariantNumeric: 'tabular-nums' }}>
          {cur(result.netWorth)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #cbeeff' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Wealth Saved
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0' }}>
              {result.lifetimeWealthPercent.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Months Covered
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0' }}>
              {result.monthsCovered.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepFIN({ plan, result, updatePlan }: any) {
  const InputCard = ({ label, value, onChange, placeholder, min, max, step, hint }: any) => (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#0088b0', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem', boxSizing: 'border-box' }}
      />
      {hint && <div style={{ fontSize: '11px', color: '#999' }}>{hint}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 5 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Financial Independence Number</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Calculate the nest egg you need to retire on your terms.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <InputCard
          label="Desired Monthly Income"
          value={plan.desiredMonthlyRetirementIncome}
          onChange={(e: any) => updatePlan({ desiredMonthlyRetirementIncome: Number(e.target.value) })}
          placeholder="$5000"
          min="0"
          hint="What you want to spend monthly"
        />
        <InputCard
          label="Expected Other Income"
          value={plan.monthlyRetirementIncome}
          onChange={(e: any) => updatePlan({ monthlyRetirementIncome: Number(e.target.value) })}
          placeholder="$1000"
          min="0"
          hint="Pension, part-time work, rental"
        />
        <InputCard
          label="Social Security/Mo"
          value={plan.socialSecurityMonthly}
          onChange={(e: any) => updatePlan({ socialSecurityMonthly: Number(e.target.value) })}
          placeholder="$2000"
          min="0"
          hint="Expected monthly benefit"
        />
        <InputCard
          label="Retirement Age"
          value={plan.retirementAge}
          onChange={(e: any) => updatePlan({ retirementAge: Number(e.target.value) })}
          placeholder="65"
          min="50"
          max="100"
          hint="Age you plan to retire"
        />
        <InputCard
          label="Life Expectancy"
          value={plan.deathAge}
          onChange={(e: any) => updatePlan({ deathAge: Number(e.target.value) })}
          placeholder="90"
          min="60"
          max="110"
          hint="Plan conservatively"
        />
        <InputCard
          label="Inflation Rate (%)"
          value={(plan.inflationRate * 100).toFixed(2)}
          onChange={(e: any) => updatePlan({ inflationRate: Number(e.target.value) / 100 })}
          placeholder="3.5"
          min="0"
          max="10"
          step="0.1"
          hint="Historical: 2.5-3.5%"
        />
        <InputCard
          label="Withdrawal Rate (%)"
          value={(plan.withdrawalRate * 100).toFixed(1)}
          onChange={(e: any) => updatePlan({ withdrawalRate: Number(e.target.value) / 100 })}
          placeholder="4"
          min="1"
          max="8"
          step="0.1"
          hint="Conservative to aggressive"
        />
        <InputCard
          label="Growth Rate (%)"
          value={(plan.projectedGrowthRate * 100).toFixed(2)}
          onChange={(e: any) => updatePlan({ projectedGrowthRate: Number(e.target.value) / 100 })}
          placeholder="5"
          min="-10"
          max="20"
          step="0.1"
          hint="Typical: 5-8%"
        />
      </div>

      {/* FIN Number Result */}
      <div style={{ background: 'linear-gradient(135deg, #e9f8ff 0%, #f0fbff 100%)', padding: '2.5rem', borderRadius: '8px', border: '1px solid #cbeeff', marginBottom: '2rem' }}>
        <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>
          Your Financial Independence Number
        </div>
        <div style={{ fontSize: 'clamp(44px, 7vw, 68px)', fontWeight: 700, color: '#0088b0', marginBottom: '1rem', fontVariantNumeric: 'tabular-nums' }}>
          {cur(result.futureSavingsNeeded)}
        </div>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          The total nest egg you need to retire on your terms and sustain your lifestyle through age {plan.deathAge}.
        </p>
      </div>

      {/* Status Banner */}
      {result.shortfall > 0 ? (
        <div style={{ background: '#ffe9f1', border: '1px solid #ff99bb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#d6006c', marginBottom: '0.5rem' }}>
            ⚠ Shortfall of {cur(result.shortfall)}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            You need to save an additional <strong>{cur(result.extraMonthlySavings)}/month</strong> to meet your retirement goal.
          </div>
        </div>
      ) : (
        <div style={{ background: '#e9ffe9', border: '1px solid #99ff99', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0088b0', marginBottom: '0.5rem' }}>
            ✓ Surplus of {cur(result.projectedSavings - result.futureSavingsNeeded)}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            You're on track for financial freedom! You'll have {cur(result.projectedSavings - result.futureSavingsNeeded)} extra after meeting your retirement goal.
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
          <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 600 }}>
            Current Liquid Savings
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0', fontVariantNumeric: 'tabular-nums' }}>
            {cur(result.currentLiquidSavings)}
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
          <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 600 }}>
            Projected Savings at {plan.retirementAge}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0', fontVariantNumeric: 'tabular-nums' }}>
            {cur(result.projectedSavings)}
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0ddd9' }}>
          <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 600 }}>
            Monthly Need from Savings
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0088b0', fontVariantNumeric: 'tabular-nums' }}>
            {cur(result.needFromSavings)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDashboard({ plan, result, youCanBookUrl, advisorName }: any) {
  const downloadResults = () => {
    const data = `FINANCIAL FREEDOM CALCULATOR RESULTS
${new Date().toLocaleDateString()}

PLAN: ${plan.name}

=== SUMMARY ===
Net Worth: ${cur(result.netWorth)}
Annual Expenses (Today): ${cur(result.annualExpensesToday)}
Monthly Cash Flow: ${cur(result.monthlyCashFlow)}
Effective Tax Rate: ${result.effectiveRate.toFixed(1)}%
Savings Rate: ${result.savingsRate.toFixed(1)}%

=== FINANCIAL INDEPENDENCE NUMBER ===
FIN Number (Retirement Nest Egg): ${cur(result.futureSavingsNeeded)}
Current Liquid Savings: ${cur(result.currentLiquidSavings)}
Projected Savings at Retirement: ${cur(result.projectedSavings)}
Status: ${result.shortfall > 0 ? `Shortfall of ${cur(result.shortfall)}` : `Surplus of ${cur(result.projectedSavings - result.futureSavingsNeeded)}`}

=== INCOME & TAXES ===
Total Annual Income: ${cur(result.totalIncome)}
After-Tax Income: ${cur(result.annualIncomeAfterTax)}
Federal Tax: ${cur(result.federalTax)}
State Tax: ${cur(result.stateTax)}

=== WEALTH METRICS ===
Lifetime Wealth Saved: ${result.lifetimeWealthPercent.toFixed(1)}%
Months of Expenses Covered: ${result.monthsCovered.toFixed(1)}

This is not financial advice. Consult with a licensed financial advisor before making investment decisions.`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial-Freedom-Results-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#0088b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        STEP 6 OF 6
      </div>
      <h2 style={{ fontSize: 'clamp(32px,4.5vw,46px)', marginBottom: '1rem', lineHeight: 1.05 }}>Your Financial Summary</h2>

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

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <button
          onClick={downloadResults}
          style={{
            background: '#f3f2f2',
            color: '#0088b0',
            border: '1px solid #e0ddd9',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#e9f8ff'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f3f2f2'}
        >
          ↓ Download Results
        </button>
        <a
          href={youCanBookUrl && youCanBookUrl !== '#' ? youCanBookUrl : '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!youCanBookUrl || youCanBookUrl === '#') {
              e.preventDefault();
              alert('Schedule consultation URL not configured for this advisor.');
            }
          }}
          style={{
            display: 'inline-block',
            background: '#0088b0',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            textAlign: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#006786'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#0088b0'}
        >
          Schedule Consultation →
        </a>
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
          Schedule a consultation with {advisorName} to review your results and explore next steps toward financial freedom.
        </p>
        {youCanBookUrl && youCanBookUrl !== '#' ? (
          <a
            href={youCanBookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#0088b0',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#006786'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#0088b0'}
          >
            Schedule on YouCanBook.me →
          </a>
        ) : (
          <div style={{ display: 'inline-block', background: '#ffe9f1', color: '#d6006c', padding: '14px 32px', borderRadius: '6px', fontWeight: 600, fontSize: '15px' }}>
            Schedule link not available
          </div>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '2rem', textAlign: 'center' }}>
        <strong>Disclaimer:</strong> This is not financial advice — this is intended as a worksheet for you to review with your licensed financial and legal advisors.
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
