const STORAGE_KEY = "abfm-engine-state-v2";
const USER_NAME = "Model owner";

const SOURCE_LOG = [
  {
    item: "Build architecture",
    source: "Assumption_Based_Financial_Modelling_Build_Guide.pdf",
    ref: "Sections 1-21",
    note: "Web app is source of truth, P&L-only MVP, assumption register, validation, scenarios, exports, and audit trail.",
  },
  {
    item: "S2b P&L reference case",
    source: "CGC Digital 3.0 Financial Projections.pdf",
    ref: "Projected Profit and Loss for Financial Model S2b",
    note: "Seeded five-year revenue, investment income, expense, ECL, funding, guarantee cover, net reserved, and GRR values.",
  },
  {
    item: "Digital guarantee revenue drivers",
    source: "Digital Guarantee Revenue Projection.xlsx",
    ref: "Assumptions and DG Revenue tabs",
    note: "Seeded fee rates, per-project charge logic, programme sizing, and inactive driver reference assumption.",
  },
];

const LINE_ITEMS = [
  { name: "Distribution fee", group: "Revenue" },
  { name: "Referral fee", group: "Revenue" },
  { name: "Cr. Guarantee Processing fee", group: "Revenue" },
  { name: "Development Fee", group: "Revenue" },
  { name: "Service fee for PD model", group: "Revenue" },
  { name: "Recurring imSME service fee", group: "Revenue" },
  { name: "Digital guarantee", group: "Revenue" },
  { name: "Investment income", group: "Investment Income" },
  { name: "Operating Expenses", group: "Expenses" },
  { name: "Expected credit loss", group: "Expenses" },
  { name: "Financing cost", group: "Below PBT" },
  { name: "Tax", group: "Below PBT" },
];

const FINANCIAL_METRICS = [
  "Funding from CGC Malaysia",
  "Funding from SPRA",
  "Guarantee Cover",
  "Net Reserved",
  "GRR",
];

const METHOD_LABELS = {
  yearSpecific: "Year-specific values",
  fixed: "Fixed annual amount",
  compound: "Compound annual growth",
  straightLine: "Straight-line growth",
  percentRevenue: "% of total operating revenue",
  percentLine: "% of another line item",
  volumePrice: "Volume x price",
  oneOff: "One-off amount",
};

const TEMPLATE_LIBRARY = [
  ["TMP-001", "Revenue assumptions", "Revenue starts at RM[x] in Year 1 and grows by [y]% annually.", "compound"],
  ["TMP-002", "Revenue assumptions", "Revenue increases from RM[x] in Year 1 to RM[y] in Year [n] using straight-line growth.", "straightLine"],
  ["TMP-003", "Revenue assumptions", "Revenue is calculated as [number of customers] multiplied by [average fee per customer].", "volumePrice"],
  ["TMP-004", "Direct cost assumptions", "Cost starts at RM[x] in Year 1 and grows by [y]% annually.", "compound"],
  ["TMP-005", "Direct cost assumptions", "Cost is fixed at RM[x] per year.", "fixed"],
  ["TMP-006", "Direct cost assumptions", "Cost is [x]% of total revenue.", "percentRevenue"],
  ["TMP-007", "Operating expenditure assumptions", "Staff cost is calculated as [headcount] multiplied by [average cost per employee].", "volumePrice"],
  ["TMP-008", "Operating expenditure assumptions", "Technology cost is RM[x] in Year 1, then increases by [y]% annually.", "compound"],
  ["TMP-009", "Credit and risk cost assumptions", "Expected credit loss is calculated as exposure multiplied by PD multiplied by LGD.", "volumePrice"],
];

const ASSUMPTION_CATEGORIES = [
  "1. Revenue assumptions",
  "2. Direct cost assumptions",
  "3. Operating expenditure assumptions",
  "4. Credit and risk cost assumptions",
  "5. Tax and financing assumptions",
  "6. Productivity and efficiency assumptions",
  "7. Scenario overlay assumptions",
  "8. Funding and financial strength assumptions",
];

const DEFAULT_CONTROLS = {
  scenarioName: "S2b Reference Case",
  baseYear: 2024,
  startYear: 2025,
  duration: 5,
  currency: "RM",
  units: "RM'000",
  outputStyle: "Working-model style",
  approvalRequired: false,
  includeAuditTrail: true,
  maxRevenueGrowth: 1.2,
  maxCostGrowth: 0.6,
  maxRevenueDecline: -0.4,
  maxCostDecline: -0.5,
  maxYear5RevenueMultiple: 8,
  minEbitdaMargin: -3,
  maxCumulativeLoss: 50000,
  materialityThreshold: 1000,
  taxRate: 0,
  locked: false,
};

const DEFAULT_ASSUMPTIONS = [
  assumption("ASM-001", "1. Revenue assumptions", "Distribution fee", "Distribution fee", "yearSpecific", true, {
    text: "Distribution fee follows the S2b five-year reference projection.",
    values: { 2025: 224.6, 2026: 500, 2027: 850, 2028: 1300, 2029: 1950 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.94,
  }),
  assumption("ASM-002", "1. Revenue assumptions", "Referral fee", "Referral fee", "yearSpecific", true, {
    text: "Referral fee follows the S2b five-year reference projection.",
    values: { 2025: 36, 2026: 46.6, 2027: 63.9, 2028: 86.8, 2029: 123.2 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.94,
  }),
  assumption("ASM-003", "1. Revenue assumptions", "Credit guarantee processing fee", "Cr. Guarantee Processing fee", "yearSpecific", true, {
    text: "Processing fee follows the S2b reference projection.",
    values: { 2025: 449.2, 2026: 1000, 2027: 1700, 2028: 2600, 2029: 3900 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.94,
  }),
  assumption("ASM-004", "1. Revenue assumptions", "Development fee", "Development Fee", "yearSpecific", true, {
    text: "Development fee follows the S2b five-year reference projection.",
    values: { 2025: 5850, 2026: 6500, 2027: 7700, 2028: 10300, 2029: 11700 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.94,
  }),
  assumption("ASM-005", "1. Revenue assumptions", "Service fee for PD model", "Service fee for PD model", "yearSpecific", true, {
    text: "PD model service fee starts in 2026 and grows 10% annually thereafter.",
    values: { 2025: 0, 2026: 250, 2027: 275, 2028: 302.5, 2029: 332.8 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.92,
  }),
  assumption("ASM-006", "1. Revenue assumptions", "Recurring imSME service fee", "Recurring imSME service fee", "yearSpecific", true, {
    text: "Recurring imSME service fee follows the S2b reference profile.",
    values: { 2025: 0, 2026: 3251.5, 2027: 3326.9, 2028: 3613.5, 2029: 3937.3 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.92,
  }),
  assumption("ASM-007", "1. Revenue assumptions", "Digital guarantee", "Digital guarantee", "yearSpecific", true, {
    text: "Digital guarantee revenue follows the S2b reference profile.",
    values: { 2025: 669, 2026: 1700, 2027: 3450, 2028: 6200, 2029: 11150 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.94,
  }),
  assumption("ASM-008", "1. Revenue assumptions", "Digital guarantee driver reference", "Digital guarantee", "yearSpecific", false, {
    text: "Reference-only driver from the workbook: programme totals, 50% EAD, 2.5% guarantee fee, 10% distribution fee, 20% processing fee, and RM1.1088m per project charges.",
    values: { 2025: 0, 2026: 0, 2027: 3872.4, 2028: 4316.4, 2029: 4076.4 },
    source: "Digital Guarantee Revenue Projection.xlsx, DG Revenue tab",
    confidence: 0.86,
  }),
  assumption("ASM-009", "1. Revenue assumptions", "Investment income", "Investment income", "yearSpecific", true, {
    text: "Investment income follows S2b reference projection and assumes 4.25% net investment income after fees.",
    values: { 2025: 177.2, 2026: 2155.9, 2027: 4264.3, 2028: 7669.7, 2029: 13891.4 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b key assumption 7",
    confidence: 0.9,
  }),
  assumption("ASM-010", "3. Operating expenditure assumptions", "Operating expenses", "Operating Expenses", "yearSpecific", true, {
    text: "Operating expenses match the S2b reference financial model.",
    values: { 2025: -23578.5, 2026: -25872.6, 2027: -28542.8, 2028: -33317.3, 2029: -37415.8 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table",
    confidence: 0.94,
  }),
  assumption("ASM-011", "4. Credit and risk cost assumptions", "Expected credit loss", "Expected credit loss", "yearSpecific", true, {
    text: "ECL follows S2b, based on reference claims assumptions for NBFI and SPRA guarantee exposure.",
    values: { 2025: -458.3, 2026: -1484.1, 2027: -2923.5, 2028: -5296.9, 2029: -9511.5 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b P&L table and key assumptions 4-5",
    confidence: 0.89,
  }),
  assumption("ASM-012", "5. Tax and financing assumptions", "Financing cost", "Financing cost", "fixed", true, {
    text: "No interest expense is incurred in the S2b reference case.",
    amount: 0,
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b key assumption 8",
    confidence: 0.9,
  }),
  assumption("ASM-013", "8. Funding and financial strength assumptions", "Funding from CGC Malaysia", "Funding from CGC Malaysia", "yearSpecific", true, {
    text: "Annual support funding from CGC Malaysia follows the detailed S2b P&L table.",
    values: { 2025: 15000, 2026: 15000, 2027: 15100, 2028: 14800, 2029: 13700 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b financial strength table",
    confidence: 0.9,
  }),
  assumption("ASM-014", "8. Funding and financial strength assumptions", "Funding from SPRA", "Funding from SPRA", "yearSpecific", true, {
    text: "SPRA funding follows the detailed S2b P&L table.",
    values: { 2025: 13000, 2026: 32000, 2027: 48000, 2028: 77000, 2029: 140000 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b financial strength table",
    confidence: 0.9,
  }),
  assumption("ASM-015", "8. Funding and financial strength assumptions", "Guarantee cover", "Guarantee Cover", "yearSpecific", true, {
    text: "Guarantee cover follows the S2b financial strength table.",
    values: { 2025: 33000, 2026: 84250, 2027: 169825, 2028: 307400, 2029: 554750 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b financial strength table",
    confidence: 0.9,
  }),
  assumption("ASM-016", "8. Funding and financial strength assumptions", "Net reserved", "Net Reserved", "yearSpecific", true, {
    text: "Net reserved follows the S2b financial strength table.",
    values: { 2025: 13534.8, 2026: 47691.8, 2027: 99562, 2028: 183910.1, 2029: 337639.8 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b financial strength table",
    confidence: 0.9,
  }),
  assumption("ASM-017", "8. Funding and financial strength assumptions", "Guarantee reserve ratio", "GRR", "yearSpecific", true, {
    text: "GRR is held at 2.4x in the S2b reference case.",
    values: { 2025: 2.4, 2026: 2.4, 2027: 2.4, 2028: 2.4, 2029: 2.4 },
    source: "CGC Digital 3.0 Financial Projections.pdf, S2b financial strength table",
    confidence: 0.9,
  }),
];

let state = loadState();
let currentView = "dashboard";
let editorDraft = null;
let undoStack = [];
let redoStack = [];

const els = {
  scenarioPill: document.querySelector("#scenarioPill"),
  modelStatusBadge: document.querySelector("#modelStatusBadge"),
  dashboardTitle: document.querySelector("#dashboardTitle"),
  dashboardContent: document.querySelector("#dashboardContent"),
  assumptionsContent: document.querySelector("#assumptionsContent"),
  plContent: document.querySelector("#plContent"),
  validationContent: document.querySelector("#validationContent"),
  scenariosContent: document.querySelector("#scenariosContent"),
  exportsContent: document.querySelector("#exportsContent"),
  auditContent: document.querySelector("#auditContent"),
  sourcesContent: document.querySelector("#sourcesContent"),
  editorPanel: document.querySelector("#editorPanel"),
  assumptionForm: document.querySelector("#assumptionForm"),
  editorTitle: document.querySelector("#editorTitle"),
  toast: document.querySelector("#toast"),
};

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("input", handleInput);
document.querySelector("#assumptionForm").addEventListener("submit", saveEditor);
document.querySelector("#closeEditorButton").addEventListener("click", closeEditor);
document.querySelector("#saveScenarioButton").addEventListener("click", saveScenario);
document.querySelector("#undoButton").addEventListener("click", undo);
document.querySelector("#redoButton").addEventListener("click", redo);
document.querySelector("#newAssumptionButton").addEventListener("click", () => openEditor(null));
document.querySelector("#duplicateScenarioButton").addEventListener("click", duplicateScenario);
document.querySelector("#lockScenarioButton").addEventListener("click", toggleLock);

render();

function assumption(id, category, title, targetLine, method, active, extra = {}) {
  return {
    id,
    category,
    subCategory: extra.subCategory || "",
    title,
    text: extra.text || "",
    targetLine,
    method,
    active,
    startYear: extra.startYear || 2025,
    endYear: extra.endYear || 2029,
    amount: extra.amount ?? null,
    endValue: extra.endValue ?? null,
    growthRate: extra.growthRate ?? 0,
    rate: extra.rate ?? 0,
    volume: extra.volume ?? 0,
    price: extra.price ?? 0,
    sourceLine: extra.sourceLine || "",
    oneOffYear: extra.oneOffYear || 2025,
    values: extra.values || {},
    source: extra.source || "User-entered",
    templateUsed: extra.templateUsed || "",
    combinationLogic: extra.combinationLogic || "Add",
    validationStatus: "Parsed",
    reasonabilityStatus: "Not run",
    confidence: extra.confidence ?? 0.75,
    version: 1,
    createdAt: extra.createdAt || "2026-06-23",
    modifiedAt: extra.modifiedAt || "2026-06-23",
    createdBy: USER_NAME,
    modifiedBy: USER_NAME,
    auditRef: extra.auditRef || "AUD-001",
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        audit: parsed.audit || initialAudit(),
        scenarios: parsed.scenarios || [],
      };
    }
  } catch {}

  const initial = {
    controls: { ...DEFAULT_CONTROLS },
    assumptions: clone(DEFAULT_ASSUMPTIONS),
    scenarios: [],
    audit: initialAudit(),
  };
  initial.scenarios.push({
    id: "SCN-BASE",
    name: "S2b Reference Case",
    savedAt: "2026-06-23 22:45",
    locked: false,
    note: "Seed scenario built from the reference PDF and workbook.",
    snapshot: snapshotFrom(initial),
  });
  return initial;
}

function initialAudit() {
  return [
    {
      id: "AUD-001",
      timestamp: "2026-06-23 22:45",
      action: "Created scenario",
      target: "S2b Reference Case",
      before: "-",
      after: "Reference assumptions loaded",
      user: USER_NAME,
      note: "Seeded from guide, S2b projection PDF, and digital guarantee revenue workbook.",
    },
    {
      id: "AUD-002",
      timestamp: "2026-06-23 22:46",
      action: "Applied rule-based parser",
      target: "Reference assumptions",
      before: "Source data",
      after: "Structured drivers",
      user: USER_NAME,
      note: "AI-ready parser field retained; no external AI call is required for this local MVP.",
    },
  ];
}

function render() {
  const calc = calculateModel();
  const validation = validateModel(calc);
  els.scenarioPill.textContent = state.controls.scenarioName;
  els.dashboardTitle.textContent = state.controls.scenarioName;
  renderStatus(validation);
  renderDashboard(calc, validation);
  renderAssumptions(calc, validation);
  renderPL(calc);
  renderValidation(calc, validation);
  renderScenarios();
  renderExports(calc, validation);
  renderAudit();
  renderSources();
  updateButtons();
  persist();
}

function renderStatus(validation) {
  const failed = validation.checks.some((check) => check.status === "FAIL");
  const warned = validation.checks.some((check) => check.status === "WARN");
  const status = failed ? "FAIL" : warned ? "WARNING" : "PASS";
  els.modelStatusBadge.textContent = `MODEL STATUS: ${status}`;
  els.modelStatusBadge.className = `status-badge ${failed ? "fail" : warned ? "warn" : "pass"}`;
}

function renderDashboard(calc, validation) {
  const years = getYears();
  const lastYear = years.at(-1);
  const pbtSeries = years.map((year) => calc.derived.pbt[year]);
  const revenueSeries = years.map((year) => calc.derived.operatingRevenue[year]);
  const activeCount = state.assumptions.filter((item) => item.active).length;
  const warningCount = validation.assumptions.filter((item) => item.status === "Warning").length;
  const pbtCumulative = years.reduce((sum, year) => sum + calc.derived.pbt[year], 0);
  const breakeven = years.find((year) => calc.derived.pbt[year] >= 0) || "-";

  els.dashboardContent.innerHTML = `
    <div class="grid dashboard-grid">
      <div class="grid">
        <div class="kpi-grid">
          ${kpi("Operating revenue", money(calc.derived.operatingRevenue[lastYear]), `${lastYear} ${state.controls.units}`)}
          ${kpi("PBT", money(calc.derived.pbt[lastYear]), `${lastYear} ${state.controls.units}`, calc.derived.pbt[lastYear] >= 0 ? "positive" : "negative")}
          ${kpi("Cumulative PBT", money(pbtCumulative), `${years[0]}-${lastYear} ${state.controls.units}`, pbtCumulative >= 0 ? "positive" : "negative")}
          ${kpi("Breakeven year", String(breakeven), "First year with non-negative PBT")}
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Revenue and PBT trend</h3>
            <span class="mini-badge ${warningCount ? "warn" : "pass"}">${warningCount} warnings</span>
          </div>
          <div class="panel-body">
            ${lineChart(years, [
              { label: "Operating revenue", values: revenueSeries, color: "#0f5ed7" },
              { label: "PBT", values: pbtSeries, color: "#b3261e" },
            ])}
            <div class="legend">
              <span class="legend-item"><span class="swatch" style="background:#0f5ed7"></span>Operating revenue</span>
              <span class="legend-item"><span class="swatch" style="background:#b3261e"></span>PBT</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">P&L preview</h3>
            <button class="secondary-button" data-nav="pl" type="button">Open P&amp;L</button>
          </div>
          <div class="panel-body">
            ${plTable(calc, true)}
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Control panel</h3>
            <span class="mini-badge ${state.controls.locked ? "warn" : "pass"}">${state.controls.locked ? "Locked" : "Editable"}</span>
          </div>
          <div class="panel-body">
            ${controlPanel()}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Assumption state</h3>
            <button class="secondary-button" data-nav="assumptions" type="button">Open Register</button>
          </div>
          <div class="panel-body">
            <div class="kpi-grid two">
              ${kpi("Active assumptions", activeCount, "Affecting the model")}
              ${kpi("Inactive assumptions", state.assumptions.length - activeCount, "Retained for audit")}
              ${kpi("Validation warnings", warningCount, "Need review", warningCount ? "negative" : "positive")}
              ${kpi("Exports available", "4", "JSON, CSV, Excel-ready, print/PDF")}
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">MVP coverage</h3>
          </div>
          <div class="panel-body">
            <div class="notice">
              Single-user source-of-truth app with assumption toggles, structured drivers, scenario snapshots, validation, undo/redo, and exportable audit trail.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAssumptions(calc, validation) {
  const years = getYears();
  const rows = state.assumptions
    .map((item) => {
      const generated = calculateAssumptionValues(item, years, calc, { preview: true });
      const status = validation.assumptions.find((entry) => entry.id === item.id) || {};
      const impact = years.reduce((sum, year) => sum + (generated[year] || 0), 0);
      return `
        <tr data-row-id="${item.id}">
          <td><button class="ghost-button" data-edit="${item.id}" type="button">${escapeHTML(item.id)}</button></td>
          <td>${escapeHTML(item.category)}</td>
          <td><strong>${escapeHTML(item.title)}</strong><br><span class="muted">${escapeHTML(item.targetLine)}</span></td>
          <td>${escapeHTML(METHOD_LABELS[item.method] || item.method)}</td>
          <td>
            <label class="toggle">
              <input class="assumption-toggle" data-id="${item.id}" type="checkbox" ${item.active ? "checked" : ""} ${state.controls.locked ? "disabled" : ""}>
              ${item.active ? "Active" : "Inactive"}
            </label>
          </td>
          <td class="status-col"><span class="mini-badge ${status.className || "pass"}">${escapeHTML(status.status || "OK")}</span></td>
          <td class="number ${impact < 0 ? "negative" : "positive"}">${money(impact)}</td>
          ${years.map((year) => `<td class="number formula-cell">${money(generated[year] || 0)}</td>`).join("")}
        </tr>
      `;
    })
    .join("");

  els.assumptionsContent.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3 class="panel-title">Register</h3>
        <span class="mini-badge">Generated values in ${state.controls.units}</span>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Assumption</th>
                <th>Method</th>
                <th>Status</th>
                <th>Validation</th>
                <th class="number">5Y impact</th>
                ${years.map((year) => `<th class="number">${year}</th>`).join("")}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid two-col" style="margin-top:14px">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Assumption library</h3>
        </div>
        <div class="panel-body">
          ${libraryTable()}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Financial model color convention</h3>
        </div>
        <div class="panel-body">
          <table>
            <tbody>
              <tr><td class="input-cell">Blue text / yellow fill</td><td>Editable inputs and scenario drivers</td></tr>
              <tr><td class="formula-cell">Black text</td><td>Formula outputs and calculated values</td></tr>
              <tr><td class="linked-cell">Green text</td><td>Linked references within the model</td></tr>
              <tr><td class="negative">Red text</td><td>Warnings, negative values, and validation failures</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPL(calc) {
  els.plContent.innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Statement Profit and Loss</h3>
          <span class="mini-badge">${state.controls.units}</span>
        </div>
        <div class="panel-body">${plTable(calc, false)}</div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Financial strength</h3>
          <span class="mini-badge">Reference metrics</span>
        </div>
        <div class="panel-body">${financialStrengthTable(calc)}</div>
      </div>
    </div>
  `;
}

function renderValidation(calc, validation) {
  const assumptionRows = validation.assumptions
    .map((item) => `
      <tr>
        <td>${escapeHTML(item.id)}</td>
        <td>${escapeHTML(item.title)}</td>
        <td><span class="mini-badge ${item.className}">${escapeHTML(item.status)}</span></td>
        <td>${escapeHTML(item.reason)}</td>
        <td>${escapeHTML(item.fix)}</td>
      </tr>
    `)
    .join("");

  const checkRows = validation.checks
    .map((check) => `
      <tr>
        <td>${escapeHTML(check.check)}</td>
        <td class="number">${check.delta === null ? "-" : money(check.delta)}</td>
        <td><span class="mini-badge ${check.status === "OK" ? "pass" : check.status === "WARN" ? "warn" : "fail"}">${check.status}</span></td>
        <td>${escapeHTML(check.where)}</td>
        <td>${escapeHTML(check.notes)}</td>
      </tr>
    `)
    .join("");

  els.validationContent.innerHTML = `
    <div class="grid two-col">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Workbook-level checks</h3>
        </div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Check</th><th class="number">Delta</th><th>Status</th><th>Where to fix</th><th>Notes</th></tr></thead>
              <tbody>${checkRows}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Assumption validation</h3>
        </div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Assumption</th><th>Status</th><th>Reason</th><th>Suggested fix</th></tr></thead>
              <tbody>${assumptionRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderScenarios() {
  const rows = state.scenarios
    .map((scenario) => `
      <tr>
        <td><strong>${escapeHTML(scenario.name)}</strong><br><span class="muted">${escapeHTML(scenario.id)}</span></td>
        <td>${escapeHTML(scenario.savedAt)}</td>
        <td>${scenario.locked ? "Locked" : "Editable"}</td>
        <td>${escapeHTML(scenario.note || "-")}</td>
        <td><button class="secondary-button" data-restore-scenario="${scenario.id}" type="button">Restore</button></td>
      </tr>
    `)
    .join("");

  els.scenariosContent.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3 class="panel-title">Saved scenarios</h3>
        <span class="mini-badge">${state.scenarios.length} saved</span>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Scenario</th><th>Saved</th><th>Lock state</th><th>Notes</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.querySelector("#lockScenarioButton").textContent = state.controls.locked ? "Unlock" : "Lock";
}

function renderExports(calc, validation) {
  const warnings = validation.assumptions.filter((item) => item.status === "Warning").length;
  els.exportsContent.innerHTML = `
    <div class="grid two-col">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Available exports</h3>
          <span class="mini-badge ${warnings ? "warn" : "pass"}">${warnings ? "Review warnings" : "Ready"}</span>
        </div>
        <div class="panel-body">
          <div class="button-row">
            <button class="primary-button" data-export="json" type="button">Download JSON</button>
            <button class="secondary-button" data-export="assumptionsCsv" type="button">Assumptions CSV</button>
            <button class="secondary-button" data-export="auditCsv" type="button">Audit CSV</button>
            <button class="secondary-button" data-export="excel" type="button">Excel-ready File</button>
            <button class="ghost-button" data-export="print" type="button">Print / Save PDF</button>
          </div>
          <p class="muted">Exports are generated from the web-app state. The app remains the controlled source of truth.</p>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Export contents</h3>
        </div>
        <div class="panel-body">
          <table>
            <tbody>
              <tr><td>Scenario summary</td><td>Included</td></tr>
              <tr><td>Control settings</td><td>Included</td></tr>
              <tr><td>Active and inactive assumptions</td><td>Included</td></tr>
              <tr><td>Full P&amp;L statement</td><td>Included</td></tr>
              <tr><td>Validation warnings</td><td>Included</td></tr>
              <tr><td>Audit trail</td><td>${state.controls.includeAuditTrail ? "Included" : "Excluded"}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAudit() {
  const rows = state.audit
    .slice()
    .reverse()
    .map((entry) => `
      <tr>
        <td>${escapeHTML(entry.id)}</td>
        <td>${escapeHTML(entry.timestamp)}</td>
        <td>${escapeHTML(entry.action)}</td>
        <td>${escapeHTML(entry.target)}</td>
        <td>${escapeHTML(entry.before)}</td>
        <td>${escapeHTML(entry.after)}</td>
        <td>${escapeHTML(entry.user)}</td>
        <td>${escapeHTML(entry.note)}</td>
      </tr>
    `)
    .join("");

  els.auditContent.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3 class="panel-title">Audit events</h3>
        <span class="mini-badge">${state.audit.length} events</span>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Timestamp</th><th>Action</th><th>Target</th><th>Old value</th><th>New value</th><th>User</th><th>Notes</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderSources() {
  els.sourcesContent.innerHTML = `
    <div class="grid two-col">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Source log</h3>
        </div>
        <div class="panel-body">
          <div class="source-list">
            ${SOURCE_LOG.map((source) => `
              <div class="source-item">
                <h3>${escapeHTML(source.item)}</h3>
                <p><strong>${escapeHTML(source.source)}</strong> - ${escapeHTML(source.ref)}</p>
                <p>${escapeHTML(source.note)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Digital guarantee driver notes</h3>
        </div>
        <div class="panel-body">
          <table>
            <tbody>
              <tr><td>Guarantee fee rate</td><td class="number">2.5%</td></tr>
              <tr><td>Distribution fee</td><td class="number">10.0% of guarantee fee</td></tr>
              <tr><td>Processing fee</td><td class="number">20.0% of guarantee fee</td></tr>
              <tr><td>Per project charge</td><td class="number">RM1.1088m</td></tr>
              <tr><td>Default projects</td><td class="number">3 per year</td></tr>
              <tr><td>Digital guarantee driver</td><td>Retained inactive to avoid conflict with the S2b PDF line item.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function calculateModel() {
  const years = getYears();
  const lineValues = {};
  const metricValues = {};
  const outputs = {};

  [...LINE_ITEMS.map((item) => item.name), ...FINANCIAL_METRICS].forEach((line) => {
    lineValues[line] = blankSeries(years);
    metricValues[line] = blankSeries(years);
  });

  const activeAssumptions = state.assumptions.filter((item) => item.active);
  const firstPass = activeAssumptions.filter((item) => !["percentRevenue", "percentLine"].includes(item.method));
  const secondPass = activeAssumptions.filter((item) => ["percentRevenue", "percentLine"].includes(item.method));

  for (const item of firstPass) {
    outputs[item.id] = calculateAssumptionValues(item, years, { lineValues }, { preview: false });
    addValues(item.targetLine, outputs[item.id], years, lineValues, metricValues);
  }

  const baseCalc = { lineValues };
  for (const item of secondPass) {
    outputs[item.id] = calculateAssumptionValues(item, years, baseCalc, { preview: false });
    addValues(item.targetLine, outputs[item.id], years, lineValues, metricValues);
  }

  const derived = {
    operatingRevenue: blankSeries(years),
    totalIncome: blankSeries(years),
    totalExpenses: blankSeries(years),
    ebitda: blankSeries(years),
    pbt: blankSeries(years),
    tax: blankSeries(years),
    pat: blankSeries(years),
    totalFunding: blankSeries(years),
  };

  for (const year of years) {
    const revenue = sumLines(["Distribution fee", "Referral fee", "Cr. Guarantee Processing fee", "Development Fee", "Service fee for PD model", "Recurring imSME service fee", "Digital guarantee"], year, lineValues);
    const investment = lineValues["Investment income"][year] || 0;
    const operatingExpenses = lineValues["Operating Expenses"][year] || 0;
    const ecl = lineValues["Expected credit loss"][year] || 0;
    const financing = lineValues["Financing cost"][year] || 0;
    const pbt = revenue + investment + operatingExpenses + ecl + financing;
    const tax = pbt > 0 ? -pbt * Number(state.controls.taxRate || 0) : 0;

    derived.operatingRevenue[year] = revenue;
    derived.totalIncome[year] = revenue + investment;
    derived.totalExpenses[year] = operatingExpenses + ecl;
    derived.ebitda[year] = revenue + operatingExpenses;
    derived.pbt[year] = pbt;
    derived.tax[year] = tax;
    derived.pat[year] = pbt + tax;
    derived.totalFunding[year] = (metricValues["Funding from CGC Malaysia"]?.[year] || 0) + (metricValues["Funding from SPRA"]?.[year] || 0);
  }

  return { years, lineValues, metricValues, derived, outputs };
}

function calculateAssumptionValues(item, years, calc = {}, options = {}) {
  const output = blankSeries(years);
  if (!options.preview && !item.active) return output;

  years.forEach((year, index) => {
    const withinRange = year >= Number(item.startYear || years[0]) && year <= Number(item.endYear || years.at(-1));
    if (!withinRange && !["yearSpecific", "oneOff"].includes(item.method)) {
      output[year] = 0;
      return;
    }

    if (item.method === "yearSpecific") {
      output[year] = Number(item.values?.[year] || 0);
    } else if (item.method === "fixed") {
      output[year] = Number(item.amount || 0);
    } else if (item.method === "compound") {
      const startIndex = Math.max(0, year - Number(item.startYear || years[0]));
      output[year] = Number(item.amount || 0) * Math.pow(1 + Number(item.growthRate || 0), startIndex);
    } else if (item.method === "straightLine") {
      const startYear = Number(item.startYear || years[0]);
      const endYear = Number(item.endYear || years.at(-1));
      const span = Math.max(1, endYear - startYear);
      const progress = Math.max(0, Math.min(1, (year - startYear) / span));
      output[year] = Number(item.amount || 0) + (Number(item.endValue || 0) - Number(item.amount || 0)) * progress;
    } else if (item.method === "percentRevenue") {
      output[year] = (calc.derived?.operatingRevenue?.[year] || operatingRevenueFromLines(calc.lineValues, year)) * Number(item.rate || 0);
    } else if (item.method === "percentLine") {
      output[year] = (calc.lineValues?.[item.sourceLine]?.[year] || 0) * Number(item.rate || 0);
    } else if (item.method === "volumePrice") {
      output[year] = Number(item.volume || 0) * Number(item.price || 0);
    } else if (item.method === "oneOff") {
      output[year] = year === Number(item.oneOffYear || years[index]) ? Number(item.amount || 0) : 0;
    }
  });
  return output;
}

function validateModel(calc) {
  const years = getYears();
  const assumptionChecks = state.assumptions.map((item) => validateAssumption(item, years, calc));
  const warnings = assumptionChecks.filter((item) => item.status === "Warning").length;
  const incomplete = assumptionChecks.filter((item) => item.status === "Incomplete").length;
  const pbtCumulative = years.reduce((sum, year) => sum + calc.derived.pbt[year], 0);
  const lastYear = years.at(-1);
  const revenueMultiple = safeDivide(calc.derived.operatingRevenue[lastYear], calc.derived.operatingRevenue[years[0]]);
  const minEbitdaMargin = Math.min(...years.map((year) => safeDivide(calc.derived.ebitda[year], calc.derived.operatingRevenue[year])));
  const conflictCount = findConflicts(years).length;

  const checks = [
    {
      check: "Required assumptions complete",
      delta: incomplete,
      status: incomplete ? "FAIL" : "OK",
      where: "Assumption Register",
      notes: incomplete ? "At least one active assumption is missing a value or line item." : "All active assumptions have interpretable drivers.",
    },
    {
      check: "Reasonability warnings",
      delta: warnings,
      status: warnings ? "WARN" : "OK",
      where: "Validation Centre",
      notes: warnings ? "One or more assumptions breach configured growth or conflict thresholds." : "All active assumptions are within configured thresholds.",
    },
    {
      check: "Active assumption conflicts",
      delta: conflictCount,
      status: conflictCount ? "WARN" : "OK",
      where: "Assumption Register",
      notes: conflictCount ? "Multiple active assumptions affect the same line and year." : "No overlapping active line-item assumptions found.",
    },
    {
      check: "Maximum Year 5 / Year 1 revenue multiple",
      delta: revenueMultiple - Number(state.controls.maxYear5RevenueMultiple || 0),
      status: revenueMultiple > Number(state.controls.maxYear5RevenueMultiple || 0) ? "WARN" : "OK",
      where: "Control Panel",
      notes: `Current multiple is ${formatNumber(revenueMultiple, 1)}x.`,
    },
    {
      check: "Minimum EBITDA margin",
      delta: minEbitdaMargin - Number(state.controls.minEbitdaMargin || 0),
      status: minEbitdaMargin < Number(state.controls.minEbitdaMargin || 0) ? "WARN" : "OK",
      where: "Control Panel",
      notes: `Lowest EBITDA margin is ${percent(minEbitdaMargin)}.`,
    },
    {
      check: "Maximum cumulative five-year loss",
      delta: pbtCumulative < 0 ? Math.abs(pbtCumulative) - Number(state.controls.maxCumulativeLoss || 0) : 0,
      status: pbtCumulative < -Number(state.controls.maxCumulativeLoss || 0) ? "FAIL" : "OK",
      where: "Control Panel",
      notes: `Cumulative PBT is ${money(pbtCumulative)}.`,
    },
  ];

  return { assumptions: assumptionChecks, checks };
}

function validateAssumption(item, years, calc) {
  if (!item.active) {
    return { id: item.id, title: item.title, status: "Inactive", className: "warn", reason: "Assumption retained but not affecting the P&L.", fix: "Toggle active if this assumption should flow into the model." };
  }
  if (!item.targetLine || !item.method) {
    return { id: item.id, title: item.title, status: "Incomplete", className: "fail", reason: "Missing target line or method.", fix: "Edit mapping and method." };
  }

  const values = calculateAssumptionValues(item, years, calc, { preview: true });
  const nonZero = years.some((year) => Math.abs(values[year] || 0) > 0.0001);
  if (!nonZero && !["Financing cost", "Tax"].includes(item.targetLine)) {
    return { id: item.id, title: item.title, status: "Incomplete", className: "fail", reason: "Generated output is zero across all years.", fix: "Add values or deactivate if this is reference-only." };
  }

  const conflicts = findConflicts(years).filter((conflict) => conflict.ids.includes(item.id));
  if (conflicts.length) {
    return { id: item.id, title: item.title, status: "Warning", className: "warn", reason: "Active assumption overlaps another assumption on the same line and year.", fix: "Choose override/add/multiply logic or deactivate one assumption." };
  }

  const materiality = years.reduce((sum, year) => sum + Math.abs(values[year] || 0), 0);
  if (materiality < Number(state.controls.materialityThreshold || 0) && !FINANCIAL_METRICS.includes(item.targetLine)) {
    return { id: item.id, title: item.title, status: "Warning", className: "warn", reason: "Below configured materiality threshold.", fix: "Retain if strategically important; otherwise archive or deactivate." };
  }

  for (let i = 1; i < years.length; i += 1) {
    const prev = values[years[i - 1]];
    const curr = values[years[i]];
    if (!prev || Math.abs(prev) < 0.0001) continue;
    const growth = (Math.abs(curr) - Math.abs(prev)) / Math.abs(prev);
    const isCost = curr < 0 || item.category.includes("cost") || item.category.includes("expenditure") || item.category.includes("risk");
    const maxGrowth = isCost ? Number(state.controls.maxCostGrowth || 0) : Number(state.controls.maxRevenueGrowth || 0);
    if (growth > maxGrowth) {
      return {
        id: item.id,
        title: item.title,
        status: "Warning",
        className: "warn",
        reason: `Year-on-year growth of ${percent(growth)} exceeds ${percent(maxGrowth)} threshold.`,
        fix: "Review source, adjust threshold, or add a scenario note.",
      };
    }
  }

  return { id: item.id, title: item.title, status: "Implemented", className: "pass", reason: "Parsed, active, and within core thresholds.", fix: "No action required." };
}

function findConflicts(years) {
  const conflicts = [];
  for (const line of LINE_ITEMS.map((item) => item.name)) {
    for (const year of years) {
      const ids = state.assumptions
        .filter((item) => item.active && item.targetLine === line)
        .filter((item) => Math.abs(calculateAssumptionValues(item, [year], {}, { preview: true })[year] || 0) > 0.0001)
        .map((item) => item.id);
      if (ids.length > 1) conflicts.push({ line, year, ids });
    }
  }
  return conflicts;
}

function controlPanel() {
  return `
    <div class="control-grid">
      ${field("Scenario", "scenarioName", "text", state.controls.scenarioName)}
      ${field("Start year", "startYear", "number", state.controls.startYear)}
      ${field("Projection years", "duration", "number", state.controls.duration, { min: 3, max: 7 })}
      ${selectField("Output style", "outputStyle", state.controls.outputStyle, ["Working-model style", "Management-report style", "Board-paper style"])}
      ${field("Currency", "currency", "text", state.controls.currency)}
      ${field("Units", "units", "text", state.controls.units)}
      ${field("Max revenue growth", "maxRevenueGrowth", "percent", state.controls.maxRevenueGrowth)}
      ${field("Max cost growth", "maxCostGrowth", "percent", state.controls.maxCostGrowth)}
      ${field("Max Year 5 / Year 1 revenue multiple", "maxYear5RevenueMultiple", "number", state.controls.maxYear5RevenueMultiple)}
      ${field("Minimum EBITDA margin", "minEbitdaMargin", "percent", state.controls.minEbitdaMargin)}
      ${field("Maximum cumulative loss", "maxCumulativeLoss", "number", state.controls.maxCumulativeLoss)}
      ${field("Tax rate", "taxRate", "percent", state.controls.taxRate)}
      <label class="toggle input-like" style="padding:8px;border-radius:6px;border:1px solid var(--line-strong)">
        <input type="checkbox" class="control-input" data-control="approvalRequired" ${state.controls.approvalRequired ? "checked" : ""} ${state.controls.locked ? "disabled" : ""}>
        Approval required
      </label>
      <label class="toggle input-like" style="padding:8px;border-radius:6px;border:1px solid var(--line-strong)">
        <input type="checkbox" class="control-input" data-control="includeAuditTrail" ${state.controls.includeAuditTrail ? "checked" : ""} ${state.controls.locked ? "disabled" : ""}>
        Include audit trail
      </label>
    </div>
  `;
}

function field(label, key, type, value, opts = {}) {
  const inputType = type === "percent" ? "number" : type;
  const shown = type === "percent" ? Number(value || 0) * 100 : value;
  return `
    <div class="form-field">
      <label for="control-${key}">${escapeHTML(label)}</label>
      <input id="control-${key}" class="control-input input-cell" data-control="${key}" data-type="${type}" type="${inputType}" value="${escapeAttr(shown)}" ${opts.min !== undefined ? `min="${opts.min}"` : ""} ${opts.max !== undefined ? `max="${opts.max}"` : ""} ${state.controls.locked ? "disabled" : ""}>
    </div>
  `;
}

function selectField(label, key, value, options) {
  return `
    <div class="form-field">
      <label for="control-${key}">${escapeHTML(label)}</label>
      <select id="control-${key}" class="control-input input-cell" data-control="${key}" ${state.controls.locked ? "disabled" : ""}>
        ${options.map((option) => `<option value="${escapeAttr(option)}" ${option === value ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}
      </select>
    </div>
  `;
}

function plTable(calc, compact) {
  const years = getYears();
  const row = (label, series, className = "", logic = "") => `
    <tr class="${className}">
      <td>${escapeHTML(label)}${logic && !compact ? `<br><span class="muted">${escapeHTML(logic)}</span>` : ""}</td>
      ${years.map((year) => `<td class="number ${series[year] < 0 ? "negative" : ""}">${money(series[year])}</td>`).join("")}
    </tr>
  `;
  const sections = [];
  sections.push(`<tr class="section-row"><td colspan="${years.length + 1}">Operating revenue</td></tr>`);
  for (const item of LINE_ITEMS.filter((line) => line.group === "Revenue")) {
    sections.push(row(item.name, calc.lineValues[item.name], "", `SUM active assumptions mapped to ${item.name}`));
  }
  sections.push(row("Total Operating Revenue", calc.derived.operatingRevenue, "total-row", "Sum of revenue lines"));
  sections.push(row("(+) Investment income", calc.lineValues["Investment income"], "", "Active assumptions mapped to Investment income"));
  sections.push(row("Total Income", calc.derived.totalIncome, "total-row", "Total Operating Revenue + Investment income"));
  sections.push(`<tr class="section-row"><td colspan="${years.length + 1}">Expenses</td></tr>`);
  sections.push(row("(-) Operating Expenses", calc.lineValues["Operating Expenses"], "", "Active assumptions mapped to Operating Expenses"));
  sections.push(row("(-) Expected credit loss", calc.lineValues["Expected credit loss"], "", "Active assumptions mapped to ECL"));
  sections.push(row("Total Expenses", calc.derived.totalExpenses, "total-row", "Operating Expenses + Expected credit loss"));
  sections.push(row("Financing cost", calc.lineValues["Financing cost"], "", "No interest expense in S2b reference case"));
  sections.push(row("Profit (Loss) before taxation", calc.derived.pbt, "total-row", "Total Income + Total Expenses + Financing cost"));
  if (!compact) {
    sections.push(row("Tax", calc.derived.tax, "", "Positive PBT x tax rate; default 0% because reference table has no tax line"));
    sections.push(row("Profit (Loss) after tax", calc.derived.pat, "total-row", "PBT + Tax"));
  }
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Line item</th>${years.map((year) => `<th class="number">${year}</th>`).join("")}</tr></thead>
        <tbody>${sections.join("")}</tbody>
      </table>
    </div>
  `;
}

function financialStrengthTable(calc) {
  const years = getYears();
  const rows = [
    ["Funding from CGC Malaysia", calc.metricValues["Funding from CGC Malaysia"]],
    ["Funding from SPRA", calc.metricValues["Funding from SPRA"]],
    ["Total Funding", calc.derived.totalFunding],
    ["Guarantee Cover", calc.metricValues["Guarantee Cover"]],
    ["Net Reserved", calc.metricValues["Net Reserved"]],
    ["GRR", calc.metricValues["GRR"]],
  ];
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Metric</th>${years.map((year) => `<th class="number">${year}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(([label, series]) => `
            <tr class="${label === "Total Funding" ? "total-row" : ""}">
              <td>${escapeHTML(label)}</td>
              ${years.map((year) => `<td class="number">${label === "GRR" ? formatNumber(series[year], 1) + "x" : money(series[year])}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function libraryTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Category</th><th>Template</th><th>Method</th></tr></thead>
        <tbody>
          ${TEMPLATE_LIBRARY.map((template) => `
            <tr><td>${template[0]}</td><td>${template[1]}</td><td>${escapeHTML(template[2])}</td><td>${escapeHTML(METHOD_LABELS[template[3]])}</td></tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function openEditor(id) {
  const years = getYears();
  const found = id ? state.assumptions.find((item) => item.id === id) : null;
  editorDraft = found ? clone(found) : assumption(nextAssumptionId(), "1. Revenue assumptions", "New assumption", "Distribution fee", "yearSpecific", true, {
    text: "Revenue starts at RM1 million in Year 1 and grows by 5% annually.",
    values: Object.fromEntries(years.map((year) => [year, 0])),
    source: "User-entered",
  });
  renderEditor();
  els.editorPanel.classList.add("open");
}

function renderEditor() {
  const years = getYears();
  els.editorTitle.textContent = state.assumptions.some((item) => item.id === editorDraft.id) ? "Edit assumption" : "New assumption";
  const method = editorDraft.method;
  els.assumptionForm.innerHTML = `
    <div class="form-field">
      <label for="assumptionText">Plain-language assumption</label>
      <textarea id="assumptionText" name="text" class="input-cell">${escapeHTML(editorDraft.text || "")}</textarea>
    </div>
    <div class="button-row">
      <button class="secondary-button" id="parseAssumptionButton" type="button">Interpret Text</button>
      <span class="mini-badge">Confidence ${percent(editorDraft.confidence || 0)}</span>
    </div>
    <div class="control-grid">
      ${editorText("Title", "title", editorDraft.title)}
      ${editorSelect("Category", "category", editorDraft.category, ASSUMPTION_CATEGORIES)}
      ${editorSelect("Target line", "targetLine", editorDraft.targetLine, [...LINE_ITEMS.map((item) => item.name), ...FINANCIAL_METRICS])}
      ${editorSelect("Method", "method", editorDraft.method, Object.keys(METHOD_LABELS), METHOD_LABELS)}
      ${editorNumber("Start year", "startYear", editorDraft.startYear)}
      ${editorNumber("End year", "endYear", editorDraft.endYear)}
      ${editorSelect("Combination logic", "combinationLogic", editorDraft.combinationLogic, ["Add", "Override", "Subtract", "Multiply", "Minimum", "Maximum", "Inactive due to conflict"])}
      <label class="toggle input-like" style="padding:8px;border-radius:6px;border:1px solid var(--line-strong)">
        <input type="checkbox" name="active" ${editorDraft.active ? "checked" : ""}>
        Active
      </label>
    </div>
    ${methodFields(method, years)}
    <div class="form-field">
      <label for="source">Source / audit note</label>
      <input id="source" name="source" class="input-cell" value="${escapeAttr(editorDraft.source || "")}">
    </div>
    <div class="button-row">
      <button class="primary-button" type="submit" ${state.controls.locked ? "disabled" : ""}>Save Assumption</button>
      <button class="danger-button" data-delete-assumption="${editorDraft.id}" type="button" ${state.controls.locked || !state.assumptions.some((item) => item.id === editorDraft.id) ? "disabled" : ""}>Delete</button>
    </div>
  `;
  document.querySelector("#parseAssumptionButton").addEventListener("click", parseEditorText);
  els.assumptionForm.querySelector("[name='method']").addEventListener("change", (event) => {
    editorDraft.method = event.target.value;
    renderEditor();
  });
}

function methodFields(method, years) {
  if (method === "yearSpecific") {
    return `
      <div class="year-grid">
        ${years.map((year) => editorNumber(String(year), `value-${year}`, editorDraft.values?.[year] || 0)).join("")}
      </div>
    `;
  }
  if (method === "compound") {
    return `<div class="control-grid">${editorNumber(`Base value (${state.controls.units})`, "amount", editorDraft.amount || 0)}${editorNumber("Annual growth %", "growthRatePercent", (editorDraft.growthRate || 0) * 100)}</div>`;
  }
  if (method === "straightLine") {
    return `<div class="control-grid">${editorNumber(`Start value (${state.controls.units})`, "amount", editorDraft.amount || 0)}${editorNumber(`End value (${state.controls.units})`, "endValue", editorDraft.endValue || 0)}</div>`;
  }
  if (method === "percentRevenue") {
    return `<div class="control-grid">${editorNumber("% of operating revenue", "ratePercent", (editorDraft.rate || 0) * 100)}</div>`;
  }
  if (method === "percentLine") {
    return `<div class="control-grid">${editorSelect("Source line", "sourceLine", editorDraft.sourceLine || "Total Operating Revenue", LINE_ITEMS.map((item) => item.name))}${editorNumber("% of source line", "ratePercent", (editorDraft.rate || 0) * 100)}</div>`;
  }
  if (method === "volumePrice") {
    return `<div class="control-grid">${editorNumber("Volume", "volume", editorDraft.volume || 0)}${editorNumber(`Price (${state.controls.units})`, "price", editorDraft.price || 0)}</div>`;
  }
  if (method === "oneOff") {
    return `<div class="control-grid">${editorNumber(`Amount (${state.controls.units})`, "amount", editorDraft.amount || 0)}${editorNumber("One-off year", "oneOffYear", editorDraft.oneOffYear || years[0])}</div>`;
  }
  return `<div class="control-grid">${editorNumber(`Annual amount (${state.controls.units})`, "amount", editorDraft.amount || 0)}</div>`;
}

function editorText(label, name, value) {
  return `<div class="form-field"><label>${escapeHTML(label)}</label><input class="input-cell" name="${name}" value="${escapeAttr(value || "")}"></div>`;
}

function editorNumber(label, name, value) {
  return `<div class="form-field"><label>${escapeHTML(label)}</label><input class="input-cell" name="${name}" type="number" step="any" value="${escapeAttr(value ?? 0)}"></div>`;
}

function editorSelect(label, name, value, options, labels = {}) {
  return `
    <div class="form-field">
      <label>${escapeHTML(label)}</label>
      <select class="input-cell" name="${name}">
        ${options.map((option) => `<option value="${escapeAttr(option)}" ${option === value ? "selected" : ""}>${escapeHTML(labels[option] || option)}</option>`).join("")}
      </select>
    </div>
  `;
}

function saveEditor(event) {
  event.preventDefault();
  if (state.controls.locked) return toast("Scenario is locked. Unlock or duplicate before editing.");
  const form = new FormData(els.assumptionForm);
  const years = getYears();
  const updated = {
    ...editorDraft,
    text: String(form.get("text") || ""),
    title: String(form.get("title") || "Untitled assumption"),
    category: String(form.get("category") || ASSUMPTION_CATEGORIES[0]),
    targetLine: String(form.get("targetLine") || LINE_ITEMS[0].name),
    method: String(form.get("method") || "yearSpecific"),
    active: form.get("active") === "on",
    startYear: Number(form.get("startYear") || years[0]),
    endYear: Number(form.get("endYear") || years.at(-1)),
    combinationLogic: String(form.get("combinationLogic") || "Add"),
    source: String(form.get("source") || "User-entered"),
    modifiedAt: today(),
    modifiedBy: USER_NAME,
  };

  if (updated.method === "yearSpecific") {
    updated.values = Object.fromEntries(years.map((year) => [year, Number(form.get(`value-${year}`) || 0)]));
  } else {
    updated.amount = Number(form.get("amount") || 0);
    updated.endValue = Number(form.get("endValue") || 0);
    updated.growthRate = Number(form.get("growthRatePercent") || 0) / 100;
    updated.rate = Number(form.get("ratePercent") || 0) / 100;
    updated.volume = Number(form.get("volume") || 0);
    updated.price = Number(form.get("price") || 0);
    updated.sourceLine = String(form.get("sourceLine") || "");
    updated.oneOffYear = Number(form.get("oneOffYear") || years[0]);
  }

  mutate("Saved assumption", updated.id, () => {
    const index = state.assumptions.findIndex((item) => item.id === updated.id);
    if (index >= 0) {
      updated.version = Number(state.assumptions[index].version || 1) + 1;
      state.assumptions[index] = updated;
    } else {
      state.assumptions.push(updated);
    }
  }, editorDraft.title, updated.title);

  closeEditor();
}

function parseEditorText() {
  const text = String(els.assumptionForm.querySelector("[name='text']").value || "");
  const parsed = parseAssumptionText(text);
  editorDraft = { ...editorDraft, ...parsed, text, confidence: parsed.confidence };
  renderEditor();
  toast("Text interpreted into a structured driver.");
}

function parseAssumptionText(text) {
  const lower = text.toLowerCase();
  const amount = parseMoney(text);
  const percentages = [...text.matchAll(/(-?\d+(?:\.\d+)?)\s*%/g)].map((match) => Number(match[1]) / 100);
  const firstPct = percentages[0] || 0;
  const yearMatch = lower.match(/year\s*(\d{4}|\d+)/);
  const oneOffYear = yearMatch ? normalizeYear(Number(yearMatch[1])) : getYears()[0];

  if (lower.includes("fixed")) {
    return { method: "fixed", amount, confidence: 0.78 };
  }
  if (lower.includes("one-off") || lower.includes("one off")) {
    return { method: "oneOff", amount, oneOffYear, confidence: 0.77 };
  }
  if (lower.includes("of revenue") || lower.includes("of total revenue")) {
    return { method: "percentRevenue", rate: firstPct, confidence: 0.82 };
  }
  if (lower.includes("multiplied by") || lower.includes(" x ")) {
    const numbers = [...text.matchAll(/(-?\d+(?:,\d{3})*(?:\.\d+)?)/g)].map((match) => Number(match[1].replace(/,/g, "")));
    return { method: "volumePrice", volume: numbers[0] || 0, price: numbers[1] || 0, confidence: 0.74 };
  }
  if (lower.includes("from") && lower.includes("to")) {
    const amounts = parseAllMoney(text);
    return { method: "straightLine", amount: amounts[0] || amount, endValue: amounts[1] || amount, confidence: 0.81 };
  }
  if (lower.includes("grow") || lower.includes("increase")) {
    return { method: "compound", amount, growthRate: firstPct, confidence: 0.84 };
  }
  return { method: "yearSpecific", values: editorDraft.values || {}, confidence: 0.55 };
}

function handleClick(event) {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    switchView(nav.dataset.nav);
    return;
  }
  const navItem = event.target.closest(".nav-item");
  if (navItem) {
    switchView(navItem.dataset.view);
    return;
  }
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    openEditor(edit.dataset.edit);
    return;
  }
  const remove = event.target.closest("[data-delete-assumption]");
  if (remove) {
    deleteAssumption(remove.dataset.deleteAssumption);
    return;
  }
  const restore = event.target.closest("[data-restore-scenario]");
  if (restore) {
    restoreScenario(restore.dataset.restoreScenario);
    return;
  }
  const exportButton = event.target.closest("[data-export]");
  if (exportButton) {
    handleExport(exportButton.dataset.export);
  }
}

function handleChange(event) {
  const toggle = event.target.closest(".assumption-toggle");
  if (toggle) {
    const id = toggle.dataset.id;
    const item = state.assumptions.find((entry) => entry.id === id);
    if (!item || state.controls.locked) return;
    mutate("Toggled assumption", id, () => {
      item.active = toggle.checked;
      item.modifiedAt = today();
    }, item.active ? "Active" : "Inactive", toggle.checked ? "Active" : "Inactive");
    return;
  }

  const control = event.target.closest(".control-input");
  if (control) {
    updateControl(control);
  }
}

function handleInput(event) {
  const control = event.target.closest(".control-input");
  if (control && ["scenarioName"].includes(control.dataset.control)) {
    updateControl(control, true);
  }
}

function updateControl(control, light = false) {
  if (state.controls.locked) return;
  const key = control.dataset.control;
  const oldValue = state.controls[key];
  let value;
  if (control.type === "checkbox") {
    value = control.checked;
  } else if (control.dataset.type === "percent") {
    value = Number(control.value || 0) / 100;
  } else if (control.type === "number") {
    value = Number(control.value || 0);
  } else {
    value = control.value;
  }
  if (oldValue === value) return;
  mutate("Changed control", key, () => {
    state.controls[key] = value;
  }, String(oldValue), String(value), light);
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
  document.querySelector(`#${view}View`)?.classList.add("active");
  document.querySelectorAll(".nav-item").forEach((node) => node.classList.toggle("active", node.dataset.view === view));
}

function saveScenario() {
  const name = state.controls.scenarioName || "Untitled Scenario";
  mutate("Saved scenario", name, () => {
    state.scenarios.push({
      id: `SCN-${String(state.scenarios.length + 1).padStart(3, "0")}`,
      name,
      savedAt: timestamp(),
      locked: state.controls.locked,
      note: "Manual scenario snapshot.",
      snapshot: snapshotFrom(state),
    });
  }, "-", "Scenario snapshot saved");
  toast("Scenario saved.");
}

function duplicateScenario() {
  const nextName = `${state.controls.scenarioName} Copy`;
  mutate("Duplicated scenario", state.controls.scenarioName, () => {
    state.controls.scenarioName = nextName;
    state.controls.locked = false;
  }, state.controls.scenarioName, nextName);
  toast("Scenario duplicated and unlocked.");
}

function toggleLock() {
  mutate(state.controls.locked ? "Unlocked scenario" : "Locked scenario", state.controls.scenarioName, () => {
    state.controls.locked = !state.controls.locked;
  }, state.controls.locked ? "Locked" : "Editable", state.controls.locked ? "Editable" : "Locked");
}

function restoreScenario(id) {
  const scenario = state.scenarios.find((item) => item.id === id);
  if (!scenario) return;
  mutate("Restored scenario", scenario.name, () => {
    state.controls = clone(scenario.snapshot.controls);
    state.assumptions = clone(scenario.snapshot.assumptions);
  }, state.controls.scenarioName, scenario.name);
  toast("Scenario restored.");
}

function deleteAssumption(id) {
  if (state.controls.locked) return;
  mutate("Deleted assumption", id, () => {
    state.assumptions = state.assumptions.filter((item) => item.id !== id);
  }, id, "-");
  closeEditor();
}

function undo() {
  const item = undoStack.pop();
  if (!item) return;
  redoStack.push(snapshotEditable());
  restoreEditable(item);
  recordAudit("Reversed action", "Undo", item.controls?.scenarioName || "-", state.controls.scenarioName, "Undo restored prior model state.");
  render();
}

function redo() {
  const item = redoStack.pop();
  if (!item) return;
  undoStack.push(snapshotEditable());
  restoreEditable(item);
  recordAudit("Redone action", "Redo", "-", state.controls.scenarioName, "Redo restored later model state.");
  render();
}

function mutate(action, target, fn, before = "-", after = "-", light = false) {
  const beforeSnapshot = snapshotEditable();
  fn();
  if (!light) undoStack.push(beforeSnapshot);
  redoStack = [];
  recordAudit(action, target, before, after, "");
  render();
}

function recordAudit(action, target, before, after, note) {
  state.audit.push({
    id: `AUD-${String(state.audit.length + 1).padStart(3, "0")}`,
    timestamp: timestamp(),
    action,
    target,
    before: String(before ?? "-"),
    after: String(after ?? "-"),
    user: USER_NAME,
    note,
  });
}

function closeEditor() {
  editorDraft = null;
  els.editorPanel.classList.remove("open");
}

function handleExport(type) {
  const calc = calculateModel();
  if (type === "json") {
    downloadFile("scenario_export.json", JSON.stringify({ controls: state.controls, assumptions: state.assumptions, calculations: calc, audit: state.audit, sources: SOURCE_LOG }, null, 2), "application/json");
  } else if (type === "assumptionsCsv") {
    downloadFile("assumption_register.csv", assumptionsCsv(calc), "text/csv");
  } else if (type === "auditCsv") {
    downloadFile("audit_trail.csv", auditCsv(), "text/csv");
  } else if (type === "excel") {
    downloadFile("assumption_based_financial_model.xls", excelHtml(calc), "application/vnd.ms-excel");
  } else if (type === "print") {
    window.print();
  }
  recordAudit("Exported scenario", type, "-", state.controls.scenarioName, `Generated ${type} export.`);
  persist();
}

function assumptionsCsv(calc) {
  const years = getYears();
  const header = ["ID", "Category", "Title", "Target Line", "Method", "Active", "Source", ...years];
  const rows = state.assumptions.map((item) => {
    const values = calculateAssumptionValues(item, years, calc, { preview: true });
    return [item.id, item.category, item.title, item.targetLine, METHOD_LABELS[item.method] || item.method, item.active ? "Active" : "Inactive", item.source, ...years.map((year) => values[year] || 0)];
  });
  return toCsv([header, ...rows]);
}

function auditCsv() {
  return toCsv([
    ["ID", "Timestamp", "Action", "Target", "Before", "After", "User", "Note"],
    ...state.audit.map((entry) => [entry.id, entry.timestamp, entry.action, entry.target, entry.before, entry.after, entry.user, entry.note]),
  ]);
}

function excelHtml(calc) {
  const years = getYears();
  const assumptionRows = state.assumptions.map((item) => {
    const values = calculateAssumptionValues(item, years, calc, { preview: true });
    return `<tr><td>${item.id}</td><td>${item.category}</td><td>${item.title}</td><td>${item.targetLine}</td><td>${METHOD_LABELS[item.method]}</td><td>${item.active ? "Active" : "Inactive"}</td>${years.map((year) => `<td>${values[year] || 0}</td>`).join("")}</tr>`;
  }).join("");
  return `
    <html><head><meta charset="utf-8"><style>table{border-collapse:collapse}td,th{border:1px solid #999;padding:4px}th{background:#dcefeb}</style></head><body>
    <h1>${escapeHTML(state.controls.scenarioName)}</h1>
    <h2>P&L</h2>${plTable(calc, false)}
    <h2>Assumptions</h2><table><thead><tr><th>ID</th><th>Category</th><th>Title</th><th>Target Line</th><th>Method</th><th>Active</th>${years.map((year) => `<th>${year}</th>`).join("")}</tr></thead><tbody>${assumptionRows}</tbody></table>
    <h2>Audit Trail</h2><pre>${escapeHTML(auditCsv())}</pre>
    </body></html>
  `;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast(`${filename} downloaded.`);
}

function kpi(label, value, sub, className = "") {
  return `<div class="kpi"><p class="kpi-label">${escapeHTML(label)}</p><p class="kpi-value ${className}">${value}</p><p class="kpi-sub">${escapeHTML(sub)}</p></div>`;
}

function lineChart(labels, series) {
  const width = 760;
  const height = 240;
  const pad = 34;
  const allValues = series.flatMap((item) => item.values);
  const min = Math.min(0, ...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;
  const x = (index) => pad + (index * (width - pad * 2)) / Math.max(1, labels.length - 1);
  const y = (value) => height - pad - ((value - min) * (height - pad * 2)) / span;
  const lines = series.map((item) => {
    const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    const dots = item.values.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="3.5" fill="${item.color}"></circle>`).join("");
    return `<polyline points="${points}" fill="none" stroke="${item.color}" stroke-width="3"></polyline>${dots}`;
  }).join("");
  const axisLabels = labels.map((label, index) => `<text x="${x(index)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#607078">${label}</text>`).join("");
  const zeroY = y(0);
  return `
    <div class="chart-box">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Revenue and PBT line chart">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"></rect>
        <line x1="${pad}" y1="${zeroY}" x2="${width - pad}" y2="${zeroY}" stroke="#aebbb7" stroke-width="1"></line>
        <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="#d7dfdc"></line>
        <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#d7dfdc"></line>
        ${lines}
        ${axisLabels}
      </svg>
    </div>
  `;
}

function getYears() {
  const start = Number(state.controls.startYear || 2025);
  const duration = Math.max(1, Number(state.controls.duration || 5));
  return Array.from({ length: duration }, (_, index) => start + index);
}

function blankSeries(years) {
  return Object.fromEntries(years.map((year) => [year, 0]));
}

function addValues(targetLine, values, years, lineValues, metricValues) {
  const bucket = FINANCIAL_METRICS.includes(targetLine) ? metricValues : lineValues;
  if (!bucket[targetLine]) bucket[targetLine] = blankSeries(years);
  for (const year of years) {
    bucket[targetLine][year] += Number(values[year] || 0);
  }
}

function sumLines(lines, year, lineValues) {
  return lines.reduce((sum, line) => sum + (lineValues[line]?.[year] || 0), 0);
}

function operatingRevenueFromLines(lineValues, year) {
  return sumLines(["Distribution fee", "Referral fee", "Cr. Guarantee Processing fee", "Development Fee", "Service fee for PD model", "Recurring imSME service fee", "Digital guarantee"], year, lineValues || {});
}

function money(value) {
  const number = Number(value || 0);
  if (Math.abs(number) < 0.05) return "-";
  const formatted = Math.abs(number).toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  return number < 0 ? `(${formatted})` : formatted;
}

function percent(value) {
  if (!Number.isFinite(Number(value))) return "-";
  return `${(Number(value) * 100).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

function formatNumber(value, digits = 1) {
  if (!Number.isFinite(Number(value))) return "-";
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function safeDivide(a, b) {
  return b ? a / b : 0;
}

function parseMoney(text) {
  const all = parseAllMoney(text);
  return all[0] || 0;
}

function parseAllMoney(text) {
  const matches = [...text.matchAll(/RM\s*(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|mil|m|thousand|k)?/gi)];
  return matches.map((match) => {
    const base = Number(match[1].replace(/,/g, ""));
    const unit = String(match[2] || "").toLowerCase();
    if (["million", "mil", "m"].includes(unit)) return base * 1000;
    if (["thousand", "k"].includes(unit)) return base;
    return base;
  });
}

function normalizeYear(value) {
  if (value > 2000) return value;
  return Number(state.controls.startYear || 2025) + value - 1;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(value);
}

function toCsv(rows) {
  return rows
    .map((row) => row.map((cell) => {
      const value = String(cell ?? "");
      return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(","))
    .join("\n");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function snapshotFrom(sourceState) {
  return {
    controls: clone(sourceState.controls),
    assumptions: clone(sourceState.assumptions),
  };
}

function snapshotEditable() {
  return {
    controls: clone(state.controls),
    assumptions: clone(state.assumptions),
    scenarios: clone(state.scenarios),
  };
}

function restoreEditable(snapshot) {
  state.controls = clone(snapshot.controls);
  state.assumptions = clone(snapshot.assumptions);
  state.scenarios = clone(snapshot.scenarios || state.scenarios);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Direct file access can restrict storage in some browser settings.
  }
}

function updateButtons() {
  document.querySelector("#undoButton").disabled = undoStack.length === 0;
  document.querySelector("#redoButton").disabled = redoStack.length === 0;
}

function nextAssumptionId() {
  const next = state.assumptions.length + 1;
  let id = `ASM-${String(next).padStart(3, "0")}`;
  while (state.assumptions.some((item) => item.id === id)) {
    id = `ASM-${String(Number(id.slice(4)) + 1).padStart(3, "0")}`;
  }
  return id;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function timestamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return `${date} ${time}`;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => els.toast.classList.remove("visible"), 2200);
}
