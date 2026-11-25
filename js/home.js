/* Homepage: 01 intro → 02 entrance → 03 takeover, 05 world, 06 TV, 07 shop, 08 scrapbook */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= 01 THE COLOURLESS WORLD ================= */
  const intro = $("#intro"), bw = $("#street-bw");
  drawStreet(bw, "bw");

  // loader: count up while fonts + images load
  const imgs = [...document.querySelectorAll("#street-bw image")].map(i => i.getAttribute("href"));
  let loaded = 0, shown = 0;
  const total = imgs.length + 1;
  imgs.forEach(src => { const im = new Image(); im.onload = im.onerror = () => loaded++; im.src = src; });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => loaded++);
  const pct = $("#intro-pct");
  const tick = () => {
    const target = Math.min(100, (loaded / total) * 100);
    shown += Math.max(0.6, (target - shown) * 0.08);
    if (shown > target) shown = target;
    pct.textContent = Math.round(shown);
    if (shown >= 100) { intro.classList.add("ready"); return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => { loaded = total; }, 6000); // never get stuck

  /* ================= 02 THE KZ ENTRANCE ================= */
  let entered = false;
  function enter(fast) {
    if (entered) return; entered = true;
    const glowEl = bw.querySelector("#kz-door-glow");
    if (glowEl) { const r = glowEl.getBoundingClientRect(); bw.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height * 0.6}px`; }
    bw.style.transform = "";
    intro.classList.add("opening");
    const seq = fast || reduce ? [0, 50, 100, 400] : [0, 1300, 3100, 3900];
    // zoom toward the door
    setTimeout(() => intro.classList.add("zoom"), seq[0]);
    setTimeout(() => intro.classList.add("entrance-on"), seq[1]);
    setTimeout(() => intro.classList.add("bands-on"), seq[2]);
    setTimeout(finish, seq[3]);
  }
  function finish() {
    document.body.classList.remove("is-intro");
    document.body.classList.add("is-in");
    intro.classList.add("gone");
    setTimeout(() => intro.remove(), 900);
    scrollTo(0, 0);
    KZ.entered = true;
    dispatchEvent(new Event("kz:entered"));
  }
  bw.addEventListener("click", e => { if (e.target.closest("#kz-door, #kz-sign") && intro.classList.contains("ready")) enter(); });
  $("#intro-skip").onclick = () => enter(true);
  addEventListener("keydown", e => { if (!entered && (e.key === "Enter" || e.key === " ") && intro.classList.contains("ready")) { e.preventDefault(); enter(); } });
  // a door that wants to be found
  const door = $("#kz-door", bw);
  if (door) { door.setAttribute("tabindex", "0"); door.setAttribute("role", "button"); door.setAttribute("aria-label", "Open the KAAFIZYADA door"); }
  // gentle parallax on the sketch
  intro.addEventListener("pointermove", e => {
    if (reduce || entered) return;
    const x = (e.clientX / innerWidth - 0.5), y = (e.clientY / innerHeight - 0.5);
    bw.style.transform = `translate(${x * -14}px, ${y * -8}px) scale(1.03)`;
  });

  /* ================= 05 ENTER OUR WORLD ================= */
  const world = [
    ["royal-bloom-1", "The Arcade", "Light, shadow and a Royal Bloom.", "royal-bloom-blouse"],
    ["sheer-mehfil-taxi", "Kaali-Peeli Corner", "Sheer Mehfil, stopping traffic.", "sheer-mehfil-top"],
    ["gulabi-door", "The Blue Door", "Gulabi Drape on a pink-framed door.", "gulabi-drape-top"],
    ["noor-yellow", "Post-Box Lane", "Noor Corset + the draped mini.", "noor-corset-top"],
    ["royal-bloom-shutter", "Shutter Down", "Pleats against a pink shutter.", "pleated-wide-leg-trouser"],
    ["noor-night", "Sea-Face, 9 PM", "The city lights do the rest.", "asymmetric-draped-mini-skirt"],
    ["royal-bloom-door", "The Old Haveli", "Wine red against old teak.", "royal-bloom-blouse"],
    ["sheer-mehfil-close", "Mehfil Close-Up", "Every layer, up close.", "sheer-mehfil-top"]
  ];
  const stickers = ["✦", "★", "☀", "♥", "✿", "✦", "☾", "★"];
  $("#world-track").innerHTML = world.map(([img, t, d, slug], i) => `
    <a class="world-card" href="product.html?p=${slug}" style="--r:${[-3, 2, -1.5, 3, -2, 1.5, -2.5, 2][i]}deg">
      <span class="world-num">${String(i + 1).padStart(2, "0")}</span>
      <img src="assets/photos/${img}.webp" alt="${t}: ${d}" loading="lazy" draggable="false">
      <span class="world-cap"><b>${t}</b>${d}</span>
      <span class="world-stk" aria-hidden="true">${stickers[i]}</span>
    </a>`).join("");
  // drag-to-scroll (mouse); touch uses native scroll
  const strip = $("#world-strip");
  let down = false, sx = 0, sl = 0, moved = false;
  strip.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add("drag"); });
  addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; strip.scrollLeft = sl - dx; });
  addEventListener("pointerup", () => { down = false; strip.classList.remove("drag"); });
  strip.addEventListener("click", e => { if (moved) { e.preventDefault(); moved = false; } }, true);
  // vertical wheel moves the strip sideways while it has room
  strip.addEventListener("wheel", e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = strip.scrollWidth - strip.clientWidth;
    if ((e.deltaY > 0 && strip.scrollLeft < max - 2) || (e.deltaY < 0 && strip.scrollLeft > 2)) { strip.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });

  /* ================= 06 TUNE INTO KZ ================= */
  const P = KZ.products;
  const channels = [
    { n: "01", name: "The Tops", items: P.filter(p => p.type === "top") },
    { n: "02", name: "The Bottoms", items: P.filter(p => p.type === "bottom") },
    { n: "03", name: "Full Looks", looks: true, items: P.filter(p => p.type === "top") },
    { n: "04", name: "Test Card", test: true }
  ];
  let ch = 0, slide = 0, auto;
  const content = $("#tv-content"), osd = $("#tv-osd");
  $("#tv-ch-list").innerHTML = channels.map((c, i) => `<button role="tab" data-ch="${i}">${c.n}</button>`).join("");
  $("#tv-remote-keys").innerHTML = channels.map((c, i) => `<button data-ch="${i}" aria-label="Channel ${c.n}: ${c.name}">${i + 1}</button>`).join("");
  function renderCh() {
    const c = channels[ch];
    document.querySelectorAll("[data-ch]").forEach(b => b.classList.toggle("on", +b.dataset.ch === ch));
    osd.textContent = `CH ${c.n} · ${c.name.toUpperCase()}`;
    if (c.test) {
      content.innerHTML = `<div class="tv-test"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><div class="tv-test-c"><svg><use href="#kz-mark-sym"/></svg><span>KZ · PLEASE STAND BY FOR THE NEXT DROP</span></div></div>`;
      return;
    }
    const p = c.items[slide % c.items.length];
    const img = c.looks ? p.look : KZ.photo(p.photos[0]);
    const pairNames = c.looks ? (p.pairs || []).map(s => KZ.bySlug(s).name).join(" or ") : "";
    content.innerHTML = `
      <div class="tv-show ${c.looks ? "is-look" : ""}">
        <img src="${img}" alt="${p.name}">
        <div class="tv-info">
          <span class="tv-live">● ON AIR</span>
          <h3>${p.name}</h3>
          <p>${c.looks ? "Pair with: " + pairNames : p.tagline}</p>
          <p class="tv-price"><s>${KZ.inr(p.was)}</s> ${KZ.inr(p.price)}</p>
          <a class="kz-btn kz-btn-sm" href="product.html?p=${p.slug}">Shop this look</a>
          <div class="tv-dots">${c.items.map((_, i) => `<i class="${i === slide % c.items.length ? "on" : ""}"></i>`).join("")}</div>
        </div>
      </div>`;
  }
  // static noise between channels
  const cv = $("#tv-static"), cx = cv.getContext("2d");
  function staticBurst(ms = 380) {
    if (reduce) return;
    cv.classList.add("on");
    const end = performance.now() + ms;
    (function f() {
      const d = cx.createImageData(160, 120);
      for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      cx.putImageData(d, 0, 0);
      if (performance.now() < end) requestAnimationFrame(f); else cv.classList.remove("on");
    })();
  }
  function setCh(i) { ch = (i + channels.length) % channels.length; slide = 0; staticBurst(); setTimeout(renderCh, reduce ? 0 : 200); $("#tv-knob").style.setProperty("--rot", ch * 90 + "deg"); restartAuto(); }
  function restartAuto() { clearInterval(auto); auto = setInterval(() => { if (channels[ch].test) return; slide++; staticBurst(160); setTimeout(renderCh, 90); }, 4200); }
  document.addEventListener("click", e => { const b = e.target.closest("[data-ch]"); if (b) setCh(+b.dataset.ch); });
  $("#tv-knob").onclick = () => setCh(ch + 1);
  $("#tv-next").onclick = () => setCh(ch + 1);
  $("#tv-prev").onclick = () => setCh(ch - 1);
  renderCh(); restartAuto();

  /* ================= 07 SHOP GRID ================= */
  const grid = $("#shop-grid");
  function renderGrid(f = "all") {
    grid.innerHTML = P.filter(p => f === "all" || p.type === f).map((p, i) => `
      <article class="card" data-reveal style="--d:${i * 60}ms">
        <a href="product.html?p=${p.slug}" class="card-img">
          <img src="${KZ.photo(p.photos[0])}" alt="${p.name}" loading="lazy">
          <img class="card-alt ${p.look ? "is-look" : ""}" src="${p.look || KZ.photo(p.photos[1])}" alt="" loading="lazy">
          <span class="card-badge">−${Math.round((1 - p.price / p.was) * 100)}%</span>
        </a>
        <div class="card-body">
          <h3><a href="product.html?p=${p.slug}">${p.name}</a></h3>
          <p class="card-price"><s>${KZ.inr(p.was)}</s> <b>${KZ.inr(p.price)}</b></p>
          <div class="card-sizes" aria-label="Quick add size">${["XS", "S", "M", "L", "XL"].map(s => `<button data-add="${p.slug}" data-size="${s}">${s}</button>`).join("")}</div>
        </div>
      </article>`).join("");
    KZ.observe(grid);
  }
  renderGrid();
  document.querySelectorAll(".shop-filters button").forEach(b => b.onclick = () => {
    document.querySelectorAll(".shop-filters button").forEach(x => x.classList.toggle("on", x === b)); renderGrid(b.dataset.f);
  });
  grid.addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) KZ.add(b.dataset.add, b.dataset.size); });

  /* ================= 08 SCRAPBOOK ================= */
  const KEY = "kz-scrap-v1", board = $("#board");
  const seed = [
    { name: "Team KZ", text: "Hi! This page is yours. Tell us how you styled your KZ piece ✦", c: "#ffd166", s: "✦", x: 6, y: 8, r: -4 },
    { name: "Team KZ", text: "Question of the week: what colour should the next drop be?", c: "#9fe3dc", s: "☀", x: 52, y: 14, r: 3 },
    { name: "Team KZ", text: "Tag @kaafizyada.in in your fit pics and we might pin them here.", c: "#f7a8c4", s: "♥", x: 24, y: 52, r: -2 }
  ];
  let notes;
  try { notes = JSON.parse(localStorage.getItem(KEY)) || seed; } catch (e) { notes = seed; }
  const saveNotes = () => { try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {} };
  const esc = s => s.replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  function renderNotes() {
    board.innerHTML = notes.map((n, i) => `
      <div class="note" data-i="${i}" style="left:${n.x}%;top:${n.y}%;--r:${n.r}deg;background:${n.c}">
        <span class="note-pin" aria-hidden="true"></span>
        <p>${esc(n.text)}</p><b>— ${esc(n.name || "Anonymous")}</b><span class="note-stk">${n.s}</span>
        ${n.mine ? `<button class="note-x" data-del="${i}" aria-label="Remove note">✕</button>` : ""}
      </div>`).join("");
  }
  renderNotes();
  let pc = "#ffd166", ps = "✦";
  document.querySelectorAll(".np-paper button").forEach(b => b.onclick = () => { pc = b.dataset.c; document.querySelectorAll(".np-paper button").forEach(x => x.classList.toggle("on", x === b)); });
  document.querySelectorAll(".np-stickers button").forEach(b => b.onclick = () => { ps = b.dataset.s; document.querySelectorAll(".np-stickers button").forEach(x => x.classList.toggle("on", x === b)); });
  $("#notepad").addEventListener("submit", e => {
    e.preventDefault();
    const text = $("#np-text").value.trim(); if (!text) return;
    notes.push({ name: $("#np-name").value.trim(), text, c: pc, s: ps, x: 8 + Math.random() * 56, y: 6 + Math.random() * 60, r: Math.round(Math.random() * 10 - 5), mine: true });
    saveNotes(); renderNotes(); e.target.reset(); KZ.toast("Pinned! Drag it anywhere on the board.");
  });
  board.addEventListener("click", e => { const d = e.target.closest("[data-del]"); if (d) { notes.splice(+d.dataset.del, 1); saveNotes(); renderNotes(); } });
  // drag notes
  let drag = null;
  board.addEventListener("pointerdown", e => {
    const n = e.target.closest(".note"); if (!n || e.target.closest("button")) return;
    const r = board.getBoundingClientRect(), nr = n.getBoundingClientRect();
    drag = { n, i: +n.dataset.i, ox: e.clientX - nr.left, oy: e.clientY - nr.top, r };
    n.classList.add("lift"); n.setPointerCapture(e.pointerId);
  });
  board.addEventListener("pointermove", e => {
    if (!drag) return;
    const { r, n, ox, oy } = drag;
    const x = Math.max(0, Math.min(r.width - n.offsetWidth, e.clientX - r.left - ox)) / r.width * 100;
    const y = Math.max(0, Math.min(r.height - n.offsetHeight, e.clientY - r.top - oy)) / r.height * 100;
    n.style.left = x + "%"; n.style.top = y + "%"; notes[drag.i].x = x; notes[drag.i].y = y;
  });
  board.addEventListener("pointerup", () => { if (drag) { drag.n.classList.remove("lift"); saveNotes(); drag = null; } });

  // skip the intro if arriving at a hash (e.g. from another page's nav)
  if (location.hash && location.hash !== "#top") enter(true);
})();
