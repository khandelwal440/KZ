/* Wires the corridor to the page: scroll = walk, colour takeover, doors → rooms, room map, achievements */
import { initCorridor, DOORS } from "./corridor.js";

const $ = s => document.querySelector(s);
const canvas = $("#kz-canvas"), walk = $("#walk-space"), room = $("#room"), roomBody = $("#room-body"), rooms = $("#rooms");
const ROOM_SECTION = { story: "#story", world: "#world", tv: "#tv", shop: "#shop", scrapbook: "#scrapbook", final: "#final" };

/* ---------------- achievements ---------------- */
const ACH = [
  { id: "wanderer", t: "Wanderer", d: "Scroll to explore the corridor" },
  { id: "colour", t: "Colour Seeker", d: "Walk far enough for the colour to arrive" },
  { id: "explorer", t: "Explorer", d: "Open your first door" },
  { id: "tuned", t: "Tuned In", d: "Change the channel on the KZ TV" },
  { id: "style", t: "Style Icon", d: "Add something to your jhola" },
  { id: "scrap", t: "Scrapbooker", d: "Pin a note in the scrapbook" },
  { id: "all", t: "Kaafi Zyada", d: "Visit every room" }
];
let got = {}; try { got = JSON.parse(localStorage.getItem("kz-ach")) || {}; } catch (e) {}
const visited = new Set();
function award(id) {
  if (got[id]) return; got[id] = 1;
  try { localStorage.setItem("kz-ach", JSON.stringify(got)); } catch (e) {}
  const a = ACH.find(x => x.id === id), t = $("#ach-toast");
  t.innerHTML = `<span>🏆</span><div><b>${a.t}</b>${a.d}</div>`; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3200);
  renderAch();
}
function renderAch() {
  $("#hud-trophy-n").textContent = Object.keys(got).length;
  $("#ach-list").innerHTML = ACH.map(a => `<li class="${got[a.id] ? "on" : ""}"><span>${got[a.id] ? "🏆" : "🔒"}</span><div><b>${a.t}</b>${a.d}</div></li>`).join("");
}
renderAch();
// hooks into existing page behaviour
document.addEventListener("click", e => {
  if (e.target.closest("[data-ch], #tv-knob, #tv-next, #tv-prev")) award("tuned");
});
const origAdd = KZ.add; KZ.add = (...a) => { origAdd(...a); award("style"); };
$("#notepad")?.addEventListener("submit", () => setTimeout(() => award("scrap"), 50));

/* ---------------- map + panels ---------------- */
$("#map-list").innerHTML = DOORS.map((d, i) => `<li><button data-go="${d.id}"><span>${String(i + 4).padStart(2, "0")}</span><b>${d.label}</b><em>${d.sub.split("— ")[1]}</em></button></li>`).join("");
$("#sr-rooms").innerHTML = DOORS.map(d => `<li><button data-go="${d.id}">${d.label}</button></li>`).join("");
const openPanel = (id, on = true) => { $(id).hidden = !on; };
$("#hud-menu").onclick = () => openPanel("#panel-menu");
$("#hud-trophy").onclick = () => openPanel("#panel-trophy");
document.querySelectorAll(".panel").forEach(p => p.addEventListener("click", e => { if (e.target === p || e.target.closest("[data-close]")) p.hidden = true; }));

/* ---------------- corridor ---------------- */
walk.style.height = "1000vh";
const ticks = $("#rail-ticks");
let world;
const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
let colourOn = false;

function onProgress(p) {
  p = Math.max(0, Math.min(1, p));
  $("#rail-fill").style.height = p * 100 + "%";
  const grey = Math.max(0, 1 - Math.max(0, p - 0.02) / 0.2);
  canvas.style.filter = grey > 0.001 ? `grayscale(${grey}) contrast(${1 + grey * 0.12})` : "none";
  if (p > 0.015) award("wanderer");
  if (!colourOn && grey < 0.05) { colourOn = true; award("colour"); const f = $("#takeover-flash"); f.classList.add("show"); setTimeout(() => f.classList.remove("show"), 2600); }
}
let nearDoor = null;
function onDoorNear(d) {
  nearDoor = d;
  const go = $("#hint-go");
  if (d) { $("#hint-title").textContent = d.label; $("#hint-sub").textContent = "Click the door to enter"; go.hidden = false; go.textContent = "Enter →"; $("#hint").classList.add("door"); }
  else { $("#hint-title").textContent = got.wanderer ? "Keep walking" : "Wanderer"; $("#hint-sub").textContent = "Scroll to explore the corridor"; go.hidden = true; $("#hint").classList.remove("door"); }
}
$("#hint-go").onclick = () => nearDoor && world && world.enterDoor(nearDoor.id);

/* ---------------- rooms ---------------- */
let current = null, savedScroll = 0;
function openRoom(id) {
  const sec = document.querySelector(ROOM_SECTION[id]); if (!sec) return;
  if (current) closeRoom(true);
  current = { id, sec };
  savedScroll = scrollY;
  roomBody.appendChild(sec);
  $("#room-name").textContent = DOORS.find(d => d.id === id).label;
  room.hidden = false; room.scrollTop = 0;
  requestAnimationFrame(() => room.classList.add("open"));
  document.body.classList.add("in-room");
  KZ.observe(sec);
  award("explorer"); visited.add(id); if (visited.size >= DOORS.length) award("all");
  history.replaceState(null, "", "#" + (id === "world" ? "world" : ROOM_SECTION[id].slice(1)));
}
function closeRoom(silent) {
  if (!current) return;
  rooms.appendChild(current.sec); current = null;
  room.classList.remove("open"); room.hidden = true;
  document.body.classList.remove("in-room");
  scrollTo(0, savedScroll);
  history.replaceState(null, "", location.pathname);
  if (!silent && world) world.exitDoor();
}
$("#room-back").onclick = () => closeRoom();
addEventListener("keydown", e => { if (e.key === "Escape" && current && !document.querySelector(".kz-drawer.open")) closeRoom(); });

function goTo(id) {
  document.querySelectorAll(".panel").forEach(p => p.hidden = true);
  if (!world) return openRoom(id);
  if (current) closeRoom(true);
  const p = world.doorScrollProgress(id);
  scrollTo({ top: p * maxScroll(), behavior: "instant" });
  world.setProgress(p);
  setTimeout(() => world.enterDoor(id), 250);
}
document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) { e.preventDefault(); goTo(b.dataset.go); } });
// header nav links (#story, #world…) open rooms
document.querySelectorAll('.kz-nav a[href^="#"]').forEach(a => a.addEventListener("click", e => {
  const id = Object.keys(ROOM_SECTION).find(k => ROOM_SECTION[k] === a.getAttribute("href"));
  if (id) { e.preventDefault(); goTo(id); }
}));

/* ---------------- boot ---------------- */
async function boot() {
  world = await initCorridor({
    canvas, onProgress, onDoorNear,
    onEnterDoor: id => openRoom(id),
    syncScroll: () => world.setProgress(scrollY / maxScroll())
  });
  ticks.innerHTML = DOORS.map(d => `<i style="top:${world.doorScrollProgress(d.id) * 100}%" title="${d.label}"></i>`).join("");
  addEventListener("scroll", () => { if (!current) world.setProgress(scrollY / maxScroll()); }, { passive: true });
  onProgress(0); onDoorNear(null);
  // arrived with a room in the URL (e.g. from a product page's "Shop" link)
  const h = location.hash.slice(1);
  const id = Object.keys(ROOM_SECTION).find(k => ROOM_SECTION[k] === "#" + h);
  if (id) { const go = () => setTimeout(() => openRoom(id), 50); KZ.entered ? go() : addEventListener("kz:entered", go, { once: true }); }
}
boot().catch(err => { console.error(err); document.body.classList.add("no-webgl"); });
