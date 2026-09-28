// Simple PDF export using canvas-based approach
export async function generatePlanPDF(planName: string, result: any, plan: any) {
  const html2pdf = (window as any).html2pdf;
  if (!html2pdf) {
    alert('PDF library not loaded. Please refresh the page.');
    return;
  }

  const content = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: #fff; color: #000;">
      <h1 style="color: #0088b0; text-align: center; font-size: 24px; margin: 0 0 10px 0;">Financial Freedom Independence Calculator</h1>
      <p style="text-align: center; color: #666; margin: 0 0 20px 0; font-size: 12px;">Generated: ${new Date().toLocaleDateString()}</p>

      <h2 style="color: #0088b0; border-bottom: 2px solid #0088b0; padding-bottom: 10px; font-size: 18px;">Plan: ${planName}</h2>

      <h3 style="color: #0088b0; margin-top: 20px; font-size: 14px;">Financial Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Net Worth</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${result.netWorth.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Annual Expenses (Today)</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.annualExpensesToday.toLocaleString()}</td>
        </tr>
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;">Monthly Cash Flow</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.monthlyCashFlow.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Savings Rate</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${result.savingsRate.toFixed(1)}%</td>
        </tr>
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;">Effective Tax Rate</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${result.effectiveRate.toFixed(1)}%</td>
        </tr>
      </table>

      <h3 style="color: #0088b0; margin-top: 20px;">Retirement Planning</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>FIN Number (Required)</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>$${result.futureSavingsNeeded.toLocaleString()}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Projected Savings at Retirement</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.projectedSavings.toLocaleString()}</td>
        </tr>
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;">Shortfall / Surplus</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: ${result.shortfall > 0 ? '#d6006c' : '#0088b0'};">
            ${result.shortfall > 0 ? '−$' + result.shortfall.toLocaleString() : '+$' + (result.projectedSavings - result.futureSavingsNeeded).toLocaleString()}
          </td>
        </tr>
      </table>

      <h3 style="color: #0088b0; margin-top: 20px;">Income & Taxes</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;">Total Annual Income</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.totalIncome.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Federal Tax</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.federalTax.toLocaleString()}</td>
        </tr>
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;">State Tax</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.stateTax.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>After-Tax Income</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>$${result.afterTaxIncome.toLocaleString()}</strong></td>
        </tr>
      </table>

      <h3 style="color: #0088b0; margin-top: 20px;">Assets & Liabilities</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;">Total Assets</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.totalAssets.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Total Liabilities</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${result.totalLiabilities.toLocaleString()}</td>
        </tr>
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Net Worth</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>$${result.netWorth.toLocaleString()}</strong></td>
        </tr>
      </table>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
        <p><strong>Disclaimer:</strong> This is not financial advice. This is intended as a worksheet for you to review with your licensed financial and legal advisors.</p>
        <p>Generated by Financial Freedom Independence Calculator</p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = content;
  element.style.cssText = 'background: white; color: black; all: revert;';

  const options = {
    margin: 10,
    filename: `${planName}-${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      allowTaint: true,
      useCORS: false,
      letterRendering: true
    },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };

  return html2pdf().set(options).from(element).save();
}
