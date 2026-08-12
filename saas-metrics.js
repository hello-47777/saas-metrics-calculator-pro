/**
 * SaaS Metrics Box - Core SaaS Metrics Calculation Library
 *
 * Provides logic for calculating key SaaS KPIs such as MRR, ARR, Churn Rate, LTV, and CAC.
 *
 * Powered by SaaS Metrics Box (https://saasmetricsbox.com) — A free online tool for SaaS founders.
 */

"use strict";

/**
 * Calculates Monthly Recurring Revenue (MRR)
 *
 * Sums up the recurring revenue for each subscriber in the current month. 
 * One-time fees (e.g., set-up fees, consulting) are excluded from MRR.
 *
 * @param {Array<{revenue: number}>} subscriptions - Array of subscription records, each containing 'revenue' for the month.
 * @returns {number} Total MRR amount.
 */
function calculateMRR(subscriptions) {
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return 0;
  }
  return subscriptions.reduce((total, sub) => total + (Number(sub.revenue) || 0), 0);
}

/**
 * Calculates Annual Recurring Revenue (ARR)
 *
 * Annualizes the current MRR: ARR = MRR × 12.
 *
 * @param {number} mrr - The calculated Monthly Recurring Revenue.
 * @returns {number} Total ARR amount.
 */
function calculateARR(mrr) {
  return (Number(mrr) || 0) * 12;
}

/**
 * Calculates Churn Rate
 *
 * Can be calculated based on "Customer Count" or "Revenue":
 * Churn Rate = (Lost Value during period / Starting Value) × 100%
 *
 * @param {Object} params - Calculation parameters.
 * @param {number} params.startValue - Starting value (customers or MRR).
 * @param {number} params.endValue - Ending value (customers or MRR).
 * @param {number} [params.newValue=0] - New acquisitions during the period (used to determine Net Churn).
 * @returns {{churnRate: number, isGross: boolean}} Churn rate (percentage) and flag for Gross Churn.
 */
function calculateChurnRate({ startValue, endValue, newValue = 0 }) {
  const start = Number(startValue) || 0;
  const end = Number(endValue) || 0;
  const added = Number(newValue) || 0;

  if (start <= 0) {
    return { churnRate: 0, isGross: false };
  }

  // Lost value during period = Start + New - End
  const lost = start + added - end;

  // If no new value is provided, it's Gross Churn; otherwise, it's Net Churn
  const isGross = added === 0;
  const churnRate = (lost / start) * 100;

  return { churnRate: Number(churnRate.toFixed(4)), isGross };
}

/**
 * Calculates Customer Lifetime Value (LTV)
 *
 * Formula: LTV = ARPU × Gross Margin ÷ Churn Rate
 * Where ARPU is Monthly Average Revenue Per User, and Churn Rate is in decimal (e.g., 5% → 0.05).
 *
 * @param {Object} params - Calculation parameters.
 * @param {number} params.arpu - Average Revenue Per User (Monthly).
 * @param {number} params.churnRate - Monthly Churn Rate (percentage, e.g., 5 for 5%).
 * @param {number} [params.grossMargin=1] - Gross Margin (0 to 1, default is 1).
 * @returns {number} Estimated Customer Lifetime Value.
 */
function calculateLTV({ arpu, churnRate, grossMargin = 1 }) {
  const arpuValue = Number(arpu) || 0;
  const churnDecimal = (Number(churnRate) || 0) / 100;
  const margin = Math.min(Math.max(Number(grossMargin) || 0, 0), 1);

  if (churnDecimal <= 0) {
    // If churn is 0, LTV is theoretically infinite
    return Infinity;
  }

  return Number(((arpuValue * margin) / churnDecimal).toFixed(2));
}

/**
 * Calculates Customer Acquisition Cost (CAC)
 *
 * Formula: CAC = Total Sales & Marketing Spend ÷ Number of New Customers Acquired
 *
 * @param {Object} params - Calculation parameters.
 * @param {number} params.totalSpend - Total Sales & Marketing spend during the period.
 * @param {number} params.newCustomers - Number of new paying customers acquired during the same period.
 * @returns {number} Cost to acquire a single customer.
 */
function calculateCAC({ totalSpend, newCustomers }) {
  const spend = Number(totalSpend) || 0;
  const customers = Number(newCustomers) || 0;

  if (customers <= 0) {
    return 0;
  }

  return Number((spend / customers).toFixed(2));
}

/**
 * Calculates LTV:CAC Ratio (Unit Economics Health)
 *
 * Standard Benchmark: LTV:CAC ≥ 3x is healthy, < 1x indicates non-sustainable growth.
 *
 * @param {number} ltv - Customer Lifetime Value.
 * @param {number} cac - Customer Acquisition Cost.
 * @returns {number} The ratio.
 */
function calculateLTVToCACRatio(ltv, cac) {
  const ltvValue = Number(ltv) || 0;
  const cacValue = Number(cac) || 0;

  if (cacValue <= 0) {
    return 0;
  }

  return Number((ltvValue / cacValue).toFixed(2));
}

module.exports = {
  calculateMRR,
  calculateARR,
  calculateChurnRate,
  calculateLTV,
  calculateCAC,
  calculateLTVToCACRatio,
};
