const API_BASE = '/api';

export async function savePlan(email: string, planName: string, planData: any) {
  const response = await fetch(`${API_BASE}/calculator/plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, planName, planData }),
  });

  if (!response.ok) {
    throw new Error('Failed to save plan');
  }

  return response.json();
}

export async function loadPlans(email: string) {
  const response = await fetch(`${API_BASE}/calculator/plans?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error('Failed to load plans');
  }

  return response.json();
}

export async function deletePlan(planId: string) {
  const response = await fetch(`${API_BASE}/calculator/plans/${planId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete plan');
  }

  return response.json();
}

export async function sendMagicLink(email: string) {
  const response = await fetch(`${API_BASE}/calculator/send-magic-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send magic link');
  }

  return response.json();
}

export async function verifyToken(token: string) {
  const response = await fetch(`${API_BASE}/calculator/verify-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify token');
  }

  return response.json();
}
