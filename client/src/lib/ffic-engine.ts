// Financial Freedom Independence Calculator — ported to TypeScript
// Core calculation engine and data models

const SAMPLE_ID = 'ffic-sample-thompson-v1';

export const CATS = [
  { key: 'housing', name: 'Housing', items: [['mortgage', 'Mortgage (rent)'], ['mortgage2', 'Mortgage 2'], ['mortgage3', 'Mortgage 3'], ['realEstateTaxes', 'Real estate taxes'], ['gas', 'Gas'], ['electric', 'Electric'], ['waterSewer', 'Water/sewer'], ['phoneInternet', 'Phone/Internet'], ['cableSatellite', 'Cable/satellite'], ['trash', 'Trash collection'], ['homeRepairs', 'Home repairs/maint.'], ['yardWork', 'Yard work/snow removal']] },
  { key: 'auto', name: 'Auto', items: [['carLoan', 'Car loan/lease pmt.'], ['gasoline', 'Gasoline'], ['parking', 'Parking fees'], ['licenseTabs', 'License tabs'], ['repairs', 'Repairs/maint.']] },
  { key: 'otherTransportation', name: 'Other Transportation', items: [['bus', 'Bus'], ['train', 'Train']] },
  { key: 'food', name: 'Food', items: [['groceries', 'Groceries'], ['eatingOut', 'Eating out'], ['schoolLunches', 'School lunches']] },
  { key: 'clothes', name: 'Clothes', items: [['adults', 'Adult(s)'], ['kids', 'Kid(s)']] },
  { key: 'entertainment', name: 'Entertainment', items: [['movies', 'Movies/sporting events'], ['recreationTravel', 'Recreation / Travel'], ['recreationalVehicles', 'Recreational Vehicles'], ['other', 'Other']] },
  { key: 'kidsActivities', name: "Kid's Activities", items: [['school', 'School'], ['lessons', 'Lessons'], ['camp', 'Camp'], ['sports', 'Sports'], ['friends', 'Activities with friends']] },
  { key: 'charity', name: 'Charity', items: [['donations', 'Donations'], ['church', 'Church pledge']] },
  { key: 'medicalDental', name: 'Medical/Dental', items: [['premiums', 'Premiums'], ['copays', 'Co-pays'], ['prescriptions', 'Prescriptions'], ['vitamins', 'Vitamins']] },
  { key: 'insurance', name: 'Insurance', items: [['auto', 'Auto'], ['life', 'Life'], ['health', 'Health'], ['home', 'Home'], ['disability', 'Disability'], ['ltc', 'Long-term care']] },
  { key: 'allowances', name: 'Allowances', items: [['grownups', 'Grown-ups'], ['children', 'Children']] },
  { key: 'personal', name: 'Personal', items: [['haircuts', 'Haircuts/etc.'], ['laundry', 'Dry cleaning/laundry'], ['gifts', 'Gifts'], ['subscriptions', 'Subscriptions']] },
  { key: 'debtPayments', name: 'Debt Payments', items: [['studentLoans', 'Student loans'], ['homeEquity', 'Home equity loan'], ['creditCards', 'Credit cards'], ['otherLoans', 'Other loans']] },
  { key: 'other', name: 'Other', items: [['other', 'Other']] },
];

const JOB_HOURS = [['commuting', 'Commuting'], ['costuming', 'Costuming'], ['meals', 'Meals'], ['decompression', 'Decompression'], ['escapeEntertainment', 'Escape Entertainment'], ['vacationsAndRewards', 'Vacations and Rewards'], ['jobRelatedIllness', 'Job-Related Illness'], ['servants', 'Servants']];

const FILING = [['single', 'Single'], ['married_jointly', 'Married Filing Jointly'], ['married_separately', 'Married Filing Separately'], ['head_of_household', 'Head of Household']];
const STD = { single: 16100, married_jointly: 32200, married_separately: 16100, head_of_household: 24150 };
const RATES = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
const BRACKETS = {
  single: [12400, 50400, 105700, 201775, 256225, 640600, Infinity],
  married_jointly: [24800, 100800, 211400, 403550, 512450, 768700, Infinity],
  married_separately: [12400, 50400, 105700, 201775, 256225, 384350, Infinity],
  head_of_household: [17700, 67450, 105700, 201750, 256200, 640600, Infinity],
};

export interface Person {
  name: string;
  age: number;
  lifetimeMoneyEarned: number;
  incomes: {
    w2: number;
    socialSecurity1099: number;
    bonusCommissions: number;
    k1ScheduleE: number;
    taxFreeIncome: number;
  };
}

export interface Expense {
  today: number;
  tomorrow: number;
}

export interface Debt {
  id: string;
  whoYouOwe: string;
  collateral: number;
  type: string;
  creditLine: number;
  originalAmount: number;
  unpaidBalance: number;
  monthlyPayment: number;
  payOffAtRetirement: boolean;
}

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  people: Person[];
  hoursWorkedWeekly: number;
  jobRelatedHours: Record<string, number>;
  filingStatus: string;
  stateTaxRate: number;
  expenses: Record<string, Record<string, Expense>>;
  debts: Debt[];
  receivables: any[];
  lifeInsurance: any[];
  investments: any[];
  businesses: any[];
  realEstate: any[];
  cashAccounts: any[];
  desiredMonthlyRetirementIncome: number;
  monthlyRetirementIncome: number;
  socialSecurityMonthly: number;
  socialSecurityType: string;
  retirementAge: number;
  deathAge: number;
  inflationRate: number;
  withdrawalRate: number;
  projectedGrowthRate: number;
  completedSteps: number[];
  isSample?: boolean;
}

export interface ComputedResult {
  totalIncome: number;
  annualIncomeAfterTax: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  afterTaxIncome: number;
  effectiveRate: number;
  jobHours: number;
  hourlyWage: number;
  afterTaxHourly: number;
  standardOfLiving: number;
  monthlyExpensesToday: number;
  monthlyExpensesTomorrow: number;
  annualExpensesToday: number;
  annualExpensesTomorrow: number;
  surplus: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  lifetimeWealth: number;
  lifetimeWealthPercent: number;
  monthlyCashFlow: number;
  savingsRate: number;
  monthsCovered: number;
  yearsToRetirement: number;
  needFromSavings: number;
  inflationAdjustedNeed: number;
  futureSavingsNeeded: number;
  currentLiquidSavings: number;
  projectedSavings: number;
  shortfall: number;
  extraMonthlySavings: number;
  progress: number;
  projectionYears: number[];
  projectionValues: number[];
}

const num = (v: any): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const clamp = (v: any, a: number, b: number): number => Math.min(b, Math.max(a, num(v)));

const sum = (arr: any[], f: (x: any) => number): number => arr.reduce((s, x) => s + num(f(x)), 0);

const uid = (): string => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

function emptyExpenses(): Record<string, Record<string, Expense>> {
  const e: Record<string, Record<string, Expense>> = {};
  CATS.forEach((c) => {
    e[c.key] = {};
    c.items.forEach(([k]) => {
      e[c.key][k] = { today: 0, tomorrow: 0 };
    });
  });
  return e;
}

function emptyPerson(name: string = ''): Person {
  return {
    name,
    age: 0,
    lifetimeMoneyEarned: 0,
    incomes: { w2: 0, socialSecurity1099: 0, bonusCommissions: 0, k1ScheduleE: 0, taxFreeIncome: 0 },
  };
}

export function blank(name: string = 'My Financial Plan'): Profile {
  const now = new Date().toISOString();
  return {
    id: 'ffic-' + uid(),
    name,
    createdAt: now,
    updatedAt: now,
    people: [emptyPerson('')],
    hoursWorkedWeekly: 40,
    jobRelatedHours: Object.fromEntries(JOB_HOURS.map(([k]) => [k, 0])),
    filingStatus: 'single',
    stateTaxRate: 0.05,
    expenses: emptyExpenses(),
    debts: [],
    receivables: [],
    lifeInsurance: [],
    investments: [],
    businesses: [],
    realEstate: [],
    cashAccounts: [],
    desiredMonthlyRetirementIncome: 0,
    monthlyRetirementIncome: 0,
    socialSecurityMonthly: 0,
    socialSecurityType: 'single',
    retirementAge: 65,
    deathAge: 90,
    inflationRate: 0.035,
    withdrawalRate: 0.04,
    projectedGrowthRate: 0.05,
    completedSteps: [],
  };
}

function federalTax(taxableIncome: number, status: string): number {
  const brackets = BRACKETS[status as keyof typeof BRACKETS];
  let tax = 0;
  let prevBracket = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const rate = RATES[i];
    if (taxableIncome <= prevBracket) break;
    const taxableInThisBracket = Math.min(taxableIncome, bracket) - prevBracket;
    tax += taxableInThisBracket * rate;
    prevBracket = bracket;
  }

  return tax;
}

export function compute(profile: Profile, { includeRE = true } = {}): ComputedResult {
  const { people, hoursWorkedWeekly, jobRelatedHours, filingStatus, stateTaxRate, expenses, debts } = profile;

  // Income
  const totalIncome = sum(people, (p) => sum(Object.values(p.incomes), (v) => v));
  const std = STD[filingStatus as keyof typeof STD] || 16100;
  const taxableIncome = Math.max(0, totalIncome - std);
  const fedTax = federalTax(taxableIncome, filingStatus);
  const stateTax = totalIncome * clamp(stateTaxRate, 0, 0.5);
  const ficaTax = totalIncome * 0.0765; // Social Security 6.2% + Medicare 1.45%
  const afterTaxIncome = totalIncome - fedTax - stateTax - ficaTax;

  // Hours & wage
  const jobRelatedTotal = sum(Object.values(jobRelatedHours), (v) => v);
  const totalJobHours = hoursWorkedWeekly + jobRelatedTotal;
  const hourlyWage = hoursWorkedWeekly > 0 ? totalIncome / 52 / hoursWorkedWeekly : 0;
  const afterTaxHourly = hoursWorkedWeekly > 0 ? afterTaxIncome / 52 / hoursWorkedWeekly : 0;

  // Expenses
  const monthlyExpensesToday = sum(Object.values(expenses), (cat) => sum(Object.values(cat), (e) => e.today));
  const monthlyExpensesTomorrow = sum(Object.values(expenses), (cat) => sum(Object.values(cat), (e) => e.tomorrow));
  const annualExpensesToday = monthlyExpensesToday * 12;
  const annualExpensesTomorrow = monthlyExpensesTomorrow * 12;
  const surplus = afterTaxIncome - annualExpensesToday;

  // Net worth - INCLUDES real estate by default
  const debtPayments = sum(debts, (d) => d.monthlyPayment);
  const totalLiabilities = sum(debts, (d) => d.unpaidBalance);
  const totalAssets = sum(profile.investments, (inv) => inv.marketValue) +
    sum(profile.cashAccounts, (c) => c.balance) +
    sum(profile.lifeInsurance, (l) => l.cashValue) +
    sum(profile.realEstate, (r) => r.marketValue);
  const netWorth = totalAssets - totalLiabilities;
  const lifetimeEarned = sum(people, (p) => p.lifetimeMoneyEarned);
  const lifetimeWealthPercent = lifetimeEarned > 0 ? (netWorth / lifetimeEarned) * 100 : 0;

  // Cash flow
  const monthlyCashFlow = surplus / 12;
  const savingsRate = afterTaxIncome > 0 ? (surplus / afterTaxIncome) * 100 : 0;
  const liquidSavings = sum(profile.cashAccounts, (c) => c.balance) +
    sum(profile.investments, (inv) => inv.marketValue) +
    sum(profile.lifeInsurance, (l) => l.cashValue);
  const monthsCovered = monthlyExpensesToday > 0 ? liquidSavings / monthlyExpensesToday : 0;

  // Retirement
  const person1Age = people[0]?.age || 0;
  const yearsToRetirement = Math.max(0, clamp(profile.retirementAge, 0, 120) - person1Age);
  const needFromSavings = Math.max(0,
    clamp(profile.desiredMonthlyRetirementIncome, 0, Infinity) -
    clamp(profile.socialSecurityMonthly, 0, Infinity) -
    clamp(profile.monthlyRetirementIncome, 0, Infinity)
  );
  const inflationFactor = Math.pow(1 + clamp(profile.inflationRate, 0, 0.5), yearsToRetirement);
  const inflationAdjustedNeed = needFromSavings * 12 * inflationFactor;
  const lifeExpectancy = clamp(profile.deathAge, 0, 120);
  const yearsInRetirement = Math.max(0, lifeExpectancy - clamp(profile.retirementAge, 0, 120));
  const withdrawalRate = clamp(profile.withdrawalRate, 0, 0.2);
  const futureSavingsNeeded = withdrawalRate > 0 ? inflationAdjustedNeed / withdrawalRate : 0;

  // Projection - calculate weighted growth rate from individual assets
  const investmentValue = sum(profile.investments, (inv) => inv.marketValue) || 0;
  const cashValue = sum(profile.cashAccounts, (c) => c.balance) || 0;
  const realEstateValue = sum(profile.realEstate, (r) => r.marketValue) || 0;
  const totalAssetValue = investmentValue + cashValue + realEstateValue;

  let weightedGrowthRate = clamp(profile.projectedGrowthRate, -0.2, 0.5);
  if (totalAssetValue > 0) {
    const investmentGrowth = investmentValue > 0 ? sum(profile.investments, (inv) => (inv.marketValue || 0) * clamp(inv.growthRate || 0.07, -0.2, 0.5)) / investmentValue : 0;
    const cashGrowth = cashValue > 0 ? sum(profile.cashAccounts, (c) => (c.balance || 0) * clamp(c.growthRate || 0.01, -0.2, 0.5)) / cashValue : 0;
    const realEstateGrowth = realEstateValue > 0 ? sum(profile.realEstate, (r) => (r.marketValue || 0) * clamp(r.growthRate || 0.03, -0.2, 0.5)) / realEstateValue : 0;

    weightedGrowthRate = (investmentValue * investmentGrowth + cashValue * cashGrowth + realEstateValue * realEstateGrowth) / totalAssetValue;
  }

  const growthRate = clamp(weightedGrowthRate, -0.2, 0.5);
  const annualContribution = Math.max(0, surplus);
  const projectionYears: number[] = [];
  const projectionValues: number[] = [];

  for (let year = 0; year <= yearsToRetirement; year += 1) {
    const gr = growthRate || 0.001;
    const compounding = Math.pow(1 + gr, year);
    const presentValue = liquidSavings * compounding;
    const futureContribution = annualContribution * (compounding - 1) / gr;
    const value = Math.max(0, presentValue + futureContribution);
    projectionYears.push(year);
    projectionValues.push(value);
  }

  const projectedSavings = projectionValues[projectionValues.length - 1] || liquidSavings;
  const shortfall = Math.max(0, futureSavingsNeeded - projectedSavings);
  const gr = growthRate || 0.001;
  const annuityFactor = (Math.pow(1 + gr, yearsToRetirement) - 1) / gr;
  const extraMonthlySavings = yearsToRetirement > 0 ? (shortfall / annuityFactor) / 12 : 0;
  const progress = futureSavingsNeeded > 0 ? (projectedSavings / futureSavingsNeeded) * 100 : 100;

  return {
    totalIncome,
    annualIncomeAfterTax: afterTaxIncome,
    federalTax: fedTax,
    stateTax,
    ficaTax,
    afterTaxIncome,
    effectiveRate: totalIncome > 0 ? ((fedTax + stateTax + ficaTax) / totalIncome) * 100 : 0,
    jobHours: totalJobHours,
    hourlyWage,
    afterTaxHourly,
    standardOfLiving: monthlyExpensesToday,
    monthlyExpensesToday,
    monthlyExpensesTomorrow,
    annualExpensesToday,
    annualExpensesTomorrow,
    surplus,
    totalAssets,
    totalLiabilities,
    netWorth,
    lifetimeWealth: lifetimeEarned,
    lifetimeWealthPercent: lifetimeWealthPercent,
    monthlyCashFlow,
    savingsRate,
    monthsCovered,
    yearsToRetirement,
    needFromSavings,
    inflationAdjustedNeed,
    futureSavingsNeeded,
    currentLiquidSavings: liquidSavings,
    projectedSavings,
    shortfall,
    extraMonthlySavings,
    progress,
    projectionYears,
    projectionValues,
  };
}

export function cur(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
}

export function pct(v: number, decimals = 1): string {
  return (v * 100).toFixed(decimals) + '%';
}
