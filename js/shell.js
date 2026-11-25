/* Shared shell: logo symbol, header, cart drawer, footer — used on every page */
(function () {
  const MARK = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="kz-mark-sym" viewBox="405.5 113.75 155.75 162.25"><g fill="currentColor">
<path transform="matrix(1,0,0,-1,492.1306,164.2673)" d="M0 0C-.317-6.517-2.977-12.668-6.73-17.855L-5.023-8.303C-4.199-8.349-1.296-3.047 .042 1.121L.147-19.28"/>
<path transform="matrix(1,0,0,-1,500.3508,137.5871)" d="M0 0C-10.711-3.77-13.974-6.124-17.199-17.663-19.411-8.313-24.762-2-34.794-.473-24.434 1.366-19.347 7.301-17.257 17.513-15.266 7.277-9.72 1.179 0 0"/>
<path transform="matrix(1,0,0,-1,455.7202,191.5357)" d="M0 0C-7.169-12.183-3.397-24.177 6.24-33.936 5.063-30.256 4.221-27.04 5.021-23.386 6.204-17.976 8.711-13.095 12.58-9.082L24.043 2.809 27.415 6.314V28.267C18.212 18.564 6.546 11.123 0 0"/>
<path transform="matrix(1,0,0,-1,487.1071,172.5705)" d="M0 0-1.706-9.552C2.046-4.365 4.706 1.787 5.023 8.303L5.049 9.375C3.705 5.215 .821-.045 0 0"/>
<path transform="matrix(1,0,0,-1,515.4761,239.36969)" d="M0 0C7.17 12.183 3.397 24.177-6.24 33.936-5.063 30.256-4.221 27.04-5.021 23.386-6.204 17.976-8.711 13.095-12.58 9.082L-24.043-2.809-27.415-6.314V-28.267C-18.212-18.564-6.546-11.123 0 0"/>
<path transform="matrix(1,0,0,-1,459.1453,149.19351)" d="M0 0C-22.12-9.681-51.82-32.695-51.532-58.314-51.322-76.924-32.108-88.594-14.231-87.575-17.393-86.717-20.513-86.46-23.466-85.382-32.49-82.086-37.937-73.953-37.309-64.349-36.321-49.242-24.679-36.083-13.711-26.716-10.251-23.762-6.702-20.912-3.071-18.171-1.028-16.629 1.117-15.204 3.247-13.788 4.697-12.824 6.158-11.874 7.653-10.982 8.993-10.183 10.199-9.228 11.793-9.077 11.717-7.913 7.695 3.048 7.884 3.117 5.251 2.155 2.659 1.164 0 0"/>
<path transform="matrix(1,0,0,-1,511.7484,176.40592)" d="M0 0C21.437-11.112 49.562-36.026 47.592-61.571 46.162-80.127 26.223-90.51 8.452-88.32 11.663-87.671 14.793-87.621 17.811-86.738 27.031-84.042 33-76.284 33.004-66.659 33.01-51.52 22.257-37.625 11.927-27.559 8.669-24.383 5.315-21.306 1.871-18.333-.066-16.66-2.112-15.098-4.145-13.545-5.529-12.488-6.924-11.444-8.358-10.456-9.642-9.571-10.783-8.539-12.364-8.283-12.211-7.127-7.479 3.546-7.662 3.627-5.099 2.495-2.577 1.336 0 0"/>
<path transform="matrix(1,0,0,-1,484.2036,162.1222)" d="M0 0C-9.35-10.275-21.682-17.856-28.483-29.414-35.653-41.596-31.881-53.59-22.243-63.35-23.421-59.669-24.262-56.453-23.463-52.799-22.279-47.389-19.772-42.509-15.904-38.496L-4.440-26.605-.989-23.018-.967-62.444C-.966-63.384-1.113-111.377-1.609-112.163 2.036-111.4 5.572-111.43 9.172-111.831L7.817-61.671 7.849-22.085 7.986 .358"/>
<path transform="matrix(1,0,0,-1,492.4798,135.14402)" d="M0 0C1.346 8.088-3.677 14.566-11.264 16.392-18.61 18.16-25.112 16.097-31.106 19.522-25.962 11.138-22.502 4.541-11.889 4.643-7.5 4.685-3.395 3.208-.336 .033"/>
<path transform="matrix(1,0,0,-1,478.9637,145.62381)" d="M0 0C11.572 1.031 20.707-2.09 30.639 5.477 34.627 8.516 38.14 12.293 41.139 16.479 37.995 15.58 35.372 14.687 32.38 14.685L-.358 14.663"/>
<path transform="matrix(1,0,0,-1,492.0948,213.89691)" d="M0 0 .329 33.764C.337 34.57 .913 75.668 1.416 76.336-2.236 75.721-5.771 75.783-9.368 76.164L-8.461 33.194-8.846-.707"/>
</g></symbol></defs></svg>`;
  document.body.insertAdjacentHTML("afterbegin", MARK);

  const here = location.pathname.split("/").pop() || "index.html";
  const home = here === "index.html" ? "" : "index.html";
  const header = `
  <header class="kz-header" id="kz-header">
    <a class="kz-brand" href="${home || "#top"}" aria-label="KAAFIZYADA home">
      <svg class="kz-brand-mark"><use href="#kz-mark-sym"/></svg>
      <span class="kz-wordline" role="img" aria-label="kaafizyada"></span>
    </a>
    <nav class="kz-nav" aria-label="Main">
      <a href="${home}#story">Our Story</a>
      <a href="${home}#world">Our World</a>
      <a href="${home}#tv">Tune In</a>
      <a href="${home}#shop">Shop</a>
      <a href="${home}#scrapbook">Scrapbook</a>
    </nav>
    <button class="kz-bag-btn" id="kz-bag-btn" aria-label="Open bag">Bag <span id="kz-bag-count">0</span></button>
  </header>
  <aside class="kz-drawer" id="kz-drawer" aria-label="Your bag" aria-hidden="true">
    <div class="kz-drawer-head"><h3>Your Jhola</h3><button id="kz-drawer-close" aria-label="Close bag">✕</button></div>
    <div class="kz-drawer-items" id="kz-drawer-items"></div>
    <div class="kz-drawer-foot">
      <div class="kz-row"><span>Subtotal</span><strong id="kz-subtotal">₹0</strong></div>
      <p class="kz-small">Shipping is shown at checkout.</p>
      <a class="kz-btn kz-btn-full" href="checkout.html" id="kz-checkout-btn">Checkout</a>
    </div>
  </aside>
  <div class="kz-scrim" id="kz-scrim"></div>
  <div class="kz-toast" id="kz-toast" role="status"></div>`;
  document.body.insertAdjacentHTML("afterbegin", header);

  /* ---------- cart ---------- */
  const KEY = "kz-bag-v1";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const write = (b) => { try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {} };
  KZ.bag = read();
  KZ.saveBag = () => { write(KZ.bag); renderBag(); };
  KZ.add = (slug, size, qty = 1) => {
    const p = KZ.bySlug(slug); if (!p) return;
    const line = KZ.bag.find(l => l.slug === slug && l.size === size);
    if (line) line.qty += qty; else KZ.bag.push({ slug, size, qty });
    KZ.saveBag(); toast(`${p.name} (${size}) added to your jhola`);
    bump();
  };
  KZ.subtotal = () => KZ.bag.reduce((s, l) => s + KZ.bySlug(l.slug).price * l.qty, 0);
  function bump() { const b = document.getElementById("kz-bag-btn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  function toast(msg) { const t = document.getElementById("kz-toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600); }
  KZ.toast = toast;

  function renderBag() {
    const wrap = document.getElementById("kz-drawer-items");
    document.getElementById("kz-bag-count").textContent = KZ.bag.reduce((s, l) => s + l.qty, 0);
    document.getElementById("kz-subtotal").textContent = KZ.inr(KZ.subtotal());
    document.getElementById("kz-checkout-btn").classList.toggle("is-disabled", !KZ.bag.length);
    if (!KZ.bag.length) { wrap.innerHTML = `<p class="kz-empty">Your jhola is empty.<br><a href="${home}#shop">Go find something kaafi zyada →</a></p>`; return; }
    wrap.innerHTML = KZ.bag.map((l, i) => {
      const p = KZ.bySlug(l.slug);
      return `<div class="kz-line">
        <img src="${KZ.photo(p.photos[0])}" alt="">
        <div><a href="product.html?p=${p.slug}">${p.name}</a><span class="kz-small">Size ${l.size}</span>
          <div class="kz-qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
        <div class="kz-line-r"><strong>${KZ.inr(p.price * l.qty)}</strong><button class="kz-link" data-rm="${i}">Remove</button></div></div>`;
    }).join("");
  }
  KZ.renderBag = renderBag;
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]");
    if (q) { const l = KZ.bag[+q.dataset.q]; l.qty += +q.dataset.d; if (l.qty < 1) KZ.bag.splice(+q.dataset.q, 1); KZ.saveBag(); }
    if (rm) { KZ.bag.splice(+rm.dataset.rm, 1); KZ.saveBag(); }
  });
  const drawer = document.getElementById("kz-drawer"), scrim = document.getElementById("kz-scrim");
  KZ.openBag = (open = true) => { drawer.classList.toggle("open", open); scrim.classList.toggle("open", open); drawer.setAttribute("aria-hidden", !open); };
  document.getElementById("kz-bag-btn").onclick = () => KZ.openBag(true);
  document.getElementById("kz-drawer-close").onclick = scrim.onclick = () => KZ.openBag(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape") KZ.openBag(false); });
  renderBag();

  /* ---------- footer (09 — The Final Frame) ---------- */
  const foot = document.getElementById("kz-footer-slot");
  if (foot) foot.outerHTML = `
  <footer class="kz-final" id="final">
    <div class="kz-final-reel" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
    <p class="kz-chip">09 — The Final Frame</p>
    <h2 class="kz-final-title">Phir milenge.</h2>
    <p class="kz-final-sub">Colours with Character. Fashion with a Desi Twist.</p>
    <form class="kz-news" id="kz-news">
      <label for="kz-news-email">Get the next drop in your inbox before anyone else.</label>
      <div><input id="kz-news-email" type="email" required placeholder="you@email.com"><button class="kz-btn" type="submit">Count me in</button></div>
      <p class="kz-small kz-news-msg" aria-live="polite"></p>
    </form>
    <div class="kz-final-cols">
      <div><h4>Shop</h4><a href="${home}#shop">All pieces</a><a href="${home}#tv">Tune into KZ</a><a href="${home}#scrapbook">Scrapbook</a></div>
      <div><h4>Help</h4><a href="policies.html#shipping">Shipping</a><a href="policies.html#returns">Returns &amp; Refunds</a><a href="policies.html#privacy">Privacy</a><a href="policies.html#contact">Contact</a></div>
      <div><h4>Follow</h4><a href="https://instagram.com/kaafizyada.in" target="_blank" rel="noopener">Instagram @kaafizyada.in</a><a href="#" aria-disabled="true">Pinterest</a><a href="#" aria-disabled="true">YouTube</a></div>
    </div>
    <div class="kz-final-word" aria-hidden="true"></div>
    <p class="kz-small kz-copy">© ${new Date().getFullYear()} KAAFIZYADA. All rights reserved.</p>
  </footer>`;
  const news = document.getElementById("kz-news");
  if (news) news.addEventListener("submit", e => { e.preventDefault(); news.querySelector(".kz-news-msg").textContent = "Shukriya! You're on the list."; news.reset(); });

  // header style once page scrolls
  const hdr = document.getElementById("kz-header");
  const onS = () => hdr.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onS, { passive: true }); onS();

  // reveal-on-scroll
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.15 });
  KZ.observe = (root = document) => root.querySelectorAll("[data-reveal]:not(.in)").forEach(el => io.observe(el));
  KZ.observe();
})();
