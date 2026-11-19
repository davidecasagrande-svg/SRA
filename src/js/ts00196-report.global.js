(function () {
// TS 00196 outputs: slope hazard and risk register (.xlsx) and Slope Inspection Report (.pdf), contents per Appendix A.

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
const colName = i => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };

// Register columns (Appendix A "slope hazard and risk register")
const REG_COLS = [
  ['Hazard', 8], ['Hazard type', 18], ['Failure mechanism', 22], ['Failure trigger', 20], ['Element at risk', 16], ['Interaction type', 11],
  ['Hazard scale (S / D / M)', 11], ['Velocity (R)', 9], ['Temporal probability (T)', 11], ['Pd', 9], ['Pt (Pt1×Pt2×…)', 12], ['Pt method / basis', 26],
  ['Pd × Pt', 10], ['Likelihood (L)', 10], ['Safety consequence (Cq)', 12], ['Cq basis', 30], ['Safety risk rating', 10], ['TERM level', 12],
  ['Indicative remediation cost', 13], ['Risk management / remediation options', 36]];

function sheetXml(rows, widths, headRows) {
  const cols = '<cols>' + widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('') + '</cols>';
  const body = rows.map((r, ri) => `<row r="${ri + 1}">` + r.map((v, ci) => { const ref = colName(ci) + (ri + 1); const st = ri < headRows ? 1 : 2;
    if (v === '' || v == null) return `<c r="${ref}" s="${st}"/>`; if (typeof v === 'number' && isFinite(v)) return `<c r="${ref}" s="${st}"><v>${v}</v></c>`;
    return `<c r="${ref}" s="${st}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`; }).join('') + '</row>').join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="${headRows}" topLeftCell="A${headRows + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols}<sheetData>${body}</sheetData><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`;
}
async function buildRegisterXlsx(JSZip, meta, rows) {
  const z = new JSZip();
  z.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>');
  z.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
  z.file('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Hazard and risk register" sheetId="1" r:id="rId1"/><sheet name="Inspection details" sheetId="2" r:id="rId2"/></sheets></workbook>');
  z.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
  z.file('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8EEF4"/></patternFill></fill></fills><borders count="2"><border/><border><left style="thin"><color rgb="FF9AA5B1"/></left><right style="thin"><color rgb="FF9AA5B1"/></right><top style="thin"><color rgb="FF9AA5B1"/></top><bottom style="thin"><color rgb="FF9AA5B1"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
  const reg = [REG_COLS.map(c => c[0]), ...rows.map(r => REG_COLS.map(c => r[c[0]] ?? ''))];
  z.file('xl/worksheets/sheet1.xml', sheetXml(reg, REG_COLS.map(c => c[1]), 1));
  const det = [['Item', 'Value'], ...meta.map(([k, v]) => [k, v ?? ''])];
  z.file('xl/worksheets/sheet2.xml', sheetXml(det, [38, 80], 1));
  return z.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', compression: 'DEFLATE' });
}

// ---------- Slope Inspection Report (PDF) ----------
async function buildSIR(PL, o) {
  // o: { meta: [[k,v]], rows (register objects), overall: {rating, level, resp, review, line}, nonSafety: [[k,v]], siteText, sdBytes, title }
  const doc = await PL.PDFDocument.create(); const F = await doc.embedFont(PL.StandardFonts.Helvetica); const FB = await doc.embedFont(PL.StandardFonts.HelveticaBold);
  const clean = x => String(x ?? '').replace(/[^\x20-\x7E -ÿ\n–—‘’“”•×]/g, s => ({ '≤': '<=', '≥': '>=', '→': '->', '⁻': '-', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁰': '0', '√': 'sqrt', '·': '-' }[s] ?? ''));
  const wrap = (txt, w, sz, f = F) => { const out = []; clean(txt).split('\n').forEach(par => { let line = ''; par.split(/\s+/).filter(Boolean).forEach(word => { const t2 = line ? line + ' ' + word : word; if (f.widthOfTextAtSize(t2, sz) > w && line) { out.push(line); line = word; } else line = t2; }); out.push(line); }); return out; };
  const ink = PL.rgb(0.1, 0.11, 0.12), grey = PL.rgb(0.4, 0.42, 0.45), line = PL.rgb(0.62, 0.66, 0.7), band = PL.rgb(0.91, 0.93, 0.96);
  let pageNo = 0; const pages = [];
  const header = (pg, W, H) => { pageNo++; pages.push(pg); pg.drawText(clean(o.title), { x: 40, y: H - 30, size: 8.5, font: F, color: grey }); pg.drawText('Slope Inspection Report · TS 00196:1.0 Slope Risk Management', { x: W - 40 - F.widthOfTextAtSize('Slope Inspection Report · TS 00196:1.0 Slope Risk Management', 8.5), y: H - 30, size: 8.5, font: F, color: grey }); pg.drawLine({ start: { x: 40, y: H - 36 }, end: { x: W - 40, y: H - 36 }, thickness: 0.5, color: line }); };
  // page 1: details
  let W = 595.28, H = 841.89; let pg = doc.addPage([W, H]); header(pg, W, H); let y = H - 70;
  pg.drawText('Slope Inspection Report', { x: 40, y, size: 20, font: FB, color: ink }); y -= 18;
  pg.drawText(clean(o.subtitle || ''), { x: 40, y, size: 10, font: F, color: grey }); y -= 26;
  if (o.overall?.rating) { pg.drawRectangle({ x: 40, y: y - 46, width: W - 80, height: 50, color: band }); pg.drawText(clean(o.overall.rating), { x: 52, y: y - 34, size: 28, font: FB, color: ink });
    pg.drawText(clean(`Overall slope risk rating · ${o.overall.level}`), { x: 120, y: y - 16, size: 11, font: FB, color: ink }); wrap(o.overall.line, W - 180, 9).slice(0, 2).forEach((l, i) => pg.drawText(l, { x: 120, y: y - 30 - i * 11, size: 9, font: F, color: ink })); y -= 64; }
  const kv = (k, v) => { const lines = wrap(v || '—', W - 80 - 180, 9.5); if (y - lines.length * 12 < 50) { pg = doc.addPage([W, H]); header(pg, W, H); y = H - 60; }
    pg.drawText(clean(k), { x: 40, y, size: 9.5, font: FB, color: ink }); lines.forEach((l, i) => pg.drawText(l, { x: 220, y: y - i * 12, size: 9.5, font: F, color: ink })); const bot = y - (Math.max(1, lines.length) - 1) * 12 - 5; pg.drawLine({ start: { x: 40, y: bot }, end: { x: W - 40, y: bot }, thickness: 0.3, color: line }); y = bot - 13; };
  const sect = t => { if (y < 90) { pg = doc.addPage([W, H]); header(pg, W, H); y = H - 60; } y -= 6; pg.drawText(clean(t), { x: 40, y, size: 12, font: FB, color: ink }); y -= 16; };
  sect('Inspection details'); o.meta.forEach(([k, v]) => kv(k, v));
  if (o.siteText?.length) { sect('Site description (summary)'); o.siteText.forEach(([k, v]) => kv(k, v)); }
  if (o.overall?.rating) { sect('Overall risk and minimum response (Tables 18–19)'); kv('Response', o.overall.resp); kv('Minimum review', o.overall.review); (o.nonSafety || []).forEach(([k, v]) => kv(`Non-safety · ${k}`, v)); }
  // register pages (landscape)
  const cols = [['Haz', 30], ['Type / mechanism / trigger', 120], ['Element / X', 62], ['Scale / R / T', 58], ['Pd', 36], ['Pt / basis', 96], ['L', 26], ['Cq / basis', 120], ['Rating', 40], ['Cost', 40], ['Options', 134]];
  W = 841.89; H = 595.28; pg = doc.addPage([W, H]); header(pg, W, H); y = H - 62;
  pg.drawText('Slope hazard and risk register', { x: 40, y, size: 13, font: FB, color: ink }); y -= 18;
  const head = () => { let x = 40; pg.drawRectangle({ x: 40, y: y - 6, width: W - 80, height: 18, color: band }); cols.forEach(([t, w]) => { pg.drawText(t, { x: x + 3, y: y, size: 8, font: FB, color: ink }); x += w; }); y -= 14; };
  head();
  o.rows.forEach(r => { const cells = [String(r.Hazard), [r['Hazard type'], r['Failure mechanism'], r['Failure trigger'] ? 'Trigger: ' + r['Failure trigger'] : ''].filter(Boolean).join('\n'), `${r['Element at risk']}\n${String(r['Interaction type']).split(' – ')[0]}`,
      `${r['Hazard scale (S / D / M)']}\n${r['Velocity (R)']}\n${r['Temporal probability (T)']}`, String(r.PdTxt), `${r.PtTxt}${r['Pt method / basis'] ? '\n' + r['Pt method / basis'] : ''}`, r['Likelihood (L)'], `${r['Safety consequence (Cq)']}\n${r['Cq basis']}`, r['Safety risk rating'], r['Indicative remediation cost'], r['Risk management / remediation options']];
    const wrapped = cells.map((c, i) => wrap(c || '—', cols[i][1] - 6, 7.5)); const hgt = Math.max(...wrapped.map(w => w.length)) * 9 + 6;
    if (y - hgt < 40) { pg = doc.addPage([W, H]); header(pg, W, H); y = H - 60; head(); }
    let x = 40; wrapped.forEach((ls, i) => { ls.forEach((l, j) => pg.drawText(l, { x: x + 3, y: y - j * 9, size: 7.5, font: i === 8 ? FB : F, color: ink })); x += cols[i][1]; });
    y -= hgt; pg.drawLine({ start: { x: 40, y: y + 6 }, end: { x: W - 40, y: y + 6 }, thickness: 0.3, color: line }); });
  if (!o.rows.length) pg.drawText('No hazards recorded.', { x: 40, y: y - 4, size: 9, font: F, color: grey });
  // site description record, sketches and photos appended
  if (o.sdBytes) { const sd = await PL.PDFDocument.load(o.sdBytes); const cp = await doc.copyPages(sd, sd.getPageIndices()); cp.forEach(p2 => { doc.addPage(p2); }); }
  const total = doc.getPageCount(); pages.forEach((p2, i) => { const { width: W2 } = p2.getSize(); const t = `Page ${i + 1} of ${total}`; p2.drawText(t, { x: W2 - 40 - F.widthOfTextAtSize(t, 8), y: 20, size: 8, font: F, color: grey }); });
  return doc.save();
}

window.TS196R = { REG_COLS, buildRegisterXlsx, buildSIR };
})();
