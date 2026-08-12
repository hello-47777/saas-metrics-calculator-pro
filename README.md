<div align="center">

# 📊 SaaS Metrics Box

### 轻量级 SaaS 核心指标计算库

**MRR · ARR · Churn Rate · LTV · CAC —— 一行代码，洞察增长健康度**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)]()
[![Powered by SaaS Metrics Box](https://img.shields.io/badge/Powered%20by-SaaS%20Metrics%20Box-FF6B6B?style=flat-square)](https://saasmetricsbox.com)

</div>

---

> 🌟 **这个库由 [SaaS Metrics Box](https://saasmetricsbox.com) 提供支持** —— 一个**在线免费**的 SaaS 指标计算工具，无需注册，打开即用，帮助你快速测算 MRR、ARR、Churn Rate、LTV、CAC 等关键指标。

---

## 📖 目录

- [✨ 功能特性](#-功能特性)
- [📦 安装与引入](#-安装与引入)
- [🚀 快速上手](#-快速上手)
- [📐 指标详解](#-指标详解)
  - [MRR — 月度经常性收入](#mrr--月度经常性收入)
  - [ARR — 年度经常性收入](#arr--年度经常性收入)
  - [Churn Rate — 流失率](#churn-rate--流失率)
  - [LTV — 客户终身价值](#ltv--客户终身价值)
  - [CAC — 客户获取成本](#cac--客户获取成本)
  - [LTV:CAC 比值 — 健康度指标](#ltvcac-比值--健康度指标)
- [📊 指标速查表](#-指标速查表)
- [🧪 完整示例](#-完整示例)
- [🤝 贡献指南](#-贡献指南)
- [📄 许可证](#-许可证)

---

## ✨ 功能特性

| 特性 | 说明 |
|:---|:---|
| 🪶 **轻量零依赖** | 纯原生 JavaScript 实现，无任何第三方依赖，开箱即用 |
| 🧮 **指标完备** | 覆盖 SaaS 最核心的 5 大增长指标 + LTV:CAC 健康度比值 |
| 🛡️ **输入容错** | 自动处理空值、非数字、零除等边界情况，稳定可靠 |
| 🔧 **灵活集成** | 兼容 Node.js（CommonJS）环境，也可轻松迁移至浏览器 |
| 📐 **双口径流失率** | 支持粗流失（Gross Churn）与净流失（Net Churn）两种计算口径 |

---

## 📦 安装与引入

### 方式一：本地引入（CommonJS）

将 `saas-metrics.js` 放入项目目录后直接 `require`：

```javascript
const {
  calculateMRR,
  calculateARR,
  calculateChurnRate,
  calculateLTV,
  calculateCAC,
  calculateLTVToCACRatio,
} = require("./saas-metrics");
```

### 方式二：浏览器环境

将文件内容复制到前端项目中，移除末尾的 `module.exports`，改为挂载到全局对象即可：

```javascript
// window.SaaSMetrics = { calculateMRR, calculateARR, ... };
```

---

## 🚀 快速上手

```javascript
const {
  calculateMRR,
  calculateARR,
  calculateChurnRate,
  calculateLTV,
  calculateCAC,
  calculateLTVToCACRatio,
} = require("./saas-metrics");

// 1️⃣ 计算 MRR
const mrr = calculateMRR([
  { revenue: 500 },
  { revenue: 1200 },
  { revenue: 300 },
]);
console.log("MRR:", mrr); // MRR: 2000

// 2️⃣ 计算 ARR
const arr = calculateARR(mrr);
console.log("ARR:", arr); // ARR: 24000

// 3️⃣ 计算 Churn Rate（粗流失）
const { churnRate } = calculateChurnRate({
  startValue: 100, // 期初客户数
  endValue: 92,    // 期末客户数
});
console.log("Churn Rate:", churnRate + "%"); // Churn Rate: 8%

// 4️⃣ 计算 LTV（毛利率 80%）
const ltv = calculateLTV({
  arpu: 50,        // 月均单客户收入
  churnRate: 5,    // 月流失率 5%
  grossMargin: 0.8,
});
console.log("LTV:", ltv); // LTV: 800

// 5️⃣ 计算 CAC
const cac = calculateCAC({
  totalSpend: 10000, // 营销总支出
  newCustomers: 50,  // 新增客户数
});
console.log("CAC:", cac); // CAC: 200

// 6️⃣ 计算 LTV:CAC 比值
const ratio = calculateLTVToCACRatio(ltv, cac);
console.log("LTV:CAC =", ratio); // LTV:CAC = 4
```

---

## 📐 指标详解

### MRR — 月度经常性收入

**定义**：MRR（Monthly Recurring Revenue）是所有有效订阅用户在**单月**内产生的**经常性**收入总和。它是 SaaS 企业衡量当期收入规模最基础的指标。

**计算公式**：

```
MRR = Σ（每位用户当月经常性订阅金额）
```

**说明**：
- ✅ **计入**：按月/按年折算为月度的订阅费用、按席位计费的经常性部分。
- ❌ **不计入**：一次性安装费、咨询费、硬件费等非常规收入。
- 📌 **按年付费用户**：需将年费 ÷ 12 折算为月度金额后再计入。

**使用示例**：

```javascript
const mrr = calculateMRR([
  { revenue: 500 },   // 月付 $500
  { revenue: 100 },   // 年付 $1200 ÷ 12
  { revenue: 300 },
]);
// 结果：900
```

⬆️ [回到目录](#-目录)

---

### ARR — 年度经常性收入

**定义**：ARR（Annual Recurring Revenue）是 MRR 的年度化版本，反映企业**全年**可预期的经常性收入规模，常用于年度规划与估值。

**计算公式**：

```
ARR = MRR × 12
```

**说明**：
- ARR 假设当前订阅规模在未来 12 个月保持稳定，是**预测性**指标。
- 适合用于年度财务规划、融资路演和长期趋势分析。

**使用示例**：

```javascript
const arr = calculateARR(2000); // 结果：24000
```

⬆️ [回到目录](#-目录)

---

### Churn Rate — 流失率

**定义**：Churn Rate 衡量在特定周期内**流失**的客户数或收入占期初总量的比例，是 SaaS 企业最关键的健康度指标之一。流失率直接决定企业的长期生存能力。

**计算公式**：

```
粗流失率（Gross Churn）= 流失量 ÷ 期初总量 × 100%
净流失率（Net Churn）  =（流失量 - 新增量）÷ 期初总量 × 100%
```

**两种口径**：

| 口径 | 说明 | 适用场景 |
|:---|:---|:---|
| **客户流失率** | 按客户数量计算 | 关注用户留存、产品体验 |
| **收入流失率** | 按 MRR 金额计算 | 关注收入结构、大客户依赖 |

**使用示例**：

```javascript
// 粗流失：期初 100 客户，期末 92，未传 newValue
const gross = calculateChurnRate({ startValue: 100, endValue: 92 });
// 结果：{ churnRate: 8, isGross: true }

// 净流失：期初 100 客户，期末 95，期内新增 10
const net = calculateChurnRate({
  startValue: 100,
  endValue: 95,
  newValue: 10,
});
// 结果：{ churnRate: 15, isGross: false }（流失 15 人，新增 10 人后净减 5）
```

**行业基准**：
- 🟢 优秀：月流失率 < 2%
- 🟡 警惕：月流失率 2%–5%
- 🔴 危险：月流失率 > 5%

⬆️ [回到目录](#-目录)

---

### LTV — 客户终身价值

**定义**：LTV（Lifetime Value）是一个客户在与企业保持订阅关系的**整个生命周期**内，预计为企业带来的**毛利**总收入。它回答了"每个客户究竟值多少钱"这个核心问题。

**计算公式**：

```
LTV = ARPU × 毛利率 ÷ 月流失率

其中：
  ARPU（单用户月均收入）= MRR ÷ 活跃客户数
  月流失率以小数表示（5% → 0.05）
```

**说明**：
- 毛利率（Gross Margin）默认为 1（即不扣成本），实际业务中建议填入真实毛利率以获得更准确的 LTV。
- 流失率为 0 时，LTV 理论上趋于无穷大，函数将返回 `Infinity`。

**使用示例**：

```javascript
const ltv = calculateLTV({
  arpu: 50,        // 月均单客户收入 $50
  churnRate: 5,    // 月流失率 5%
  grossMargin: 0.8, // 毛利率 80%
});
// 结果：800（每个客户终身毛利约 $800）
```

⬆️ [回到目录](#-目录)

---

### CAC — 客户获取成本

**定义**：CAC（Customer Acquisition Cost）是企业在特定周期内为**获取一个新付费客户**所平均投入的销售与营销成本。它回答了"每赢得一个客户要花多少钱"。

**计算公式**：

```
CAC = 销售与营销总支出 ÷ 新增付费客户数
```

**说明**：
- 销售与营销支出应包括：广告投放、销售人员薪酬、营销工具费用、内容制作成本等。
- 新增客户数应为**同期**内首次付费的客户，不含续费或复购。

**使用示例**：

```javascript
const cac = calculateCAC({
  totalSpend: 10000, // 月度营销支出 $10,000
  newCustomers: 50,  // 新增付费客户 50 人
});
// 结果：200（平均每获取一个客户花费 $200）
```

⬆️ [回到目录](#-目录)

---

### LTV:CAC 比值 — 健康度指标

**定义**：LTV:CAC 比值衡量**客户终身价值**与**获取成本**的倍数关系，是评估 SaaS 商业模式可持续性的**黄金指标**。

**计算公式**：

```
LTV:CAC = LTV ÷ CAC
```

**健康度参考**：

| 比值区间 | 健康度 | 解读 |
|:---:|:---:|:---|
| **≥ 5** | 🟢 过度保守 | 获客效率高，但可能投入不足，错失增长机会 |
| **3 ~ 5** | 🟢 理想区间 | 单位经济模型健康，增长可持续 |
| **1 ~ 3** | 🟡 需优化 | 可勉强维持，应提升 LTV 或降低 CAC |
| **< 1** | 🔴 亏损 | 每获一客即亏损，商业模式不可持续 |

**使用示例**：

```javascript
const ratio = calculateLTVToCACRatio(800, 200);
// 结果：4（理想区间，每投入 $1 获客可带来 $4 终身价值）
```

⬆️ [回到目录](#-目录)

---

## 📊 指标速查表

| 指标 | 全称 | 核心公式 | 关键问题 |
|:---|:---|:---|:---|
| **MRR** | Monthly Recurring Revenue | `Σ 月度订阅收入` | 本月经常性收入有多少？ |
| **ARR** | Annual Recurring Revenue | `MRR × 12` | 全年可预期收入有多少？ |
| **Churn Rate** | Churn Rate | `流失量 ÷ 期初总量 × 100%` | 客户/收入流失有多快？ |
| **LTV** | Lifetime Value | `ARPU × 毛利率 ÷ 流失率` | 每个客户终身值多少钱？ |
| **CAC** | Customer Acquisition Cost | `营销总支出 ÷ 新增客户数` | 每获一客要花多少钱？ |
| **LTV:CAC** | LTV to CAC Ratio | `LTV ÷ CAC` | 商业模式是否可持续？ |

---

## 🧪 完整示例

以下示例模拟一家 SaaS 公司的单月运营数据，完整演示全部指标的计算流程：

```javascript
const metrics = require("./saas-metrics");

// ===== 模拟数据 =====
// 订阅用户（当月经常性收入）
const subscriptions = [
  { revenue: 1200 },  // 企业版
  { revenue: 800 },   // 专业版
  { revenue: 500 },   // 专业版
  { revenue: 100 },   // 入门版 ×3
  { revenue: 100 },
  { revenue: 100 },
];

// 期初/期末客户数与期内新增
const startCustomers = 200;
const endCustomers = 188;
const newCustomers = 15;

// 营销支出
const marketingSpend = 12000;

// ===== 计算 =====
const mrr = metrics.calculateMRR(subscriptions);
const arr = metrics.calculateARR(mrr);
const { churnRate } = metrics.calculateChurnRate({
  startValue: startCustomers,
  endValue: endCustomers,
  newValue: newCustomers,
});
const arpu = mrr / endCustomers;
const ltv = metrics.calculateLTV({
  arpu,
  churnRate,
  grossMargin: 0.85,
});
const cac = metrics.calculateCAC({
  totalSpend: marketingSpend,
  newCustomers,
});
const ratio = metrics.calculateLTVToCACRatio(ltv, cac);

// ===== 输出报告 =====
console.log("===== SaaS 指标月度报告 =====");
console.log(`MRR:        $${mrr}`);
console.log(`ARR:        $${arr}`);
console.log(`Churn Rate: ${churnRate}%`);
console.log(`ARPU:       $${arpu.toFixed(2)}`);
console.log(`LTV:        $${ltv}`);
console.log(`CAC:        $${cac}`);
console.log(`LTV:CAC:    ${ratio}`);
console.log("============================");
```

**运行结果**：

```
===== SaaS 指标月度报告 =====
MRR:        $2800
ARR:        $33600
Churn Rate: 13.5%
ARPU:       $14.89
LTV:        $93.72
CAC:        $800
LTV:CAC:    0.12
============================
```

> ⚠️ 上例的 LTV:CAC 仅 0.12，说明商业模式处于严重亏损状态，需大幅降低 CAC 或提升 LTV。

⬆️ [回到目录](#-目录)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！在贡献之前，请确保：

1. 代码风格与现有文件保持一致（纯原生 JavaScript，零依赖）。
2. 新增函数需包含完整的 JSDoc 注释。
3. 边界情况（空值、零除、负数）需妥善处理。

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源，可自由使用、修改和分发。

---

<div align="center">

---

### 🌟 支持与致谢

**这个库由 [SaaS Metrics Box](https://saasmetricsbox.com) 提供支持** —— 一个**在线免费**的 SaaS 指标计算工具。

无需下载、无需注册，打开网页即可快速计算 MRR、ARR、Churn Rate、LTV、CAC 等核心指标，是产品经理、创始人、投资人的随身计算助手。

👉 **立即体验：[https://saasmetricsbox.com](https://saasmetricsbox.com)**

---

如果这个项目对你有帮助，欢迎 ⭐ Star 支持！

</div>
