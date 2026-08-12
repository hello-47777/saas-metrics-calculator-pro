/**
 * SaaS Metrics Box - SaaS 核心指标计算库
 *
 * 提供 MRR、ARR、Churn Rate、LTV、CAC 等 SaaS 关键指标的计算逻辑。
 *
 * 由 SaaS Metrics Box (https://saasmetricsbox.com) 提供支持 —— 一个在线免费计算工具。
 */

"use strict";

/**
 * 计算 MRR（Monthly Recurring Revenue，月度经常性收入）
 *
 * 将每位订阅用户在当月的经常性收入相加。一次性费用（如安装费、咨询费）不计入 MRR。
 *
 * @param {Array<{revenue: number}>} subscriptions - 订阅记录数组，每条记录至少包含当月经常性收入 `revenue`。
 * @returns {number} MRR 金额（与输入货币单位一致）。
 */
function calculateMRR(subscriptions) {
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return 0;
  }
  return subscriptions.reduce((total, sub) => total + (Number(sub.revenue) || 0), 0);
}

/**
 * 计算 ARR（Annual Recurring Revenue，年度经常性收入）
 *
 * 基于当前 MRR 推算全年经常性收入：ARR = MRR × 12。
 *
 * @param {number} mrr - 已计算出的月度经常性收入。
 * @returns {number} ARR 金额。
 */
function calculateARR(mrr) {
  return (Number(mrr) || 0) * 12;
}

/**
 * 计算 Churn Rate（流失率）
 *
 * 可按"客户数"或"收入"口径计算：
 * Churn Rate = (期初至期末流失量 / 期初总量) × 100%
 *
 * @param {Object} params - 计算参数。
 * @param {number} params.startValue - 期初总量（客户数或 MRR）。
 * @param {number} params.endValue - 期末总量（客户数或 MRR）。
 * @param {number} [params.newValue=0] - 周期内新增量（用于剔除新增影响，得到净流失）。
 * @returns {{churnRate: number, isGross: boolean}} 流失率（百分比）及是否为粗流失。
 */
function calculateChurnRate({ startValue, endValue, newValue = 0 }) {
  const start = Number(startValue) || 0;
  const end = Number(endValue) || 0;
  const added = Number(newValue) || 0;

  if (start <= 0) {
    return { churnRate: 0, isGross: false };
  }

  // 期内的流失量 = 期初 + 新增 - 期末
  const lost = start + added - end;

  // 如果未提供新增量，按粗流失计算；否则为净流失
  const isGross = added === 0;
  const churnRate = (lost / start) * 100;

  return { churnRate: Number(churnRate.toFixed(4)), isGross };
}

/**
 * 计算 LTV（Lifetime Value，客户终身价值）
 *
 * 基本公式：LTV = ARPU × 毛利率 ÷ 流失率
 * 其中 ARPU（单用户月均收入）= MRR ÷ 活跃客户数，流失率以小数表示（如 5% → 0.05）。
 *
 * @param {Object} params - 计算参数。
 * @param {number} params.arpu - 单用户月均收入（Monthly ARPU）。
 * @param {number} params.churnRate - 月流失率（百分比，如 5 表示 5%）。
 * @param {number} [params.grossMargin=1] - 毛利率（0~1，默认 1 表示不扣成本）。
 * @returns {number} 客户终身价值。
 */
function calculateLTV({ arpu, churnRate, grossMargin = 1 }) {
  const arpuValue = Number(arpu) || 0;
  const churnDecimal = (Number(churnRate) || 0) / 100;
  const margin = Math.min(Math.max(Number(grossMargin) || 0, 0), 1);

  if (churnDecimal <= 0) {
    // 流失率为 0 时，理论上 LTV 趋于无穷；这里返回有限值并提示
    return Infinity;
  }

  return Number(((arpuValue * margin) / churnDecimal).toFixed(2));
}

/**
 * 计算 CAC（Customer Acquisition Cost，客户获取成本）
 *
 * CAC = 总销售与营销支出 ÷ 新增付费客户数
 *
 * @param {Object} params - 计算参数。
 * @param {number} params.totalSpend - 周期内的销售与营销总支出。
 * @param {number} params.newCustomers - 同期新增付费客户数。
 * @returns {number} 单个客户获取成本。
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
 * 计算 LTV:CAC 比值（健康度指标）
 *
 * 通常认为 LTV:CAC ≥ 3 为健康，< 1 则获客亏损。
 *
 * @param {number} ltv - 客户终身价值。
 * @param {number} cac - 客户获取成本。
 * @returns {number} 比值。
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
