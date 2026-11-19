(function(){
// Sketch pad engine: pencil / eraser / TfNSW Guide mapping symbols (Mapping Symbols sheet, v4) + legend.
const GROUPS = [['gb','Geological boundary'],['def','Defects · dip / dip direction'],['surf','Slope surface'],['water','Water & drainage'],['fail','Failures'],['mat','Materials & structures'],['road','Road furniture'],['brg','Bridge'],['util','Services'],['ann','Annotation']];
const SYM = [
  ['gb_acc','Boundary – accurate','gb','line'],['gb_app','Boundary – approximate','gb','line'],['gb_inf','Boundary – inferred','gb','line'],
  ['bed','Bedding','def','stamp'],['joint','Joint','def','stamp'],['cleav','Cleavage','def','stamp'],['fol','Foliation','def','stamp'],['plunge','Plunge of lineation','def','stamp'],
  ['decomp','Decomposed seam/zone','def','line'],['infill','Infilled seam/zone','def','line'],['crushed','Crushed seam/zone','def','line'],['sheared','Sheared zone','def','line'],
  ['crest','Crest of cut or embankment','surf','line'],['scarp','Scarp','surf','line'],['cliff','Cliff','surf','line'],['bos_vx','Break of slope – convex','surf','line'],['bos_cc','Break of slope – concave','surf','line'],['slope','Slope angle (of facet)','surf','stamp','Slope angle (°)'],['gully','Gully erosion','surf','line'],['soil','Soil (sheet) erosion','surf','area'],
  ['wf_perm','Water flow – permanent','water','line'],['wf_int','Water flow – intermittent','water','line'],['outflow','Outflow','water','stamp'],['inflow','Inflow','water','stamp'],['seep','Seepage','water','stamp'],['seepline','Seepage line','water','line'],['pond','Standing water (pond, dam)','water','area'],['damp','Damp or wet ground','water','area'],['culv1','Culvert – single cell','water','line'],['culvN','Culvert – multi cell','water','line'],
  ['landslide','Landslide','fail','area'],['debris','Debris flow','fail','area'],['rockfall','Rock fall','fail','area'],
  ['m_rock','Rock','mat','area'],['m_soil','Soil','mat','area'],['m_ret','Retaining structure (section / outline)','mat','area'],['retwall','Retaining wall (plan trace)','mat','line'],['drystone','Dry stone wall','mat','line'],
  ['jopen','Major joint in rock face (opening mm)','def','line','Opening (mm)'],['tcrack','Tension crack (opening mm)','fail','line','Opening (mm)'],
  ['guard','Guardrail (plan)','road','line'],['guardx','Guardrail (section)','road','stamp'],['fence','Fenceline','road','line'],
  ['power','Overhead power line','util','line'],['gas','Main gas pipeline','util','line'],['wpit','Water pit / manhole','util','stamp'],['pole','Electricity pole','util','stamp'],
  ['ngl','Natural ground surface (hatched)','surf','line'],['tree','Tree / vegetation','surf','stamp'],['boulder','Boulder','surf','stamp'],
  ['m_fill','Fill','mat','area'],['rlev','Road level marker','road','stamp'],['rdend','Limit of road / break line','road','line'],
  ['pier','Bridge pier (plan)','brg','stamp'],['pierx','Bridge pier (section)','brg','line'],['wmain','Main water pipeline','util','line'],
  ['text','Text label','ann','text','Label text'],['leader','Leader label (text + arrow)','ann','text','Label text'],['dim','Dimension line','ann','line','Dimension'],['ratio','Slope ratio triangle (H:V)','ann','stamp','Ratio H:V'],['sf_s','Start of site (S)','ann','stamp'],['sf_f','Finish of site (F)','ann','stamp'],['access','Access restriction','ann','stamp','Restriction'],['north','North arrow','ann','stamp'],['photo','Photo point + bearing','ann','stamp','Photo no. (e.g. P01)'],['hazard','Hazard no. (H1…)','ann','stamp','Hazard no.'],['xsec','Cross-section line','ann','line','Section label'],
].map(([key,label,group,kind,ask]) => ({ key, label, group, kind, ask }));
const BY = Object.fromEntries(SYM.map(s => [s.key, s]));
BY.wmain.hidden = true; BY.text.hidden = true; // wmain: legacy only; text: lives on the toolbar
const SIDED = { crest:1, scarp:1, gully:1, cliff:1, ngl:1, guard:1, bos_vx:1, bos_cc:1, retwall:1, jopen:1, gb_inf:1, seepline:1 };
const ORIENT = { pier:1, bed:1, joint:1, cleav:1, fol:1, plunge:1, slope:1, outflow:1, inflow:1, seep:1, north:1, photo:1 };
const DEF_A = { north: -Math.PI / 2, seep: Math.PI / 4, outflow: Math.PI / 3, inflow: Math.PI / 3 };
const GREY = 'rgba(0,0,0,.16)';

function path(ctx, pts, close) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); if (close) ctx.closePath(); }
function resample(pts, step) {
  const out = []; if (!pts || pts.length < 2) return out; let carry = 0, s = 0;
  for (let i = 1; i < pts.length; i++) { const a = pts[i-1], b = pts[i]; const dx = b.x - a.x, dy = b.y - a.y; const L = Math.hypot(dx, dy); if (!L) continue; const ang = Math.atan2(dy, dx); let t = carry; while (t <= L) { out.push({ x: a.x + dx*t/L, y: a.y + dy*t/L, a: ang, s: s + t }); t += step; } carry = t - L; s += L; }
  const last = pts[pts.length-1], pl = out[out.length-1]; if (pl) out.push({ x: last.x, y: last.y, a: pl.a, s });
  return out;
}
const nrm = (p, d) => ({ x: p.x - Math.sin(p.a)*d, y: p.y + Math.cos(p.a)*d });
function offset(pts, d, k) { return resample(pts, 4*k).map(p => nrm(p, d)); }
function arrow(ctx, x, y, a, sz) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(a - .45)*sz, y - Math.sin(a - .45)*sz); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(a + .45)*sz, y - Math.sin(a + .45)*sz); ctx.stroke(); }
function ticks(ctx, pts, spacing, len, side) { ctx.beginPath(); resample(pts, spacing).forEach(p => { const q = nrm(p, len*side); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }); ctx.stroke(); }
function wavy(ctx, pts, amp, wl, k) { const r = resample(pts, 3*k); path(ctx, r.map(p => nrm(p, amp*Math.sin(p.s/wl*2*Math.PI)))); ctx.stroke(); return r; }
function endArrow(ctx, pts, k) { const n = pts.length; if (n < 2) return; const b = pts[n-1]; let i = n - 2; while (i > 0 && Math.hypot(b.x - pts[i].x, b.y - pts[i].y) < 12*k) i--; arrow(ctx, b.x, b.y, Math.atan2(b.y - pts[i].y, b.x - pts[i].x), 16*k); }
function tri(ctx, x, y, a, s, down) { // ▽ with apex on (x,y) pointing to +normal when down
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); if (down) { ctx.moveTo(0, 0); ctx.lineTo(-s*.6, -s); ctx.lineTo(s*.6, -s); } else { ctx.moveTo(-s*.6, 0); ctx.lineTo(s*.6, 0); ctx.lineTo(0, s); } ctx.closePath(); ctx.stroke(); ctx.restore();
}
function fillGrid(ctx, pts, step, fn) {
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  ctx.save(); path(ctx, pts, true); ctx.clip(); let row = 0;
  for (let y = y0 + step/2; y < y1; y += step, row++) for (let x = x0 + (row % 2 ? step/2 : step/4); x < x1; x += step) fn(x, y);
  ctx.restore();
}

function lettered(ctx, p, ch, k) {
  const r = resample(p, 2*k); const sp = 110*k, g = 12*k; let seg = []; const marks = [];
  const total = r.length ? r[r.length-1].s : 0; const one = total < sp; // short line: single gap at the middle
  r.forEach(q => { const m = one ? Math.abs(q.s - total/2) : Math.abs(q.s % sp - sp/2); if (m < g) { if (seg.length > 1) { path(ctx, seg); ctx.stroke(); } seg = []; if (m <= 1.2*k) marks.push(q); } else seg.push(q); });
  if (seg.length > 1) { path(ctx, seg); ctx.stroke(); }
  ctx.font = `600 ${18*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let lastS = -1e9; marks.forEach(q => { if (q.s - lastS < g) return; lastS = q.s; ctx.fillText(ch, q.x, q.y + 1*k); });
}
function renderLine(ctx, it, k) {
  const p = it.pts; if (!p || p.length < 2) return; const s = it.sym; const sd = it.side || 1;
  if (s === 'power' || s === 'gas' || s === 'wmain') { if (s === 'power') ctx.setLineDash([18*k, 7*k]); lettered(ctx, p, s === 'power' ? 'E' : s === 'gas' ? 'G' : 'W', k); ctx.setLineDash([]); return; }
  if (s === 'xsec') {
    ctx.setLineDash([22*k, 6*k, 4*k, 6*k]); path(ctx, p); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 4*k;
    const a = p[0], b = p[p.length-1]; const ang = Math.atan2(b.y - a.y, b.x - a.x); const nx = -Math.sin(ang), ny = Math.cos(ang); const T = 16*k;
    ctx.beginPath(); [a, b].forEach(q => { ctx.moveTo(q.x - nx*T, q.y - ny*T); ctx.lineTo(q.x + nx*T, q.y + ny*T); }); ctx.stroke();
    const lab = (it.t || 'A').slice(0, 3); ctx.font = `600 ${24*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(lab, a.x - Math.cos(ang)*20*k, a.y - Math.sin(ang)*20*k); ctx.fillText(lab + '′', b.x + Math.cos(ang)*22*k, b.y + Math.sin(ang)*22*k); return;
  }
  if (s === 'rdend') { ctx.lineWidth = 2.6*k; const P = 90*k, z = 9*k, hgt = 14*k; const r = resample(p, 1.5*k); const tot = r.length ? r[r.length-1].s : 0; const n = Math.max(1, Math.round(tot / P)); const per = tot / n;
    path(ctx, r.map(q => { const u = (q.s % per) - per/2; const o = u < -z || u > z ? 0 : u < -z/3 ? (u + z)/(2*z/3)*hgt : u < z/3 ? hgt - (u + z/3)/(2*z/3)*2*hgt : -hgt + (u - z/3)/(2*z/3)*hgt; return nrm(q, o); })); ctx.stroke(); return; }
  if (s === 'pierx') { const a = p[0], b = p[p.length-1]; const ang = Math.atan2(b.y - a.y, b.x - a.x); const nx = -Math.sin(ang), ny = Math.cos(ang); const w = 10*k, L = Math.hypot(b.x - a.x, b.y - a.y);
    const c = [[a, w], [b, w], [b, -w], [a, -w]].map(([q, o]) => ({ x: q.x + nx*o, y: q.y + ny*o })); ctx.lineWidth = 2.4*k; path(ctx, c, true); ctx.stroke();
    ctx.lineWidth = 1.2*k; ctx.save(); path(ctx, c, true); ctx.clip(); ctx.beginPath(); for (let t = -w*2; t < L + w*2; t += 9*k) { const q = { x: a.x + Math.cos(ang)*t, y: a.y + Math.sin(ang)*t }; ctx.moveTo(q.x + nx*w*1.2 - Math.cos(ang)*w*1.2, q.y + ny*w*1.2 - Math.sin(ang)*w*1.2); ctx.lineTo(q.x - nx*w*1.2 + Math.cos(ang)*w*1.2, q.y - ny*w*1.2 + Math.sin(ang)*w*1.2); } ctx.stroke(); ctx.restore();
    const f = 22*k; ctx.lineWidth = 2.4*k; const fc = [[b, f], [{ x: b.x + Math.cos(ang)*8*k, y: b.y + Math.sin(ang)*8*k }, f], [{ x: b.x + Math.cos(ang)*8*k, y: b.y + Math.sin(ang)*8*k }, -f], [b, -f]].map(([q, o]) => ({ x: q.x + nx*o, y: q.y + ny*o })); path(ctx, fc, true); ctx.stroke(); return; }
  if (s === 'retwall') { const w = 12*k*sd; ctx.lineWidth = 2.6*k; path(ctx, p); ctx.stroke(); path(ctx, offset(p, w, k)); ctx.stroke(); ctx.lineWidth = 1.8*k; ctx.beginPath(); resample(p, 18*k).forEach(q => { const b = nrm(q, w); ctx.moveTo(q.x, q.y); ctx.lineTo(b.x, b.y); }); ctx.stroke(); return; }
  if (s === 'ngl') { path(ctx, p); ctx.stroke(); ctx.lineWidth = 1.6*k; ctx.beginPath(); resample(p, 9*k).forEach(q => { const b = nrm(q, 12*k*sd); ctx.moveTo(q.x, q.y); ctx.lineTo(b.x - Math.cos(q.a)*7*k, b.y - Math.sin(q.a)*7*k); }); ctx.stroke(); return; }
  if (s === 'dim') { const a = p[0], b = p[p.length-1]; const ang = Math.atan2(b.y - a.y, b.x - a.x); ctx.lineWidth = 2*k; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); arrow(ctx, b.x, b.y, ang, 14*k); arrow(ctx, a.x, a.y, ang + Math.PI, 14*k); const nx = -Math.sin(ang), ny = Math.cos(ang); ctx.beginPath(); [a, b].forEach(q => { ctx.moveTo(q.x - nx*10*k, q.y - ny*10*k); ctx.lineTo(q.x + nx*10*k, q.y + ny*10*k); }); ctx.stroke();
    if (it.t) { let ra = ang; if (ra > Math.PI/2) ra -= Math.PI; if (ra < -Math.PI/2) ra += Math.PI; ctx.save(); ctx.translate((a.x + b.x)/2, (a.y + b.y)/2); ctx.rotate(ra); ctx.font = (18*k) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(it.t, 0, -6*k); ctx.restore(); } return; }
  if (s === 'drystone') { ctx.lineWidth = 2*k; const r = resample(p, 2*k); const tot = r.length ? r[r.length-1].s : 0; const L = 22*k; for (let d = L/2; d < tot; d += L) { const q = r.reduce((b, x) => Math.abs(x.s - d) < Math.abs(b.s - d) ? x : b, r[0]); ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.a); ctx.beginPath(); ctx.ellipse(0, 0, L/2 - 1*k, 6*k, 0, 0, 7); ctx.stroke(); ctx.restore(); } return; }
  if (s === 'guard') { path(ctx, p); ctx.stroke(); ctx.lineWidth = 2*k; resample(p, 26*k).forEach(q => { const a = nrm(q, -7*k*sd); ctx.fillRect(a.x - 3*k, a.y - 3*k, 6*k, 6*k); }); return; }
  if (s === 'fence') { ctx.lineWidth = 2*k; path(ctx, p); ctx.stroke(); ticks(ctx, p, 14*k, 6*k, 1); ticks(ctx, p, 14*k, 6*k, -1); return; }
  if (s === 'jopen' || s === 'tcrack') {
    const r = resample(p, 2*k); const n = r.length; if (n < 2) return;
    if (s === 'jopen') { path(ctx, p); ctx.stroke(); ctx.lineWidth = 2.4*k; [r[0], r[n-1]].forEach((q, i) => { const t = nrm(q, -14*k*sd); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(t.x, t.y); ctx.stroke(); }); }
    else { ctx.setLineDash([14*k, 26*k]); path(ctx, p); ctx.stroke(); ctx.setLineDash([]); ctx.font = `600 ${18*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; r.filter(q => (q.s % (40*k)) < 2*k && q.s > 20*k).forEach(q => { ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.a); ctx.fillText('T', 0, -1*k); ctx.restore(); }); }
    if (it.t) { const m = r[Math.floor(n/2)]; const t = nrm(m, 20*k); ctx.font = `600 ${18*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it.t, t.x, t.y); }
    return;
  }
  if (s === 'gb_app' || s === 'gb_inf' || s === 'seepline') ctx.setLineDash([14*k, 10*k]);
  if (s === 'wf_perm') { wavy(ctx, p, 6*k, 26*k, k); endArrow(ctx, p, k); return; }
  if (s === 'wf_int') { ctx.setLineDash([14*k, 9*k]); wavy(ctx, p, 6*k, 26*k, k); ctx.setLineDash([]); endArrow(ctx, p, k); return; }
  if (s === 'crushed') { const r = resample(p, 6*k); path(ctx, r.map((q, i) => nrm(q, i % 2 ? 7*k : -7*k))); ctx.stroke(); return; }
  if (s === 'decomp' || s === 'infill' || s === 'sheared') {
    const w = s === 'sheared' ? 11*k : 8*k; path(ctx, offset(p, w, k)); ctx.stroke(); path(ctx, offset(p, -w, k)); ctx.stroke();
    if (s === 'decomp') { ctx.lineWidth = 1.2*k; ticks(ctx, p, 4*k, 0, 1); ctx.beginPath(); resample(p, 4*k).forEach(q => { const a = nrm(q, w), b = nrm(q, -w); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }); ctx.stroke(); }
    if (s === 'infill') { const r = resample(p, 12*k); for (let i = 0; i < r.length - 1; i += 2) { const a = nrm(r[i], w), b = nrm(r[i], -w), c = nrm(r[i+1], -w), d = nrm(r[i+1], w); path(ctx, [a, b, c, d], true); ctx.fill(); } }
    if (s === 'sheared') { ctx.lineWidth = 1.6*k; wavy(ctx, p, 4*k, 16*k, k); }
    return;
  }
  path(ctx, p); ctx.stroke(); ctx.setLineDash([]);
  if (s === 'gb_inf') { ctx.font = `${20*k}px sans-serif`; ctx.textAlign = 'center'; resample(p, 56*k).slice(1).forEach(q => { const t = nrm(q, -10*k*sd); ctx.fillText('?', t.x, t.y); }); }
  if (s === 'crest') ticks(ctx, p, 14*k, 16*k, sd);
  if (s === 'scarp') ticks(ctx, p, 12*k, 20*k, sd);
  if (s === 'gully') ticks(ctx, p, 14*k, 14*k, sd);
  if (s === 'cliff') { path(ctx, offset(p, 16*k*sd, k)); ctx.stroke(); ctx.lineWidth = 1.6*k; ctx.beginPath(); resample(p, 10*k).forEach(q => { const b = nrm(q, 16*k*sd); ctx.moveTo(q.x, q.y); ctx.lineTo(b.x + Math.cos(q.a)*6*k, b.y + Math.sin(q.a)*6*k); }); ctx.stroke(); }
  if (s === 'bos_vx' || s === 'bos_cc') { ctx.lineWidth = 2*k; resample(p, 50*k).slice(1).forEach(q => { const qa = sd < 0 ? q.a + Math.PI : q.a; if (s === 'bos_vx') { const t = nrm(q, 0); tri(ctx, t.x, t.y, qa, 14*k, true); } else tri(ctx, q.x, q.y, qa, 14*k, false); }); }
  if (s === 'seepline') { resample(p, 46*k).forEach(q => { ctx.beginPath(); ctx.arc(q.x, q.y, 6*k, 0, 7); ctx.fill(); const a = q.a + sd*Math.PI/2.6, x2 = q.x + Math.cos(a)*22*k, y2 = q.y + Math.sin(a)*22*k; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(x2, y2); ctx.stroke(); arrow(ctx, x2, y2, a, 9*k); }); }
  if (s === 'culv1' || s === 'culvN') {
    if (s === 'culvN') { ctx.lineWidth = 2*k; path(ctx, offset(p, 7*k, k)); ctx.stroke(); path(ctx, offset(p, -7*k, k)); ctx.stroke(); }
    const r = resample(p, 4*k); const e = [[r[0], Math.PI], [r[r.length-1], 0]]; const sz = s === 'culvN' ? 20*k : 16*k;
    e.forEach(([q, flip]) => { const a = q.a + flip; ctx.beginPath(); [-.7, .7].forEach(d => { ctx.moveTo(q.x, q.y); ctx.lineTo(q.x + Math.cos(a + d)*sz, q.y + Math.sin(a + d)*sz); }); ctx.stroke(); });
  }
}
function renderArea(ctx, it, k) {
  const p = it.pts; if (!p || p.length < 3) return; const s = it.sym;
  if (s === 'landslide' || s === 'debris' || s === 'rockfall') { ctx.fillStyle = GREY; path(ctx, p, true); ctx.fill(); ctx.fillStyle = it._ink; }
  ctx.lineWidth = 2.4*k; path(ctx, p, true); ctx.stroke(); ctx.lineWidth = 1.8*k;
  if (s === 'soil') fillGrid(ctx, p, 11*k, (x, y) => { ctx.beginPath(); ctx.arc(x, y, 1.8*k, 0, 7); ctx.fill(); });
  if (s === 'pond') fillGrid(ctx, p, 56*k, (x, y) => { ctx.beginPath(); [[-12, 0], [-8, 5], [-4, 10]].forEach(([w, dy]) => { ctx.moveTo(x + w*k, y + dy*k); ctx.lineTo(x - w*k, y + dy*k); }); ctx.stroke(); tri(ctx, x, y, 0, 8*k, true); });
  if (s === 'damp') fillGrid(ctx, p, 52*k, (x, y) => { ctx.beginPath(); [-8, -3, 3, 8].forEach(d => { ctx.moveTo(x + d*.4*k, y + 6*k); ctx.lineTo(x + d*k, y - 8*k); }); ctx.stroke(); });
  if (s === 'landslide') fillGrid(ctx, p, 50*k, (x, y) => { ctx.beginPath(); ctx.arc(x, y, 10*k, .2, Math.PI - .2); ctx.stroke(); });
  if (s === 'debris') fillGrid(ctx, p, 44*k, (x, y) => { ctx.beginPath(); ctx.arc(x, y - 18*k, 26*k, .5, Math.PI - .5); ctx.stroke(); });
  if (s === 'm_rock' || s === 'm_ret') { const xs = p.map(q => q.x), ys = p.map(q => q.y); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys); ctx.save(); path(ctx, p, true); ctx.clip(); ctx.lineWidth = 1.4*k; ctx.beginPath();
    if (s === 'm_rock') { const h = 16*k, bw = 34*k; let r = 0; for (let y = y0 + h; y < y1; y += h, r++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 + (r % 2 ? bw/2 : 0); x < x1; x += bw) { ctx.moveTo(x, y); ctx.lineTo(x, y + h); } } }
    else { const st = 12*k, D = (y1 - y0); for (let x = x0 - D; x < x1; x += st) { ctx.moveTo(x, y1); ctx.lineTo(x + D, y0); } }
    ctx.stroke(); ctx.restore(); }
  if (s === 'm_fill') { const xs = p.map(q => q.x), ys = p.map(q => q.y); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys); ctx.save(); path(ctx, p, true); ctx.clip(); ctx.lineWidth = 1.4*k; ctx.beginPath(); const st = 22*k, D = y1 - y0; for (let x = x0 - D; x < x1; x += st) { ctx.moveTo(x, y1); ctx.lineTo(x + D, y0); } ctx.stroke(); ctx.restore(); }
  if (s === 'm_soil') fillGrid(ctx, p, 14*k, (x, y) => { ctx.beginPath(); if ((Math.round(x/(7*k)) + Math.round(y/(7*k))) % 3) ctx.arc(x, y, 1.6*k, 0, 7), ctx.fill(); else { ctx.arc(x, y, 3.2*k, 0, 7); ctx.stroke(); } });
  if (s === 'rockfall') fillGrid(ctx, p, 46*k, (x, y) => { ctx.beginPath(); ctx.moveTo(x - 8*k, y - 9*k); ctx.lineTo(x + 10*k, y); ctx.lineTo(x - 8*k, y + 9*k); ctx.closePath(); ctx.stroke(); });
}
function renderStamp(ctx, it, k) {
  const s = it.sym, a = it.a ?? DEF_A[s] ?? 0; const L = 30*k;
  ctx.save(); ctx.translate(it.x, it.y);
  if (s === 'pier') { ctx.rotate(a); ctx.lineWidth = 2.4*k; ctx.strokeRect(-24*k, -7*k, 48*k, 14*k); ctx.beginPath(); for (let x = -24; x < 24; x += 6) { ctx.moveTo(x*k, 7*k); ctx.lineTo((x + 6)*k, -7*k); } ctx.lineWidth = 1.2*k; ctx.stroke(); ctx.restore(); return; }
  if (s === 'wpit') { const h = 15*k; ctx.lineWidth = 2.4*k; ctx.strokeRect(-h, -h, 2*h, 2*h); ctx.beginPath(); ctx.arc(0, 0, 10*k, 0, 7); ctx.stroke(); ctx.font = `600 ${12*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('W', 0, 1*k); ctx.restore(); return; }
  if (s === 'hazard') { const t = hzLabel(it.t); ctx.font = `600 ${20*k}px sans-serif`; const w = Math.max(40*k, ctx.measureText(t).width + 14*k); ctx.lineWidth = 2.6*k; ctx.strokeRect(-w/2, -15*k, w, 30*k); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, 0, 1*k); ctx.restore(); return; }
  if (s === 'pole') { ctx.lineWidth = 2.4*k; ctx.beginPath(); ctx.arc(0, 0, 11*k, 0, 7); ctx.stroke(); ctx.beginPath(); const d = 7.8*k; ctx.moveTo(-d, -d); ctx.lineTo(d, d); ctx.moveTo(d, -d); ctx.lineTo(-d, d); ctx.stroke(); ctx.restore(); return; }
  if (s === 'tree') { ctx.lineWidth = 2*k; ctx.beginPath(); ctx.moveTo(0, 2*k); ctx.lineTo(0, 22*k); ctx.stroke(); [[0,-14],[-9,-8],[9,-8],[-6,0],[6,0]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x*k, y*k, 7*k, 0, 7); ctx.stroke(); }); ctx.restore(); return; }
  if (s === 'boulder') { ctx.lineWidth = 2.2*k; const P = [[-14,4],[-11,-7],[-2,-12],[10,-9],[15,0],[11,9],[-3,11]]; ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x*k, y*k) : ctx.moveTo(x*k, y*k)); ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1.4*k; ctx.beginPath(); ctx.moveTo(-6*k, -4*k); ctx.lineTo(2*k, 2*k); ctx.stroke(); ctx.restore(); return; }
  if (s === 'rlev') { ctx.lineWidth = 2*k; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8*k, -14*k); ctx.lineTo(8*k, -14*k); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-16*k, 0); ctx.lineTo(16*k, 0); ctx.stroke(); ctx.restore(); return; }
  if (s === 'sf_s' || s === 'sf_f') { ctx.lineWidth = 3*k; ctx.beginPath(); ctx.arc(0, 0, 11*k, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 4*k, 0, 7); ctx.fill(); ctx.font = '600 ' + (20*k) + 'px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(s === 'sf_s' ? 'S' : 'F', -10*k, -8*k); if (it.t) { ctx.font = (15*k) + 'px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(it.t, 18*k, 0); } ctx.restore(); return; }
  if (s === 'access') { ctx.lineWidth = 2.6*k; ctx.beginPath(); ctx.arc(0, 0, 12*k, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-8.5*k, 8.5*k); ctx.lineTo(8.5*k, -8.5*k); ctx.stroke(); if (it.t) { ctx.font = (17*k) + 'px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(it.t, 18*k, 0); } ctx.restore(); return; }
  if (s === 'ratio') { const m = String(it.t || '1:1').match(/([\d.]+)\s*:\s*([\d.]+)/); const hh = m ? +m[1] : 1, vv = m ? +m[2] : 1; const sc = 36*k / Math.max(hh, vv, .01); const w = hh*sc, v = vv*sc; ctx.lineWidth = 2*k; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, v); ctx.closePath(); ctx.stroke(); if (!it._noLbl) { ctx.font = (17*k) + 'px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(it.t || '1:1', -8*k, 0); } ctx.restore(); return; }
  if (s === 'guardx') { ctx.lineWidth = 2.4*k; ctx.strokeRect(-3*k, -6*k, 6*k, 28*k); ctx.beginPath(); ctx.moveTo(-14*k, 24*k); ctx.lineTo(14*k, 24*k); ctx.stroke(); ctx.fillRect(3*k, -10*k, 8*k, 12*k); ctx.restore(); return; }
  ctx.rotate(a); ctx.beginPath();
  if (['bed','joint','cleav','fol','plunge'].includes(s)) { ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke(); ctx.beginPath(); }
  if (s === 'bed') { ctx.moveTo(0, 0); ctx.lineTo(0, 12*k); ctx.stroke(); }
  if (s === 'joint') { ctx.fillRect(-8*k, -3.5*k, 16*k, 7*k); }
  if (s === 'cleav') { ctx.moveTo(-L, 0); ctx.lineTo(-L, 12*k); ctx.moveTo(L, 0); ctx.lineTo(L, 12*k); ctx.stroke(); }
  if (s === 'fol') { ctx.moveTo(-7*k, 0); ctx.lineTo(7*k, 0); ctx.lineTo(0, 12*k); ctx.closePath(); ctx.fill(); }
  if (s === 'plunge') { ctx.moveTo(0, 0); ctx.lineTo(8*k, 22*k); ctx.stroke(); arrow(ctx, 8*k, 22*k, Math.atan2(22, 8), 9*k); }
  if (s === 'slope' || s === 'north' || s === 'photo') { const x0 = s === 'photo' ? 0 : -L; ctx.moveTo(x0, 0); ctx.lineTo(L + 10*k, 0); ctx.stroke(); arrow(ctx, L + 10*k, 0, 0, 14*k); }
  if (s === 'photo') { ctx.beginPath(); ctx.arc(0, 0, 7*k, 0, 7); ctx.fill(); }
  if (s === 'seep') { ctx.arc(0, 0, 7*k, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(24*k, 0); ctx.stroke(); arrow(ctx, 24*k, 0, 0, 10*k); }
  if (s === 'outflow' || s === 'inflow') {
    const pts = []; for (let x = -L; x <= L; x += 3*k) pts.push({ x, y: Math.sin((x + L)/(18*k)*Math.PI)*5*k }); path(ctx, pts); ctx.stroke(); arrow(ctx, L, pts[pts.length-1].y, 0, 11*k);
    ctx.lineWidth = 4*k; ctx.beginPath(); if (s === 'outflow') { ctx.moveTo(-L + 4*k, 10*k); ctx.lineTo(-L - 4*k, -2*k); ctx.lineTo(-L + 8*k, -12*k); } else { ctx.moveTo(L - 8*k, 12*k); ctx.lineTo(L + 6*k, 12*k); ctx.lineTo(L + 10*k, -2*k); } ctx.stroke();
  }
  ctx.restore();
  ctx.font = `${18*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (s === 'slope' && it.t) { ctx.fillText(it.t, it.x - Math.cos(a)*L*.4 - Math.sin(a)*14*k, it.y - Math.sin(a)*L*.4 + Math.cos(a)*14*k); }
  if (s === 'north') { ctx.font = `600 ${22*k}px sans-serif`; ctx.fillText('N', it.x + Math.cos(a)*(L + 30*k), it.y + Math.sin(a)*(L + 30*k)); }
  if (s === 'photo' && it.t) { ctx.font = `600 ${18*k}px sans-serif`; ctx.fillText(it.t, it.x - Math.cos(a)*22*k, it.y - Math.sin(a)*22*k - 4*k); }
  if (DIP[s] && it.dip != null && it.dip !== '') { ctx.font = `600 ${18*k}px sans-serif`; const d = s === 'cleav' ? 28*k : 30*k; ctx.fillText(String(it.dip), it.x - Math.sin(a)*d, it.y + Math.cos(a)*d); }
}
const DIP = { bed:1, joint:1, cleav:1, fol:1 };
function hzLabel(t) { t = String(t || '1').trim(); return /^h/i.test(t) ? 'H' + t.slice(1) : 'H' + t; }
function renderMeas(ctx, it, k) {
  const p = it.pts || []; if (!p.length) return; ctx.lineWidth = 3*k; if (p.length > 1) { path(ctx, p); ctx.stroke(); }
  p.forEach(q => { ctx.beginPath(); ctx.arc(q.x, q.y, 3.5*k, 0, 7); ctx.fill(); });
  if (it.dims !== false && it.labels) { ctx.font = `${16*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i+1], lab = it.labels[i]; if (!lab) continue; const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; let nx = dy/L, ny = -dx/L; if (ny > 0 || (ny === 0 && nx > 0)) { nx = -nx; ny = -ny; }
      let ang = Math.atan2(dy, dx); if (ang > Math.PI/2) ang -= Math.PI; if (ang < -Math.PI/2) ang += Math.PI; ctx.save(); ctx.translate((a.x + b.x)/2 + nx*14*k, (a.y + b.y)/2 + ny*14*k); ctx.rotate(ang); ctx.fillText(lab, 0, 0); ctx.restore(); } }
  if (it.live) { const q = p[p.length-1]; ctx.lineWidth = 2*k; ctx.beginPath(); ctx.arc(q.x, q.y, 11*k, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(q.x - 18*k, q.y); ctx.lineTo(q.x - 13*k, q.y); ctx.moveTo(q.x + 13*k, q.y); ctx.lineTo(q.x + 18*k, q.y); ctx.moveTo(q.x, q.y - 18*k); ctx.lineTo(q.x, q.y - 13*k); ctx.moveTo(q.x, q.y + 13*k); ctx.lineTo(q.x, q.y + 18*k); ctx.stroke(); }
}
// Section sheet: one horizontal band per cross section, titled at the top of each band.
function sectionFrame(ctx, labels, scale, W, H, ink) {
  const n = (labels || []).length; if (!n) return; const bh = H / n; ctx.save(); ctx.fillStyle = ink || '#1d1f20'; ctx.strokeStyle = ink || '#1d1f20';
  labels.forEach((L, i) => { const y0 = i * bh; if (i) { ctx.lineWidth = 2; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke(); ctx.setLineDash([]); }
    ctx.font = '600 26px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const tx = `Cross section ${L}–${L}′  ·  1:${scale}`; ctx.fillText(tx, 16, y0 + 28); const w = ctx.measureText(tx).width; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(16, y0 + 46); ctx.lineTo(16 + w, y0 + 46); ctx.stroke(); });
  ctx.restore();
}
// Symbol labels that can be pulled away from their symbol; a leader arrow then points back to it.
const LBL = { slope:'t', photo:'t', sf_s:'t', sf_f:'t', access:'t', ratio:'t', jopen:'t', tcrack:'t', dim:'t', bed:'dip', joint:'dip', cleav:'dip', fol:'dip' };
function lblText(it) { const f = LBL[it.sym]; const v = f ? it[f] : ''; if (v == null || v === '') return ''; return it.sym === 'slope' ? String(v).replace(/°?$/, '°') : String(v); }
function anchor(it) { if (it.x != null) return { x: it.x, y: it.y }; const r = resample(it.pts || [], 2); if (!r.length) return (it.pts || [])[0] || { x: 0, y: 0 }; const h = r[r.length-1].s / 2; return r.reduce((b, q) => Math.abs(q.s - h) < Math.abs(b.s - h) ? q : b, r[0]); }
function lblBox(it, k) { const a = anchor(it), t = lblText(it); const w = Math.max(24, t.length * 10.5) * (k || 1), h = 24 * (k || 1); const cx = a.x + it.lo.x, cy = a.y + it.lo.y; return { a, t, cx, cy, x0: cx - w/2, x1: cx + w/2, y0: cy - h/2, y1: cy + h/2 }; }
function drawDetached(ctx, it, k, ink) { const b = lblBox(it, k); if (!b.t) return; ctx.save(); ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.font = `600 ${18*k}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.t, b.cx, b.cy);
  const dx = b.a.x - b.cx, dy = b.a.y - b.cy, D = Math.hypot(dx, dy); if (D > 34*k) { const sx = Math.max(b.x0 - 4*k, Math.min(b.x1 + 4*k, b.a.x)), sy = Math.max(b.y0 - 2*k, Math.min(b.y1 + 2*k, b.a.y)); const ex = b.a.x - dx/D*12*k, ey = b.a.y - dy/D*12*k; ctx.lineWidth = 1.6*k; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); arrow(ctx, ex, ey, Math.atan2(ey - sy, ex - sx), 12*k); }
  ctx.restore(); }
function labelHit(it, p) { if (!it || !it.lo || !LBL[it.sym]) return false; const b = lblBox(it, 1); return p.x > b.x0 - 10 && p.x < b.x1 + 10 && p.y > b.y0 - 10 && p.y < b.y1 + 10; }
function selBox(ctx, it) { let x0, y0, x1, y1; if (it.pts && it.pts.length) { const xs = it.pts.map(q => q.x), ys = it.pts.map(q => q.y); x0 = Math.min(...xs) - 18; x1 = Math.max(...xs) + 18; y0 = Math.min(...ys) - 18; y1 = Math.max(...ys) + 18; } else if (it.x != null) { x0 = it.x - 36; x1 = it.x + 36; y0 = it.y - 36; y1 = it.y + 36; } else return;
  ctx.save(); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5; ctx.strokeStyle = '#5980a6'; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); ctx.restore(); }
function render(ctx, it, k, ink) {
  k = k || 1; ink = ink || '#1d1f20';
  if (it.lo && LBL[it.sym] && !it._noLbl) { const f = LBL[it.sym]; render(ctx, it.sym === 'ratio' ? { ...it, _noLbl: 1 } : { ...it, [f]: '', _noLbl: 1 }, k, ink); drawDetached(ctx, it, k, ink); return; }
  ctx.save(); ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 3*k; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash([]); it._ink = ink;
  if (it.kind === 'pen' || it.kind === 'eraser') {
    if (it.kind === 'eraser') ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = (it.w || 3)*k; const p = it.pts || [];
    if (p.length === 1) { ctx.beginPath(); ctx.arc(p[0].x, p[0].y, ctx.lineWidth/2, 0, 7); ctx.fill(); } else { path(ctx, p); ctx.stroke(); }
  } else if (it.kind === 'text') { ctx.font = (24*k*(it.fs || 1)) + 'px sans-serif'; ctx.textBaseline = 'middle'; if (it.r) { ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.r); ctx.fillText(it.t || '', 0, 0); ctx.restore(); } else ctx.fillText(it.t || '', it.x, it.y);
    if (it.sel) { const w0 = ctx.measureText(it.t || '').width, h0 = 16*k*(it.fs || 1); ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.r || 0); ctx.setLineDash([6*k, 5*k]); ctx.lineWidth = 1.5*k; ctx.strokeStyle = '#5980a6'; ctx.strokeRect(-6*k, -h0 - 4*k, w0 + 12*k, 2*h0 + 8*k); ctx.restore(); }
    if (it.tx != null) { const w = it.r ? 0 : ctx.measureText(it.t || '').width; const inside = it.tx >= it.x && it.tx <= it.x + w; const sx = inside ? it.x + w/2 : it.tx < it.x ? it.x - 6*k : it.x + w + 6*k; const sy = inside ? (it.ty > it.y ? it.y + 14*k : it.y - 14*k) : it.y; ctx.lineWidth = 1.8*k; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(it.tx, it.ty); ctx.stroke(); arrow(ctx, it.tx, it.ty, Math.atan2(it.ty - sy, it.tx - sx), 14*k); } }
  else if (it.kind === 'line') renderLine(ctx, it, k);
  else if (it.kind === 'area') renderArea(ctx, it, k);
  else if (it.kind === 'stamp') renderStamp(ctx, it, k);
  else if (it.kind === 'meas') renderMeas(ctx, it, k);
  delete it._ink; ctx.restore();
}
const ICONS = {};
function iconCanvas(key) {
  if (ICONS[key]) return ICONS[key];
  const W = 120, H = 64, k = .55; const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d'); const d = BY[key];
  let it;
  if (d.kind === 'line') { const pts = []; for (let i = 0; i <= 20; i++) { const x = 12 + (W - 24)*i/20; pts.push({ x, y: H/2 + 6 - 12*i/20 + Math.sin(i/20*Math.PI)*-4 }); } it = { kind: 'line', sym: key, pts }; }
  else if (d.kind === 'area') { const pts = []; for (let i = 0; i < 40; i++) { const t = i/40*2*Math.PI; pts.push({ x: W/2 + Math.cos(t)*(W/2 - 8), y: H/2 + Math.sin(t)*(H/2 - 6) }); } it = { kind: 'area', sym: key, pts }; }
  else if (d.kind === 'text') it = key === 'leader' ? { kind: 'text', t: 'Abc', x: 8, y: 16, tx: 108, ty: 52 } : { kind: 'text', t: 'Abc', x: 34, y: H/2 };
  else it = { kind: 'stamp', sym: key, x: key === 'north' ? W/2 : key === 'photo' ? W/2 - 20 : W/2, y: key === 'north' ? H/2 + 18 : DIP[key] ? H/2 - 8 : H/2, a: key === 'north' ? -Math.PI/2 : key === 'seep' || key === 'plunge' ? undefined : DIP[key] ? -.35 : 0, t: key === 'slope' ? '35' : key === 'photo' ? 'P01' : key === 'hazard' ? 'H1' : '', dip: DIP[key] ? '60' : undefined };
  if (key === 'xsec') it.t = 'A'; if (key === 'jopen') it.t = '200'; if (key === 'ratio') { it.t = '1.5:1'; it.x = W/2 + 4; it.y = H/2 - 14; } if (key === 'dim') it.t = '20 m'; if (key === 'guardx') it.y = H/2 - 8;
  render(ctx, it, key === 'north' ? .42 : k, '#1d1f20');
  ICONS[key] = c; return c;
}
function icon(key) { const c = iconCanvas(key); if (!c._url) c._url = c.toDataURL('image/png'); return c._url; }
function usedSymbols(items, hide) { const seen = []; (items || []).forEach(it => { if (it.sym && it.kind !== 'text' && !seen.includes(it.sym) && !(hide || []).includes(it.sym)) seen.push(it.sym); }); return seen; }
// Hit-testing and moving drawn items (Move tool, object eraser).
function segD(p, a, b) { const dx = b.x - a.x, dy = b.y - a.y, L = dx*dx + dy*dy; const t = L ? Math.max(0, Math.min(1, ((p.x - a.x)*dx + (p.y - a.y)*dy) / L)) : 0; return Math.hypot(p.x - a.x - t*dx, p.y - a.y - t*dy); }
function inPoly(p, pts) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x)*(p.y - a.y)/(b.y - a.y) + a.x) c = !c; } return c; }
function hitTest(it, p, tol) {
  tol = tol || 16; if (!it || it.kind === 'eraser') return false;
  if (it.kind === 'text') { const f = it.fs || 1, w = Math.max(30, String(it.t || '').length * 13 * f); const c = Math.cos(-(it.r || 0)), sn = Math.sin(-(it.r || 0)); const dx = p.x - it.x, dy = p.y - it.y; const lx = dx*c - dy*sn, ly = dx*sn + dy*c; return lx > -tol && lx < w + tol && Math.abs(ly) < 14*f + tol; }
  if (it.kind === 'stamp') return Math.hypot(p.x - it.x, p.y - it.y) < 30 + tol;
  const pts = it.pts || []; if (pts.length === 1) return Math.hypot(p.x - pts[0].x, p.y - pts[0].y) < tol + (it.w || 3);
  for (let i = 1; i < pts.length; i++) if (segD(p, pts[i-1], pts[i]) < tol + (it.w || 3)/2) return true;
  if (it.kind === 'area') return segD(p, pts[pts.length-1], pts[0]) < tol || inPoly(p, pts);
  return false;
}
// Eraser on symbols: small items and labelled lines go whole; long lines / large areas lose only the rubbed part.
const WHOLE = { dim:1, xsec:1 };
function eraseItem(it, ep, r) {
  if (!it || it.kind === 'pen' || it.kind === 'eraser' || !ep || !ep.length) return null;
  const pts = it.pts || []; let big = false;
  if ((it.kind === 'line' || it.kind === 'area') && !WHOLE[it.sym] && pts.length > 1) { const xs = pts.map(q => q.x), ys = pts.map(q => q.y); big = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) > 60; }
  if (!big) return ep.some(q => hitTest(it, q, 12)) ? [] : null;
  const near = q => { if (ep.length === 1) return Math.hypot(q.x - ep[0].x, q.y - ep[0].y) < r; for (let i = 1; i < ep.length; i++) if (segD(q, ep[i-1], ep[i]) < r) return true; return false; };
  const src = it.kind === 'area' ? [...pts, pts[0]] : pts;
  const rs = resample(src, 3).map(q => ({ x: Math.round(q.x*10)/10, y: Math.round(q.y*10)/10 })); const hit = rs.map(near);
  if (!hit.some(Boolean)) return null;
  if (it.kind === 'area') { const kept = rs.filter((q, i) => !hit[i]); return kept.length >= 3 ? [{ ...it, pts: kept }] : []; }
  const runs = []; let cur = []; rs.forEach((q, i) => { if (hit[i]) { if (cur.length) runs.push(cur); cur = []; } else cur.push(q); }); if (cur.length) runs.push(cur);
  return runs.filter(r0 => r0.length >= 3).map(r0 => ({ ...it, pts: r0 }));
}
function moved(it, dx, dy) { if (it.kind === 'text' && it.tx != null) { const o = JSON.parse(JSON.stringify(it)); o.x = Math.round(o.x + dx); o.y = Math.round(o.y + dy); return o; } const o = JSON.parse(JSON.stringify(it)); if (o.x != null) { o.x = Math.round(o.x + dx); o.y = Math.round(o.y + dy); } if (o.pts) o.pts = o.pts.map(q => ({ ...q, x: Math.round((q.x + dx)*10)/10, y: Math.round((q.y + dy)*10)/10 })); return o; }
function legendHeight(keys, W) { if (!keys.length) return 0; const cols = W >= 1000 ? 3 : 2; return 70 + Math.ceil(keys.length/cols)*72; }
function drawLegend(ctx, keys, x0, y0, W) {
  if (!keys.length) return; const cols = W >= 1000 ? 3 : 2; const cw = W/cols;
  ctx.save(); ctx.fillStyle = '#1d1f20'; ctx.strokeStyle = '#1d1f20'; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 10, y0 + 6, W - 20, legendHeight(keys, W) - 16);
  ctx.font = '600 26px sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('LEGEND', x0 + 26, y0 + 36);
  keys.forEach((key, i) => { const cx = x0 + (i % cols)*cw + 20, cy = y0 + 64 + Math.floor(i/cols)*72; ctx.drawImage(iconCanvas(key), cx, cy, 120, 64); ctx.font = '20px sans-serif'; ctx.fillText(BY[key].label, cx + 130, cy + 32, cw - 160); });
  ctx.restore();
}
// Compact legend box drawn inside the sketch, anchored at its bottom-right corner (x1, y1).
function legendBox(ctx, keys, notes, x1, y1, maxW) {
  notes = notes || []; if (!keys.length && !notes.length) return; const iw = 38, ih = 20, rowH = 22, lw = 150; const cols = keys.length > 12 ? 2 : 1; const colW = iw + 10 + lw;
  const rows = Math.ceil(keys.length / cols); const w = Math.min(maxW || 1e9, Math.max(cols*colW, notes.length ? 250 : 0) + 16); const h = 26 + rows*rowH + (notes.length ? 20 + notes.length*15 : 0) + 4; const x0 = x1 - w, y0 = y1 - h;
  ctx.save(); ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = '#1d1f20'; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + .5, y0 + .5, w - 1, h - 1); ctx.fillStyle = '#1d1f20';
  ctx.font = '600 12px sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText('LEGEND', x0 + 8, y0 + 13);
  keys.forEach((key, i) => { const cx = x0 + 8 + (i % cols)*colW, cy = y0 + 24 + Math.floor(i / cols)*rowH; ctx.drawImage(iconCanvas(key), cx, cy, iw, ih); ctx.font = '11px sans-serif'; ctx.fillText(BY[key].label, cx + iw + 6, cy + ih/2, lw - 6); });
  if (notes.length) { let y = y0 + 26 + rows*rowH + 8; ctx.font = '600 11px sans-serif'; ctx.fillText('HAZARDS', x0 + 8, y); y += 15; ctx.font = '11px sans-serif'; notes.forEach(n => { ctx.fillText(n, x0 + 8, y, w - 16); y += 15; }); }
  ctx.restore();
}
function wrapChars(t, n) { const out = []; String(t || '').split(/\n/).forEach(par => { let line = ''; par.split(/\s+/).forEach(w => { if (!w) return; if ((line + ' ' + w).trim().length > n) { if (line) out.push(line); line = w; } else line = (line + ' ' + w).trim(); }); if (line) out.push(line); }); return out.slice(0, 10); }
function stripLayout(keys, hz, ph, notes, W) { const side = hz.length > 0 || ph.length > 0 || !!String(notes || '').trim(); const lw = side ? (keys.length ? Math.round(W*.58) : 0) : W; const cols = side ? 2 : 3; const rows = Math.ceil(keys.length/cols); const legH = keys.length ? 46 + rows*36 : 0; const mw = W - lw - 40; const nl = wrapChars(notes, Math.floor(mw/8)); const blk = n => n ? 34 + n*22 : 0; const sideH = side ? 14 + blk(hz.length) + blk(ph.length) + blk(nl.length) : 0; return { side, lw, cols, mw, nl, h: Math.max(legH, sideH) + 24 }; }
function stripHeight(keys, hz, ph, notes, W) { if (!keys.length && !hz.length && !ph.length && !String(notes || '').trim()) return 0; return stripLayout(keys, hz, ph, notes, W).h; }
function drawStrip(ctx, keys, hz, ph, notes, x0, y0, W) {
  if (!stripHeight(keys, hz, ph, notes, W)) return; const L = stripLayout(keys, hz, ph, notes, W);
  ctx.save(); ctx.fillStyle = '#1d1f20'; ctx.strokeStyle = '#1d1f20'; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + 10.5, y0 + .5, W - 21, L.h - 12); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  if (keys.length) { ctx.font = '600 18px sans-serif'; ctx.fillText('LEGEND', x0 + 24, y0 + 22); const cw = (L.lw - 30) / L.cols; keys.forEach((key, i) => { const cx = x0 + 24 + (i % L.cols)*cw, cy = y0 + 40 + Math.floor(i / L.cols)*36; ctx.drawImage(iconCanvas(key), cx, cy, 56, 30); ctx.font = '15px sans-serif'; ctx.fillText(BY[key].label, cx + 64, cy + 15, cw - 72); }); }
  if (L.side) { const x = x0 + L.lw + (keys.length ? 14 : 24); let y = y0 + 22; if (keys.length) { ctx.beginPath(); ctx.moveTo(x - 10, y0 + 10); ctx.lineTo(x - 10, y0 + L.h - 22); ctx.stroke(); }
    const block = (title, lines) => { if (!lines.length) return; ctx.font = '600 18px sans-serif'; ctx.fillText(title, x, y); y += 26; ctx.font = '15px sans-serif'; lines.forEach(t => { ctx.fillText(t, x, y, L.mw); y += 22; }); y += 8; };
    block('HAZARDS', hz); block('PHOTOGRAPHS', ph); block('NOTES', L.nl); }
  ctx.restore();
}
function hint(key) { const d = BY[key]; if (!d) return ''; if (DIP[key]) return 'Tap to place · then enter dip and dip direction (true north)'; if (key === 'photo') return 'Tap to place · then pick the photo — bearing comes from the photo or type it'; if (key === 'xsec') return 'Drag from one end of the section to the other · then name it (A–A′)'; if (key === 'leader') return 'Tap where the text goes · type it · then tap the feature the arrow points to'; if (key === 'dim') return 'Drag from one end to the other · then type the dimension'; if (key === 'sf_s' || key === 'sf_f') return 'Tap the ' + (key === 'sf_s' ? 'start' : 'finish') + ' of the site · its GPS coordinates (from A. Location) are written beside it'; if (key === 'ratio') return 'Tap to place · then type the ratio, e.g. 1.5:1'; if (key === 'jopen' || key === 'tcrack') return 'Drag along the trace · then enter the opening (mm)'; if (key === 'pierx') return 'Drag from the underside of the deck down to the footing'; if (key === 'pier') return 'Tap to place · drag while pressing to align it with the bridge'; if (key === 'rdend') return 'Drag across where the road (or drawing) stops — shows the cut-off, so what lies below can be drawn'; if (key === 'guardx') return 'Tap where the guardrail post sits on the section'; if (SIDED[key]) return 'Drag along the trace · then use Flip side if the symbols face the wrong way'; return d.kind === 'line' ? 'Drag to draw the line along its true trace' : d.kind === 'area' ? 'Drag to outline the area — it closes and fills on release' : d.kind === 'text' ? 'Tap where the label goes' : ORIENT[key] ? 'Tap to place · drag while pressing to set direction' : 'Tap to place'; }
window.SRA_SK = { GROUPS, SYM, BY, ORIENT, DEF_A, DIP, render, icon, iconCanvas, usedSymbols, legendHeight, drawLegend, legendBox, stripHeight, drawStrip, hzLabel, hint, sectionFrame, hitTest, moved, eraseItem, SIDED, LBL, lblText, anchor, labelHit, selBox };
})();
