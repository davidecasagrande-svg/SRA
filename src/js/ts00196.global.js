(function () {
// TS 00196:1.0 Slope Risk Management (TfNSW, effective 15 June 2026).
// Tables reproduced from the standard (© State of NSW through Transport for NSW 2026). Section / table numbers as in the standard.

const MODES = [
  { k: 'road', label: 'Road', hint: 'Vehicles on the road (Appendix E)' },
  { k: 'rail', label: 'Rail', hint: 'Trains: heavy rail, metro, light rail (Appendix F)' },
  { k: 'open', label: 'Persons in the open', hint: 'Footpaths, shared paths, platforms, public open space (Appendix G, X5a)' },
  { k: 'bldg', label: 'Persons in buildings', hint: 'Buildings below or above the slope (Appendix G, X5b)' },
];

// Figures 4–6: spatial interaction types
const X_TYPES = {
  road: [
    { k: 'X1', label: 'X1', hint: 'Moving vehicle collides with stationary rock fall debris or landslide debris' },
    { k: 'X2', label: 'X2', hint: 'Moving vehicle struck by falling rock (single blocks), impact above sill height' },
    { k: 'X3', label: 'X3', hint: 'Vehicle crossing embankment falls into a void (landslide or scour) or traverses a stepped surface' },
    { k: 'X4', label: 'X4', hint: 'Moving vehicle struck by rapidly moving landslide debris (large scale, S1/R1 only)' },
  ],
  rail: [
    { k: 'X1', label: 'X1', hint: 'Moving train collides with stationary rock fall debris or landslide debris' },
    { k: 'X2', label: 'X2', hint: 'Moving train struck by falling rock (single blocks)' },
    { k: 'X3', label: 'X3', hint: 'Train crossing embankment falls into a void (landslide or scour) or traverses stepped surface / track movement' },
    { k: 'X4', label: 'X4', hint: 'Moving train struck by rapidly moving landslide debris' },
  ],
  open: [{ k: 'X5a', label: 'X5a', hint: 'People in the open' }],
  bldg: [{ k: 'X5b', label: 'X5b', hint: 'People in buildings' }],
};

// Table 22 (= Table 3): scale of hazard for X1, X2, X4, X5
const S = [
  { k: 'S1', vol: '>20,000 m³', block: '>1 m (e.g. one rock 1 × 1 × 2 m)', debris: 'Blocks >1 m minimum dimension' },
  { k: 'S2', vol: '>2,000 m³', block: '0.5 m to 1 m', debris: 'Blocks 0.5 m to 1 m minimum dimension' },
  { k: 'S3', vol: '>200 m³', block: '0.2 m to 0.5 m', debris: 'Blocks 0.2 m to 0.5 m; loose or wet mixed soil/rock' },
  { k: 'S4', vol: '>20 m³', block: '0.1 m to 0.2 m', debris: 'Blocks 0.1 m to 0.2 m minimum dimension' },
  { k: 'S5', vol: '<20 m³', block: '<0.1 m', debris: 'Blocks <0.1 m minimum dimension' },
];
// Table 23: road embankment (X3)
const D = [
  { k: 'D1', label: 'Deep, narrow void >0.5 m', hint: 'Interventions not in place before vehicles arrive (rapid failure)' },
  { k: 'D2', label: 'Shallow void 0.2 m to 0.5 m', hint: 'Interventions not in place before vehicles arrive (rapid failure)' },
  { k: 'D3', label: 'Shallow void 0.2–0.5 m with guard fence or wire rope barrier', hint: 'Shallow void develops rapidly but a barrier is present' },
  { k: 'D4', label: 'Stepped surface, 0.1 m to 0.2 m steps', hint: 'No risk management interventions implemented' },
  { k: 'D5', label: 'Irregular surface, steps <0.1 m', hint: 'No risk management interventions implemented' },
];
// Table 24: rail embankment (X3)
const M = [
  { k: 'M1', label: '>100% of normal limit, or sudden void', hint: 'Track movement as a % of normal limit over 6 months' },
  { k: 'M2', label: '>50% but <100% of normal limit', hint: 'Track movement as a % of normal limit over 6 months' },
  { k: 'M3', label: '>25% but <50% of normal limit', hint: 'Track movement as a % of normal limit over 6 months' },
];
// Table 30: velocity of failure
const R = [
  { k: 'R1a', label: 'Extremely rapid', hint: '>5 m/s' },
  { k: 'R1b', label: 'Very rapid', hint: '3 m/minute to 5 m/s' },
  { k: 'R2', label: 'Rapid', hint: '1.8 m/hour to 3 m/minute' },
  { k: 'R3', label: 'Moderate', hint: '13 m/month to 1.8 m/hour' },
  { k: 'R4', label: 'Slow', hint: '1.6 m/year to 13 m/month' },
  { k: 'R5a', label: 'Very slow', hint: '16 mm/year to 1.6 m/year' },
  { k: 'R5b', label: 'Extremely slow', hint: '<16 mm/year' },
];
const rGroup = r => !r ? null : /^R1|^R2/.test(r) ? 'R12' : 'R345';
// Table 25 (road), 26 (rail), 27 (persons in the open)
const T_ROAD = [
  { k: 'T1', p: '>0.5', hint: '>20,000 vehicles/lane/day' }, { k: 'T2', p: '0.1 to 0.5', hint: '3,000 to 20,000 vehicles/lane/day' },
  { k: 'T3', p: '0.01 to 0.1', hint: '300 to 3,000 vehicles/lane/day' }, { k: 'T4', p: '0.001 to 0.01', hint: '30 to 300 vehicles/lane/day' },
  { k: 'T5', p: '<0.001', hint: '<30 vehicles/lane/day' }];
const T_RAIL = [
  { k: 'T1', p: '>0.5', hint: 'Temporal probability of 1.0 adopted for regional and suburban heavy rail and metro' },
  { k: 'T2', p: '0.1 to 0.5', hint: 'Not used for rail' }, { k: 'T3', p: '0.01 to 0.1', hint: 'Not used for rail' },
  { k: 'T4', p: '0.001 to 0.01', hint: 'Not used for rail' }, { k: 'T5', p: '<0.001', hint: 'Not used for rail' }];
const T_OPEN = [
  { k: 'T1', p: '>0.5', hint: 'Usually expected to be present as part of the normal pattern of usage' },
  { k: 'T2', p: '0.1 to 0.5', hint: 'Often expected to be present as part of the normal pattern of usage' },
  { k: 'T3', p: '0.01 to 0.1', hint: 'May sometimes be expected to be present as part of the normal pattern of usage' },
  { k: 'T4', p: '0.001 to 0.01', hint: 'Unlikely to be present even where there is a pattern of usage' },
  { k: 'T5', p: '<0.001', hint: 'Very unlikely to be present' }];
const T_BLDG = T_OPEN.map(t => ({ ...t, hint: 'Choose from the NCC building class (Table 29)' }));
const tFromVol = v => v == null || !isFinite(v) ? null : v > 20000 ? 'T1' : v > 3000 ? 'T2' : v > 300 ? 'T3' : v > 30 ? 'T4' : 'T5';
// Table 29: NCC building classes → indicative occupancy probability
const NCC = [
  ['1a', 'House – single dwelling (detached, townhouse, row house)', 'T1–T2'], ['1b', 'House – boarding/guest house, short-term holiday (<300 m², <12 people)', 'T1'],
  ['2', 'Apartment / multi-unit residential', 'T1–T2'], ['3', 'Other residential – hostel, backpackers, dormitory, workers’ quarters', 'T1'],
  ['4', 'Sole dwelling within a Class 5–9 building (caretaker)', 'T1–T2'], ['5', 'Offices', 'T2'], ['6', 'Shops, restaurants, cafes, service station', 'T2'],
  ['7a', 'Storage – carparks', 'T4'], ['7b', 'Storage – warehouses, wholesale display', 'T2–T3'], ['8', 'Factory, workshop, processing', 'T2'],
  ['9a', 'Public building – hospitals, clinics', 'T1'], ['9b', 'Assembly – schools, universities, childcare, sport, public transport buildings', 'T1–T3'],
  ['9c', 'Residential care – aged care', 'T1'], ['10a', 'Non-habitable – sheds, carports, private garages', 'T4'], ['10b', 'Non-habitable – fence, mast, antenna, retaining wall, pool', 'T5'],
  ['10c', 'Non-habitable – private bushfire shelter', 'T5']];
// Table 31: resultant velocity class from v = √(vs² + 2gh) (matches Table 31; Vr1 >25 m/s, Vr2 15–25 m/s, Vr3 <15 m/s)
const resVel = (kmh, fallH) => (fallH == null || !isFinite(fallH) || kmh == null || !isFinite(kmh)) ? null : Math.sqrt((kmh / 3.6) ** 2 + 2 * 9.81 * fallH);
const vrClass = v => v == null ? null : v > 25 ? 'Vr1' : v >= 15 ? 'Vr2' : 'Vr3';
const speedCol = kmh => kmh == null || !isFinite(kmh) || !kmh ? null : kmh > 90 ? 0 : kmh >= 60 ? 1 : 2;   // >90 | 60–90 | <60 km/h
const SPEED_LBL = ['>90 km/h', '60–90 km/h', '<60 km/h'];
const ti = t => t ? +t[1] - 1 : null;
const cq = n => 'Cq' + n;
// Appendix E — roads. Rows → [speed col][T1..T5] as Cq numbers
const T32 = { // X1, single block (rows S1..S5; R1/R2)
  S1: [[1, 1, 2, 3, 4], [1, 1, 2, 3, 4], [2, 2, 3, 4, 5]], S2: [[1, 1, 2, 3, 4], [2, 2, 3, 4, 5], [3, 3, 4, 5, 5]],
  S3: [[2, 2, 3, 4, 5], [3, 3, 4, 5, 5], [4, 4, 5, 5, 5]], S4: [[3, 3, 4, 5, 5], [4, 4, 5, 5, 5], [4, 4, 5, 5, 5]], S5: [[4, 4, 5, 5, 5], [4, 4, 5, 5, 5], [4, 4, 5, 5, 5]] };
const T33 = { // X1, mixed landslide debris
  mixed: [[2, 2, 3, 4, 5], [3, 3, 4, 5, 5], [4, 4, 5, 5, 5]], small: [[4, 4, 5, 5, 5], [4, 4, 5, 5, 5], [4, 4, 5, 5, 5]] };
const T34 = { // X2 (rows S; columns Vr1, Vr2, Vr3)
  S1: [[2, 2, 3, 4, 4], [2, 2, 3, 4, 4], [2, 2, 3, 4, 4]], S2: [[2, 2, 3, 4, 4], [2, 2, 3, 4, 4], [2, 2, 3, 4, 4]], S3: [[2, 2, 3, 4, 4], [2, 2, 3, 4, 4], [3, 3, 4, 5, 5]],
  S4: [[2, 2, 3, 4, 4], [3, 3, 4, 5, 5], [3, 3, 4, 5, 5]], S5: [[3, 3, 4, 5, 5], [4, 4, 5, 5, 5], [4, 4, 5, 5, 5]] };
const T35 = { // X3 road (rows D)
  D1: [[1, 1, 2, 3, 4], [1, 1, 2, 3, 4], [2, 2, 3, 4, 5]], D2: [[1, 1, 2, 3, 4], [2, 2, 3, 4, 5], [3, 3, 4, 5, 5]], D3: [[3, 3, 4, 5, 5], [3, 3, 4, 5, 5], [4, 4, 5, 5, 5]],
  D4: [[2, 2, 3, 4, 5], [3, 3, 4, 5, 5], [4, 4, 5, 5, 5]], D5: [[4, 4, 5, 5, 5], [4, 4, 5, 5, 5], [4, 4, 5, 5, 5]] };
// Table 36: X4 roads, length bands per speed column: short | medium | long
const T36_BANDS = [[60, 600], [25, 250], [15, 100]];
const T36 = { short: [1, 2, 3, 4, 4], medium: [[1, 1, 2, 3, 4], [1, 1, 2, 3, 4], [2, 2, 3, 4, 5]], long: [1, 1, 1, 2, 3] };
// Appendix F — rail
const T37 = { S1: 1, S2: 2, S3: 3, S4: 4, S5: 6 };
const T38 = { S1: [1, 1, 1], S2: [1, 1, 1], S3: [2, 1, 1], S4: [3, 2, 2], S5: [4, 3, 3] };   // columns Vr1, Vr2, Vr3
const T39 = { M1: 0, M2: 1, M3: 2 };
// Appendix G — persons
const EVADE = [
  { k: 'unable', label: 'Unable to evade rockfall or other debris', r: 'R1/R2', row: [1, 1, 2, 3, 4] },
  { k: 'may', label: 'May be able to evade debris', r: 'R2–R5', row: [1, 1, 2, 3, 4] },
  { k: 'most', label: 'Most people able to avoid debris', r: 'R2–R5', row: [2, 2, 3, 4, 5] }];
const BLDG = [
  { k: 'buried', label: 'Buried or engulfed in building collapse', r: 'R1/R2', row: [1, 1, 2, 3, 4] },
  { k: 'partial', label: 'Partial building collapse', r: 'R1/R2', row: [1, 1, 2, 3, 4] },
  { k: 'penetrated', label: 'Building penetrated, no collapse, emergency evacuation possible', r: 'Varies', row: [2, 2, 3, 4, 5] },
  { k: 'damaged', label: 'Building struck, damaged but not penetrated', r: 'Varies', row: [3, 3, 4, 5, 5] },
  { k: 'minor', label: 'Building struck, only minor damage', r: 'Varies', row: [4, 4, 5, 5, 5] }];

// Table 8: probability of a hazard event, Pd
const PD = [
  { v: 1, label: '1', sup: '', cond: 'Mechanism apparent and appears imminent, or detachment currently active', prev: 'Earlier repeated failures of the same type', prog: 'Very small further progression needed', trig: 'Short return period (e.g. 1-in-1-year storm)' },
  { v: 0.1, label: '10', sup: '-1', cond: 'Mechanism apparent; active or could be activated, but not imminent; past distress possible', prev: 'Slopes in place for decades show occasional previous failures', prog: 'Failure within a few years to a few decades at current rate', trig: 'Fairly common event (e.g. 1-in-10-year storm)' },
  { v: 0.01, label: '10', sup: '-2', cond: 'Mechanism apparent but failure not imminent; past distress possible', prev: 'Slopes >30 years old can show an earlier failure', prog: 'Substantial further development needed', trig: 'Severe event (e.g. 1-in-100-year storm)' },
  { v: 0.001, label: '10', sup: '-3', cond: 'Mechanism can be identified but failure not imminent', prev: 'Constructed slopes show no evidence of this type; old failures on natural slopes', prog: 'Very substantial development or acceleration needed', trig: 'Unusually severe event' },
  { v: 0.0001, label: '10', sup: '-4', cond: 'Mechanism deduced from slope features / geology', prev: 'Comparable slopes in the same area can show previous failures', prog: 'Ancient processes; age used to infer', trig: 'Extreme event' },
  { v: 0.00001, label: '10', sup: '-5', cond: 'Mechanism deduced from features / geology', prev: 'Some comparable slopes in the same area show failures', prog: 'Deduced from long-term slope evolution only', trig: 'Most extreme event (e.g. PMF, MCE)' }];
// Table 43 / 10: likelihood ratings (annual probability L = Pd × Pt). Decade values fall on the lower bound of each band.
const L_BANDS = [
  { k: 'L1', min: 0.8, range: '>0.8', hint: 'Almost certain within the next year (>80% probability)' },
  { k: 'L2', min: 0.5, range: '0.5 to 0.8', hint: 'Very likely within the next year (50% to 80% probability)' },
  { k: 'L3', min: 0.1, range: '0.1 to 0.5', hint: 'Likely within the next year (10% to 50%), expected within the next 10 years' },
  { k: 'L4', min: 0.04, range: '0.04 to 0.1', hint: 'Unlikely within the next year unless slightly adverse circumstances (4% to 10%), expected within 10 to 25 years' },
  { k: 'L5', min: 0.01, range: '0.01 to 0.04', hint: 'Very unlikely within the next year except in adverse circumstances, expected within 100 years' },
  { k: 'L6', min: 0.001, range: '0.001 to 0.01', hint: 'Almost unprecedented in the next year except under adverse circumstances; may occur within 100 to 1000 years' },
  { k: 'L7', min: 0, range: '<0.001', hint: 'Unlikely within the next 1000 years except under very adverse circumstances' }];
const likelihood = p => { if (p == null || !isFinite(p)) return null; const e = 1e-9; for (const b of L_BANDS) if (p >= b.min - e * b.min) return b.k; return 'L7'; };
// Table 44 / 16: risk rating (rows L1..L7, columns Cq6..Cq0)
const RISK = {
  L1: ['D1', 'C2', 'B1', 'A', 'A', 'A', 'A'], L2: ['D1', 'C2', 'B2', 'B1', 'A', 'A', 'A'], L3: ['D1', 'C2', 'C2', 'B2', 'B1', 'A', 'A'],
  L4: ['D2', 'D1', 'C2', 'C1', 'B1', 'B1', 'A'], L5: ['D2', 'D2', 'D1', 'C2', 'C1', 'B1', 'B1'], L6: ['D2', 'D2', 'D2', 'D1', 'C2', 'C1', 'B1'],
  L7: ['D2', 'D2', 'D2', 'D2', 'D1', 'C2', 'B2'] };
const riskOf = (L, Cq) => L && Cq ? RISK[L][6 - +Cq.slice(2)] : null;
const RANK = ['A', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
const worst = list => list.filter(Boolean).sort((a, b) => RANK.indexOf(a) - RANK.indexOf(b))[0] || null;
// Table 18 / 19: TERM risk tolerance and minimum response
const TERM = {
  A: { level: 'Very High', tol: 'Generally intolerable', review: 'Monthly update of risk register by the risk owner', resp: 'Very High risks are generally intolerable and should be avoided except in extraordinary circumstances. An alternative solution shall be found and all necessary steps taken to reduce the risk below this level without delay. Secretary approval required to accept.' },
  B: { level: 'High', tol: 'Undesirable', review: 'Monthly update of risk register by the risk owner', resp: 'High risks are undesirable. They can be tolerated if it is not reasonably practicable to reduce the risk further. High risks shall be given immediate priority. Direct report to the Secretary required to accept.' },
  C: { level: 'Medium', tol: 'Tolerable', review: 'Two-monthly update of risk register by the risk owner', resp: 'Medium risks are tolerable if it is not reasonably practicable to reduce the risk further. Additional treatment should be sought if significant benefit can be demonstrated or a measure is recognised as good practice.' },
  D: { level: 'Low', tol: 'Broadly acceptable', review: 'Quarterly update of risk register by the risk owner', resp: 'Low risks are acceptable. If options for further risk reduction exist and costs are proportionate to the benefit, implementation should be considered.' } };
const termOf = r => r ? TERM[r[0]] : null;
// Table 11: consequence descriptors
const CQ = [
  ['Cq0', 'Disastrous', 'Greater than 10 fatalities (category added by TS 00196; not defined in TERM)'],
  ['Cq1', 'Catastrophic', 'Multiple fatalities or more than 20 serious injuries or illnesses'],
  ['Cq2', 'Severe', 'Single fatality, or 10 to 20 serious injuries or illnesses, or both'],
  ['Cq3', 'Major', '1 to 10 serious injuries or illnesses to staff, customers or community'],
  ['Cq4', 'Moderate', 'Minor injuries or illnesses requiring medical treatment'],
  ['Cq5', 'Minor', 'Injury or illness requiring first aid'],
  ['Cq6', 'Insignificant', 'Incident, or injury/illness not requiring treatment']];
// Table 14: indicative remediation costs (2024 AUD) to reduce to D1 or better
const COST = [
  { k: '>$10M', hint: 'Complete reconstruction or realignment of the entire site; options, approvals, extensive investigation, detailed design, ongoing monitoring' },
  { k: '>$2M', hint: 'Reconstruction or realignment of a significant length; options, approvals, investigation, detailed design, likely monitoring' },
  { k: '>$500k', hint: 'Treatment of individual or multiple hazards within the existing footprint; limited investigation and design, some specialist input' },
  { k: '>$50k', hint: 'Localised treatment of multiple hazards with simple techniques defined from visual observation; limited specialist input' },
  { k: '<$50k', hint: 'Localised treatment or monitoring of individual hazards; work most likely done by maintenance crews' }];
// TERM non-safety categories (Section 9 / Table 15)
const NONSAFETY = ['Reputation and integrity', 'Everyday service delivery', 'Integrated planning', 'Project delivery', 'New service introduction', 'People', 'Technology', 'Financial sustainability', 'Environment', 'Regulation and compliance', 'Infrastructure asset management'];

// Figure 10: Pt for small rock falls/slides — boundaries digitised from the figure (ratio L/H vs slope angle)
const F10 = { // angle → L/H on each boundary curve
  a: [38, 45, 50, 55, 60, 65, 70, 75, 80, 85],
  b001: [0.43, 0.68, 0.80, 0.87, 0.89, 0.89, 0.86, 0.78, 0.67, 0.55],
  b01: [0.12, 0.27, 0.38, 0.50, 0.58, 0.60, 0.57, 0.48, 0.37, 0.25],
  b1: [0.04, 0.07, 0.10, 0.12, 0.15, 0.18, 0.20, 0.18, 0.13, 0.07] };
const interp = (xs, ys, x) => { if (x <= xs[0]) return ys[0]; if (x >= xs[xs.length - 1]) return ys[ys.length - 1]; for (let i = 1; i < xs.length; i++) if (x <= xs[i]) { const t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + t * (ys[i] - ys[i - 1]); } };
const ptFig10 = (angle, LH) => { if (angle == null || LH == null || !isFinite(angle) || !isFinite(LH) || angle < 30) return null;
  if (LH < interp(F10.a, F10.b1, angle)) return 1; if (LH < interp(F10.a, F10.b01, angle)) return 0.1; if (LH < interp(F10.a, F10.b001, angle)) return 0.01; return 0.001; };

// Safety consequence for one hazard (Appendix C process). ctx: { speed (km/h), length (m) }
function consequence(h, ctx) {
  const n = h.n6 || {}; const mode = n.mode; const X = n.X; const T = n.T; const t = ti(T); const sc = speedCol(+ctx.speed); const why = [];
  if (!mode || !X) return { Cq: null, table: null, why: ['Choose the element at risk and interaction type'] };
  if (t == null) return { Cq: null, table: null, why: ['Choose the temporal probability T'] };
  if (mode === 'road') {
    if (X === 'X1') { if (sc == null) return { Cq: null, table: 'T32', why: ['Posted speed needed (A. Location)'] };
      if (n.debris === 'mixed' || n.debris === 'small') return { Cq: cq(T33[n.debris][sc][t]), table: 'T33', why: [`Table 33 · ${n.debris === 'mixed' ? 'loose or wet mixed soil/rock' : 'small rock debris <0.1 m'} · ${SPEED_LBL[sc]} · ${T}`] };
      if (!n.S) return { Cq: null, table: 'T32', why: ['Choose the scale of hazard S'] };
      return { Cq: cq(T32[n.S][sc][t]), table: 'T32', why: [`Table 32 · single block ${n.S} · ${SPEED_LBL[sc]} · ${T}`] }; }
    if (X === 'X2') { const v = resVel(+ctx.speed, n.fallH === '' || n.fallH == null ? null : +n.fallH); const vr = vrClass(v);
      if (!n.S) return { Cq: null, table: 'T34', why: ['Choose the scale of hazard S'] }; if (!vr) return { Cq: null, table: 'T34', why: ['Enter the fall height (and posted speed) for the resultant velocity'] };
      return { Cq: cq(T34[n.S][+vr[2] - 1][t]), table: 'T34', vr, v, why: [`Table 34 · ${n.S} · ${vr} (${v.toFixed(1)} m/s) · ${T}`] }; }
    if (X === 'X3') { if (sc == null) return { Cq: null, table: 'T35', why: ['Posted speed needed (A. Location)'] }; if (!n.D) return { Cq: null, table: 'T35', why: ['Choose the void / step category D'] };
      return { Cq: cq(T35[n.D][sc][t]), table: 'T35', why: [`Table 35 · ${n.D} · ${SPEED_LBL[sc]} · ${T}`] }; }
    if (X === 'X4') { if (sc == null) return { Cq: null, table: 'T36', why: ['Posted speed needed (A. Location)'] }; const len = +ctx.length; if (!isFinite(len) || !ctx.length) return { Cq: null, table: 'T36', why: ['Enter the landslide length (m)'] };
      const [lo, hi] = T36_BANDS[sc]; const band = len < lo ? 'short' : len > hi ? 'long' : 'medium'; const row = band === 'medium' ? T36.medium[sc] : T36[band];
      if (n.S && n.S !== 'S1') why.push('Table 36 applies only to S1/R1 hazards'); return { Cq: cq(row[t]), table: 'T36', why: [`Table 36 · length ${len} m (${band === 'short' ? '<' + lo : band === 'long' ? '>' + hi : lo + '–' + hi} m at ${SPEED_LBL[sc]}) · ${T}`, ...why] }; }
  }
  if (mode === 'rail') {
    if (X === 'X1' || X === 'X4') { if (!n.S) return { Cq: null, table: 'T37', why: ['Choose the scale of hazard S'] }; let c = T37[n.S]; const w = [`Table 37 · ${X} · ${n.S} → Cq${c}`];
      if (X === 'X4') { const len = +ctx.length; if (ctx.length && isFinite(len)) { const m = len < 25 ? 1 : len > 250 ? -1 : 0; if (m) { c = Math.max(0, Math.min(6, c + m)); w.push(`Table 40 modifier ${m > 0 ? '+1' : '−1'} (length ${len} m) → Cq${c}`); } } else w.push('Enter the failure length for the Table 40 modifier'); }
      return { Cq: cq(c), table: X === 'X4' ? 'T40' : 'T37', why: w }; }
    if (X === 'X2') { const v = resVel(+ctx.speed, n.fallH === '' || n.fallH == null ? null : +n.fallH); const vr = vrClass(v);
      if (!n.S) return { Cq: null, table: 'T38', why: ['Choose the scale of hazard S'] }; if (!vr) return { Cq: null, table: 'T38', why: ['Enter the fall height and line speed for the resultant velocity'] };
      return { Cq: cq(T38[n.S][+vr[2] - 1]), table: 'T38', vr, v, why: [`Table 38 · ${n.S} · ${vr} (${v.toFixed(1)} m/s)`] }; }
    if (X === 'X3') { if (!n.M) return { Cq: null, table: 'T39', why: ['Choose the rail movement category M'] }; return { Cq: cq(T39[n.M]), table: 'T39', why: [`Table 39 · ${n.M}`] }; }
  }
  if (mode === 'open') { const e = EVADE.find(x => x.k === n.evade); if (!e) return { Cq: null, table: 'T41', why: ['Choose how likely people are to evade the debris'] }; return { Cq: cq(e.row[t]), table: 'T41', why: [`Table 41 · ${e.label} · ${T}`] }; }
  if (mode === 'bldg') { const e = BLDG.find(x => x.k === n.bImpact); if (!e) return { Cq: null, table: 'T42', why: ['Choose the indicative impact to the building'] }; return { Cq: cq(e.row[t]), table: 'T42', why: [`Table 42 · ${e.label} · ${T}`] }; }
  return { Cq: null, table: null, why: [] };
}
function compute(h, ctx) {
  if (!h) return {}; const n = h.n6 || {};
  const pd = h.pd == null ? null : +h.pd; const ptParts = [h.pt, ...(n.ptx || [])].filter(v => v != null && v !== '').map(Number);
  const pt = h.pt == null ? null : ptParts.reduce((a, b) => a * b, 1);
  const p = pd != null && pt != null ? pd * pt : null; const L = likelihood(p);
  const c = consequence(h, ctx); const CqAuto = c.Cq; const Cq = n.cqOvr || CqAuto;
  const rating = riskOf(L, Cq);
  return { pd, pt, p, L, CqAuto, Cq, cqOvr: !!n.cqOvr, cTable: c.table, why: c.why, vr: c.vr, v: c.v, rating, term: termOf(rating) };
}
const fmtP = p => p == null ? '—' : p >= 0.1 ? String(+p.toPrecision(2)) : p.toExponential(0).replace('e-', ' × 10⁻').replace(/(\d)$/, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).replace(/⁻(\d)(\d)/, (m, a, b) => '⁻' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[a] + '⁰¹²³⁴⁵⁶⁷⁸⁹'[b]);

// ---------- Reference sheets (shown in the app) ----------
const row5 = arr => arr.map(cq);
const REF = {
  N8: { title: 'TS 00196 Table 8 · Likelihood assessment criteria — Pd', note: 'Annual probability of a hazard event (detachment). Use several lines of evidence; estimates are rarely better than one order of magnitude (Section 7.1).', cols: ['Pd', 'Current slope condition', 'Previous failures', 'Progress of mechanism', 'Possible trigger'], rows: PD.map(p => [p.v === 1 ? '1' : '1×10' + p.sup, p.cond, p.prev, p.prog, p.trig]) },
  N10: { title: 'TS 00196 Figure 10 · Travel distance probability Pt — small rock falls or slides', note: 'Use only where the failure is a rock fall or slide, the debris cannot fill the shoulder, and the slope geometry is normal (Section 7.3.1). L = a (toe to edge of corridor or element at risk); with a catch ditch and d > w/3: L = a + 2w for slope angles ≤65°, L = a + w for >65°. The app reads the zone from B. Geometry (slope angle, L/H). Conditional probabilities multiply: Pt = Pt1 × Pt2 × … (Section 7.3.2). State the basis of Pt in the report.', cols: ['Zone on Figure 10 (ratio L/H)', 'Pt'], rows: [['Below the lowest curve', '1'], ['Between the lowest and middle curves', '0.1'], ['Between the middle and upper curves', '0.01'], ['Above the upper curve', '0.001 and less']] },
  N43: { title: 'TS 00196 Table 43 · Likelihood ratings (L = Pd × Pt)', note: 'Decade values (1, 0.1, 0.01, 0.001) fall on the lower bound of a band in this app: 0.1 → L3, 0.01 → L5, 0.001 → L6.', cols: ['Annual probability', 'L', 'Meaning'], rows: L_BANDS.map(b => [b.range, b.k, b.hint]) },
  N11: { title: 'TS 00196 Table 11 · TERM safety consequence descriptors', cols: ['Cq', 'Category', 'Descriptor'], rows: CQ },
  N22: { title: 'TS 00196 Table 22 · Scale of hazard (X1, X2, X4, X5)', cols: ['S', 'Volume of failure', 'Individual block (min. dimension)', 'Landslide / collapsed wall debris'], rows: S.map(s => [s.k, s.vol, s.block, s.debris]) },
  N23: { title: 'TS 00196 Table 23 · Road embankment — void / step (X3)', cols: ['D', 'Depth of void, height of step', 'Intervention'], rows: D.map(d => [d.k, d.label, d.hint]) },
  N24: { title: 'TS 00196 Table 24 · Rail embankment — rail movement (X3)', cols: ['M', 'Track movement as % of normal limit over 6 months'], rows: M.map(m => [m.k, m.label]) },
  N25: { title: 'TS 00196 Tables 25–27 · Temporal (spatial impact) probability', note: 'Road: vehicles per lane per day for the lane(s) the hazard reaches. Rail: T1 (1.0) adopted for regional and suburban heavy rail and metro. Persons in the open: normal pattern of usage. Persons in buildings: Table 29.', cols: ['T', 'Probability', 'Road (veh/lane/day)', 'Persons in the open'], rows: T_ROAD.map((t, i) => [t.k, t.p, t.hint.replace(' vehicles/lane/day', ''), T_OPEN[i].hint]) },
  N29: { title: 'TS 00196 Table 29 · NCC building classes — indicative occupancy (T)', cols: ['Class', 'Building', 'T'], rows: NCC },
  N30: { title: 'TS 00196 Table 30 · Velocity of failure', cols: ['R', 'Description', 'Typical velocity'], rows: R.map(r => [r.k, r.label, r.hint]) },
  N31: { title: 'TS 00196 Table 31 · Resultant velocity Vr (X2)', note: 'Vr = √(vs² + 2gh), vs = speed of the element at risk, h = fall height. Vr1 >25 m/s · Vr2 15–25 m/s · Vr3 <15 m/s. The app calculates Vr from the posted speed and fall height; this reproduces Table 31.', cols: ['Speed m/s (km/h)', '5 m', '10 m', '15 m', '20 m', '25 m'], rows: [[0, 0], [13.9, 50], [16.7, 60], [19.4, 70], [22.2, 80], [25, 90]].map(([ms, kmh]) => [`${ms} (${kmh})`, ...[5, 10, 15, 20, 25].map(hh => vrClass(resVel(kmh, hh)))]) },
  T32: { title: 'TS 00196 Table 32 · Roads X1 — vehicle collides with stationary rockfall block (R1/R2)', cols: ['S', ...['>90', '60–90', '<60'].flatMap(s => ['T1', 'T2', 'T3', 'T4', 'T5'].map(t => `${s} ${t}`))], rows: Object.entries(T32).map(([k, v]) => [k, ...v.flat().map(cq)]) },
  T33: { title: 'TS 00196 Table 33 · Roads X1 — vehicle collides with mixed landslide debris', cols: ['Debris', ...['>90', '60–90', '<60'].flatMap(s => ['T1', 'T2', 'T3', 'T4', 'T5'].map(t => `${s} ${t}`))], rows: [['Loose or wet mixed soil/rock', ...T33.mixed.flat().map(cq)], ['Small rock debris (<0.1 m)', ...T33.small.flat().map(cq)]] },
  T34: { title: 'TS 00196 Table 34 · Roads X2 — vehicle struck by falling rock (R1/R2)', cols: ['S', ...['Vr1', 'Vr2', 'Vr3'].flatMap(s => ['T1', 'T2', 'T3', 'T4', 'T5'].map(t => `${s} ${t}`))], rows: Object.entries(T34).map(([k, v]) => [k, ...v.flat().map(cq)]) },
  T35: { title: 'TS 00196 Table 35 · Roads X3 — void or step in embankment', note: 'D1–D3: R1/R2 · D4–D5: R4/R5.', cols: ['D', ...['>90', '60–90', '<60'].flatMap(s => ['T1', 'T2', 'T3', 'T4', 'T5'].map(t => `${s} ${t}`))], rows: Object.entries(T35).map(([k, v]) => [k, ...v.flat().map(cq)]) },
  T36: { title: 'TS 00196 Table 36 · Roads X4 — direct impact by large-scale landslide (S1/R1 only)', cols: ['Length >90 km/h', '60–90 km/h', '<60 km/h', 'T1', 'T2', 'T3', 'T4', 'T5'], rows: [['<60 m', '<25 m', '<15 m', ...row5(T36.short)], ['60–600 m', '', '', ...row5(T36.medium[0])], ['', '25–250 m', '', ...row5(T36.medium[1])], ['', '', '15–100 m', ...row5(T36.medium[2])], ['>600 m', '>250 m', '>100 m', ...row5(T36.long)]] },
  T37: { title: 'TS 00196 Table 37 · Rail X1 and X4', cols: ['Interaction', 'S', 'Cq'], rows: Object.entries(T37).map(([k, v]) => ['X1/X4', k, cq(v)]) },
  T38: { title: 'TS 00196 Table 38 · Rail X2', cols: ['S', 'Vr >25 m/s', 'Vr 15–25 m/s', 'Vr <15 m/s'], rows: Object.entries(T38).map(([k, v]) => [k, ...v.map(cq)]) },
  T39: { title: 'TS 00196 Table 39 · Rail X3', cols: ['M', 'Cq'], rows: Object.entries(T39).map(([k, v]) => [k, cq(v)]) },
  T40: { title: 'TS 00196 Table 40 · Rail X4 — modifier by length of failure', note: 'Example: a 700 m hazard rated Cq4 becomes Cq3 (a lower number is a worse consequence). Combined with Table 37.', cols: ['Length of failure', 'Modifier Mc'], rows: [['<25 m', '+1'], ['25–250 m', '0'], ['>250 m', '−1']] },
  T41: { title: 'TS 00196 Table 41 · Persons in the open (X5a)', cols: ['Likelihood to evade', 'R', 'T1', 'T2', 'T3', 'T4', 'T5'], rows: EVADE.map(e => [e.label, e.r, ...row5(e.row)]) },
  T42: { title: 'TS 00196 Table 42 · Persons in buildings (X5b)', cols: ['Impact to building', 'R', 'T1', 'T2', 'T3', 'T4', 'T5'], rows: BLDG.map(e => [e.label, e.r, ...row5(e.row)]) },
  N44: { title: 'TS 00196 Table 44 · Risk rating for slopes', note: 'Rows L, columns Cq. The overall slope rating is the worst of the safety rating of every hazard and any non-safety ratings (Section 11).', cols: ['L \\ Cq', 'Cq6', 'Cq5', 'Cq4', 'Cq3', 'Cq2', 'Cq1', 'Cq0'], rows: Object.entries(RISK).map(([k, v]) => [k, ...v]) },
  N19: { title: 'TS 00196 Tables 18–19 · TERM risk tolerance and minimum response', cols: ['Rating', 'TERM level', 'Response', 'Review'], rows: Object.entries(TERM).map(([k, v]) => [k === 'A' ? 'A' : `${k}1 or ${k}2`, `${v.level} (${v.tol})`, v.resp, v.review]) },
  N14: { title: 'TS 00196 Table 14 · Indicative remediation costs (2024 AUD)', note: 'Cost of works to reduce the risk rating to D1 or better.', cols: ['Cost', 'Typical works'], rows: COST.map(c => [c.k, c.hint]) },
};

window.TS196 = { MODES, X_TYPES, S, D, M, R, rGroup, T_ROAD, T_RAIL, T_OPEN, T_BLDG, tFromVol, NCC, resVel, vrClass, speedCol, SPEED_LBL, PD, L_BANDS, likelihood, RISK, riskOf, RANK, worst, TERM, termOf, CQ, COST, NONSAFETY, ptFig10, consequence, compute, fmtP, REF };
})();
