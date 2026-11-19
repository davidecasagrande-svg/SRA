// Fills the SRA Summary Report (v3.12) template with app data and returns an .xlsx Blob.
(function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  function setCell(xml, ref, val) {
    const re = new RegExp('<c r="' + ref + '"([^>]*?)(?:/>|>[\\s\\S]*?</c>)');
    const m = xml.match(re);
    const sAttr = m ? ((m[1].match(/ s="\d+"/) || [''])[0]) : '';
    let cell;
    if (val === '' || val == null) cell = `<c r="${ref}"${sAttr}/>`;
    else if (typeof val === 'object' && val.f) cell = `<c r="${ref}"${sAttr} t="str"><f>${esc(val.f)}</f><v>${esc(val.v ?? '')}</v></c>`;
    else if (typeof val === 'number' && isFinite(val)) cell = `<c r="${ref}"${sAttr}><v>${val}</v></c>`;
    else cell = `<c r="${ref}"${sAttr} t="inlineStr"><is><t xml:space="preserve">${esc(val)}</t></is></c>`;
    if (m) return xml.replace(re, () => cell);
    // cell absent: insert into its row in column order
    const row = ref.match(/\d+$/)[0];
    const rre = new RegExp('(<row r="' + row + '"[^>]*>)([\\s\\S]*?)(</row>)');
    return xml.replace(rre, (all, a, body, z) => {
      const col = ref.replace(/\d+$/, '');
      const cells = body.match(/<c r="[A-Z]+\d+"[\s\S]*?(?:\/>|<\/c>)/g) || [];
      const colN = c => c.split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
      const i = cells.findIndex(c => colN(c.match(/r="([A-Z]+)/)[1]) > colN(col));
      if (i < 0) cells.push(cell); else cells.splice(i, 0, cell);
      return a + cells.join('') + z;
    });
  }
  function safeSheetName(n) { return (String(n || 'SRA Summary').replace(/[\[\]:*?\/\\']/g, '').slice(0, 31)) || 'SRA Summary'; }
  async function build(JSZip, cells, sheetName) {
    const T = window.SRA_XLSX; if (!T) throw new Error('SRA Summary template not loaded');
    const zip = new JSZip(); const name = safeSheetName(sheetName);
    let sheet = T.parts['xl/worksheets/sheet1.xml'];
    for (const ref in cells) sheet = setCell(sheet, ref, cells[ref]);
    for (const p in T.parts) {
      let c = p === 'xl/worksheets/sheet1.xml' ? sheet : T.parts[p];
      if (p === 'xl/workbook.xml') c = c.replace('__SHEETNAME__', esc(name)).split('__SHEET__').join(name.replace(/&/g, '&amp;'));
      zip.file(p, c);
    }
    for (const p in T.bin) zip.file(p, T.bin[p], { base64: true });
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', compression: 'DEFLATE' });
  }
  window.SRA_SUMMARY = { build, setCell };
})();
