const STORAGE_KEY = "adfm-sdd-v2-state";
const USER_NAME = "Model owner";

const TAXONOMY = ["Volume & Growth", "Revenue Drivers", "Cost Base", "Risk & ECL", "Funding", "Macro / Other"];
const METHOD_LABELS = {
  flat_values: "Flat values",
  single_value_growth: "Single value + growth",
  percent_of_driver: "% of driver",
  per_unit: "Per unit",
  fixed_per_year: "Fixed per year",
};
const METHOD_KEYS = Object.keys(METHOD_LABELS);
const MAX_ANNUAL_YEARS = 10;
const MAX_MONTHLY_YEARS = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SOURCE_LOG = [
  {
    item: "SDD v2 product contract",
    source: "Assumption-Driven-Financial-Model-SDD-v2.0.pdf",
    note: "Formula cards, annual/monthly granularity, drivers, editable P&L lines, Unit Economics, exports, audit, and translator seam.",
  },
  {
    item: "Seed financial case",
    source: "CGC Digital 3.0 Financial Projections.pdf",
    note: "Reference values retained as starter assumptions so a new model does not open as zeros.",
  },
  {
    item: "Driver hints",
    source: "Digital Guarantee Revenue Projection.xlsx",
    note: "Programme size, guarantee volume, man-day, project count, and fee-rate patterns inform starter drivers.",
  },
];

const DEFAULT_SETTINGS = {
  scenarioName: "S2b Reference Case - SDD v2",
  startYear: 2025,
  yearCount: 5,
  granularity: "annual",
  startMonth: 1,
  monthlyYearCount: 3,
  unitYear: 2029,
  currency: "RM",
  units: "RM'000",
  translatorBackend: "local",
  maxAnnualFigure: 120000,
  maxCostRatio: 3,
  locked: false,
  includeAuditTrail: true,
};

const DEFAULT_LINES = [
  line("distribution_fee", "Distribution fee", "revenue"),
  line("referral_fee", "Referral fee", "revenue"),
  line("processing_fee", "Credit guarantee processing fee", "revenue"),
  line("development_fee", "Development fee", "revenue"),
  line("pd_model_service", "Service fee for PD model", "revenue"),
  line("imsme_service", "Recurring imSME service fee", "revenue"),
  line("digital_guarantee", "Digital guarantee", "revenue"),
  line("investment_income", "Investment income", "revenue"),
  line("operating_expenses", "Operating expenses", "cost"),
  line("expected_credit_loss", "Expected credit loss", "cost"),
  line("technology_support", "Technology support cost", "cost"),
];

const DEFAULT_DRIVERS = [
  driver("programme_size", "Programme size", "RM'000", 145600, 0.15, "Digital guarantee programme pipeline"),
  driver("guarantee_volume", "Guarantee volume", "RM'000", 72800, 0.12, "50% EAD on programme size"),
  driver("project_count", "Number of projects", "count", 3, 0, "Current manpower capacity"),
  driver("man_days", "Man-days per project", "days", 720, 0, "6 months x 20 working days x 6 people"),
  driver("guarantee_count", "Number of guarantees", "count", 8000, 0.1, "Illustrative guarantee activity driver"),
];

const DEFAULT_CARDS = [
  card("FC-001", "Revenue Drivers", "Distribution fee follows the S2b five-year reference projection.", "distribution_fee", "flat_values", {
    values: { 2025: 224.6, 2026: 500, 2027: 850, 2028: 1300, 2029: 1950 },
  }),
  card("FC-002", "Revenue Drivers", "Referral fee follows the S2b five-year reference projection.", "referral_fee", "flat_values", {
    values: { 2025: 36, 2026: 46.6, 2027: 63.9, 2028: 86.8, 2029: 123.2 },
  }),
  card("FC-003", "Revenue Drivers", "Credit guarantee processing fee follows the S2b reference projection.", "processing_fee", "flat_values", {
    values: { 2025: 449.2, 2026: 1000, 2027: 1700, 2028: 2600, 2029: 3900 },
  }),
  card("FC-004", "Revenue Drivers", "Development fee follows the S2b five-year reference projection.", "development_fee", "flat_values", {
    values: { 2025: 5850, 2026: 6500, 2027: 7700, 2028: 10300, 2029: 11700 },
  }),
  card("FC-005", "Revenue Drivers", "Service fee for PD model is RM250k in 2026 and grows by 10% annually.", "pd_model_service", "single_value_growth", {
    startValue: 250,
    growthRate: 0.1,
    baseYear: 2026,
  }),
  card("FC-006", "Revenue Drivers", "Recurring imSME service fee follows the S2b reference profile.", "imsme_service", "flat_values", {
    values: { 2025: 0, 2026: 3251.5, 2027: 3326.9, 2028: 3613.5, 2029: 3937.3 },
  }),
  card("FC-007", "Revenue Drivers", "Digital guarantee revenue follows the S2b reference profile.", "digital_guarantee", "flat_values", {
    values: { 2025: 669, 2026: 1700, 2027: 3450, 2028: 6200, 2029: 11150 },
  }),
  card("FC-008", "Revenue Drivers", "Investment income follows S2b and assumes 4.25% net investment income after fees.", "investment_income", "flat_values", {
    values: { 2025: 177.2, 2026: 2155.9, 2027: 4264.3, 2028: 7669.7, 2029: 13891.4 },
  }),
  card("FC-009", "Cost Base", "Operating expenses match the S2b reference financial model.", "operating_expenses", "flat_values", {
    values: { 2025: 23578.5, 2026: 25872.6, 2027: 28542.8, 2028: 33317.3, 2029: 37415.8 },
  }),
  card("FC-010", "Risk & ECL", "Expected credit loss follows S2b claims assumptions.", "expected_credit_loss", "flat_values", {
    values: { 2025: 458.3, 2026: 1484.1, 2027: 2923.5, 2028: 5296.9, 2029: 9511.5 },
  }),
  card("FC-011", "Cost Base", "Technology support cost is fixed at RM600k per year.", "technology_support", "fixed_per_year", {
    amount: 600,
  }),
];

const DEFAULT_SEGMENTS = [
  { key: "digital_banks", name: "Digital Banks" },
  { key: "nbfi", name: "NBFI" },
  { key: "ecosystem", name: "Ecosystem" },
];

const HELP_VIEWS = new Set(["guide", "quickStart"]);
const VIEW_LABELS = {
  dashboard: "Dashboard",
  pl: "P&L",
  assumptions: "Assumptions",
  drivers: "Drivers",
  unitEconomics: "Unit Economics",
  unitAssumptions: "Unit Econ Assumptions",
  scenarios: "Scenarios",
  audit: "Audit Trail",
  settings: "Settings",
};

const GUIDE_SECTIONS = [
  {
    view: "dashboard",
    title: "Dashboard",
    summary: "The Dashboard is the management cockpit. Use it to understand whether the current scenario is usable before you spend time interpreting outputs or preparing exports.",
    useWhen: [
      "You want the fastest view of revenue, profit or loss, cumulative losses, breakeven year, model status, and SDD coverage.",
      "You need to confirm whether the model is clean, needs review, or needs a formula rewrite.",
      "You want a launch point for common actions such as editing drivers, adding formula cards, or exporting outputs.",
    ],
    actions: [
      "Read the MODEL STATUS badge first. OK means all formula cards translate and all reasonability checks pass. NEEDS REVIEW means the model calculates, but a bound or split needs human attention. NEEDS REWRITE means at least one card cannot be interpreted safely.",
      "Use the KPI row to understand the latest projected year. The app shows the final year in the active projection range, not necessarily 2029 if you change Settings.",
      "Use the trend chart to see whether losses are narrowing, expanding, or reversing into profit across the annual horizon.",
      "Open the coverage cards when you want to confirm which SDD v2 features are implemented in this static MVP and which parts remain backend scope.",
    ],
    checks: [
      "If the dashboard is blank, reload the page once. The app rebuilds a default SDD v2 state if older local storage is incompatible.",
      "If profit seems surprising, go to Assumptions and inspect the formula cards contributing to the largest line items.",
      "If Unit Economics reconciliation differs from the main P&L, inspect Unit Econ Assumptions for a split warning.",
    ],
  },
  {
    view: "pl",
    title: "P&L",
    summary: "The P&L screen is a read-only output statement. It is the formal result of formula cards, drivers, projection settings, and the P&L line structure.",
    useWhen: [
      "You want to review revenue, cost, total revenue, total costs, and profit or loss by period.",
      "You need to compare the annual view with the monthly view after changing the P&L breakout or Settings.",
      "You want to verify that formula-card impacts are rolling into the correct line items.",
    ],
    actions: [
      "Use the P&L breakout controls or Settings to select annual or monthly projection. Annual can run up to 10 years. Monthly can run up to 3 years and reconciles back to the annual model.",
      "Read positive revenue lines as income. Cost lines are shown as negative values in the total section because they reduce profit.",
      "Use Assumptions to change the mechanics behind the P&L. This screen intentionally does not allow direct overwriting of outputs.",
      "Use the P&L export buttons for PDF, Word, CSV, JSON, Google Docs import, and Google Sheets import files after the P&L has been reviewed.",
    ],
    checks: [
      "A dash means the value is effectively zero after rounding.",
      "If a line is missing, check Settings to see whether the line was removed or whether cards targeting it were parked.",
      "If monthly values look too smooth, remember the static MVP spreads annual card values evenly across months unless the formula card itself changes the annual profile.",
    ],
  },
  {
    view: "assumptions",
    title: "Assumptions",
    summary: "Assumptions are stored as formula cards. Each card contains source text, target line, target years, method, params, dependencies, enabled state, and validation status.",
    useWhen: [
      "You need to add, change, disable, or inspect the assumptions that drive the model.",
      "You need traceability from plain-English source text to the calculated P&L impact.",
      "You need to see which assumptions require rewrite or review.",
    ],
    actions: [
      "Click New Formula Card to create a new card. Start with source text that a finance reviewer can understand without opening the editor.",
      "Choose the method carefully. Flat values use explicit annual values. Single value + growth compounds from a base year. % of driver multiplies a named driver by a rate. Per unit multiplies a driver by a unit rate. Fixed per year applies the same amount every covered year.",
      "Use target years to apply an assumption to all years, one year, a range, or a discontinuous set of years.",
      "Use the impact strip to check whether the signed contribution looks sensible before moving to the P&L.",
      "Export Cards CSV when you want a reviewable register of source text, method, params, target, status, and validation hint.",
    ],
    checks: [
      "needs_rewrite means the card cannot safely translate into a supported method, target, or driver.",
      "needs_review means the card calculates, but it breaches a configured reasonability bound.",
      "Disabled cards remain in the register for audit and scenario traceability but do not contribute to the P&L.",
    ],
  },
  {
    view: "drivers",
    title: "Drivers",
    summary: "Drivers are named independent input series used by driver-linked formula cards. They keep common business quantities in one place.",
    useWhen: [
      "You want one assumption such as programme size, guarantee volume, project count, or man-days to feed multiple formula cards.",
      "You need to change a volume, count, or other operational input without editing every formula card.",
      "You want the model to show the same driver values across years before those values feed revenue or cost logic.",
    ],
    actions: [
      "Edit the driver name to make it reviewer-friendly, but keep the key stable because formula cards reference the key.",
      "Set the unit so users know whether the driver is RM'000, count, days, or another basis.",
      "Set the base value for the first projection year. Set growth percentage to roll that value forward annually.",
      "Add a driver before creating formula cards that should use % of driver or per unit methods.",
    ],
    checks: [
      "If a card shows Missing driver, restore or recreate the referenced driver key.",
      "Large driver changes can move many formula cards at once. Save a scenario first if you want a clean before-and-after comparison.",
      "Drivers are model inputs, not outputs. If you need a split by another calculated line, use Unit Econ Assumptions instead.",
    ],
  },
  {
    view: "unitEconomics",
    title: "Unit Economics",
    summary: "Unit Economics allocates the P&L across business segments while reconciling back to the main P&L total.",
    useWhen: [
      "You need to see which segment carries revenue, cost, or profit for a selected year.",
      "You need mini P&Ls for segments such as Digital Banks, NBFI, and Ecosystem.",
      "You want confidence that segment totals reconcile to the main P&L.",
    ],
    actions: [
      "Choose the year in the Allocation matrix. The selected year controls the matrix and all mini P&Ls below it.",
      "Read each P&L line across the segments, then compare the Total column to the main P&L line value.",
      "Use the mini P&L cards for segment-level conversation. They are summaries, not separate models.",
      "Change allocation methods in Unit Econ Assumptions, not directly on this output screen.",
    ],
    checks: [
      "The Reconciles to P&L badge means the allocation matrix is normalizing back to the main P&L.",
      "If a split method is flagged, the matrix may still reconcile by normalization, but the assumption should be reviewed.",
      "A negative segment total indicates the segment carries more cost than revenue for that selected year.",
    ],
  },
  {
    view: "unitAssumptions",
    title: "Unit Econ Assumptions",
    summary: "Unit Econ Assumptions define how each P&L line is split across segments. The output appears in Unit Economics.",
    useWhen: [
      "You need to add, rename, or remove segment buckets.",
      "You need to choose whether a line splits evenly, by ratio, by percentages, by per-segment quantity, or by another line's split.",
      "You need to resolve split warnings before relying on segment-level outputs.",
    ],
    actions: [
      "Add segments up to the SDD limit of 8. Keep segment names short enough for tables and exports.",
      "Use ratio when values are relative weights. Use percentages when values are intended to sum to 100%. Use per-segment quantity when the numbers represent quantity or activity basis.",
      "Use by another line split when a cost should follow the same allocation as a revenue or activity line.",
      "Review the Status column. Percentage splits that do not sum to 100% are normalized, but flagged for review.",
    ],
    checks: [
      "By-line cycles are blocked. If line A follows line B and line B follows line A, the app falls back to an even split and flags the issue.",
      "Removing a segment removes its split values across all lines.",
      "Changing split logic affects Unit Economics only; it does not change the main P&L total.",
    ],
  },
  {
    view: "scenarios",
    title: "Scenarios",
    summary: "Scenarios let you preserve model states, restore saved states, lock a case for review, and export outputs.",
    useWhen: [
      "You want to save the current combination of settings, drivers, cards, P&L lines, and Unit Economics splits.",
      "You need to duplicate a case before trying a new assumption set.",
      "You need to export the current model for review or distribution.",
    ],
    actions: [
      "Click Save Scenario before making changes that you may want to reverse later.",
      "Use Duplicate to create a copy name and keep the saved state available for comparison.",
      "Use Lock when a scenario is under review. Locking disables editable controls while keeping outputs and exports accessible.",
      "Use PDF / Print, Word, CSV, JSON, Google Docs import, or Google Sheets import for report-pack outputs. Use Cards CSV for assumption review and Audit CSV for activity review.",
    ],
    checks: [
      "Scenario restores overwrite the current working state. Save first if the current state matters.",
      "Exports are logged in the audit trail.",
      "Static GitHub Pages stores scenarios in each user's browser storage, so a saved scenario is local to that browser profile.",
    ],
  },
  {
    view: "audit",
    title: "Audit Trail",
    summary: "The Audit Trail records meaningful model actions in plain English so reviewers can understand what changed and when.",
    useWhen: [
      "You need to review recent model activity.",
      "You want evidence that exports, scenario saves, undo, redo, and model edits were recorded.",
      "You need a CSV trail to attach to a review pack.",
    ],
    actions: [
      "Read the latest entries at the top. Each entry includes an ID, timestamp, event, and user label.",
      "Use Audit CSV from Scenarios to export the log.",
      "Use undo and redo for meaningful state changes. Undo and redo actions themselves are logged.",
    ],
    checks: [
      "The audit trail is append-oriented for transparency, but it is still stored in browser storage in this static MVP.",
      "If the browser storage is cleared, local scenarios and audit entries are cleared too.",
      "For shared governance, the future backend should persist audit records server-side.",
    ],
  },
  {
    view: "settings",
    title: "Settings",
    summary: "Settings control projection length, granularity, currency display, translator mode, reasonability bounds, and the P&L line structure.",
    useWhen: [
      "You need to switch between annual and monthly projection.",
      "You need to change the start year, number of years, month start, units, or reasonability thresholds.",
      "You need to add, rename, reorder, or remove P&L lines.",
    ],
    actions: [
      "Set Annual years from 1 to 10. Set Monthly years from 1 to 3. Monthly uses 12 periods per year.",
      "Keep translator backend on local for GitHub Pages. Live API is a placeholder for a future hosted backend.",
      "Use Global annual bound and Max cost / revenue to tune validation sensitivity.",
      "Add P&L lines when the business model needs a new output line. Rename lines for presentation. Reorder lines to improve readability.",
      "Remove a line only when you understand the guardrail. Cards targeting that line are parked and disabled so they do not silently calculate into the wrong place.",
    ],
    checks: [
      "Changing granularity affects how the P&L is displayed, but annual formula cards remain the source of truth.",
      "Locked scenarios disable settings edits except for view-only selectors such as Unit Economics year.",
      "Changing a line type between revenue and cost changes the sign treatment in totals and impact strips.",
    ],
  },
];

const QUICK_START_STEPS = [
  {
    view: "dashboard",
    title: "1. Start with the Dashboard",
    goal: "Confirm the scenario is loaded, the model status is OK, and the key financial result looks plausible.",
    actions: ["Read the status badge.", "Check revenue and profit or loss for the final projected year.", "Open User Guide from the top bar if any dashboard flag needs explanation."],
    exit: "Continue when the status is OK or when you know which screen owns the issue.",
  },
  {
    view: "settings",
    title: "2. Set the model frame",
    goal: "Choose the projection horizon, granularity, units, and P&L line structure before editing assumptions.",
    actions: ["Choose annual or monthly in Settings or directly on the P&L screen.", "Set start year and year count.", "Confirm P&L lines match the review pack you intend to produce."],
    exit: "Continue when the P&L structure has the right rows and period length.",
  },
  {
    view: "drivers",
    title: "3. Update shared drivers",
    goal: "Put common business inputs in one place so formula cards can reference them cleanly.",
    actions: ["Review driver names and units.", "Update base values and growth percentages.", "Add missing drivers before creating dependent formula cards."],
    exit: "Continue when driver series show the expected yearly values.",
  },
  {
    view: "assumptions",
    title: "4. Build formula cards",
    goal: "Translate each business assumption into a traceable card with method, params, target line, and target years.",
    actions: ["Create or edit formula cards.", "Use the local translator only as a helper, then review the emitted method and params.", "Resolve needs_rewrite before using outputs."],
    exit: "Continue when every active card is OK or intentionally marked for review.",
  },
  {
    view: "pl",
    title: "5. Review the P&L",
    goal: "Confirm the calculated model output before segment allocation or exports.",
    actions: ["Scan total revenue, total costs, and profit or loss.", "Compare annual and monthly views if needed.", "Return to assumptions for any line that looks wrong."],
    exit: "Continue when the P&L tells the story you expect.",
  },
  {
    view: "unitAssumptions",
    title: "6. Configure segment splits",
    goal: "Define how P&L lines allocate across Unit Economics segments.",
    actions: ["Confirm segment names.", "Choose split methods by line.", "Fix percentage totals or by-line cycle warnings."],
    exit: "Continue when split statuses are OK or reviewed.",
  },
  {
    view: "unitEconomics",
    title: "7. Read Unit Economics",
    goal: "Use the segment matrix and mini P&Ls to explain where economics land by segment.",
    actions: ["Pick the review year.", "Check each segment contribution.", "Confirm the matrix reconciles to the main P&L."],
    exit: "Continue when the segment outputs are ready for conversation.",
  },
  {
    view: "scenarios",
    title: "8. Save, lock, and export",
    goal: "Preserve the case and produce review files.",
    actions: ["Save the scenario.", "Lock it if it is ready for review.", "Export PDF, Word, CSV, JSON, Google Docs import, or Google Sheets import files as needed."],
    exit: "Continue when the scenario is saved and the required files are exported.",
  },
  {
    view: "audit",
    title: "9. Check the audit trail",
    goal: "Confirm the app recorded the key changes and exports.",
    actions: ["Review recent events.", "Export Audit CSV if needed.", "Use the trail to support review notes."],
    exit: "Finish when the audit evidence is sufficient for the review pack.",
  },
];

function line(key, name, type) {
  return { key, name, type, active: true, bound: type === "cost" ? 60000 : 80000 };
}

function driver(key, name, unit, baseValue, growthRate, source) {
  return { key, name, unit, baseValue, growthRate, source };
}

function card(id, category, sourceText, lineKey, method, params, extra = {}) {
  return {
    id,
    category,
    source_text: sourceText,
    enabled: extra.enabled !== false,
    target: { line: lineKey, years: extra.years || "all" },
    method,
    params,
    depends_on: [],
    status: "ok",
    hint: "",
    created_at: extra.created_at || "2026-06-27",
    updated_at: extra.updated_at || "2026-06-27",
  };
}

let state = loadState();
let currentView = "dashboard";
let lastContextView = "dashboard";
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
  driversContent: document.querySelector("#driversContent"),
  unitEconomicsContent: document.querySelector("#unitEconomicsContent"),
  unitAssumptionsContent: document.querySelector("#unitAssumptionsContent"),
  scenariosContent: document.querySelector("#scenariosContent"),
  auditContent: document.querySelector("#auditContent"),
  settingsContent: document.querySelector("#settingsContent"),
  guideContent: document.querySelector("#guideContent"),
  quickStartContent: document.querySelector("#quickStartContent"),
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

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return migrateState(JSON.parse(saved));
  } catch {}

  const initial = {
    settings: clone(DEFAULT_SETTINGS),
    lines: clone(DEFAULT_LINES),
    drivers: clone(DEFAULT_DRIVERS),
    cards: clone(DEFAULT_CARDS),
    unitEconomics: {
      segments: clone(DEFAULT_SEGMENTS),
      splits: defaultSplits(DEFAULT_LINES),
    },
    scenarios: [],
    audit: initialAudit(),
  };
  initial.scenarios.push({
    id: "SCN-BASE",
    name: initial.settings.scenarioName,
    savedAt: "2026-06-27 16:30",
    snapshot: snapshotFrom(initial),
    note: "Seed SDD v2 scenario.",
  });
  return initial;
}

function migrateState(saved) {
  if (saved.settings && saved.cards && saved.lines) return normalizeState(saved);
  return loadFreshState();
}

function loadFreshState() {
  return normalizeState({
    settings: clone(DEFAULT_SETTINGS),
    lines: clone(DEFAULT_LINES),
    drivers: clone(DEFAULT_DRIVERS),
    cards: clone(DEFAULT_CARDS),
    unitEconomics: { segments: clone(DEFAULT_SEGMENTS), splits: defaultSplits(DEFAULT_LINES) },
    scenarios: [],
    audit: initialAudit(),
  });
}

function normalizeState(source) {
  const out = {
    settings: { ...clone(DEFAULT_SETTINGS), ...(source.settings || {}) },
    lines: clone(source.lines || DEFAULT_LINES),
    drivers: clone(source.drivers || DEFAULT_DRIVERS),
    cards: clone(source.cards || DEFAULT_CARDS),
    unitEconomics: clone(source.unitEconomics || { segments: DEFAULT_SEGMENTS, splits: defaultSplits(source.lines || DEFAULT_LINES) }),
    scenarios: clone(source.scenarios || []),
    audit: clone(source.audit || initialAudit()),
  };
  out.settings.granularity = out.settings.granularity === "monthly" ? "monthly" : "annual";
  out.settings.yearCount = clampInteger(out.settings.yearCount, 1, MAX_ANNUAL_YEARS, DEFAULT_SETTINGS.yearCount);
  out.settings.monthlyYearCount = clampInteger(out.settings.monthlyYearCount, 1, MAX_MONTHLY_YEARS, DEFAULT_SETTINGS.monthlyYearCount);
  out.settings.startMonth = clampInteger(out.settings.startMonth, 1, 12, DEFAULT_SETTINGS.startMonth);
  out.settings.startYear = clampInteger(out.settings.startYear, 1900, 2200, DEFAULT_SETTINGS.startYear);
  if (!out.unitEconomics.segments?.length) out.unitEconomics.segments = clone(DEFAULT_SEGMENTS);
  if (!out.unitEconomics.splits) out.unitEconomics.splits = defaultSplits(out.lines);
  for (const lineItem of out.lines) {
    if (!out.unitEconomics.splits[lineItem.key]) out.unitEconomics.splits[lineItem.key] = { method: "even", values: {}, byLine: "" };
  }
  return out;
}

function defaultSplits(lines) {
  const out = {};
  for (const item of lines) {
    out[item.key] = { method: item.type === "revenue" ? "ratio" : "by_line", values: { digital_banks: 2, nbfi: 5, ecosystem: 3 }, byLine: "digital_guarantee" };
    if (item.key === "digital_guarantee") out[item.key] = { method: "ratio", values: { digital_banks: 1, nbfi: 6, ecosystem: 3 }, byLine: "" };
    if (item.key === "operating_expenses") out[item.key] = { method: "per_segment_quantity", values: { digital_banks: 12, nbfi: 18, ecosystem: 10 }, byLine: "" };
    if (item.key === "expected_credit_loss") out[item.key] = { method: "percentages", values: { digital_banks: 15, nbfi: 75, ecosystem: 10 }, byLine: "" };
  }
  return out;
}

function initialAudit() {
  return [
    auditEntry("Created SDD v2 state", "Model", "-", "Formula cards, drivers, P&L lines, Unit Economics"),
    auditEntry("Loaded local translator", "Translator.translate()", "-", "local deterministic parser"),
  ];
}

function render() {
  const model = calculateModel();
  const validation = validateModel(model);
  const unit = calculateUnitEconomics(model, validation);

  els.scenarioPill.textContent = state.settings.scenarioName;
  els.dashboardTitle.textContent = state.settings.scenarioName;
  renderStatus(validation);
  renderDashboard(model, validation, unit);
  renderPL(model);
  renderAssumptions(model, validation);
  renderDrivers(model);
  renderUnitEconomics(model, validation, unit);
  renderUnitAssumptions(validation);
  renderScenarios(model, validation);
  renderAudit();
  renderSettings(validation);
  renderQuickStart();
  renderGuide();
  updateButtons();
  persist();
}

function renderStatus(validation) {
  const hasRewrite = validation.cards.some((item) => item.status === "needs_rewrite");
  const hasReview = validation.cards.some((item) => item.status === "needs_review") || validation.splits.some((item) => item.status === "needs_review");
  const label = hasRewrite ? "NEEDS REWRITE" : hasReview ? "NEEDS REVIEW" : "OK";
  els.modelStatusBadge.textContent = `MODEL STATUS: ${label}`;
  els.modelStatusBadge.className = `status-badge ${hasRewrite ? "fail" : hasReview ? "warn" : "pass"}`;
}

function renderDashboard(model, validation, unit) {
  const years = getYears();
  const lastYear = years[years.length - 1];
  const activeCards = state.cards.filter((item) => item.enabled).length;
  const rewriteCount = validation.cards.filter((item) => item.status === "needs_rewrite").length;
  const reviewCount = validation.cards.filter((item) => item.status === "needs_review").length + validation.splits.filter((item) => item.status === "needs_review").length;
  const pbt = model.annual.total[lastYear] || 0;
  const revenue = model.annual.revenue[lastYear] || 0;
  const lossTotal = years.reduce((sum, year) => sum + Math.min(0, model.annual.total[year] || 0), 0);
  const breakeven = years.find((year) => (model.annual.total[year] || 0) >= 0) || "-";

  els.dashboardContent.innerHTML = `
    <div class="grid dashboard-grid">
      <div class="grid">
        <div class="kpi-grid">
          ${kpi("Revenue", money(revenue), `${lastYear} ${state.settings.units}`)}
          ${kpi("Profit / (Loss)", money(pbt), `${lastYear} ${state.settings.units}`, pbt >= 0 ? "positive" : "negative")}
          ${kpi("Cumulative losses", money(lossTotal), `${years[0]}-${lastYear}`, lossTotal < 0 ? "negative" : "positive")}
          ${kpi("Breakeven", String(breakeven), "First non-negative year")}
        </div>
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Annual roll-up trend</h3>
            <span class="mini-badge ${reviewCount || rewriteCount ? "warn" : "pass"}">${reviewCount + rewriteCount} flags</span>
          </div>
          <div class="panel-body">
            ${lineChart(years, [
              { label: "Revenue", values: years.map((year) => model.annual.revenue[year] || 0), color: "#0f5ed7" },
              { label: "Profit / (Loss)", values: years.map((year) => model.annual.total[year] || 0), color: "#b3261e" },
            ])}
            <div class="legend">
              <span class="legend-item"><span class="swatch" style="background:#0f5ed7"></span>Revenue</span>
              <span class="legend-item"><span class="swatch" style="background:#b3261e"></span>Profit / (Loss)</span>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">SDD v2 coverage</h3>
            <button class="secondary-button" data-nav="guide" type="button">Open Guide</button>
          </div>
          <div class="panel-body">
            <div class="coverage-grid">
              ${coverage("Formula cards", "Built", "Cards use source_text, target, method, params, depends_on, status.")}
            ${coverage("Granularity", "Built", "Annual up to 10 years; monthly up to 3 years.")}
              ${coverage("Drivers", "Built", "Named independent input series for driver methods.")}
              ${coverage("P&L lines", "Built", "Rename, add, reorder, remove with parking.")}
              ${coverage("Unit Economics", "Built", "Up to 8 segments, split assumptions, matrix and mini-P&Ls.")}
              ${coverage("Live AI backend", "Stub", "Translator seam exists; static hosting has no /api/translate endpoint.")}
            </div>
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Control summary</h3>
            <span class="mini-badge ${state.settings.locked ? "warn" : "pass"}">${state.settings.locked ? "Locked" : "Editable"}</span>
          </div>
          <div class="panel-body">
            <table>
              <tbody>
                <tr><td>Granularity</td><td>${escapeHTML(state.settings.granularity)}</td></tr>
                <tr><td>Projection</td><td>${state.settings.granularity === "monthly" ? `${state.settings.monthlyYearCount} years x 12 months` : `${state.settings.yearCount} annual years`}</td></tr>
                <tr><td>Translator</td><td>${escapeHTML(state.settings.translatorBackend)}</td></tr>
                <tr><td>Cards</td><td>${activeCards} active / ${state.cards.length} total</td></tr>
                <tr><td>Segments</td><td>${state.unitEconomics.segments.length}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Unit Economics reconciliation</h3>
          </div>
          <div class="panel-body">
            <div class="notice">
              Matrix total for ${selectedUnitYear()}: ${money(unit.totalByYear[selectedUnitYear()] || 0)}. Main P&L total: ${money(model.annual.total[selectedUnitYear()] || 0)}.
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">Quick actions</h3>
          </div>
          <div class="panel-body">
            <div class="button-row">
              <button class="primary-button" data-open-new-card type="button">New Formula Card</button>
              <button class="secondary-button" data-nav="drivers" type="button">Edit Drivers</button>
              ${exportButtonsHTML("pack")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPL(model) {
  const periods = getDisplayPeriods();
  els.plContent.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3 class="panel-title">Profit & Loss statement</h3>
        <div class="inline-actions">
          ${projectionControlsHTML()}
          <span class="mini-badge">${state.settings.granularity} / ${state.settings.units}</span>
        </div>
      </div>
      <div class="panel-body">
        <div class="button-row export-actions">${exportButtonsHTML("pl")}</div>
        ${plTable(model, periods)}
      </div>
    </div>
  `;
}

function renderAssumptions(model, validation) {
  const years = getYears();
  const rows = state.cards.map((item) => {
    const v = validation.cards.find((entry) => entry.id === item.id) || { status: "ok", className: "pass", hint: "" };
    const annual = model.cardAnnual[item.id] || blankYearSeries(years);
    const signed = signedAnnualForCard(item, annual);
    return `
      <tr data-card="${item.id}">
        <td><button class="ghost-button" data-edit-card="${item.id}" type="button">${escapeHTML(item.id)}</button></td>
        <td><label class="toggle"><input data-toggle-card="${item.id}" type="checkbox" ${item.enabled ? "checked" : ""} ${state.settings.locked ? "disabled" : ""}> ${item.enabled ? "On" : "Off"}</label></td>
        <td>${escapeHTML(item.category)}</td>
        <td><strong>${escapeHTML(sourceTitle(item.source_text))}</strong><br><span class="muted">${escapeHTML(item.source_text)}</span></td>
        <td>${escapeHTML(lineName(item.target.line))}<br><span class="muted">${targetYearsLabel(item.target.years)}</span></td>
        <td>${escapeHTML(METHOD_LABELS[item.method] || item.method)}<br><span class="muted">${escapeHTML(operationText(item))}</span></td>
        <td>${operandStrip(years, item, model)}</td>
        <td><span class="mini-badge ${v.className}">${escapeHTML(v.status)}</span><br><span class="muted">${escapeHTML(v.hint || "")}</span></td>
        <td>${impactStrip(years, signed)}</td>
      </tr>
    `;
  }).join("");

  els.assumptionsContent.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3 class="panel-title">Formula card register</h3>
        <div class="inline-actions">
          <button class="primary-button" data-open-new-card type="button">New Formula Card</button>
          <button class="secondary-button" data-export="cardsCsv" type="button">Cards CSV</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Enabled</th><th>Category</th><th>Source text</th><th>Target</th><th>Operation</th><th>Mathematical operand</th><th>Status</th><th>Per-period impact</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderDrivers(model) {
  const years = getYears();
  const rows = state.drivers.map((item) => {
    const series = model.drivers[item.key] || blankYearSeries(years);
    return `
      <tr>
        <td>${escapeHTML(item.key)}</td>
        <td><input class="grid-input" data-driver-field="${item.key}:name" value="${escapeAttr(item.name)}" ${state.settings.locked ? "disabled" : ""}></td>
        <td><input class="grid-input" data-driver-field="${item.key}:unit" value="${escapeAttr(item.unit)}" ${state.settings.locked ? "disabled" : ""}></td>
        <td><input class="grid-input number-input" type="number" step="any" data-driver-field="${item.key}:baseValue" value="${item.baseValue}" ${state.settings.locked ? "disabled" : ""}></td>
        <td><input class="grid-input number-input" type="number" step="any" data-driver-field="${item.key}:growthRatePercent" value="${round(item.growthRate * 100, 2)}" ${state.settings.locked ? "disabled" : ""}></td>
        ${years.map((year) => `<td class="number linked-cell">${money(series[year])}</td>`).join("")}
      </tr>
    `;
  }).join("");
  els.driversContent.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3 class="panel-title">Named driver series</h3>
        <button class="primary-button" data-add-driver type="button">Add Driver</button>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Key</th><th>Name</th><th>Unit</th><th class="number">Base</th><th class="number">Growth %</th>${years.map((year) => `<th class="number">${year}</th>`).join("")}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderUnitEconomics(model, validation, unit) {
  const year = selectedUnitYear();
  const segments = state.unitEconomics.segments;
  const lineRows = state.lines.map((lineItem) => {
    const lineTotal = model.annual.lines[lineItem.key]?.[year] || 0;
    return `
      <tr>
        <td class="sticky-col">${escapeHTML(lineItem.name)}</td>
        ${segments.map((segment) => `<td class="number">${money(unit.lineSegment[lineItem.key]?.[segment.key]?.[year] || 0)}</td>`).join("")}
        <td class="number total-cell">${money(lineTotal)}</td>
      </tr>
    `;
  }).join("");
  const segmentCards = segments.map((segment) => miniPL(segment, unit, year)).join("");
  els.unitEconomicsContent.innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Allocation matrix</h3>
          <div class="inline-actions">
            <label class="form-field inline-field"><span>Year</span><select class="settings-input" data-setting="unitYear">${getYears().map((item) => `<option value="${item}" ${item === year ? "selected" : ""}>${item}</option>`).join("")}</select></label>
            <span class="mini-badge ${validation.splits.some((item) => item.status === "needs_review") ? "warn" : "pass"}">Reconciles to P&L</span>
          </div>
        </div>
        <div class="panel-body">
          <div class="button-row export-actions">${exportButtonsHTML("unit")}</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th class="sticky-col">P&L line</th>${segments.map((segment) => `<th class="number">${escapeHTML(segment.name)}</th>`).join("")}<th class="number">Total</th></tr></thead>
              <tbody>${lineRows}<tr class="total-row"><td class="sticky-col">Profit / (Loss)</td>${segments.map((segment) => `<td class="number">${money(unit.segmentTotal[segment.key]?.[year] || 0)}</td>`).join("")}<td class="number">${money(unit.totalByYear[year] || 0)}</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="mini-pl-grid">${segmentCards}</div>
    </div>
  `;
}

function renderUnitAssumptions(validation) {
  const segments = state.unitEconomics.segments;
  const lockedAttr = state.settings.locked ? "disabled" : "";
  const segmentRows = segments.map((segment) => `
    <tr>
      <td>${escapeHTML(segment.key)}</td>
      <td><input class="grid-input" data-segment-name="${segment.key}" value="${escapeAttr(segment.name)}" ${state.settings.locked ? "disabled" : ""}></td>
      <td><button class="danger-button" data-remove-segment="${segment.key}" type="button" ${state.settings.locked ? "disabled" : ""}>Remove</button></td>
    </tr>
  `).join("");
  const splitRows = state.lines.map((lineItem) => {
    const split = splitFor(lineItem.key);
    const splitFlag = validation.splits.find((item) => item.lineKey === lineItem.key);
    return `
      <tr>
        <td>${escapeHTML(lineItem.name)}</td>
        <td>${selectHTML(`data-split-method="${lineItem.key}" ${lockedAttr}`, split.method, ["even", "ratio", "percentages", "per_segment_quantity", "by_line"], splitMethodLabel)}</td>
        ${segments.map((segment) => `<td><input class="grid-input number-input" type="number" step="any" data-split-value="${lineItem.key}:${segment.key}" value="${split.values?.[segment.key] ?? ""}" ${split.method === "by_line" || state.settings.locked ? "disabled" : ""}></td>`).join("")}
        <td>${selectHTML(`data-split-byline="${lineItem.key}" ${state.settings.locked || split.method !== "by_line" ? "disabled" : ""}`, split.byLine || "", ["", ...state.lines.map((item) => item.key)], (key) => key ? lineName(key) : "None")}</td>
        <td><span class="mini-badge ${splitFlag?.className || "pass"}">${escapeHTML(splitFlag?.status || "ok")}</span><br><span class="muted">${escapeHTML(splitFlag?.hint || "")}</span></td>
      </tr>
    `;
  }).join("");
  els.unitAssumptionsContent.innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Segments</h3>
          <button class="primary-button" data-add-segment type="button" ${segments.length >= 8 ? "disabled" : ""}>Add Segment</button>
        </div>
        <div class="panel-body">
          <div class="table-wrap"><table><thead><tr><th>Key</th><th>Name</th><th>Action</th></tr></thead><tbody>${segmentRows}</tbody></table></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3 class="panel-title">Per-line allocation splits</h3></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>P&L line</th><th>Method</th>${segments.map((segment) => `<th>${escapeHTML(segment.name)}</th>`).join("")}<th>By line</th><th>Status</th></tr></thead>
              <tbody>${splitRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderScenarios(model, validation) {
  const scenarioRows = state.scenarios.map((item) => `
    <tr>
      <td><strong>${escapeHTML(item.name)}</strong><br><span class="muted">${escapeHTML(item.id)}</span></td>
      <td>${escapeHTML(item.savedAt)}</td>
      <td>${escapeHTML(item.note || "-")}</td>
      <td><button class="secondary-button" data-restore-scenario="${item.id}" type="button">Restore</button></td>
    </tr>
  `).join("");
  els.scenariosContent.innerHTML = `
    <div class="grid two-col">
      <div class="panel">
        <div class="panel-header"><h3 class="panel-title">Saved scenarios</h3><span class="mini-badge">${state.scenarios.length} saved</span></div>
        <div class="panel-body"><div class="table-wrap"><table><thead><tr><th>Scenario</th><th>Saved</th><th>Notes</th><th>Action</th></tr></thead><tbody>${scenarioRows}</tbody></table></div></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3 class="panel-title">P&L + Unit Economics report pack</h3><span class="mini-badge">Logged actions</span></div>
        <div class="panel-body">
          <div class="button-row export-actions">${exportButtonsHTML("pack")}</div>
          <div class="button-row">
            <button class="secondary-button" data-export="cardsCsv" type="button">Assumptions CSV</button>
            <button class="secondary-button" data-export="auditCsv" type="button">Audit CSV</button>
          </div>
          <p class="muted">The report pack includes the current P&L breakout, Unit Economics matrix, explicit formula-card assumptions, Unit Economics split assumptions, and implicit engine assumptions. Google Docs and Google Sheets exports are import-ready files for static GitHub Pages deployment.</p>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3 class="panel-title">Working data backup / restore</h3><span class="mini-badge">Full model state</span></div>
        <div class="panel-body">
          <div class="button-row">
            <button class="secondary-button" data-export="workspaceJson" type="button">Export JSON</button>
            <button class="secondary-button" data-import="workspaceJson" type="button">Import JSON</button>
            <button class="secondary-button" data-export="workspaceCsv" type="button">Export CSV</button>
            <button class="secondary-button" data-import="workspaceCsv" type="button">Import CSV</button>
          </div>
          <p class="muted">Backup files include settings, P&L lines, drivers, formula cards, Unit Economics, saved scenarios, and audit trail. Import replaces the current working data in this browser.</p>
        </div>
      </div>
    </div>
  `;
  document.querySelector("#lockScenarioButton").textContent = state.settings.locked ? "Unlock" : "Lock";
}

function renderAudit() {
  const rows = state.audit.slice().reverse().map((entry) => `
    <tr><td>${escapeHTML(entry.id)}</td><td>${escapeHTML(entry.timestamp)}</td><td>${escapeHTML(entry.text)}</td><td>${escapeHTML(entry.user)}</td></tr>
  `).join("");
  els.auditContent.innerHTML = `
    <div class="panel">
      <div class="panel-header"><h3 class="panel-title">Plain-English audit trail</h3><span class="mini-badge">${state.audit.length} events</span></div>
      <div class="panel-body"><div class="table-wrap"><table><thead><tr><th>ID</th><th>Timestamp</th><th>Event</th><th>User</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    </div>
  `;
}

function renderSettings(validation) {
  const lineRows = state.lines.map((item, index) => {
    const used = state.cards.some((cardItem) => cardItem.target.line === item.key) || Boolean(state.unitEconomics.splits[item.key]);
    return `
      <tr>
        <td>${escapeHTML(item.key)}</td>
        <td><input class="grid-input" data-line-name="${item.key}" value="${escapeAttr(item.name)}" ${state.settings.locked ? "disabled" : ""}></td>
        <td>${selectHTML(`data-line-type="${item.key}" ${state.settings.locked ? "disabled" : ""}`, item.type, ["revenue", "cost"], (x) => x)}</td>
        <td><input class="grid-input number-input" type="number" step="any" data-line-bound="${item.key}" value="${item.bound}" ${state.settings.locked ? "disabled" : ""}></td>
        <td>
          <button class="ghost-button" data-move-line="${item.key}:up" type="button" ${index === 0 || state.settings.locked ? "disabled" : ""}>Up</button>
          <button class="ghost-button" data-move-line="${item.key}:down" type="button" ${index === state.lines.length - 1 || state.settings.locked ? "disabled" : ""}>Down</button>
          <button class="danger-button" data-remove-line="${item.key}" type="button" ${state.settings.locked ? "disabled" : ""}>Remove</button>
        </td>
        <td>${used ? "Guarded" : "Clear"}</td>
      </tr>
    `;
  }).join("");
  els.settingsContent.innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-header"><h3 class="panel-title">Projection settings</h3><span class="mini-badge">${state.settings.locked ? "Locked" : "Editable"}</span></div>
        <div class="panel-body">
          <div class="control-grid">
            ${settingField("Scenario", "scenarioName", "text", state.settings.scenarioName)}
            ${settingField("Start year", "startYear", "number", state.settings.startYear)}
            ${settingField(`Annual years (max ${MAX_ANNUAL_YEARS})`, "yearCount", "number", state.settings.yearCount, { min: 1, max: MAX_ANNUAL_YEARS })}
            ${settingField(`Monthly years (max ${MAX_MONTHLY_YEARS})`, "monthlyYearCount", "number", state.settings.monthlyYearCount, { min: 1, max: MAX_MONTHLY_YEARS })}
            ${settingSelect("Granularity", "granularity", state.settings.granularity, ["annual", "monthly"])}
            ${settingSelect("Start month", "startMonth", String(state.settings.startMonth), MONTHS.map((_, index) => String(index + 1)), (x) => MONTHS[Number(x) - 1])}
            ${settingField("Currency", "currency", "text", state.settings.currency)}
            ${settingField("Units", "units", "text", state.settings.units)}
            ${settingSelect("Translator backend", "translatorBackend", state.settings.translatorBackend, ["local", "live_api"])}
            ${settingField("Global annual bound", "maxAnnualFigure", "number", state.settings.maxAnnualFigure)}
            ${settingField("Max cost / revenue", "maxCostRatio", "number", state.settings.maxCostRatio)}
            <label class="toggle input-like"><input class="settings-input" data-setting="includeAuditTrail" type="checkbox" ${state.settings.includeAuditTrail ? "checked" : ""} ${state.settings.locked ? "disabled" : ""}> Include audit trail</label>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3 class="panel-title">P&L lines</h3><button class="primary-button" data-add-line type="button" ${state.settings.locked ? "disabled" : ""}>Add Line</button></div>
        <div class="panel-body">
          <div class="table-wrap"><table><thead><tr><th>Key</th><th>Name</th><th>Type</th><th class="number">Annual bound</th><th>Order / remove</th><th>Guard</th></tr></thead><tbody>${lineRows}</tbody></table></div>
          <p class="muted">Removing a used line parks cards that target it, matching the SDD guardrail.</p>
        </div>
      </div>
    </div>
  `;
}

function renderQuickStart() {
  els.quickStartContent.innerHTML = `
    <div class="help-layout">
      <aside class="help-index panel">
        <div class="panel-header"><h3 class="panel-title">Quick Start sections</h3></div>
        <div class="panel-body">
          <div class="help-nav-list">
            ${QUICK_START_STEPS.map((item) => `<button class="ghost-button help-nav-link" data-help-jump="quickStart:${item.view}" type="button">${escapeHTML(item.title)}</button>`).join("")}
          </div>
        </div>
      </aside>
      <div class="help-document">
        <div class="panel help-intro">
          <div class="panel-header">
            <h3 class="panel-title">Quick Start Guide</h3>
            <span class="mini-badge">${escapeHTML(VIEW_LABELS[activeContextView()] || "Dashboard")} context</span>
          </div>
          <div class="panel-body">
            <p>This guide is the shortest path from a blank review session to a saved and exportable financial model. Use the top bar Quick Start button from any screen to jump straight to the step that matches where you are working.</p>
            <div class="button-row">
              <button class="secondary-button" data-help="guide" type="button">Open Full User Guide</button>
              <button class="primary-button" data-print-guide="quickStart" type="button">Download PDF</button>
            </div>
          </div>
        </div>
        <div class="quick-step-grid">
          ${QUICK_START_STEPS.map(quickStepHTML).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderGuide() {
  els.guideContent.innerHTML = `
    <div class="help-layout">
      <aside class="help-index panel">
        <div class="panel-header"><h3 class="panel-title">Guide index</h3></div>
        <div class="panel-body">
          <div class="help-nav-list">
            ${GUIDE_SECTIONS.map((item) => `<button class="ghost-button help-nav-link" data-help-jump="guide:${item.view}" type="button">${escapeHTML(item.title)}</button>`).join("")}
          </div>
        </div>
      </aside>
      <div class="help-document">
        <div class="panel help-intro">
          <div class="panel-header">
            <h3 class="panel-title">User Guide</h3>
            <span class="mini-badge">${escapeHTML(VIEW_LABELS[activeContextView()] || "Dashboard")} context</span>
          </div>
          <div class="panel-body">
            <p>This guide explains every working screen in the SDD v2 model. Use the top bar User Guide button from any screen to land directly on the relevant section, then use the index to move across the rest of the documentation.</p>
            <div class="button-row">
              <button class="secondary-button" data-help="quickStart" type="button">Open Quick Start</button>
              <button class="primary-button" data-print-guide="guide" type="button">Download PDF</button>
            </div>
          </div>
        </div>
        ${GUIDE_SECTIONS.map(guideSectionHTML).join("")}
        <div class="panel help-section" id="guide-sources">
          <div class="panel-header"><h3 class="panel-title">Sources and implementation notes</h3></div>
          <div class="panel-body">
            <div class="source-list">
              ${SOURCE_LOG.map((item) => `<div class="source-item"><h3>${escapeHTML(item.item)}</h3><p><strong>${escapeHTML(item.source)}</strong></p><p>${escapeHTML(item.note)}</p></div>`).join("")}
            </div>
            <table class="guide-note-table">
              <tbody>
                <tr><td>AI arithmetic</td><td>Not allowed. Translator only emits formula cards; the deterministic engine calculates.</td></tr>
                <tr><td>Live AI backend</td><td>Interface and setting exist. Static GitHub Pages cannot host /api/translate.</td></tr>
                <tr><td>Cross-referencing</td><td>depends_on exists as a field; complex cross-card dependency solving remains future scope.</td></tr>
                <tr><td>Data storage</td><td>Browser local storage for this zero-cost single-user MVP.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function calculateModel() {
  const years = getYears();
  const periods = getPeriods();
  const drivers = {};
  for (const item of state.drivers) drivers[item.key] = driverSeries(item, years);

  const cardAnnual = {};
  const annualLines = {};
  const periodLines = {};
  for (const item of state.lines) {
    annualLines[item.key] = blankYearSeries(years);
    periodLines[item.key] = blankPeriodSeries(periods);
  }

  for (const item of state.cards) {
    const annual = cardAnnualValues(item, years, drivers);
    cardAnnual[item.id] = annual;
    if (!item.enabled || !lineByKey(item.target.line)) continue;
    for (const year of years) {
      annualLines[item.target.line][year] += annual[year] || 0;
    }
  }

  for (const lineItem of state.lines) {
    for (const period of periods) {
      const amount = annualLines[lineItem.key]?.[period.year] || 0;
      periodLines[lineItem.key][period.key] = state.settings.granularity === "monthly" ? amount / 12 : amount;
    }
  }

  const annual = aggregateAnnual(annualLines, years);
  const period = aggregatePeriods(periodLines, periods);
  return { years, periods, drivers, cardAnnual, annual: { lines: signedLineMap(annualLines), rawLines: annualLines, ...annual }, period: { lines: signedPeriodLineMap(periodLines), rawLines: periodLines, ...period } };
}

function cardAnnualValues(item, years, drivers) {
  const out = blankYearSeries(years);
  if (!item.enabled) return out;
  for (const year of years) {
    if (!targetCoversYear(item.target.years, year)) continue;
    if (item.method === "flat_values") {
      out[year] = Number(item.params.values?.[year] || 0);
    } else if (item.method === "single_value_growth") {
      const baseYear = Number(item.params.baseYear || years[0]);
      if (year < baseYear) out[year] = 0;
      else out[year] = Number(item.params.startValue || 0) * Math.pow(1 + Number(item.params.growthRate || 0), year - baseYear);
    } else if (item.method === "percent_of_driver") {
      out[year] = (drivers[item.params.driver]?.[year] || 0) * Number(item.params.rate || 0);
    } else if (item.method === "per_unit") {
      out[year] = (drivers[item.params.driver]?.[year] || 0) * Number(item.params.unitRate || 0);
    } else if (item.method === "fixed_per_year") {
      out[year] = Number(item.params.amount || 0);
    }
  }
  return out;
}

function validateModel(model) {
  const years = getYears();
  const cards = state.cards.map((item) => validateCard(item, years, model));
  const splits = state.lines.map((item) => validateSplit(item.key));
  const checks = [
    check("Formula card translation", cards.filter((item) => item.status === "needs_rewrite").length, "Assumptions", "Cards must translate into a valid method and params."),
    check("Reasonability review", cards.filter((item) => item.status === "needs_review").length, "Assumptions", "Cards breach annual line/global bounds."),
    check("Unit split review", splits.filter((item) => item.status === "needs_review").length, "Unit Econ Assumptions", "Percentage splits must sum to 100%; by-line cycles are blocked."),
  ];
  return { cards, splits, checks };
}

function validateCard(item, years, model) {
  if (!item.enabled) return { id: item.id, status: "ok", className: "pass", hint: "Disabled; retained for scenario audit." };
  if (!METHOD_KEYS.includes(item.method)) return { id: item.id, status: "needs_rewrite", className: "fail", hint: "Unknown method." };
  if (!lineByKey(item.target.line)) return { id: item.id, status: "needs_rewrite", className: "fail", hint: "Target P&L line is parked or missing." };
  if (["percent_of_driver", "per_unit"].includes(item.method) && !driverByKey(item.params.driver)) return { id: item.id, status: "needs_rewrite", className: "fail", hint: "Driver is missing." };
  if (item.method === "flat_values" && !item.params.values) return { id: item.id, status: "needs_rewrite", className: "fail", hint: "Flat values are missing." };

  const lineItem = lineByKey(item.target.line);
  const annual = model.cardAnnual[item.id] || blankYearSeries(years);
  const maxAbs = Math.max(...years.map((year) => Math.abs(annual[year] || 0)));
  const bound = Number(lineItem.bound || state.settings.maxAnnualFigure);
  if (maxAbs > bound || maxAbs > Number(state.settings.maxAnnualFigure || bound)) {
    return { id: item.id, status: "needs_review", className: "warn", hint: `Annual amount ${money(maxAbs)} breaches configured bound.` };
  }
  return { id: item.id, status: "ok", className: "pass", hint: "Translated and within configured bounds." };
}

function validateSplit(lineKey) {
  const split = splitFor(lineKey);
  if (split.method === "percentages") {
    const total = state.unitEconomics.segments.reduce((sum, segment) => sum + Number(split.values?.[segment.key] || 0), 0);
    if (Math.abs(total - 100) > 0.01) return { lineKey, status: "needs_review", className: "warn", hint: `Percentages sum to ${round(total, 1)}%, normalized for reconciliation.` };
  }
  if (split.method === "by_line" && createsSplitCycle(lineKey, split.byLine)) {
    return { lineKey, status: "needs_review", className: "fail", hint: "Split by-line cycle detected; using even split." };
  }
  return { lineKey, status: "ok", className: "pass", hint: "Split normalizes to 100%." };
}

function calculateUnitEconomics(model) {
  const years = getYears();
  const lineSegment = {};
  const segmentTotal = {};
  const totalByYear = blankYearSeries(years);
  for (const segment of state.unitEconomics.segments) segmentTotal[segment.key] = blankYearSeries(years);

  for (const lineItem of state.lines) {
    const weights = normalizedSplit(lineItem.key, new Set());
    lineSegment[lineItem.key] = {};
    for (const segment of state.unitEconomics.segments) lineSegment[lineItem.key][segment.key] = blankYearSeries(years);
    for (const year of years) {
      const lineValue = model.annual.lines[lineItem.key]?.[year] || 0;
      for (const segment of state.unitEconomics.segments) {
        const allocated = lineValue * (weights[segment.key] || 0);
        lineSegment[lineItem.key][segment.key][year] = allocated;
        segmentTotal[segment.key][year] += allocated;
      }
      totalByYear[year] += lineValue;
    }
  }
  return { lineSegment, segmentTotal, totalByYear };
}

function normalizedSplit(lineKey, seen) {
  const segments = state.unitEconomics.segments;
  const split = splitFor(lineKey);
  if (!segments.length) return {};
  if (split.method === "by_line" && split.byLine && !seen.has(lineKey) && !createsSplitCycle(lineKey, split.byLine)) {
    seen.add(lineKey);
    return normalizedSplit(split.byLine, seen);
  }
  if (split.method === "even" || split.method === "by_line") {
    return Object.fromEntries(segments.map((segment) => [segment.key, 1 / segments.length]));
  }
  const raw = {};
  for (const segment of segments) raw[segment.key] = Number(split.values?.[segment.key] || 0);
  const total = Object.values(raw).reduce((sum, value) => sum + Math.max(0, value), 0);
  if (!total) return Object.fromEntries(segments.map((segment) => [segment.key, 1 / segments.length]));
  return Object.fromEntries(segments.map((segment) => [segment.key, Math.max(0, raw[segment.key] || 0) / total]));
}

function driverSeries(item, years) {
  const out = blankYearSeries(years);
  for (const year of years) out[year] = Number(item.baseValue || 0) * Math.pow(1 + Number(item.growthRate || 0), year - years[0]);
  return out;
}

function aggregateAnnual(rawLines, years) {
  const revenue = blankYearSeries(years);
  const cost = blankYearSeries(years);
  const total = blankYearSeries(years);
  for (const year of years) {
    for (const lineItem of state.lines) {
      const value = rawLines[lineItem.key]?.[year] || 0;
      if (lineItem.type === "revenue") revenue[year] += value;
      else cost[year] += value;
    }
    total[year] = revenue[year] - cost[year];
  }
  return { revenue, cost, total };
}

function aggregatePeriods(rawLines, periods) {
  const revenue = blankPeriodSeries(periods);
  const cost = blankPeriodSeries(periods);
  const total = blankPeriodSeries(periods);
  for (const period of periods) {
    for (const lineItem of state.lines) {
      const value = rawLines[lineItem.key]?.[period.key] || 0;
      if (lineItem.type === "revenue") revenue[period.key] += value;
      else cost[period.key] += value;
    }
    total[period.key] = revenue[period.key] - cost[period.key];
  }
  return { revenue, cost, total };
}

function signedLineMap(rawLines) {
  const out = {};
  for (const lineItem of state.lines) {
    out[lineItem.key] = {};
    for (const [year, value] of Object.entries(rawLines[lineItem.key] || {})) out[lineItem.key][year] = lineItem.type === "cost" ? -value : value;
  }
  return out;
}

function signedPeriodLineMap(rawLines) {
  const out = {};
  for (const lineItem of state.lines) {
    out[lineItem.key] = {};
    for (const [period, value] of Object.entries(rawLines[lineItem.key] || {})) out[lineItem.key][period] = lineItem.type === "cost" ? -value : value;
  }
  return out;
}

function plTable(model, periods) {
  const isMonthly = state.settings.granularity === "monthly";
  const rows = [];
  rows.push(`<tr class="section-row"><td class="sticky-col" colspan="${periods.length + 1}">Revenue</td></tr>`);
  for (const item of state.lines.filter((lineItem) => lineItem.type === "revenue")) rows.push(plLineRow(item, model, periods, isMonthly));
  rows.push(totalRow("Total Revenue", isMonthly ? model.period.revenue : model.annual.revenue, periods));
  rows.push(`<tr class="section-row"><td class="sticky-col" colspan="${periods.length + 1}">Costs</td></tr>`);
  for (const item of state.lines.filter((lineItem) => lineItem.type === "cost")) rows.push(plLineRow(item, model, periods, isMonthly));
  rows.push(totalRow("Total Costs", negateSeries(isMonthly ? model.period.cost : model.annual.cost), periods));
  rows.push(totalRow("Profit / (Loss)", isMonthly ? model.period.total : model.annual.total, periods));
  return `
    <div class="table-wrap">
      <table class="wide-table">
        <thead><tr><th class="sticky-col">Line item</th>${periods.map((period) => `<th class="number">${escapeHTML(period.label)}</th>`).join("")}</tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>
  `;
}

function plLineRow(item, model, periods, isMonthly) {
  const series = isMonthly ? model.period.lines[item.key] : model.annual.lines[item.key];
  return `<tr><td class="sticky-col">${escapeHTML(item.name)}</td>${periods.map((period) => valueCell(series?.[period.key] ?? series?.[period.year] ?? 0)).join("")}</tr>`;
}

function totalRow(label, series, periods) {
  return `<tr class="total-row"><td class="sticky-col">${escapeHTML(label)}</td>${periods.map((period) => valueCell(series?.[period.key] ?? series?.[period.year] ?? 0)).join("")}</tr>`;
}

function openEditor(id) {
  const years = getYears();
  editorDraft = id ? clone(state.cards.find((item) => item.id === id)) : card(nextCardId(), "Revenue Drivers", "Guarantee fee is 2.5% of programme size.", state.lines[0]?.key || "", "percent_of_driver", { driver: state.drivers[0]?.key || "", rate: 0.025 }, { years: "all" });
  if (!editorDraft.params.values) editorDraft.params.values = Object.fromEntries(years.map((year) => [year, 0]));
  renderEditor();
  els.editorPanel.classList.add("open");
}

function renderEditor() {
  const years = getYears();
  const targetYears = targetYearsToArray(editorDraft.target.years, years);
  els.editorTitle.textContent = state.cards.some((item) => item.id === editorDraft.id) ? "Edit formula card" : "New formula card";
  els.assumptionForm.innerHTML = `
    <div class="form-field">
      <label>Source text</label>
      <textarea class="input-cell" name="source_text">${escapeHTML(editorDraft.source_text || "")}</textarea>
    </div>
    <div class="button-row">
      <button class="secondary-button" id="parseAssumptionButton" type="button">Translator.translate()</button>
      <span class="mini-badge">Backend: ${escapeHTML(state.settings.translatorBackend)}</span>
    </div>
    <div class="control-grid">
      ${editorSelect("Category", "category", editorDraft.category, TAXONOMY)}
      ${editorSelect("Target line", "line", editorDraft.target.line, state.lines.map((item) => item.key), lineName)}
      ${editorSelect("Method", "method", editorDraft.method, METHOD_KEYS, (key) => METHOD_LABELS[key])}
      <label class="toggle input-like"><input name="enabled" type="checkbox" ${editorDraft.enabled ? "checked" : ""}> Enabled</label>
    </div>
    <div class="form-field">
      <label>Target years</label>
      <div class="year-chip-row">
        <label class="year-chip"><input name="year-all" type="checkbox" ${editorDraft.target.years === "all" ? "checked" : ""}> All</label>
        ${years.map((year) => `<label class="year-chip"><input name="year-${year}" type="checkbox" ${targetYears.includes(year) ? "checked" : ""}> ${year}</label>`).join("")}
      </div>
    </div>
    ${methodEditor(editorDraft, years)}
    <div class="button-row">
      <button class="primary-button" type="submit" ${state.settings.locked ? "disabled" : ""}>Save Card</button>
      <button class="danger-button" data-delete-card="${editorDraft.id}" type="button" ${state.settings.locked || !state.cards.some((item) => item.id === editorDraft.id) ? "disabled" : ""}>Delete</button>
    </div>
  `;
  document.querySelector("#parseAssumptionButton").addEventListener("click", interpretEditorText);
  els.assumptionForm.querySelector("[name='method']").addEventListener("change", (event) => {
    editorDraft.method = event.target.value;
    editorDraft.params = defaultParamsForMethod(editorDraft.method, years);
    renderEditor();
  });
}

function methodEditor(item, years) {
  if (item.method === "flat_values") {
    return `<div class="year-grid">${years.map((year) => `<div class="form-field"><label>${year}</label><input class="input-cell" name="value-${year}" type="number" step="any" value="${item.params.values?.[year] || 0}"></div>`).join("")}</div>`;
  }
  if (item.method === "single_value_growth") {
    return `<div class="control-grid">${editorNumber("Base year", "baseYear", item.params.baseYear || years[0])}${editorNumber("Start value", "startValue", item.params.startValue || 0)}${editorNumber("Growth %", "growthRatePercent", (item.params.growthRate || 0) * 100)}</div>`;
  }
  if (item.method === "percent_of_driver") {
    return `<div class="control-grid">${editorSelect("Driver", "driver", item.params.driver || state.drivers[0]?.key, state.drivers.map((d) => d.key), driverName)}${editorNumber("Rate %", "ratePercent", (item.params.rate || 0) * 100)}</div>`;
  }
  if (item.method === "per_unit") {
    return `<div class="control-grid">${editorSelect("Driver", "driver", item.params.driver || state.drivers[0]?.key, state.drivers.map((d) => d.key), driverName)}${editorNumber("Unit rate", "unitRate", item.params.unitRate || 0)}</div>`;
  }
  return `<div class="control-grid">${editorNumber("Annual amount", "amount", item.params.amount || 0)}</div>`;
}

function saveEditor(event) {
  event.preventDefault();
  if (state.settings.locked) return toast("Scenario is locked.");
  const form = new FormData(els.assumptionForm);
  const years = getYears();
  const updated = clone(editorDraft);
  updated.source_text = String(form.get("source_text") || "");
  updated.category = String(form.get("category") || TAXONOMY[0]);
  updated.enabled = form.get("enabled") === "on";
  updated.target.line = String(form.get("line") || "");
  updated.method = String(form.get("method") || "flat_values");
  updated.target.years = form.get("year-all") === "on" ? "all" : years.filter((year) => form.get(`year-${year}`) === "on");
  updated.params = paramsFromForm(updated.method, form, years);
  updated.depends_on = [];
  updated.updated_at = today();

  mutate(`Saved formula card ${updated.id}: ${sourceTitle(updated.source_text)}`, () => {
    const index = state.cards.findIndex((item) => item.id === updated.id);
    if (index >= 0) state.cards[index] = updated;
    else state.cards.push(updated);
  });
  closeEditor();
}

function paramsFromForm(method, form, years) {
  if (method === "flat_values") return { values: Object.fromEntries(years.map((year) => [year, Number(form.get(`value-${year}`) || 0)])) };
  if (method === "single_value_growth") return { baseYear: Number(form.get("baseYear") || years[0]), startValue: Number(form.get("startValue") || 0), growthRate: Number(form.get("growthRatePercent") || 0) / 100 };
  if (method === "percent_of_driver") return { driver: String(form.get("driver") || ""), rate: Number(form.get("ratePercent") || 0) / 100 };
  if (method === "per_unit") return { driver: String(form.get("driver") || ""), unitRate: Number(form.get("unitRate") || 0) };
  return { amount: Number(form.get("amount") || 0) };
}

async function interpretEditorText() {
  const text = String(els.assumptionForm.querySelector("[name='source_text']").value || "");
  const translated = await Translator.translate(text);
  editorDraft = { ...editorDraft, ...translated, source_text: text, target: { ...editorDraft.target, ...(translated.target || {}) } };
  renderEditor();
  toast("Translator emitted a formula card.");
}

const Translator = {
  async translate(text) {
    if (state.settings.translatorBackend === "live_api") {
      try {
        const result = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
        if (result.ok) return await result.json();
      } catch {}
      toast("Live API unavailable; using local parser.");
    }
    return localTranslate(text);
  },
};

function localTranslate(text) {
  const lower = text.toLowerCase();
  const rate = firstPercent(text);
  const amount = firstMoney(text);
  if (lower.includes("programme size")) return { method: "percent_of_driver", params: { driver: "programme_size", rate: rate || 0.025 } };
  if (lower.includes("guarantee volume")) return { method: "percent_of_driver", params: { driver: "guarantee_volume", rate: rate || 0.025 } };
  if (lower.includes("per guarantee")) return { method: "per_unit", params: { driver: "guarantee_count", unitRate: amount || 0.05 } };
  if (lower.includes("grows") || lower.includes("growth")) return { method: "single_value_growth", params: { baseYear: getYears()[0], startValue: amount || 1000, growthRate: rate || 0.05 } };
  if (lower.includes("fixed") || lower.includes("same")) return { method: "fixed_per_year", params: { amount: amount || 1000 } };
  return { method: "flat_values", params: { values: Object.fromEntries(getYears().map((year) => [year, amount || 0])) }, status: "needs_rewrite", hint: "Local parser could not infer a stronger method." };
}

function handleClick(event) {
  const help = event.target.closest("[data-help]");
  if (help) return openHelp(help.dataset.help, activeContextView());
  const helpJump = event.target.closest("[data-help-jump]");
  if (helpJump) {
    const [target, section] = helpJump.dataset.helpJump.split(":");
    return openHelp(target, section);
  }
  const guidePrint = event.target.closest("[data-print-guide]");
  if (guidePrint) return printHelpDocument(guidePrint.dataset.printGuide);
  const nav = event.target.closest("[data-nav]");
  if (nav) return HELP_VIEWS.has(nav.dataset.nav) ? openHelp(nav.dataset.nav, activeContextView()) : switchView(nav.dataset.nav);
  const navItem = event.target.closest(".nav-item");
  if (navItem) return HELP_VIEWS.has(navItem.dataset.view) ? openHelp(navItem.dataset.view, activeContextView()) : switchView(navItem.dataset.view);
  if (event.target.closest("[data-open-new-card]")) return openEditor(null);
  const edit = event.target.closest("[data-edit-card]");
  if (edit) return openEditor(edit.dataset.editCard);
  const delCard = event.target.closest("[data-delete-card]");
  if (delCard) return deleteCard(delCard.dataset.deleteCard);
  if (event.target.closest("[data-add-driver]")) return addDriver();
  if (event.target.closest("[data-add-line]")) return addLine();
  if (event.target.closest("[data-add-segment]")) return addSegment();
  const removeSegment = event.target.closest("[data-remove-segment]");
  if (removeSegment) return removeSegmentByKey(removeSegment.dataset.removeSegment);
  const moveLine = event.target.closest("[data-move-line]");
  if (moveLine) return moveLineByKey(moveLine.dataset.moveLine);
  const removeLine = event.target.closest("[data-remove-line]");
  if (removeLine) return removeLineByKey(removeLine.dataset.removeLine);
  const restore = event.target.closest("[data-restore-scenario]");
  if (restore) return restoreScenario(restore.dataset.restoreScenario);
  const importButton = event.target.closest("[data-import]");
  if (importButton) return beginImport(importButton.dataset.import);
  const exportButton = event.target.closest("[data-export]");
  if (exportButton) return handleExport(exportButton.dataset.export);
}

function handleChange(event) {
  const target = event.target;
  if (state.settings.locked && target.dataset.setting !== "unitYear") {
    if (target.matches("[data-toggle-card], [data-driver-field], [data-segment-name], [data-split-method], [data-split-value], [data-split-byline], [data-line-name], [data-line-type], [data-line-bound], .settings-input")) return toast("Scenario is locked.");
  }
  if (target.matches("[data-toggle-card]")) return toggleCard(target.dataset.toggleCard, target.checked);
  if (target.matches("[data-driver-field]")) return updateDriverField(target);
  if (target.matches("[data-segment-name]")) return updateSegmentName(target);
  if (target.matches("[data-split-method]")) return updateSplitMethod(target);
  if (target.matches("[data-split-value]")) return updateSplitValue(target);
  if (target.matches("[data-split-byline]")) return updateSplitByLine(target);
  if (target.matches("[data-line-name]")) return updateLineName(target);
  if (target.matches("[data-line-type]")) return updateLineType(target);
  if (target.matches("[data-line-bound]")) return updateLineBound(target);
  if (target.matches(".settings-input")) return updateSetting(target);
}

function handleInput(event) {
  const target = event.target;
  if (target.matches("[data-line-name], [data-driver-field], [data-segment-name]")) return;
  if (target.matches(".settings-input") && ["scenarioName"].includes(target.dataset.setting)) updateSetting(target, true);
}

function updateSetting(target, light = false) {
  const key = target.dataset.setting;
  const old = state.settings[key];
  let value = target.type === "checkbox" ? target.checked : target.value;
  if (target.type === "number" || ["startYear", "yearCount", "monthlyYearCount", "startMonth", "unitYear", "maxAnnualFigure", "maxCostRatio"].includes(key)) value = Number(value || 0);
  if (key === "yearCount") value = Math.max(1, Math.min(MAX_ANNUAL_YEARS, value));
  if (key === "monthlyYearCount") value = Math.max(1, Math.min(MAX_MONTHLY_YEARS, value));
  mutate(`Changed setting ${key} from ${old} to ${value}`, () => { state.settings[key] = value; }, light);
}

function updateDriverField(target) {
  const [key, field] = target.dataset.driverField.split(":");
  mutate(`Updated driver ${key}`, () => {
    const item = driverByKey(key);
    if (!item) return;
    if (field === "growthRatePercent") item.growthRate = Number(target.value || 0) / 100;
    else if (field === "baseValue") item.baseValue = Number(target.value || 0);
    else item[field] = target.value;
  });
}

function updateSegmentName(target) {
  mutate(`Renamed segment ${target.dataset.segmentName}`, () => {
    const item = state.unitEconomics.segments.find((segment) => segment.key === target.dataset.segmentName);
    if (item) item.name = target.value;
  });
}

function updateSplitMethod(target) {
  mutate(`Changed split method for ${lineName(target.dataset.splitMethod)}`, () => {
    splitFor(target.dataset.splitMethod).method = target.value;
  });
}

function updateSplitValue(target) {
  const [lineKey, segmentKey] = target.dataset.splitValue.split(":");
  mutate(`Changed split value for ${lineName(lineKey)}`, () => {
    splitFor(lineKey).values[segmentKey] = Number(target.value || 0);
  });
}

function updateSplitByLine(target) {
  mutate(`Changed by-line split for ${lineName(target.dataset.splitByline)}`, () => {
    splitFor(target.dataset.splitByline).byLine = target.value;
  });
}

function updateLineName(target) {
  mutate(`Renamed P&L line ${target.dataset.lineName}`, () => {
    const item = lineByKey(target.dataset.lineName);
    if (item) item.name = target.value;
  });
}

function updateLineType(target) {
  mutate(`Changed P&L line type for ${lineName(target.dataset.lineType)}`, () => {
    const item = lineByKey(target.dataset.lineType);
    if (item) item.type = target.value;
  });
}

function updateLineBound(target) {
  mutate(`Changed bound for ${lineName(target.dataset.lineBound)}`, () => {
    const item = lineByKey(target.dataset.lineBound);
    if (item) item.bound = Number(target.value || 0);
  });
}

function toggleCard(id, enabled) {
  mutate(`${enabled ? "Enabled" : "Disabled"} formula card ${id}`, () => {
    const item = state.cards.find((cardItem) => cardItem.id === id);
    if (item) item.enabled = enabled;
  });
}

function addDriver() {
  const key = uniqueKey("driver", state.drivers.map((item) => item.key));
  mutate(`Added driver ${key}`, () => state.drivers.push(driver(key, "New driver", "units", 1000, 0, "User-entered")));
}

function addLine() {
  const key = uniqueKey("line", state.lines.map((item) => item.key));
  mutate(`Added P&L line ${key}`, () => {
    state.lines.push(line(key, "New line", "revenue"));
    state.unitEconomics.splits[key] = { method: "even", values: {}, byLine: "" };
  });
}

function addSegment() {
  if (state.unitEconomics.segments.length >= 8) return toast("Maximum 8 segments.");
  const key = uniqueKey("segment", state.unitEconomics.segments.map((item) => item.key));
  mutate(`Added Unit Economics segment ${key}`, () => {
    state.unitEconomics.segments.push({ key, name: "New Segment" });
    for (const split of Object.values(state.unitEconomics.splits)) split.values[key] = 1;
  });
}

function removeSegmentByKey(key) {
  mutate(`Removed Unit Economics segment ${key}`, () => {
    state.unitEconomics.segments = state.unitEconomics.segments.filter((item) => item.key !== key);
    for (const split of Object.values(state.unitEconomics.splits)) delete split.values[key];
  });
}

function moveLineByKey(action) {
  const [key, dir] = action.split(":");
  mutate(`Moved P&L line ${key} ${dir}`, () => {
    const index = state.lines.findIndex((item) => item.key === key);
    const swap = dir === "up" ? index - 1 : index + 1;
    if (index < 0 || swap < 0 || swap >= state.lines.length) return;
    [state.lines[index], state.lines[swap]] = [state.lines[swap], state.lines[index]];
  });
}

function removeLineByKey(key) {
  mutate(`Removed P&L line ${key}; dependent cards parked`, () => {
    for (const item of state.cards) {
      if (item.target.line === key) {
        item.target.line = "";
        item.enabled = false;
        item.status = "needs_review";
        item.hint = "Target line was removed; choose a new line.";
      }
    }
    delete state.unitEconomics.splits[key];
    state.lines = state.lines.filter((item) => item.key !== key);
  });
}

function deleteCard(id) {
  mutate(`Deleted formula card ${id}`, () => {
    state.cards = state.cards.filter((item) => item.id !== id);
  });
  closeEditor();
}

function saveScenario() {
  mutate(`Saved scenario ${state.settings.scenarioName}`, () => {
    state.scenarios.push({
      id: `SCN-${String(state.scenarios.length + 1).padStart(3, "0")}`,
      name: state.settings.scenarioName,
      savedAt: timestamp(),
      snapshot: snapshotFrom(state),
      note: "Manual save.",
    });
  });
  toast("Scenario saved.");
}

function duplicateScenario() {
  mutate(`Duplicated scenario ${state.settings.scenarioName}`, () => {
    state.settings.scenarioName = `${state.settings.scenarioName} Copy`;
    state.settings.locked = false;
  });
}

function toggleLock() {
  mutate(`${state.settings.locked ? "Unlocked" : "Locked"} scenario`, () => {
    state.settings.locked = !state.settings.locked;
  });
}

function restoreScenario(id) {
  const item = state.scenarios.find((scenario) => scenario.id === id);
  if (!item) return;
  mutate(`Restored scenario ${item.name}`, () => restoreSnapshot(item.snapshot));
}

function undo() {
  const snapshot = undoStack.pop();
  if (!snapshot) return;
  redoStack.push(snapshotFrom(state));
  restoreSnapshot(snapshot);
  state.audit.push(auditEntry("Undo restored previous meaningful model state", "Undo", "-", "-"));
  render();
}

function redo() {
  const snapshot = redoStack.pop();
  if (!snapshot) return;
  undoStack.push(snapshotFrom(state));
  restoreSnapshot(snapshot);
  state.audit.push(auditEntry("Redo restored later meaningful model state", "Redo", "-", "-"));
  render();
}

function mutate(text, fn, light = false) {
  const before = snapshotFrom(state);
  fn();
  if (!light) undoStack.push(before);
  redoStack = [];
  state.audit.push(auditEntry(text, "", "", ""));
  render();
}

function handleExport(type) {
  if (type === "cardsCsv") {
    downloadFile("formula_cards.csv", cardsCsv(), "text/csv");
  } else if (type === "auditCsv") {
    downloadFile("audit_trail.csv", auditCsv(), "text/csv");
  } else if (type === "workspaceJson") {
    downloadFile(`${filenameStem("workspace")}.json`, workspaceJson(), "application/json");
  } else if (type === "workspaceCsv") {
    downloadFile(`${filenameStem("workspace")}.csv`, workspaceCsv(), "text/csv");
  } else {
    const mapped = mapLegacyExport(type);
    const [scope, format] = mapped.split(":");
    exportReport(scope, format);
  }
  state.audit.push(auditEntry(`Exported ${type} output`, "Export", "-", state.settings.scenarioName));
  persist();
}

async function beginImport(type) {
  const ok = window.confirm("Import will replace the current working data in this browser. Export a backup first if you need to keep the current state.");
  if (!ok) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = type === "workspaceJson" ? ".json,application/json" : ".csv,text/csv";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = type === "workspaceJson" ? parseWorkspaceJson(text) : parseWorkspaceCsv(text);
      importWorkspaceState(imported, `${type} import from ${file.name}`);
    } catch (error) {
      toast(`Import failed: ${error.message || "Invalid file"}`);
    }
  }, { once: true });
  input.click();
}

function importWorkspaceState(imported, label) {
  const before = snapshotFrom(state);
  const normalized = normalizeState(imported);
  state.settings = clone(normalized.settings);
  state.lines = clone(normalized.lines);
  state.drivers = clone(normalized.drivers);
  state.cards = clone(normalized.cards);
  state.unitEconomics = clone(normalized.unitEconomics);
  state.scenarios = clone(normalized.scenarios || []);
  state.audit = clone(normalized.audit || []);
  state.audit.push(auditEntry(`Imported working data: ${label}`, "Import", "-", state.settings.scenarioName));
  undoStack.push(before);
  redoStack = [];
  render();
  toast("Working data imported.");
}

function mapLegacyExport(type) {
  if (type === "pdf" || type === "print") return "pack:pdf";
  if (type === "word") return "pack:word";
  if (type === "excel") return "pack:gsheet";
  if (type === "json") return "pack:json";
  return type.includes(":") ? type : "pack:json";
}

function exportReport(scope, format) {
  const label = scopeLabel(scope);
  const stem = filenameStem(scope);
  if (format === "pdf") {
    printReport(scope);
  } else if (format === "word") {
    downloadFile(`${stem}.doc`, reportHtml(scope), "application/msword");
  } else if (format === "csv") {
    downloadFile(`${stem}.csv`, reportCsv(scope), "text/csv");
  } else if (format === "json") {
    downloadFile(`${stem}.json`, JSON.stringify(reportJson(scope), null, 2), "application/json");
  } else if (format === "gdoc") {
    downloadFile(`${stem}_google_docs_import.html`, reportHtml(scope), "text/html");
  } else if (format === "gsheet") {
    downloadFile(`${stem}_google_sheets_import.xls`, reportSpreadsheetHtml(scope), "application/vnd.ms-excel");
  } else {
    toast(`${label} export format is not available.`);
  }
}

function printReport(scope) {
  const popup = window.open("", "_blank");
  if (!popup) {
    toast("Allow pop-ups, then try PDF / Print again.");
    return;
  }
  popup.document.open();
  popup.document.write(reportHtml(scope, true));
  popup.document.close();
  popup.focus();
  setTimeout(() => popup.print(), 250);
}

function switchView(view) {
  currentView = view;
  if (!HELP_VIEWS.has(view)) lastContextView = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
  document.querySelector(`#${view}View`)?.classList.add("active");
  document.querySelectorAll(".nav-item").forEach((node) => node.classList.toggle("active", node.dataset.view === view));
}

function closeEditor() {
  editorDraft = null;
  els.editorPanel.classList.remove("open");
}

function getYears() {
  const count = state.settings.granularity === "monthly"
    ? Math.min(MAX_MONTHLY_YEARS, Number(state.settings.monthlyYearCount || DEFAULT_SETTINGS.monthlyYearCount))
    : Math.min(MAX_ANNUAL_YEARS, Number(state.settings.yearCount || DEFAULT_SETTINGS.yearCount));
  return Array.from({ length: count }, (_, index) => Number(state.settings.startYear || 2025) + index);
}

function getPeriods() {
  const years = getYears();
  if (state.settings.granularity === "annual") return years.map((year) => ({ key: String(year), year, label: String(year) }));
  const periods = [];
  for (const year of years) {
    for (let offset = 0; offset < 12; offset += 1) {
      const month = ((Number(state.settings.startMonth || 1) - 1 + offset) % 12) + 1;
      periods.push({ key: `${year}-${String(month).padStart(2, "0")}`, year, month, label: `${MONTHS[month - 1]} ${year}` });
    }
  }
  return periods;
}

function getDisplayPeriods() {
  return getPeriods();
}

function selectedUnitYear() {
  const years = getYears();
  const requested = Number(state.settings.unitYear || years[years.length - 1]);
  return years.includes(requested) ? requested : years[years.length - 1];
}

function targetCoversYear(targetYears, year) {
  if (targetYears === "all") return true;
  return Array.isArray(targetYears) && targetYears.map(Number).includes(Number(year));
}

function targetYearsToArray(targetYears, years) {
  if (targetYears === "all") return years;
  return Array.isArray(targetYears) ? targetYears.map(Number) : [];
}

function targetYearsLabel(targetYears) {
  if (targetYears === "all") return "All years";
  if (!Array.isArray(targetYears) || !targetYears.length) return "Parked";
  const sorted = [...targetYears].map(Number).sort();
  const consecutive = sorted.every((year, index) => index === 0 || year === sorted[index - 1] + 1);
  return consecutive && sorted.length > 1 ? `${sorted[0]}-${sorted[sorted.length - 1]}` : sorted.join(", ");
}

function blankYearSeries(years) {
  return Object.fromEntries(years.map((year) => [year, 0]));
}

function blankPeriodSeries(periods) {
  return Object.fromEntries(periods.map((period) => [period.key, 0]));
}

function lineByKey(key) {
  return state.lines.find((item) => item.key === key);
}

function driverByKey(key) {
  return state.drivers.find((item) => item.key === key);
}

function lineName(key) {
  return lineByKey(key)?.name || key || "Parked";
}

function driverName(key) {
  return driverByKey(key)?.name || key || "Missing driver";
}

function splitFor(lineKey) {
  if (!state.unitEconomics.splits[lineKey]) state.unitEconomics.splits[lineKey] = { method: "even", values: {}, byLine: "" };
  return state.unitEconomics.splits[lineKey];
}

function createsSplitCycle(lineKey, byLine) {
  let cursor = byLine;
  const seen = new Set([lineKey]);
  while (cursor) {
    if (seen.has(cursor)) return true;
    seen.add(cursor);
    const split = splitFor(cursor);
    cursor = split.method === "by_line" ? split.byLine : "";
  }
  return false;
}

function signedAnnualForCard(cardItem, annual) {
  const lineItem = lineByKey(cardItem.target.line);
  if (!lineItem) return annual;
  return Object.fromEntries(Object.entries(annual).map(([year, value]) => [year, lineItem.type === "cost" ? -value : value]));
}

function operationText(item) {
  if (item.method === "flat_values") return "engine reads explicit annual values";
  if (item.method === "single_value_growth") return `${money(item.params.startValue)} grows ${percent(item.params.growthRate)} from ${item.params.baseYear}`;
  if (item.method === "percent_of_driver") return `${percent(item.params.rate)} x ${driverName(item.params.driver)}`;
  if (item.method === "per_unit") return `${money(item.params.unitRate)} x ${driverName(item.params.driver)}`;
  if (item.method === "fixed_per_year") return `${money(item.params.amount)} every year`;
  return "needs rewrite";
}

function defaultParamsForMethod(method, years) {
  if (method === "flat_values") return { values: Object.fromEntries(years.map((year) => [year, 0])) };
  if (method === "single_value_growth") return { baseYear: years[0], startValue: 1000, growthRate: 0.05 };
  if (method === "percent_of_driver") return { driver: state.drivers[0]?.key || "", rate: 0.025 };
  if (method === "per_unit") return { driver: state.drivers[0]?.key || "", unitRate: 1 };
  return { amount: 1000 };
}

function sourceTitle(text) {
  const trimmed = String(text || "").trim();
  return trimmed.length > 58 ? `${trimmed.slice(0, 58)}...` : trimmed || "Untitled assumption";
}

function kpi(label, value, sub, className = "") {
  return `<div class="kpi"><p class="kpi-label">${escapeHTML(label)}</p><p class="kpi-value ${className}">${value}</p><p class="kpi-sub">${escapeHTML(sub)}</p></div>`;
}

function activeContextView() {
  return normalizeContextView(HELP_VIEWS.has(currentView) ? lastContextView : currentView);
}

function normalizeContextView(view) {
  return VIEW_LABELS[view] ? view : "dashboard";
}

function openHelp(target, context) {
  const helpView = target === "quickStart" ? "quickStart" : "guide";
  lastContextView = normalizeContextView(context);
  switchView(helpView);
  requestAnimationFrame(() => jumpToHelpSection(helpView, lastContextView));
}

function jumpToHelpSection(helpView, context) {
  const prefix = helpView === "quickStart" ? "quick" : "guide";
  const normalized = normalizeContextView(context);
  document.querySelectorAll(`#${helpView}View .help-intro .mini-badge`).forEach((node) => {
    node.textContent = `${VIEW_LABELS[normalized]} context`;
  });
  const fallback = helpView === "quickStart" ? QUICK_START_STEPS[0]?.view : GUIDE_SECTIONS[0]?.view;
  const target = document.querySelector(`#${prefix}-${normalized}`) || document.querySelector(`#${prefix}-${fallback}`);
  if (!target) return;
  document.querySelectorAll(".context-highlight").forEach((node) => node.classList.remove("context-highlight"));
  target.classList.add("context-highlight");
  target.scrollIntoView({ block: "start", behavior: "smooth" });
}

function listHTML(title, items) {
  return `<div class="help-block"><h4>${escapeHTML(title)}</h4><ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>`;
}

function guideSectionHTML(item) {
  return `
    <section class="panel help-section" id="guide-${item.view}" tabindex="-1">
      <div class="panel-header">
        <h3 class="panel-title">${escapeHTML(item.title)}</h3>
        <span class="mini-badge">${escapeHTML(VIEW_LABELS[item.view])}</span>
      </div>
      <div class="panel-body">
        <p class="help-summary">${escapeHTML(item.summary)}</p>
        <div class="help-detail-grid">
          ${listHTML("Use this screen when", item.useWhen)}
          ${listHTML("Core workflow", item.actions)}
          ${listHTML("Review checks", item.checks)}
        </div>
        <div class="button-row">
          <button class="secondary-button" data-nav="${item.view}" type="button">Open ${escapeHTML(item.title)}</button>
          <button class="ghost-button" data-help-jump="quickStart:${item.view}" type="button">Quick Start step</button>
        </div>
      </div>
    </section>
  `;
}

function quickStepHTML(item) {
  return `
    <section class="panel quick-step" id="quick-${item.view}" tabindex="-1">
      <div class="panel-header">
        <h3 class="panel-title">${escapeHTML(item.title)}</h3>
        <span class="mini-badge">${escapeHTML(VIEW_LABELS[item.view])}</span>
      </div>
      <div class="panel-body">
        <p class="help-summary">${escapeHTML(item.goal)}</p>
        ${listHTML("Do this", item.actions)}
        <div class="notice"><strong>Move on when:</strong> ${escapeHTML(item.exit)}</div>
        <div class="button-row">
          <button class="secondary-button" data-nav="${item.view}" type="button">Open ${escapeHTML(VIEW_LABELS[item.view])}</button>
          <button class="ghost-button" data-help-jump="guide:${item.view}" type="button">Full guide section</button>
        </div>
      </div>
    </section>
  `;
}

function printHelpDocument(type) {
  const isQuick = type === "quickStart";
  const title = isQuick ? "Quick Start Guide" : "User Guide";
  const popup = window.open("", "_blank");
  if (!popup) {
    toast("Allow pop-ups, then try Download PDF again.");
    return;
  }
  popup.document.open();
  popup.document.write(helpPrintHTML(title, isQuick ? quickStartPrintBody() : userGuidePrintBody()));
  popup.document.close();
  popup.focus();
  state.audit.push(auditEntry(`Opened ${title} PDF print view`, "Guide", "-", title));
  persist();
  setTimeout(() => popup.print(), 250);
}

function helpPrintHTML(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHTML(title)}</title><style>${helpPrintStyles()}</style></head><body><header><p>Assumption-Based Financial Modelling Engine</p><h1>${escapeHTML(title)}</h1><p>${escapeHTML(state.settings.scenarioName)}</p></header>${body}</body></html>`;
}

function userGuidePrintBody() {
  return `
    <main>
      <section><h2>How to use this guide</h2><p>The User Guide is organized by app screen. Each section explains when to use the screen, the core workflow, and the checks to complete before relying on the output.</p></section>
      ${GUIDE_SECTIONS.map((item) => `<section><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.summary)}</p>${listHTML("Use this screen when", item.useWhen)}${listHTML("Core workflow", item.actions)}${listHTML("Review checks", item.checks)}</section>`).join("")}
      <section><h2>Sources and implementation notes</h2>${SOURCE_LOG.map((item) => `<h3>${escapeHTML(item.item)}</h3><p><strong>${escapeHTML(item.source)}</strong></p><p>${escapeHTML(item.note)}</p>`).join("")}<p>Static GitHub Pages can host the app, but cannot run the future live /api/translate backend.</p></section>
    </main>
  `;
}

function quickStartPrintBody() {
  return `
    <main>
      <section><h2>Purpose</h2><p>The Quick Start Guide is the shortest path from opening the model to saving and exporting a reviewable scenario.</p></section>
      ${QUICK_START_STEPS.map((item) => `<section><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.goal)}</p>${listHTML("Do this", item.actions)}<p><strong>Move on when:</strong> ${escapeHTML(item.exit)}</p></section>`).join("")}
    </main>
  `;
}

function helpPrintStyles() {
  return `
    body{margin:32px;color:#1d2428;font-family:Inter,Aptos,"Segoe UI",Arial,sans-serif;font-size:12px;line-height:1.45}
    header{border-bottom:2px solid #172b4d;margin-bottom:24px;padding-bottom:12px}
    header p{margin:0 0 4px;color:#607078;font-weight:700;text-transform:uppercase}
    h1{margin:0;color:#172b4d;font-size:26px}
    h2{margin:22px 0 8px;color:#172b4d;font-size:18px;break-after:avoid}
    h3{margin:14px 0 4px;font-size:14px}
    h4{margin:12px 0 4px;font-size:12px;text-transform:uppercase;color:#607078}
    section{break-inside:avoid;margin-bottom:18px}
    ul{margin:6px 0 10px 18px;padding:0}
    li{margin:0 0 5px}
    p{margin:0 0 8px}
    strong{color:#1d2428}
  `;
}

function coverage(title, status, text) {
  return `<div class="coverage-card"><strong>${escapeHTML(title)}</strong><span class="mini-badge ${status === "Built" ? "pass" : "warn"}">${escapeHTML(status)}</span><p>${escapeHTML(text)}</p></div>`;
}

function impactStrip(years, series) {
  return `<div class="impact-strip">${years.map((year) => `<span class="${(series[year] || 0) < 0 ? "negative" : "positive"}">${year}: ${money(series[year] || 0)}</span>`).join("")}</div>`;
}

function operandStrip(years, item, model) {
  return `<div class="operand-strip">${years.map((year) => `<span>${escapeHTML(operandExpression(item, year, model))}</span>`).join("")}</div>`;
}

function operandExpression(item, year, model) {
  const result = model.cardAnnual[item.id]?.[year] || 0;
  if (!item.enabled) return `${year}: disabled = -`;
  if (!targetCoversYear(item.target.years, year)) return `${year}: outside target = -`;
  if (item.method === "flat_values") return `${year}: value ${money(item.params.values?.[year] || 0)} = ${money(result)}`;
  if (item.method === "single_value_growth") {
    const baseYear = Number(item.params.baseYear || year);
    const exponent = Math.max(0, Number(year) - baseYear);
    return `${year}: ${money(item.params.startValue)} x (1 + ${percent(item.params.growthRate)})^${exponent} = ${money(result)}`;
  }
  if (item.method === "percent_of_driver") {
    const driverValue = model.drivers[item.params.driver]?.[year] || 0;
    return `${year}: ${driverName(item.params.driver)} ${money(driverValue)} x ${percent(item.params.rate)} = ${money(result)}`;
  }
  if (item.method === "per_unit") {
    const driverValue = model.drivers[item.params.driver]?.[year] || 0;
    return `${year}: ${driverName(item.params.driver)} ${money(driverValue)} x ${money(item.params.unitRate)} = ${money(result)}`;
  }
  if (item.method === "fixed_per_year") return `${year}: fixed ${money(item.params.amount)} = ${money(result)}`;
  return `${year}: unsupported method`;
}

function lineChart(labels, series) {
  const width = 760;
  const height = 240;
  const pad = 34;
  const values = series.flatMap((item) => item.values);
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => pad + (i * (width - pad * 2)) / Math.max(1, labels.length - 1);
  const y = (value) => height - pad - ((value - min) * (height - pad * 2)) / span;
  return `
    <div class="chart-box"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Annual trend chart">
      <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"></rect>
      <line x1="${pad}" y1="${y(0)}" x2="${width - pad}" y2="${y(0)}" stroke="#aebbb7"></line>
      ${series.map((item) => `<polyline points="${item.values.map((value, i) => `${x(i)},${y(value)}`).join(" ")}" fill="none" stroke="${item.color}" stroke-width="3"></polyline>${item.values.map((value, i) => `<circle cx="${x(i)}" cy="${y(value)}" r="3.5" fill="${item.color}"></circle>`).join("")}`).join("")}
      ${labels.map((label, i) => `<text x="${x(i)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#607078">${label}</text>`).join("")}
    </svg></div>`;
}

function miniPL(segment, unit, year) {
  return `<div class="panel"><div class="panel-header"><h3 class="panel-title">${escapeHTML(segment.name)}</h3><span class="mini-badge">${year}</span></div><div class="panel-body"><table><tbody>${state.lines.map((lineItem) => `<tr><td>${escapeHTML(lineItem.name)}</td><td class="number">${money(unit.lineSegment[lineItem.key]?.[segment.key]?.[year] || 0)}</td></tr>`).join("")}<tr class="total-row"><td>Profit / (Loss)</td><td class="number">${money(unit.segmentTotal[segment.key]?.[year] || 0)}</td></tr></tbody></table></div></div>`;
}

function valueCell(value) {
  return `<td class="number ${value < 0 ? "negative" : ""}">${money(value)}</td>`;
}

function settingField(label, key, type, value, opts = {}) {
  return `<div class="form-field"><label>${escapeHTML(label)}</label><input class="settings-input input-cell" data-setting="${key}" type="${type}" value="${escapeAttr(value)}" ${opts.min ? `min="${opts.min}"` : ""} ${opts.max ? `max="${opts.max}"` : ""} ${state.settings.locked ? "disabled" : ""}></div>`;
}

function settingSelect(label, key, value, options, labelFn = (x) => x) {
  const disabled = state.settings.locked && key !== "unitYear" ? "disabled" : "";
  return `<div class="form-field"><label>${escapeHTML(label)}</label>${selectHTML(`class="settings-input input-cell" data-setting="${key}" ${disabled}`, String(value), options.map(String), labelFn)}</div>`;
}

function projectionControlsHTML() {
  const locked = state.settings.locked ? "disabled" : "";
  return `
    <div class="projection-controls">
      <label class="form-field inline-field"><span>Breakout</span>${selectHTML(`class="settings-input input-cell" data-setting="granularity" ${locked}`, state.settings.granularity, ["annual", "monthly"], (value) => value === "annual" ? "Annual" : "Monthly")}</label>
      <label class="form-field inline-field"><span>Annual years</span><input class="settings-input input-cell" data-setting="yearCount" type="number" min="1" max="${MAX_ANNUAL_YEARS}" value="${state.settings.yearCount}" ${locked}></label>
      <label class="form-field inline-field"><span>Monthly years</span><input class="settings-input input-cell" data-setting="monthlyYearCount" type="number" min="1" max="${MAX_MONTHLY_YEARS}" value="${state.settings.monthlyYearCount}" ${locked}></label>
    </div>
  `;
}

function exportButtonsHTML(scope) {
  return `
    <button class="primary-button" data-export="${scope}:pdf" type="button">PDF / Print</button>
    <button class="secondary-button" data-export="${scope}:word" type="button">Word</button>
    <button class="secondary-button" data-export="${scope}:csv" type="button">CSV</button>
    <button class="secondary-button" data-export="${scope}:json" type="button">JSON</button>
    <button class="secondary-button" data-export="${scope}:gdoc" type="button">Google Docs</button>
    <button class="secondary-button" data-export="${scope}:gsheet" type="button">Google Sheets</button>
  `;
}

function editorNumber(label, name, value) {
  return `<div class="form-field"><label>${escapeHTML(label)}</label><input class="input-cell" name="${name}" type="number" step="any" value="${escapeAttr(value)}"></div>`;
}

function editorSelect(label, name, value, options, labelFn = (x) => x) {
  return `<div class="form-field"><label>${escapeHTML(label)}</label>${selectHTML(`class="input-cell" name="${name}"`, value, options, labelFn)}</div>`;
}

function selectHTML(attrs, value, options, labelFn = (x) => x) {
  return `<select ${attrs}>${options.map((option) => `<option value="${escapeAttr(option)}" ${String(option) === String(value) ? "selected" : ""}>${escapeHTML(labelFn(option))}</option>`).join("")}</select>`;
}

function splitMethodLabel(key) {
  return ({ even: "Even", ratio: "Ratio", percentages: "Percentages", per_segment_quantity: "Per-segment quantity", by_line: "By another line split" })[key] || key;
}

function check(name, count, where, notes) {
  return { name, count, status: count ? "needs_review" : "ok", where, notes };
}

function firstPercent(text) {
  const match = String(text).match(/(-?\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) / 100 : 0;
}

function firstMoney(text) {
  const match = String(text).match(/RM\s*(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|mil|m|thousand|k)?/i);
  if (!match) return 0;
  const raw = Number(match[1].replace(/,/g, ""));
  const unit = String(match[2] || "").toLowerCase();
  if (["million", "mil", "m"].includes(unit)) return raw * 1000;
  return raw;
}

function money(value) {
  const number = Number(value || 0);
  if (Math.abs(number) < 0.05) return "-";
  const formatted = Math.abs(number).toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  return number < 0 ? `(${formatted})` : formatted;
}

function percent(value) {
  return `${round(Number(value || 0) * 100, 1)}%`;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(Number(value || 0) * factor) / factor;
}

function clampInteger(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function negateSeries(series) {
  return Object.fromEntries(Object.entries(series || {}).map(([key, value]) => [key, -value]));
}

function cardsCsv() {
  const model = calculateModel();
  const statuses = Object.fromEntries(validateModel(model).cards.map((entry) => [entry.id, entry]));
  return toCsv([
    ["id", "category", "source_text", "enabled", "target_line", "target_years", "method", "resultant_mathematical_operand", "params", "depends_on", "status", "validation_hint"],
    ...state.cards.map((item) => {
      const status = statuses[item.id] || { status: item.status, hint: item.hint };
      const operand = getYears().map((year) => operandExpression(item, year, model)).join(" | ");
      return [item.id, item.category, item.source_text, item.enabled, item.target.line, targetYearsLabel(item.target.years), item.method, operand, JSON.stringify(item.params), JSON.stringify(item.depends_on), status.status, status.hint];
    }),
  ]);
}

function auditCsv() {
  return toCsv([["id", "timestamp", "event", "user"], ...state.audit.map((item) => [item.id, item.timestamp, item.text, item.user])]);
}

function workspacePayload() {
  return {
    schema: "abfm-workspace-v1",
    exportedAt: timestamp(),
    settings: clone(state.settings),
    lines: clone(state.lines),
    drivers: clone(state.drivers),
    cards: clone(state.cards),
    unitEconomics: clone(state.unitEconomics),
    scenarios: clone(state.scenarios || []),
    audit: clone(state.audit || []),
  };
}

function workspaceJson() {
  return JSON.stringify(workspacePayload(), null, 2);
}

function parseWorkspaceJson(text) {
  const parsed = JSON.parse(text);
  const payload = parsed.schema === "abfm-workspace-v1" ? parsed : parsed.state || parsed;
  if (!payload.settings || !payload.lines || !payload.cards) throw new Error("JSON backup is missing model data.");
  return payload;
}

function workspaceCsv() {
  const payload = workspacePayload();
  const rows = [
    ["section", "key", "json"],
    ["meta", "schema", payload.schema],
    ["meta", "exportedAt", payload.exportedAt],
    ["settings", "settings", JSON.stringify(payload.settings)],
    ...payload.lines.map((item) => ["line", item.key, JSON.stringify(item)]),
    ...payload.drivers.map((item) => ["driver", item.key, JSON.stringify(item)]),
    ...payload.cards.map((item) => ["card", item.id, JSON.stringify(item)]),
    ...payload.unitEconomics.segments.map((item) => ["segment", item.key, JSON.stringify(item)]),
    ...Object.entries(payload.unitEconomics.splits || {}).map(([key, item]) => ["split", key, JSON.stringify({ lineKey: key, ...item })]),
    ...payload.scenarios.map((item) => ["scenario", item.id, JSON.stringify(item)]),
    ...payload.audit.map((item) => ["audit", item.id, JSON.stringify(item)]),
  ];
  return toCsv(rows);
}

function parseWorkspaceCsv(text) {
  const rows = parseCsv(text).filter((row) => row.some((cell) => String(cell || "").trim()));
  if (!rows.length) throw new Error("CSV is empty.");
  const header = rows.shift().map((item) => String(item || "").trim().toLowerCase());
  const sectionIndex = header.indexOf("section");
  const keyIndex = header.indexOf("key");
  const jsonIndex = header.indexOf("json");
  if (sectionIndex < 0 || keyIndex < 0 || jsonIndex < 0) throw new Error("CSV backup must have section,key,json headers.");

  const payload = {
    settings: null,
    lines: [],
    drivers: [],
    cards: [],
    unitEconomics: { segments: [], splits: {} },
    scenarios: [],
    audit: [],
  };

  for (const row of rows) {
    const section = String(row[sectionIndex] || "").trim();
    const key = String(row[keyIndex] || "").trim();
    const raw = row[jsonIndex] || "";
    if (section === "meta") continue;
    const value = parseJsonCell(raw, section, key);
    if (section === "settings") payload.settings = value;
    else if (section === "line") payload.lines.push(value);
    else if (section === "driver") payload.drivers.push(value);
    else if (section === "card") payload.cards.push(value);
    else if (section === "segment") payload.unitEconomics.segments.push(value);
    else if (section === "split") payload.unitEconomics.splits[key || value.lineKey] = splitFromCsvValue(value);
    else if (section === "scenario") payload.scenarios.push(value);
    else if (section === "audit") payload.audit.push(value);
  }

  if (!payload.settings || !payload.lines.length || !payload.cards.length) throw new Error("CSV backup is missing settings, P&L lines, or formula cards.");
  if (!payload.unitEconomics.segments.length) payload.unitEconomics.segments = clone(DEFAULT_SEGMENTS);
  return payload;
}

function parseJsonCell(raw, section, key) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON payload for ${section}:${key}.`);
  }
}

function splitFromCsvValue(value) {
  const out = clone(value);
  delete out.lineKey;
  return out;
}

function reportHtml(scope, printMode = false) {
  const data = reportData(scope);
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHTML(scopeLabel(scope))} - ${escapeHTML(state.settings.scenarioName)}</title>
        <style>${reportStyles(printMode)}</style>
      </head>
      <body>
        <header>
          <p class="eyebrow">Assumption-Based Financial Modelling Engine</p>
          <h1>${escapeHTML(scopeLabel(scope))}</h1>
          <p>${escapeHTML(state.settings.scenarioName)} | Generated ${escapeHTML(timestamp())} | ${escapeHTML(state.settings.granularity)} breakout</p>
        </header>
        ${data.includePL ? `<section><h2>P&L</h2>${htmlTable(data.pl.headers, data.pl.rows)}</section>` : ""}
        ${data.includeUnit ? `<section><h2>Unit Economics - ${data.unit.year}</h2>${htmlTable(data.unit.matrixHeaders, data.unit.matrixRows)}</section>` : ""}
        ${data.includeUnit ? `<section><h2>Unit Economics Split Assumptions</h2>${htmlTable(data.unit.splitHeaders, data.unit.splitRows)}</section>` : ""}
        <section><h2>Explicit Formula Card Assumptions</h2>${htmlTable(data.assumptions.headers, data.assumptions.rows)}</section>
        <section><h2>Implicit Engine Assumptions and Mathematical Operands</h2>${htmlTable(data.implicit.headers, data.implicit.rows)}</section>
        ${state.settings.includeAuditTrail ? `<section><h2>Audit Trail</h2>${htmlTable(["ID", "Timestamp", "Event", "User"], state.audit.map((item) => [item.id, item.timestamp, item.text, item.user]))}</section>` : ""}
      </body>
    </html>`;
}

function reportSpreadsheetHtml(scope) {
  return reportHtml(scope).replace("<body>", "<body><p>Import this file into Google Sheets. Each report section appears as a separate table in the workbook import.</p>");
}

function reportCsv(scope) {
  const data = reportData(scope);
  const sections = [];
  if (data.includePL) sections.push(sectionCsv("P&L", data.pl.headers, data.pl.rows));
  if (data.includeUnit) sections.push(sectionCsv(`Unit Economics - ${data.unit.year}`, data.unit.matrixHeaders, data.unit.matrixRows));
  if (data.includeUnit) sections.push(sectionCsv("Unit Economics Split Assumptions", data.unit.splitHeaders, data.unit.splitRows));
  sections.push(sectionCsv("Explicit Formula Card Assumptions", data.assumptions.headers, data.assumptions.rows));
  sections.push(sectionCsv("Implicit Engine Assumptions and Mathematical Operands", data.implicit.headers, data.implicit.rows));
  if (state.settings.includeAuditTrail) sections.push(sectionCsv("Audit Trail", ["ID", "Timestamp", "Event", "User"], state.audit.map((item) => [item.id, item.timestamp, item.text, item.user])));
  return sections.join("\n\n");
}

function reportJson(scope) {
  const data = reportData(scope);
  return {
    generatedAt: timestamp(),
    scope,
    scenario: state.settings.scenarioName,
    settings: clone(state.settings),
    pl: data.includePL ? { headers: data.pl.headers, rows: data.pl.rows } : null,
    unitEconomics: data.includeUnit ? {
      year: data.unit.year,
      matrixHeaders: data.unit.matrixHeaders,
      matrixRows: data.unit.matrixRows,
      splitHeaders: data.unit.splitHeaders,
      splitRows: data.unit.splitRows,
    } : null,
    explicitFormulaCardAssumptions: data.assumptions.objects,
    implicitEngineAssumptions: data.implicit.objects,
    rawState: {
      lines: clone(state.lines),
      drivers: clone(state.drivers),
      cards: clone(state.cards),
      unitEconomics: clone(state.unitEconomics),
    },
  };
}

function reportData(scope) {
  const model = calculateModel();
  const validation = validateModel(model);
  const unit = calculateUnitEconomics(model, validation);
  const includePL = scope !== "unit";
  const includeUnit = scope !== "pl";
  const periods = getDisplayPeriods();
  const assumptionData = assumptionExportData(model, validation);
  const implicitData = implicitAssumptionData(model, unit);
  return {
    includePL,
    includeUnit,
    pl: { headers: ["Section", "Line item", ...periods.map((period) => period.label)], rows: plExportRows(model, periods) },
    unit: unitExportData(model, unit, validation),
    assumptions: assumptionData,
    implicit: implicitData,
  };
}

function plExportRows(model, periods) {
  const isMonthly = state.settings.granularity === "monthly";
  const rows = [];
  for (const item of state.lines.filter((lineItem) => lineItem.type === "revenue")) rows.push(["Revenue", item.name, ...periods.map((period) => money(periodValue(period, isMonthly ? model.period.lines[item.key] : model.annual.lines[item.key], model.annual.lines[item.key])))]);
  rows.push(["Revenue", "Total Revenue", ...periods.map((period) => money(periodValue(period, isMonthly ? model.period.revenue : model.annual.revenue, model.annual.revenue)))]);
  for (const item of state.lines.filter((lineItem) => lineItem.type === "cost")) rows.push(["Costs", item.name, ...periods.map((period) => money(periodValue(period, isMonthly ? model.period.lines[item.key] : model.annual.lines[item.key], model.annual.lines[item.key])))]);
  rows.push(["Costs", "Total Costs", ...periods.map((period) => money(-periodValue(period, isMonthly ? model.period.cost : model.annual.cost, model.annual.cost)))]);
  rows.push(["Result", "Profit / (Loss)", ...periods.map((period) => money(periodValue(period, isMonthly ? model.period.total : model.annual.total, model.annual.total)))]);
  return rows;
}

function periodValue(period, activeSeries, annualSeries) {
  return activeSeries?.[period.key] ?? annualSeries?.[period.year] ?? 0;
}

function unitExportData(model, unit, validation) {
  const year = selectedUnitYear();
  const segments = state.unitEconomics.segments;
  const matrixHeaders = ["P&L line", ...segments.map((segment) => segment.name), "Total"];
  const matrixRows = state.lines.map((lineItem) => [
    lineItem.name,
    ...segments.map((segment) => money(unit.lineSegment[lineItem.key]?.[segment.key]?.[year] || 0)),
    money(model.annual.lines[lineItem.key]?.[year] || 0),
  ]);
  matrixRows.push(["Profit / (Loss)", ...segments.map((segment) => money(unit.segmentTotal[segment.key]?.[year] || 0)), money(unit.totalByYear[year] || 0)]);

  const splitHeaders = ["P&L line", "Method", ...segments.map((segment) => segment.name), "By line", "Status", "Validation hint"];
  const splitRows = state.lines.map((lineItem) => {
    const split = splitFor(lineItem.key);
    const status = validation.splits.find((item) => item.lineKey === lineItem.key) || { status: "ok", hint: "" };
    return [
      lineItem.name,
      splitMethodLabel(split.method),
      ...segments.map((segment) => split.values?.[segment.key] ?? ""),
      split.byLine ? lineName(split.byLine) : "",
      status.status,
      status.hint,
    ];
  });
  return { year, matrixHeaders, matrixRows, splitHeaders, splitRows };
}

function assumptionExportData(model, validation) {
  const years = getYears();
  const statusMap = Object.fromEntries(validation.cards.map((item) => [item.id, item]));
  const objects = state.cards.map((item) => {
    const annual = model.cardAnnual[item.id] || blankYearSeries(years);
    const signed = signedAnnualForCard(item, annual);
    const status = statusMap[item.id] || { status: item.status, hint: item.hint || "" };
    return {
      id: item.id,
      category: item.category,
      sourceText: item.source_text,
      enabled: item.enabled,
      targetLine: lineName(item.target.line),
      targetYears: targetYearsLabel(item.target.years),
      method: item.method,
      operation: operationText(item),
      mathematicalOperand: years.map((year) => operandExpression(item, year, model)).join(" | "),
      signedImpact: years.map((year) => `${year}: ${money(signed[year] || 0)}`).join(" | "),
      status: status.status,
      validationHint: status.hint,
      params: clone(item.params),
      dependsOn: clone(item.depends_on || []),
    };
  });
  const headers = ["ID", "Category", "Source text", "Enabled", "Target line", "Target years", "Method", "Operation", "Mathematical operand", "Signed impact", "Status", "Validation hint"];
  const rows = objects.map((item) => [item.id, item.category, item.sourceText, item.enabled, item.targetLine, item.targetYears, item.method, item.operation, item.mathematicalOperand, item.signedImpact, item.status, item.validationHint]);
  return { headers, rows, objects };
}

function implicitAssumptionData(model, unit) {
  const years = getYears();
  const objects = [
    implicitAssumption("Projection breakout", `${state.settings.granularity === "monthly" ? `${state.settings.monthlyYearCount} years x 12 months` : `${state.settings.yearCount} annual years`}`, `Annual cap ${MAX_ANNUAL_YEARS}; monthly cap ${MAX_MONTHLY_YEARS}. Active years: ${years.join(", ")}.`),
    implicitAssumption("Monthly operand", "Monthly period value = annual formula-card value / 12", state.settings.granularity === "monthly" ? "Active for P&L monthly display." : "Inactive while annual breakout is selected."),
    implicitAssumption("Cost sign operand", "Displayed cost = raw cost x -1", "Costs reduce Profit / (Loss), while raw formula cards stay positive for cost input clarity."),
    implicitAssumption("Total revenue", "Total Revenue = sum of all active revenue P&L lines", years.map((year) => `${year}: ${money(model.annual.revenue[year] || 0)}`).join(" | ")),
    implicitAssumption("Total costs", "Total Costs = sum of all active cost P&L lines x -1", years.map((year) => `${year}: ${money(-(model.annual.cost[year] || 0))}`).join(" | ")),
    implicitAssumption("Profit / (Loss)", "Profit / (Loss) = Total Revenue - Total raw costs", years.map((year) => `${year}: ${money(model.annual.total[year] || 0)}`).join(" | ")),
    implicitAssumption("Unit Economics normalization", "Segment allocation weight = segment input / sum of segment inputs", "Ratios, percentages, and per-segment quantity inputs normalize so Unit Economics reconciles to the main P&L."),
    implicitAssumption("By-line split guard", "If a split references another line recursively, cycle detection falls back to even split", "Prevents circular Unit Economics allocation logic."),
    implicitAssumption("Unit Economics reconciliation", "Unit Economics total = sum of segment allocated P&L", `${selectedUnitYear()}: ${money(unit.totalByYear[selectedUnitYear()] || 0)}.`),
    implicitAssumption("Static Google export", "Google Docs = HTML import file; Google Sheets = XLS/HTML table import file", "Direct Drive creation requires Google authentication and is outside the static GitHub Pages app."),
  ];
  return {
    headers: ["Implicit assumption", "Mathematical operand / engine design", "Resulting effect"],
    rows: objects.map((item) => [item.name, item.operand, item.effect]),
    objects,
  };
}

function implicitAssumption(name, operand, effect) {
  return { name, operand, effect };
}

function htmlTable(headers, rows) {
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHTML(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function sectionCsv(title, headers, rows) {
  return toCsv([[title], headers, ...rows]);
}

function reportStyles(printMode = false) {
  return `
    body{margin:${printMode ? "28px" : "18px"};color:#1d2428;font-family:Inter,Aptos,"Segoe UI",Arial,sans-serif;font-size:12px;line-height:1.35}
    header{border-bottom:2px solid #172b4d;margin-bottom:18px;padding-bottom:10px}
    .eyebrow{margin:0 0 4px;color:#607078;font-size:10px;font-weight:800;text-transform:uppercase}
    h1{margin:0 0 4px;color:#172b4d;font-size:24px}
    h2{margin:22px 0 8px;color:#172b4d;font-size:17px;break-after:avoid}
    section{margin-bottom:18px;break-inside:avoid}
    table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:11px}
    th,td{border:1px solid #aebbb7;padding:5px 6px;vertical-align:top;text-align:left}
    th{background:#e7eeeb;color:#253138;font-weight:800}
    tr:nth-child(even) td{background:#f8fbfa}
    p{margin:0 0 8px}
  `;
}

function scopeLabel(scope) {
  if (scope === "pl") return "P&L Report";
  if (scope === "unit") return "Unit Economics Report";
  return "P&L and Unit Economics Report Pack";
}

function filenameStem(scope) {
  const prefix = scope === "pl" ? "pl" : scope === "unit" ? "unit_economics" : scope === "workspace" ? "workspace" : "pl_unit_economics";
  return `${prefix}_${String(state.settings.scenarioName || "scenario").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
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

function toCsv(rows) {
  return rows.map((row) => row.map((cell) => {
    const value = String(cell ?? "");
    return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }).join(",")).join("\n");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

function auditEntry(text, target, before, after) {
  return { id: `AUD-${String(Date.now()).slice(-6)}-${Math.floor(Math.random() * 100)}`, timestamp: timestamp(), text, target, before, after, user: USER_NAME };
}

function snapshotFrom(source) {
  return {
    settings: clone(source.settings),
    lines: clone(source.lines),
    drivers: clone(source.drivers),
    cards: clone(source.cards),
    unitEconomics: clone(source.unitEconomics),
    scenarios: clone(source.scenarios || []),
  };
}

function restoreSnapshot(snapshot) {
  const normalized = normalizeState({ ...snapshot, scenarios: snapshot.scenarios || state.scenarios, audit: state.audit });
  state.settings = clone(normalized.settings);
  state.lines = clone(normalized.lines);
  state.drivers = clone(normalized.drivers);
  state.cards = clone(normalized.cards);
  state.unitEconomics = clone(normalized.unitEconomics);
  state.scenarios = clone(normalized.scenarios || state.scenarios);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function updateButtons() {
  document.querySelector("#undoButton").disabled = undoStack.length === 0;
  document.querySelector("#redoButton").disabled = redoStack.length === 0;
  document.querySelector("#newAssumptionButton").disabled = state.settings.locked;
}

function uniqueKey(prefix, existing) {
  let index = existing.length + 1;
  let key = `${prefix}_${index}`;
  while (existing.includes(key)) {
    index += 1;
    key = `${prefix}_${index}`;
  }
  return key;
}

function nextCardId() {
  let index = state.cards.length + 1;
  let id = `FC-${String(index).padStart(3, "0")}`;
  while (state.cards.some((item) => item.id === id)) {
    index += 1;
    id = `FC-${String(index).padStart(3, "0")}`;
  }
  return id;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function timestamp() {
  const now = new Date();
  return `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("visible"), 2200);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(value);
}
