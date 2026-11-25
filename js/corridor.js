/* KZ Corridor — a hand-drawn 3D haveli corridor. Scroll walks you forward, doors open into rooms.
   All textures are drawn at runtime with rough.js in the KAAFIZYADA palette (no external art). */
import * as THREE from "./three.module.min.js";
import { drawPaper } from "./paper.js";

const C = { rani: "#c10046", cream: "#f3ecdc", teal: "#009e9e", plum: "#501943", blue: "#003b8b", orange: "#fc5425", sun: "#ffd166", ink: "#2b1630" };
const W = 6, H = 4.2, START_Z = 4.5, END_Z = -37.5;

export const DOORS = [
  { id: "story", label: "Our Story", sub: "04 — who we are", side: -1, z: -6, color: C.teal, panel: C.orange },
  { id: "world", label: "The Gallery", sub: "05 — enter our world", side: 1, z: -12, color: C.blue, panel: C.sun },
  { id: "tv", label: "Tune into KZ", sub: "06 — channel KZ", side: -1, z: -18.5, color: C.orange, panel: C.teal },
  { id: "shop", label: "The Shop", sub: "07 — the drop", side: 1, z: -25, color: C.rani, panel: C.cream },
  { id: "scrapbook", label: "Scrapbook", sub: "08 — leave a note", side: -1, z: -31.5, color: C.plum, panel: C.sun },
  { id: "final", label: "Final Frame", sub: "09 — phir milenge", side: 0, z: -40, color: C.rani, panel: C.sun }
];

/* ---------------- canvas texture helpers ---------------- */
function cnv(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function tex(c, rep) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
let seed = 11;
const o = (x = {}) => Object.assign({ seed: ++seed, stroke: C.ink, strokeWidth: 2, roughness: 1.4, bowing: 1.2 }, x);

function floorTex() {
  const c = cnv(1024, 1024), g = c.getContext("2d"), rc = rough.canvas(c);
  g.fillStyle = "#e7cba0"; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 8; i++) {
    const x = i * 128;
    g.fillStyle = i % 2 ? "#e2c294" : "#ebd2aa"; g.fillRect(x, 0, 128, 1024);
    rc.line(x, 0, x, 1024, o({ strokeWidth: 2.4 }));
    const cut = (i * 377) % 1024; rc.line(x, cut, x + 128, cut, o({ strokeWidth: 2 }));
    for (let k = 0; k < 6; k++) { const yy = (k * 173 + i * 61) % 1024; rc.curve([[x + 20, yy], [x + 60, yy + 30], [x + 108, yy + 10]], o({ strokeWidth: .8, stroke: "#9b7448", roughness: 2 })); }
  }
  return tex(c, [3, 14]);
}
function rugTex() {
  const c = cnv(512, 1024), g = c.getContext("2d"), rc = rough.canvas(c);
  const bands = [C.rani, C.orange, C.sun, C.teal, C.blue, C.plum];
  g.fillStyle = C.rani; g.fillRect(0, 0, 512, 1024);
  for (let y = 0; y < 1024; y += 128) {
    bands.forEach((b, i) => { g.fillStyle = b; g.fillRect(40, y + i * 21, 432, 21); });
    rc.polygon([[256, y + 18], [300, y + 64], [256, y + 110], [212, y + 64]], o({ fill: C.cream, fillStyle: "solid", strokeWidth: 2 }));
  }
  g.fillStyle = C.cream; for (let y = 0; y < 1024; y += 16) { g.fillRect(6, y, 22, 8); g.fillRect(484, y + 8, 22, 8); }
  rc.rectangle(34, -10, 444, 1044, o({ strokeWidth: 3 }));
  return tex(c, [1, 10]);
}
function wallTex() {
  const c = cnv(1024, 720), g = c.getContext("2d"), rc = rough.canvas(c);
  drawPaper(g, 1024, 720);
  rc.rectangle(-10, 470, 1044, 260, o({ fill: C.rani, fillStyle: "hachure", hachureGap: 7, fillWeight: 2.2, strokeWidth: 2.5 }));
  g.fillStyle = C.teal; g.fillRect(0, 452, 1024, 22); rc.line(0, 452, 1024, 452, o()); rc.line(0, 474, 1024, 474, o());
  for (let x = 16; x < 1024; x += 64) rc.polygon([[x, 474], [x + 32, 474], [x + 16, 502]], o({ fill: C.sun, fillStyle: "solid", strokeWidth: 1.4 }));
  g.fillStyle = C.orange; g.fillRect(0, 0, 1024, 26); rc.line(0, 26, 1024, 26, o());
  return tex(c, [14, 1]);
}
function ceilTex() {
  const c = cnv(512, 512), g = c.getContext("2d"), rc = rough.canvas(c);
  drawPaper(g, 512, 512, { veinAlpha: .45 });
  rc.rectangle(-6, 210, 524, 90, o({ fill: "#8a5a3c", fillStyle: "hachure", hachureGap: 6, strokeWidth: 2 }));
  return tex(c, [1, 16]);
}
function doorTex(d) {
  const c = cnv(512, 1024), g = c.getContext("2d"), rc = rough.canvas(c);
  const leaf = [[16, 1010], [16, 230], [60, 120], [150, 50], [256, 24], [362, 50], [452, 120], [496, 230], [496, 1010]];
  rc.polygon(leaf, o({ fill: d.color, fillStyle: "solid", strokeWidth: 4 }));
  rc.polygon(leaf, o({ fill: "#00000022", fillStyle: "hachure", hachureGap: 12, strokeWidth: 0.01 }));
  [[70, 300, 372, 260], [70, 620, 372, 330]].forEach(([x, y, w, h]) => { rc.rectangle(x, y, w, h, o({ fill: d.panel, fillStyle: "zigzag", hachureGap: 9, fillWeight: 2, strokeWidth: 3 })); rc.circle(x + w / 2, y + h / 2, 90, o({ fill: C.cream, fillStyle: "solid", strokeWidth: 2.5 })); });
  rc.circle(440, 580, 30, o({ fill: "#d4a017", fillStyle: "solid" }));
  rc.path("M256 120 q-24 40 0 80 q24 -40 0 -80", o({ fill: C.cream, fillStyle: "solid" }));
  return tex(c);
}
function frameTex(d) {
  const c = cnv(640, 1100), g = c.getContext("2d"), rc = rough.canvas(c);
  const outer = [[0, 1100], [0, 240], [60, 110], [170, 30], [320, 0], [470, 30], [580, 110], [640, 240], [640, 1100]];
  const inner = [[64, 1100], [64, 270], [100, 168], [190, 96], [320, 66], [450, 96], [540, 168], [576, 270], [576, 1100]];
  rc.polygon(outer, o({ fill: C.plum, fillStyle: "solid", strokeWidth: 4 }));
  rc.polygon(inner, o({ fill: "#1a0f15", fillStyle: "solid", strokeWidth: 3 }));
  for (let i = 0; i < 9; i++) { const a = Math.PI * (i / 8); rc.circle(320 - Math.cos(a) * 285, 280 - Math.sin(a) * 248, 18, o({ fill: C.sun, fillStyle: "solid", strokeWidth: 1.5 })); }
  return tex(c);
}
function signTex(d) {
  const c = cnv(1024, 380), g = c.getContext("2d"), rc = rough.canvas(c);
  rc.line(200, 0, 230, 90, o({ strokeWidth: 3 })); rc.line(824, 0, 794, 90, o({ strokeWidth: 3 }));
  rc.rectangle(60, 80, 904, 270, o({ fill: C.cream, fillStyle: "solid", strokeWidth: 5 }));
  rc.rectangle(80, 100, 864, 230, o({ stroke: d.color, strokeWidth: 3 }));
  g.fillStyle = C.ink; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = '800 118px "Fraunces", Georgia, serif'; g.fillText(d.label, 512, 196);
  g.fillStyle = d.color; g.font = '700 46px "Kalam", cursive'; g.fillText(d.sub, 512, 286);
  return tex(c);
}
function logoTex() {
  const c = cnv(1400, 640), g = c.getContext("2d"), rc = rough.canvas(c);
  rc.line(300, 0, 330, 120, o({ strokeWidth: 3 })); rc.line(1100, 0, 1070, 120, o({ strokeWidth: 3 }));
  rc.rectangle(40, 110, 1320, 500, o({ fill: C.blue, fillStyle: "solid", strokeWidth: 6 }));
  for (let i = 0; i < 16; i++) rc.circle(80 + i * 83, 110, 24, o({ fill: C.sun, fillStyle: "solid", strokeWidth: 2 }));
  g.fillStyle = C.cream; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = '800 230px "Fraunces", Georgia, serif'; g.fillText("kaafizyada", 700, 330);
  g.fillStyle = C.sun; g.font = '700 70px "Kalam", cursive'; g.fillText("< colours with character />", 700, 510);
  return tex(c);
}
function endWallTex() {
  const c = cnv(1200, 840), g = c.getContext("2d"), rc = rough.canvas(c);
  const bands = [C.rani, C.orange, C.sun, C.teal, C.blue, C.plum];
  bands.forEach((b, i) => { g.fillStyle = b; g.fillRect(i * 200, 0, 200, 840); });
  for (let i = 0; i < 6; i++) rc.rectangle(i * 200, -10, 200, 860, o({ strokeWidth: 3 }));
  g.fillStyle = C.cream; g.textAlign = "center"; g.font = '800 120px "Fraunces", Georgia, serif';
  g.strokeStyle = C.ink; g.lineWidth = 10; g.strokeText("Phir milenge.", 600, 150); g.fillText("Phir milenge.", 600, 150);
  return tex(c);
}
function photoTex(img, caption, tilt) {
  const c = cnv(640, 860), g = c.getContext("2d"), rc = rough.canvas(c);
  rc.rectangle(20, 20, 600, 820, o({ fill: "#fffaf0", fillStyle: "solid", strokeWidth: 3 }));
  const iw = 540, ih = 640, r = Math.max(iw / img.width, ih / img.height), sw = iw / r, sh = ih / r;
  g.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 4, sw, sh, 50, 50, iw, ih);
  rc.rectangle(50, 50, iw, ih, o({ strokeWidth: 2.5 }));
  g.fillStyle = "#f3ecdccc"; g.save(); g.translate(320, 30); g.rotate(tilt); g.fillRect(-80, -18, 160, 36); g.restore();
  g.fillStyle = C.ink; g.textAlign = "center"; g.font = '700 46px "Kalam", cursive'; g.fillText(caption, 320, 775);
  return tex(c);
}
function loadImg(src) { return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }

/* ---------------- scene ---------------- */
export async function initCorridor(opts) {
  const { canvas, onDoorNear, onProgress, onEnterDoor } = opts;
  await Promise.all([document.fonts.load('800 100px "Fraunces"'), document.fonts.load('700 40px "Kalam"')]).catch(() => {});

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ecc696");
  scene.fog = new THREE.Fog("#ecc696", 9, 34);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 80);

  const basic = (map, extra = {}) => new THREE.MeshBasicMaterial(Object.assign({ map, side: THREE.DoubleSide }, extra));
  const LEN = 52, MIDZ = (START_Z + 3 + (-44)) / 2;

  // floor, rug, ceiling, walls
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, LEN), basic(floorTex()));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, MIDZ); scene.add(floor);
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(1.8, LEN - 6), basic(rugTex()));
  rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.005, MIDZ - 2); scene.add(rug);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, LEN), basic(ceilTex()));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, MIDZ); scene.add(ceil);
  const wt = wallTex();
  [-1, 1].forEach(s => {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(LEN, H), basic(wt));
    wall.rotation.y = s * -Math.PI / 2; wall.position.set(s * W / 2, H / 2, MIDZ); scene.add(wall);
  });
  // end wall
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), basic(endWallTex()));
  endWall.position.set(0, H / 2, -40.02); scene.add(endWall);
  // back wall behind start (entrance)
  const backC = cnv(1024, 720); drawPaper(backC.getContext("2d"), 1024, 720);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), basic(tex(backC)));
  back.position.set(0, H / 2, START_Z + 3); back.rotation.y = Math.PI; scene.add(back);

  // bunting strings across the ceiling
  const bcol = [C.rani, C.teal, C.orange, C.blue, C.sun, C.plum];
  for (let z = 1; z > -38; z -= 5.5) {
    const n = 11;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = -W / 2 + W * t, y = H - 0.25 - Math.sin(t * Math.PI) * 0.45;
      const sh = new THREE.Shape(); sh.moveTo(-0.17, 0); sh.lineTo(0.17, 0); sh.lineTo(0, -0.34); sh.closePath();
      const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: bcol[(i + Math.abs(z | 0)) % 6], side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.rotation.z = (Math.random() - .5) * .2; m.userData.flag = Math.random() * 6; scene.add(m);
    }
    const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector3(-W / 2 + W * t, H - 0.25 - Math.sin(t * Math.PI) * 0.45, z)); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: C.ink })));
  }

  // hanging logo board at the start
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.28), basic(logoTex(), { transparent: true, alphaTest: 0.05 }));
  logo.position.set(0, H - 0.95, -1.6); scene.add(logo);

  // doors
  const clickables = [];
  const doorObjs = DOORS.map(d => {
    const grp = new THREE.Group();
    const fw = 1.75, fh = 3.0;
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), basic(frameTex(d), { transparent: true, alphaTest: 0.05 }));
    frame.position.y = fh / 2; grp.add(frame);
    const pivot = new THREE.Group(); pivot.position.set(-0.71, 0, 0.01); grp.add(pivot);
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 2.72), basic(doorTex(d), { transparent: true, alphaTest: 0.05 }));
    leaf.position.set(0.71, 1.36, 0.005); pivot.add(leaf);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.7), new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0 }));
    glow.position.set(0, 1.35, 0.002); grp.add(glow);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.63), basic(signTex(d), { transparent: true, alphaTest: 0.05 }));
    sign.position.set(0, fh + 0.42, 0.06); grp.add(sign);
    if (d.side === 0) { grp.position.set(0, 0, d.z + 0.01); }
    else { grp.position.set(d.side * (W / 2 - 0.01), 0, d.z); grp.rotation.y = -d.side * Math.PI / 2; }
    scene.add(grp);
    [leaf, frame, sign].forEach(m => { m.userData.door = d; clickables.push(m); });
    return { d, grp, pivot, sign, glow, open: 0, hover: 0 };
  });

  // posters on the wall opposite each side door
  const POSTERS = [
    ["royal-bloom-1", "The Arcade"], ["gulabi-door", "The Blue Door"], ["sheer-mehfil-taxi", "Kaali-Peeli"],
    ["noor-yellow", "Post-Box Lane"], ["royal-bloom-shutter", "Shutter Down"], ["noor-night", "Sea-face, 9pm"], ["gulabi-portrait", "Gulabi"]
  ];
  const posterSpots = [[1, -6], [-1, -12], [1, -18.5], [-1, -25], [1, -31.5], [-1, -3], [1, -35.5]];
  // illustrated models standing in the corridor (billboards)
  const FIGS = [["royal-bloom-blouse", -1.75, -1.2], ["sheer-mehfil-top", 1.8, -1.3], ["gulabi-drape-top", 1.9, -9.2], ["noor-corset-top", -1.9, -22], ["sheer-mehfil-top", 1.9, -28.5]];
  const figMeshes = [];
  const imgs = await Promise.all([...POSTERS.map(p => loadImg("assets/photos/" + p[0] + ".webp")), ...FIGS.map(f => loadImg("assets/img/kf-look-" + f[0] + ".webp"))]);
  POSTERS.forEach((p, i) => {
    const img = imgs[i]; if (!img) return;
    const [s, z] = posterSpots[i];
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.41), basic(photoTex(img, p[1], (i % 2 ? 1 : -1) * 0.06)));
    m.position.set(s * (W / 2 - 0.02), 2.05, z); m.rotation.y = -s * Math.PI / 2; m.rotation.z = (i % 2 ? 1 : -1) * 0.03; scene.add(m);
  });
  FIGS.forEach((f, i) => {
    const img = imgs[POSTERS.length + i]; if (!img) return;
    const h = 1.75, w = h * img.width / img.height;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(tex(img), { transparent: true, alphaTest: 0.35 }));
    m.position.set(f[1], h / 2, f[2]); scene.add(m); figMeshes.push(m);
  });
  // ceiling lamps (simple glowing discs)
  for (let z = -2; z > -38; z -= 7) {
    const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), new THREE.MeshBasicMaterial({ color: C.sun }));
    lamp.rotation.x = Math.PI / 2; lamp.position.set(0, H - 0.01, z); scene.add(lamp);
  }

  /* ---------------- camera / input ---------------- */
  const cam = { z: START_Z, tz: START_Z, yaw: 0, tyaw: 0, pitch: 0, tpitch: 0, x: 0, tx: 0, y: 1.6, ty: 1.6 };
  let mode = "walk", focus = null, mx = 0, my = 0;
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hovered = null;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 78 : 62; camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize); resize();

  canvas.addEventListener("pointermove", e => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = -((e.clientY - r.top) / r.height) * 2 + 1;
    ptr.set(mx, my); ray.setFromCamera(ptr, camera);
    const hit = mode === "walk" ? ray.intersectObjects(clickables)[0] : null;
    hovered = hit && hit.distance < 14 ? hit.object.userData.door : null;
    canvas.style.cursor = hovered ? "pointer" : "";
  });
  canvas.addEventListener("click", e => {
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(clickables)[0];
    if (hit && mode === "walk" && hit.distance < 16) enterDoor(hit.object.userData.door.id);
  });

  function setProgress(p) { if (mode === "walk") cam.tz = START_Z + (END_Z - START_Z) * p; }

  function enterDoor(id) {
    const o = doorObjs.find(x => x.d.id === id); if (!o) return;
    mode = "enter"; focus = o;
    const d = o.d;
    if (d.side === 0) { cam.tz = d.z + 2.6; cam.tx = 0; cam.tyaw = 0; }
    else { cam.tz = d.z; cam.tx = d.side * (W / 2 - 2.0); cam.tyaw = -d.side * Math.PI / 2; }
    cam.tpitch = 0.02;
    setTimeout(() => {
      if (d.side === 0) cam.tz = d.z + 1.1; else cam.tx = d.side * (W / 2 - 0.6);
    }, 900);
    setTimeout(() => onEnterDoor && onEnterDoor(id), 1500);
  }
  function exitDoor() {
    if (!focus) return;
    const d = focus.d;
    mode = "exit";
    cam.tx = 0; cam.tyaw = 0; cam.tpitch = 0;
    if (d.side === 0) cam.tz = d.z + 3.2;
    setTimeout(() => { mode = "walk"; focus = null; opts.syncScroll && opts.syncScroll(); }, 1100);
  }

  /* ---------------- loop ---------------- */
  const clock = new THREE.Clock();
  let lastNear = null, running = true;
  function frame() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    const k = 1 - Math.pow(0.0015, dt);
    if (mode === "walk") { cam.tyaw = -mx * 0.22; cam.tpitch = my * 0.08; }
    cam.z += (cam.tz - cam.z) * k; cam.x += (cam.tx - cam.x) * k;
    cam.yaw += (cam.tyaw - cam.yaw) * k; cam.pitch += (cam.tpitch - cam.pitch) * k;
    const bob = mode === "walk" ? Math.sin(cam.z * 2.4) * 0.025 : 0;
    camera.position.set(cam.x, cam.y + bob, cam.z);
    camera.rotation.set(cam.pitch, cam.yaw, 0, "YXZ");

    // doors: hover ajar, focus open
    doorObjs.forEach(o => {
      const want = focus === o ? 1 : 0, hov = hovered && hovered.id === o.d.id ? 1 : 0;
      o.open += (want - o.open) * k * 0.9; o.hover += (hov - o.hover) * k;
      o.pivot.rotation.y = -(o.open * 1.45 + o.hover * 0.18);
      o.glow.material.opacity = Math.min(1, o.open * 1.4);
      o.sign.rotation.z = Math.sin(t * 1.3 + o.d.z) * 0.02 + o.hover * Math.sin(t * 6) * 0.03;
    });
    logo.rotation.z = Math.sin(t * 0.9) * 0.015;
    figMeshes.forEach(m => { m.lookAt(camera.position.x, m.position.y, camera.position.z); });

    // nearest door hint
    if (mode === "walk") {
      let near = null, best = 99;
      doorObjs.forEach(o => { const dz = cam.z - o.d.z; if (dz > 0.3 && dz < 6.5 && dz < best) { best = dz; near = o.d; } });
      if (near !== lastNear) { lastNear = near; onDoorNear && onDoorNear(near); }
      onProgress && onProgress((cam.z - START_Z) / (END_Z - START_Z));
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    setProgress, enterDoor, exitDoor, resize,
    doorScrollProgress: (id) => { const d = DOORS.find(x => x.id === id); return Math.min(1, Math.max(0, (d.z + 3.2 - START_Z) / (END_Z - START_Z))); },
    get mode() { return mode; }
  };
}
