(function(){
// Geographic (GDA2020 lat/lon) → MGA2020 grid (UTM on GRS80). Krüger series, accurate to mm.
const a = 6378137, f = 1 / 298.257222101, k0 = 0.9996, FE = 500000, FN = 10000000;
function mgaZone(lon) { return Math.floor((lon + 180) / 6) + 1; }
function toMGA2020(lat, lon) {
  if (!isFinite(lat) || !isFinite(lon)) return null;
  const zone = mgaZone(lon), lon0 = (zone - 1) * 6 - 180 + 3;
  const n = f / (2 - f), n2 = n * n, n3 = n2 * n, n4 = n3 * n;
  const A = a / (1 + n) * (1 + n2 / 4 + n4 / 64);
  const al = [n / 2 - 2 * n2 / 3 + 5 * n3 / 16, 13 * n2 / 48 - 3 * n3 / 5, 61 * n3 / 240];
  const φ = lat * Math.PI / 180, λ = (lon - lon0) * Math.PI / 180;
  const e = Math.sqrt(f * (2 - f));
  const t = Math.sinh(Math.atanh(Math.sin(φ)) - e * Math.atanh(e * Math.sin(φ)));
  const ξ0 = Math.atan2(t, Math.cos(λ)), η0 = Math.atanh(Math.sin(λ) / Math.sqrt(1 + t * t));
  let ξ = ξ0, η = η0;
  for (let j = 1; j <= 3; j++) { ξ += al[j - 1] * Math.sin(2 * j * ξ0) * Math.cosh(2 * j * η0); η += al[j - 1] * Math.cos(2 * j * ξ0) * Math.sinh(2 * j * η0); }
  const E = FE + k0 * A * η, N = (lat < 0 ? FN : 0) + k0 * A * ξ;
  return { zone, easting: Math.round(E * 100) / 100, northing: Math.round(N * 100) / 100 };
}

window.SRA_G = { mgaZone, toMGA2020 };
})();
