// Local storage version of plan saving (client-side)
// This saves plans to localStorage + an email reminder service

const STORAGE_KEY = 'calculator_plans';

interface SavedPlan {
  id: string;
  name: string;
  data: any;
  email: string;
  savedAt: string;
}

export function savePlanLocally(email: string, planName: string, planData: any) {
  const plans = getSavedPlans();
  const newPlan: SavedPlan = {
    id: Math.random().toString(36).slice(2),
    name: planName,
    data: planData,
    email,
    savedAt: new Date().toISOString(),
  };

  plans.push(newPlan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));

  // Send email reminder
  sendSaveEmail(email, planName);

  return newPlan;
}

export function getSavedPlans(email?: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const plans: SavedPlan[] = stored ? JSON.parse(stored) : [];
    return email ? plans.filter(p => p.email === email) : plans;
  } catch {
    return [];
  }
}

export function loadPlan(planId: string) {
  const plans = getSavedPlans();
  return plans.find(p => p.id === planId);
}

export function deletePlan(planId: string) {
  const plans = getSavedPlans();
  const filtered = plans.filter(p => p.id !== planId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function exportPlanAsJSON(planData: any, planName: string) {
  const json = JSON.stringify(planData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${planName}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function sendSaveEmail(email: string, planName: string) {
  // For now, just log. Later this will call a real email service
  console.log(`[DEMO] Email would be sent to ${email} about plan "${planName}"`);

  try {
    // Attempt to send via API endpoint if available
    const response = await fetch('/api/calculator/send-save-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, planName }),
    });
    return response.ok;
  } catch (error) {
    console.log('Email service not configured yet - plan saved locally');
    return false;
  }
}
