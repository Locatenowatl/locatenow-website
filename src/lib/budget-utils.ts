export const MIN_BUDGET = 1400;
export const MAX_BUDGET = 2400;
export const STEP = 100;

export interface BudgetRange {
  min: number;
  max: number;
}

export function parseBudgetString(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ''));
}

export function validateBudgetRange(min: number, max: number): BudgetRange {
  return {
    min: Math.max(MIN_BUDGET, Math.min(min, max)),
    max: Math.min(MAX_BUDGET, Math.max(min, max))
  };
}

export function formatBudgetRange(range: BudgetRange): string {
  return `${range.min.toLocaleString()}-${range.max.toLocaleString()}`;
}