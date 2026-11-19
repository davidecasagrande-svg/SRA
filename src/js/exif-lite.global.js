(function(){
// Minimal JPEG EXIF reader: GPS lat/lon/alt, image direction, original date. Returns {} when absent.
async function readExif(file) {
  try {
    const buf = new DataView(await file.slice(0, 256 * 1024).arrayBuffer());
    if (buf.getUint16(0) !== 0xFFD8) return {};
    let off = 2;
    while (off < buf.byteLength - 4) {
      const marker = buf.getUint16(off); const len = buf.getUint16(off + 2);
      if (marker === 0xFFE1 && buf.getUint32(off + 4) === 0x45786966) return parseTiff(buf, off + 10);
      if ((marker & 0xFF00) !== 0xFF00) break;
      off += 2 + len;
    }
  } catch (e) { /* ignore */ }
  return {};
}
function parseTiff(buf, start) {
  const le = buf.getUint16(start) === 0x4949;
  const u16 = o => buf.getUint16(o, le), u32 = o => buf.getUint32(o, le);
  const rational = o => { const n = u32(o), d = u32(o + 4); return d ? n / d : 0; };
  const readIfd = (ptr, want) => {
    const out = {}; const n = u16(ptr);
    for (let i = 0; i < n; i++) {
      const e = ptr + 2 + i * 12; const tag = u16(e), type = u16(e + 2), count = u32(e + 4);
      if (!(tag in want)) continue;
      const size = ({ 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 10: 8 })[type] * count;
      const valOff = size > 4 ? start + u32(e + 8) : e + 8;
      let val;
      if (type === 2) { let s = ''; for (let k = 0; k < count - 1; k++) s += String.fromCharCode(buf.getUint8(valOff + k)); val = s; }
      else if (type === 5 || type === 10) { val = []; for (let k = 0; k < count; k++) val.push(rational(valOff + k * 8)); }
      else if (type === 3) val = u16(valOff); else if (type === 4) val = u32(valOff); else val = buf.getUint8(valOff);
      out[want[tag]] = val;
    }
    return out;
  };
  const ifd0 = readIfd(start + u32(start + 4), { 0x8825: 'gpsIfd', 0x8769: 'exifIfd', 0x0110: 'model' });
  const res = { model: ifd0.model };
  if (ifd0.exifIfd) Object.assign(res, readIfd(start + ifd0.exifIfd, { 0x9003: 'dateTime' }));
  if (ifd0.gpsIfd) {
    const g = readIfd(start + ifd0.gpsIfd, { 1: 'latRef', 2: 'lat', 3: 'lonRef', 4: 'lon', 5: 'altRef', 6: 'alt', 16: 'dirRef', 17: 'dir' });
    const dms = a => a ? a[0] + a[1] / 60 + a[2] / 3600 : null;
    if (g.lat && g.lon) { res.lat = dms(g.lat) * (g.latRef === 'S' ? -1 : 1); res.lon = dms(g.lon) * (g.lonRef === 'W' ? -1 : 1); }
    if (g.alt) res.alt = g.alt[0] * (g.altRef === 1 ? -1 : 1);
    if (g.dir) res.direction = g.dir[0]; res.dirRef = g.dirRef;
  }
  return res;
}

window.SRA_X = { readExif };
})();
