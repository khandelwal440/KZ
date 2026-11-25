/* KZ paper — warm fibrous parchment with diagonal veins.
   Seeded, so the same size always draws the same sheet. The vein layout is designed on a
   1750×500 banner and stretched to whatever size is asked for.
   Used two ways:
   - tools/paper-texture.mjs renders it to assets/img/kz-paper-*.webp (the CSS backgrounds)
   - js/corridor.js draws it under the corridor walls at runtime. */

const BASE_W = 1750, BASE_H = 500;

// Left cluster, centre sweeps, right cluster: [x0, y0, x1, y1, thickness, darkness, curvePull, branches]
const VEINS = [
  [-30, 140, 130, -20, 2.2, .85, -35, 2], [-20, 240, 210, -20, 2.6, .90, -50, 3], [-10, 340, 290, -20, 2.0, .80, -40, 2],
  [10, 440, 360, -20, 2.4, .85, -55, 3], [60, 520, 440, -20, 1.5, .65, -30, 2], [140, 520, 540, -20, 2.1, .80, -45, 3],
  [230, 520, 650, -20, 1.3, .55, -25, 1],
  [360, 520, 820, -20, 1.8, .70, -40, 2], [490, 520, 960, -20, 1.4, .50, -30, 1], [640, 520, 1130, -20, 2.2, .82, -55, 3],
  [740, 520, 1240, -20, 1.2, .45, -20, 1], [910, 520, 1410, -20, 1.3, .42, -35, 1],
  [1240, 520, 1690, 20, 2.1, .82, 45, 3], [1340, 520, 1740, 10, 2.3, .85, 55, 3], [1430, 520, 1770, 80, 1.8, .75, 40, 2],
  [1510, 520, 1780, 170, 2.2, .85, 35, 2], [1590, 520, 1780, 280, 1.9, .78, 25, 2], [1670, 520, 1780, 380, 2.4, .88, 20, 1]
];

/**
 * Draw the paper onto a 2D context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W @param {number} H
 * @param {{veins?: boolean, grain?: boolean, veinAlpha?: number}} [opt]
 */
export function drawPaper(ctx, W, H, opt = {}) {
  const { veins = true, grain = true, veinAlpha = 1 } = opt;
  let seed = 4219;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const area = (W * H) / (BASE_W * BASE_H);
  const sx = W / BASE_W, sy = H / BASE_H;
  const k = Math.min(1.5, Math.max(.8, Math.sqrt(area)));   // stroke weight scale

  // 1. warm parchment gradient
  const base = ctx.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, "#e3ba86"); base.addColorStop(.35, "#ecc696"); base.addColorStop(.7, "#e2b782"); base.addColorStop(1, "#d9ab74");
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);

  // 2. mottled cloud wash
  for (let i = 0, n = Math.round(90 * area); i < n; i++) {
    const x = rand() * W, y = rand() * H, r = (80 + rand() * 220) * k;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r), light = rand() > .45;
    g.addColorStop(0, light ? "rgba(255,232,198,.14)" : "rgba(165,112,58,.12)");
    g.addColorStop(1, "rgba(227,186,134,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // 3. crinkled mulberry fibres
  ctx.lineCap = "round";
  for (let i = 0, n = Math.round(4500 * area); i < n; i++) {
    let fx = rand() * W, fy = rand() * H;
    const len = 12 + rand() * 35, a = (rand() - .5) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(fx, fy);
    for (let s = 0; s < 4; s++) {
      fx += Math.cos(a + (rand() - .5) * 1.4) * (len / 4);
      fy += Math.sin(a + (rand() - .5) * 1.4) * (len / 4);
      ctx.lineTo(fx, fy);
    }
    ctx.strokeStyle = rand() > .5 ? `rgba(255,240,215,${.08 + rand() * .12})` : `rgba(140,92,45,${.05 + rand() * .08})`;
    ctx.lineWidth = .5 + rand() * .9; ctx.stroke();
  }

  // 4. veins with soft halo + hairline branches
  if (veins) {
    ctx.save(); ctx.globalAlpha = veinAlpha;
    for (const [x0, y0, x1, y1, t, d, pull, br] of VEINS) vein(x0 * sx, y0 * sy, x1 * sx, y1 * sy, t * k, d, pull * k, br);
    ctx.restore();
  }

  // 5. surface grain
  if (grain) {
    const img = ctx.getImageData(0, 0, W, H), px = img.data;
    for (let i = 0; i < px.length; i += 4) {
      const gr = (rand() - .5) * 18;
      px[i] = clamp(px[i] + gr); px[i + 1] = clamp(px[i + 1] + gr * .9); px[i + 2] = clamp(px[i + 2] + gr * .75);
    }
    ctx.putImageData(img, 0, 0);
  }

  function vein(ax, ay, bx, by, thick, dark, pull, branches) {
    const steps = 110, pts = [];
    const c1x = ax + (bx - ax) * .33 + pull, c1y = ay + (by - ay) * .33 - pull * .4;
    const c2x = ax + (bx - ax) * .66 - pull * .5, c2y = ay + (by - ay) * .66 + pull * .3;
    let jx = 0, jy = 0;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, m = 1 - t;
      const x = m * m * m * ax + 3 * m * m * t * c1x + 3 * m * t * t * c2x + t * t * t * bx;
      const y = m * m * m * ay + 3 * m * m * t * c1y + 3 * m * t * t * c2y + t * t * t * by;
      jx = jx * .85 + (rand() - .5) * 7.5; jy = jy * .85 + (rand() - .5) * 5;
      pts.push({ x: x + jx, y: y + jy });
    }
    // halo
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.strokeStyle = `rgba(128,76,30,${dark * .22})`; ctx.lineWidth = thick * 4.5; ctx.stroke();
    // tapered core + branches
    for (let i = 0; i < pts.length - 1; i++) {
      const p = Math.sin((i / pts.length) * Math.PI) * (.6 + rand() * .8);
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
      ctx.strokeStyle = `rgba(58,31,11,${Math.min(.95, dark * (.5 + p * .6))})`;
      ctx.lineWidth = Math.max(.4, thick * p); ctx.stroke();
      if (branches > 0 && i > 15 && i < steps - 15 && rand() < .045) {
        const n = 18 + Math.floor(rand() * 28);
        let x = pts[i].x, y = pts[i].y;
        const a = Math.atan2(pts[i + 1].y - y, pts[i + 1].x - x) + (rand() - .5) * .7;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let b = 0; b < n; b++) { x += Math.cos(a + (rand() - .5) * .8) * 3.2; y += Math.sin(a + (rand() - .5) * .8) * 3.2; ctx.lineTo(x, y); }
        ctx.strokeStyle = `rgba(68,38,14,${dark * .55})`; ctx.lineWidth = thick * .45; ctx.stroke();
      }
    }
  }
}

const clamp = v => (v < 0 ? 0 : v > 255 ? 255 : v);
