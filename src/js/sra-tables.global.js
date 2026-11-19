(function(){
// TfNSW Guide to Slope Risk Analysis v4 — rating tables (Ch. 6–7, Appendix) + SRA Checker formulas.
const HAZARD_TYPES = {
  'Cutting / natural slope': ['Fall','Topple','Slide – rotational','Slide – translational','Boulder roll','Spread','Flow','Complex'],
  'Embankment': ['Rotational, within embankment','Rotational, through foundations','Translational','Collapse','Liquefaction','Internal erosion','Reactivation of pre-existing landslide','Spreading of foundations'],
  'Retaining structure': ['Overturning','Sliding','Bearing','Global foundation failure','Settlement','Shear failure through backfill (bulging)','Bending','Toe breakout','Anchor pullout'],
};

// Probability steps for P(d) and P(t) (Table 10 axes)
const P_STEPS = [
  {v:1,    label:'1',     sup:'',   hint:'Certain / currently active'},
  {v:0.1,  label:'10',    sup:'-1', hint:'1 in 10 per year'},
  {v:0.01, label:'10',    sup:'-2', hint:'1 in 100'},
  {v:0.001,label:'10',    sup:'-3', hint:'1 in 1,000'},
  {v:1e-4, label:'10',    sup:'-4', hint:'1 in 10,000'},
  {v:1e-5, label:'10',    sup:'-5', hint:'1 in 100,000'},
];
// Table 10: L = combined order of magnitude; L6* → L6
function likelihoodFrom(pd, pt) {
  if (pd == null || pt == null) return null;
  const e = Math.round(-Math.log10(pd)) + Math.round(-Math.log10(pt));
  return 'L' + Math.min(6, e + 1);
}
const L_HINTS = { // Table 6
  L1:'Expected within days to 2–3 yrs, or mechanism active',
  L2:'Within a few years to ~30 yrs; within inspection period under slightly adverse conditions',
  L3:'Some time over ~100 yrs; next inspection period only under adverse conditions',
  L4:'Not expected within ~100 yrs; only under very adverse conditions',
  L5:'Not expected within ~100 yrs even under very adverse conditions',
  L6:'Unlikely even under extreme circumstances',
};
const S_VOL = [ // Table 28
  {code:'S1',hint:'> 20,000 m³'},{code:'S2',hint:'2,000 – 20,000 m³'},{code:'S3',hint:'200 – 2,000 m³'},{code:'S4',hint:'20 – 200 m³'},{code:'S5',hint:'< 20 m³'}];
const S_BLOCK = [
  {code:'S1',hint:'Blocks > 1 m'},{code:'S2',hint:'0.5 – 1 m'},{code:'S3',hint:'0.2 – 0.5 m'},{code:'S4',hint:'~0.2 m'},{code:'S5',hint:'~0.1 m'}];
const R_RATES = [ // Table 29
  {code:'R1',hint:'Extremely / very rapid — 5 m/s to 3 m/min'},{code:'R2',hint:'Rapid — ~1.8 m/h'},{code:'R3',hint:'Moderate — ~13 m/month'},{code:'R4',hint:'Slow — ~1.6 m/yr'},{code:'R5',hint:'Very / extremely slow — ~16 mm/yr'}];
const T_HINTS = { // Table 11
  T1:'> 0.5 — heaviest urban traffic', T2:'0.1 – 0.5 — major urban arterials, busiest rural roads', T3:'0.01 – 0.1 — many urban arterials, most major rural arterials', T4:'0.001 – 0.01 — suburban / minor rural arterials', T5:'< 0.001 — lightly trafficked roads, shoulders'};
const V_HINTS = { // Table 16/17 abridged
  V1:'Unable to evade; block > 1 m at highway speed; deep void', V2:'May evade; block > 1 m urban or 0.5–1 m highway', V3:'Most evade; 0.5–1 m urban; loose debris at highway speed', V4:'0.5–1 m low speed; ~0.2 m highway; debris urban', V5:'~0.2 m urban; smaller blocks; irregular surface'};
const C_PROP = [ // Table 26
  {code:'C1',hint:'> $15M — total closure SN5–6 for extended period'},{code:'C2',hint:'$3M – $15M — one carriageway SN5–6 / total SN3–4 closure'},{code:'C3',hint:'$0.8M – $3M — partial/total SN3–4 closure, short period'},{code:'C4',hint:'$0.2M – $0.8M — SN2 closure, short period'},{code:'C5',hint:'< $0.2M — SN1 closure / negligible damage'}];

// Chart: vehicles per lane per day → T (Appendix, Allocation of T by traffic volume)
function tFromTraffic(aadt, lanes) {
  if (!aadt || !lanes) return null;
  const v = aadt / lanes;
  return v > 17500 ? 'T1' : v > 2600 ? 'T2' : v > 270 ? 'T3' : v > 30 ? 'T4' : 'T5';
}
const T13 = { T5:'T5', T4:'T5', T3:'T4', T2:'T3', T1:'T3' }; // direct impact by rockfall
function speedBand(kmh) { return !kmh ? null : kmh <= 50 ? 'low' : kmh < 90 ? 'urban' : 'highway'; }
// Table 14: large-scale failure — length traversed vs speed
function t14Shift(lengthM, band) {
  if (lengthM == null || !band) return 0;
  const [lo, hi] = band === 'low' ? [15,100] : band === 'urban' ? [25,250] : [60,600];
  return lengthM < lo ? +1 : lengthM > hi ? -1 : 0; // +1 = decrease T (T3→T4)
}
function modifyT(t, mode, lengthM, band) {
  if (!t) return null;
  if (mode === 'rockfall') return T13[t];
  if (mode === 'large') { const n = Math.min(5, Math.max(1, +t[1] + t14Shift(lengthM, band))); return 'T' + n; }
  return t;
}
// Tables 18–20: V from debris type × speed band (V5* → V5)
const V18 = { '>1':['V1','V2','V3'], '0.5-1':['V2','V3','V4'], '0.2-0.5':['V3','V4','V5'], '0.1-0.2':['V4','V5','V5'], '<0.1':['V5','V5','V5'] };
const V19 = { 'mixed':['V3','V4','V5'], 'small':['V5','V5','V5'] };
const V20 = { 'deep':['V1','V2','V3'], 'shallow':['V2','V3','V4'], 'stepped':['V3','V4','V5'], 'irregular':['V5','V5','V5'], 'guardfence':['V4','V4','V4'] };
const V_DEBRIS = [
  {group:'Single rock blocks (Table 18)', opts:[['>1','Block > 1 m'],['0.5-1','Block 0.5 – 1 m'],['0.2-0.5','Block 0.2 – 0.5 m'],['0.1-0.2','Block 0.1 – 0.2 m'],['<0.1','Block < 0.1 m']]},
  {group:'Mixed landslide debris (Table 19)', opts:[['mixed','Loose / wet mixed soil-rock debris'],['small','Small rock debris < 0.1 m']]},
  {group:'Voids / stepped surfaces (Table 20)', opts:[['deep','Deep narrow void'],['shallow','Shallow void (0.2 – 0.5 m step)'],['stepped','Stepped surface (0.1 – 0.2 m)'],['irregular','Irregular surface (< 0.1 m)'],['guardfence','Shallow void with guardfence / wire rope']]},
];
function vFrom(debris, band) {
  if (!debris || !band) return null;
  const row = V18[debris] || V19[debris] || V20[debris];
  return row ? row[['highway','urban','low'].indexOf(band)] : null;
}
// Table 25: consequence to life, rows V1..V5, cols T5..T1
const T25 = { V1:['C4','C3','C2','C1','C1'], V2:['C4','C3','C2','C1','C1'], V3:['C5','C4','C3','C2','C2'], V4:['C5','C5','C4','C3','C3'], V5:['C5','C5','C5','C4','C4'] };
function cLife(v, t) { return v && t ? T25[v][5 - +t[1]] : null; }
// Table 30: event magnitude rows R1..R5, cols S5..S1
const T30 = { R1:['M3','M2','M2','M1','M1'], R2:['M4','M3','M2','M2','M1'], R3:['M4','M4','M3','M2','M2'], R4:['M5','M4','M4','M3','M2'], R5:['M5','M5','M4','M4','M3'] };
function magnitude(r, sVol, sBlock) {
  const nums = [sVol, sBlock].filter(Boolean).map(s => +s[1]);
  if (!r || !nums.length) return null;
  const s = Math.min(...nums); // worst (lowest number) governs — SRA Checker MIN()
  return T30[r][5 - s];
}
// Table 31: hazard class rows L1..L6, cols M5..M1
const T31 = { L1:['H3','H2','H2','H1','H1'], L2:['H4','H3','H2','H2','H1'], L3:['H4','H4','H3','H2','H2'], L4:['H5','H4','H4','H3','H2'], L5:['H5','H5','H4','H4','H3'], L6:['H5','H5','H5','H4','H4'] };
function hazardClass(l, m) { return l && m ? T31[l][5 - +m[1]] : null; }
// Table 27: ARL rows L1..L6, cols C5..C1
const T27 = { L1:['ARL3','ARL2','ARL1','ARL1','ARL1'], L2:['ARL4','ARL3','ARL2','ARL1','ARL1'], L3:['ARL5','ARL4','ARL3','ARL2','ARL1'], L4:['ARL5','ARL5','ARL4','ARL3','ARL2'], L5:['ARL5','ARL5','ARL5','ARL4','ARL3'], L6:['ARL5','ARL5','ARL5','ARL5','ARL4'] };
function arl(l, cLifeCode, cPropCode) {
  const nums = [cLifeCode, cPropCode].filter(Boolean).map(c => +c[1]);
  if (!l || !nums.length) return null;
  return T27[l][5 - Math.min(...nums)];
}
const MATRIX = { T25, T27, T30, T31 };

// Slope Description Record "Typical Scoring" (sections B.1–K)
const SD_SCORING = {
  B1: { title:'B.1 Slope angle', opts:[['Rock ≥ 60°',10],['Rock ≥ 50°',8],['Rock ≥ 40°',5],['Rock < 40°',0],['Soil ≥ 45°',20],['Soil ≥ 35°',15],['Soil ≥ 25°',10],['Soil < 25°',5]], single:true },
  B2: { title:'B.2 Overall slope height', opts:[['> 30 m',20],['20 – 30 m',15],['10 – 20 m',10],['5 – 10 m',8],['< 5 m',0]], single:true },
  B3: { title:'B.3 Shoulder / verge width', opts:[['> 5 m',0],['2 – 5 m',5],['< 2 m',10]], single:true },
  B4: { title:'B.4 Natural slope above / below', opts:[['Rock ≥ 70°',5],['Rock ≥ 60°',4],['Rock ≥ 50°',2],['Rock < 50°',0],['Soil ≥ 45°',5],['Soil ≥ 35°',4],['Soil ≥ 25°',2],['Soil < 25°',0]], single:true },
  D:  { title:'D. Evidence of previous failures', opts:[['Any type present',5],['None / not known',0]], single:true },
  E1: { title:'E.1 Potentially adverse features', opts:[['Loose blocks / boulders',10],['Tension cracks (rock)',10],['Undercuts / overhangs / voids',10],['Sheared / fractured zones',10],['Erodible seams / beds',5],['Tension cracks (soil)',20],['Toe heave',20],['Bulging',20],['Surface deformation',10],['Number: many / major',10],['Number: some / minor',5]], max:80 },
  E2: { title:'E.2 Potentially adverse discontinuities', opts:[['Joints / planes dipping out > 30°',10],['Wedges dipping out of face',10],['Joints that might cause toppling',10],['Open / weathered / infilled',5],['Tight / clean',0],['Number: many',10],['Number: some',5]], max:45 },
  F:  { title:'F. Installed drainage', opts:[['None on slope / berm',5],['Weepholes partially / totally blocked',5],['Horizontal drains in good condition',0]], max:10 },
  G:  { title:'G. Water-carrying services', opts:[['Water mains present',5],['No stormwater drainage',5]], max:10 },
  H:  { title:'H. Infiltration potential', opts:[['Tension cracks / open joints',5],['Ponding areas',5],['Vegetation none (soil)',5],['Vegetation sparse (soil)',5],['Vegetation dense',0]], max:15 },
  I:  { title:'I. Visible seepage', opts:[['Heavy',10],['Slight',5],['Previous',5],['None',0]], single:true },
  J:  { title:'J. Condition of installed measures', opts:[['Cracking',10],['Bulging',10],['Tilting',10],['Settling',10],['Sliding',10],['Loose plate',10],['Corrosion',5],['Seepage / leakage',5],['Good condition',0],['None installed',0]], max:70 },
  K:  { title:'K. Potentially affected development', opts:[['Occupied buildings',10],['Unoccupied buildings',5],['Other roads',10],['Railways',10],['Carparks / open public spaces',5],['Telephone / power poles',5],['Private open spaces',2],['None',0]], single:true },
};
function sdScore(desc) {
  const out = {}; let total = 0;
  for (const k in SD_SCORING) {
    const sec = SD_SCORING[k]; const picked = desc?.[k] || [];
    let s = picked.reduce((a, i) => a + (sec.opts[i]?.[1] || 0), 0);
    if (sec.max != null) s = Math.min(s, sec.max);
    out[k] = s; total += s;
  }
  return { sections: out, total };
}

function fileName(site, date, suffix) { return `${String(site).padStart(6, '0')}_${date}_${suffix}`; }

// Traffic volume (veh/lane/day) → T (Appendix chart: 30 / 270 / 2 600 / 17 500)
function tFromVolume(v) { if (!v) return null; return v > 17500 ? 'T1' : v > 2600 ? 'T2' : v > 270 ? 'T3' : v > 30 ? 'T4' : 'T5'; }
// Table 11 full definitions (people in the open / buildings / road users)
const T11_DEF = [
  ['T1','> 0.5','Person usually expected to be present as part of the normal pattern of usage (e.g. residential buildings, some commercial buildings). Road users in the heaviest urban traffic.'],
  ['T2','0.1 – 0.5','Person often expected to be present as part of the normal pattern of usage (e.g. many commercial buildings). Road users on major urban arterials and the most heavily trafficked rural roads.'],
  ['T3','0.01 – 0.1','Person may sometimes be present as part of the normal pattern of usage. Road users on many urban arterials and most major rural arterials.'],
  ['T4','0.001 – 0.01','Person unlikely to be present even where there is a pattern of usage. Road users on suburban roads and minor rural arterials.'],
  ['T5','< 0.001','Person is very unlikely to be present. Road users on the most lightly trafficked roads, road shoulders etc.']];
// Table 21: resultant velocity v = √(vs² + 2gh)
function resVel(kmh, fallH) { if (fallH == null || isNaN(fallH) || kmh == null || isNaN(kmh)) return null; const vs = kmh / 3.6; return Math.sqrt(vs * vs + 2 * 9.81 * fallH); }
// Table 22: V for vehicle directly impacted by single rock blocks; cols > 25, 15 – 25, < 15 m/s
const V22 = { '>1':['V1','V1','V1'], '0.5-1':['V1','V1','V2'], '0.2-0.5':['V1','V2','V3'], '0.1-0.2':['V2','V3','V3'], '<0.1':['V3','V4','V4'] };
const BLOCK_MIN = [['>1','Min. dimension > 1 m'],['0.5-1','0.5 – 1 m'],['0.2-0.5','0.2 – 0.5 m'],['0.1-0.2','0.1 – 0.2 m'],['<0.1','< 0.1 m']];
function vDirect(block, vel) { if (!block || vel == null) return null; const row = V22[block]; return row ? row[vel > 25 ? 0 : vel >= 15 ? 1 : 2] : null; }
// Table 17 expanded vulnerability — people
const V17 = [
  { group:'People in the open', opts:[['V1','Unable to evade rockfall or other debris (very / extremely rapid), or buried'],['V2','May be able to evade debris'],['V3','Most people able to evade debris']] },
  { group:'People in buildings', opts:[['V1','Engulfed in building collapse'],['V2','Partial building collapse'],['V3','Building penetrated, no collapse'],['V4','Building struck, damaged but not penetrated'],['V5','Building struck, only minor damage']] }];
// Retaining wall failure under live load (drystone) — Tables 9 and 24; T1 required
const WALL_COND = ['Significant or major distress evident, apparently active','Significant or major distress evident, not apparently active','Minor distress evident, apparently active','Minor distress evident, not apparently active, or poorly constructed wall','Apparently well-constructed wall, no visible distress'];
const WALL_DIST = ['< H/2','H/2 – H','> H'];
const T9 = [['L1','L2','L3'],['L2','L3','L4'],['L3','L4','L5'],['L4','L5','L6'],['L5','L6','L6']];
function wallL(ci, di) { return ci == null || di == null ? null : T9[ci]?.[di] || null; }
const WALL_ANG = ['> 35°','25° – 35°','15° – 25°','< 15°'];
const T24 = [['V2','V2','V1','V1','V1'],['V3','V2','V2','V1','V1'],['V4','V3','V2','V1','V1'],['V5','V4','V3','V2','V1']];
function wallHBand(h) { return h == null || isNaN(h) ? null : h < 1 ? 0 : h < 2 ? 1 : h < 3 ? 2 : h < 4 ? 3 : 4; }
function wallV(ai, h) { const b = wallHBand(h); return ai == null || b == null ? null : T24[ai]?.[b] || null; }

window.SRA_T = { tFromVolume, T11_DEF, resVel, V22, BLOCK_MIN, vDirect, V17, WALL_COND, WALL_DIST, T9, wallL, WALL_ANG, T24, wallHBand, wallV, HAZARD_TYPES, P_STEPS, likelihoodFrom, L_HINTS, S_VOL, S_BLOCK, R_RATES, T_HINTS, V_HINTS, C_PROP, tFromTraffic, speedBand, t14Shift, modifyT, V_DEBRIS, vFrom, cLife, magnitude, hazardClass, arl, MATRIX, SD_SCORING, sdScore, fileName };
})();
