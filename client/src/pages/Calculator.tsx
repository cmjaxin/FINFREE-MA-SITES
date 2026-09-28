import { useEffect } from 'react';
import FreedomCalculator from '@/components/FreedomCalculator';
import { getCurrentAdvisor } from '@/lib/advisor-loader';

export default function CalculatorPage() {
  const advisor = getCurrentAdvisor();

  useEffect(() => {
    // Add noindex meta tag to prevent Google indexing
    const noindexMeta = document.createElement('meta');
    noindexMeta.name = 'robots';
    noindexMeta.content = 'noindex, nofollow';
    document.head.appendChild(noindexMeta);

    document.title = `Financial Freedom Calculator - ${advisor.name} | NEO Home Loans`;

    return () => {
      noindexMeta.remove();
    };
  }, [advisor.name]);

  return (
    <FreedomCalculator
      advisorName={advisor.name}
      advisorPhoto={advisor.headshot}
      youCanBookUrl={advisor.youCanBookUrl || '#'}
      showAdvisorBar={true}
    />
  );
}
