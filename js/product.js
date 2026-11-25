/* Product page — a small fashion editorial: gallery, Discover the Details, Style It Your Way, Shop the Complete Look */
(function () {
  const slug = new URLSearchParams(location.search).get("p") || KZ.products[0].slug;
  const p = KZ.bySlug(slug) || KZ.products[0];
  document.title = `${p.name} — KAAFIZYADA`;
  const SIZES = ["XS", "S", "M", "L", "XL"];
  const off = Math.round((1 - p.price / p.was) * 100);
  const gallery = p.photos.map(KZ.photo).concat(p.look ? [p.look] : []);
  const detailImg = p.look || KZ.photo(p.photos[0]);
  const pairCard = (s) => { const q = KZ.bySlug(s); return `
    <article class="mini">
      <a href="product.html?p=${q.slug}"><img src="${KZ.photo(q.photos[0])}" alt="${q.name}" loading="lazy"></a>
      <div><a href="product.html?p=${q.slug}" class="mini-name">${q.name}</a>
      <p class="card-price"><s>${KZ.inr(q.was)}</s> <b>${KZ.inr(q.price)}</b></p>
      <div class="mini-add"><select aria-label="Size for ${q.name}">${SIZES.map(z => `<option${z === "M" ? " selected" : ""}>${z}</option>`).join("")}</select><button class="kz-btn kz-btn-sm" data-add-pair="${q.slug}">Add</button></div></div>
    </article>`; };

  document.getElementById("pdp").innerHTML = `
  <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="index.html#shop">The Drop</a> / <span>${p.name}</span></nav>
  <section class="pdp-top">
    <div class="pdp-gallery">
      <div class="pdp-main ${gallery[0] === p.look ? "is-look" : ""}" id="pdp-main"><img src="${gallery[0]}" alt="${p.name}"></div>
      <div class="pdp-thumbs">${gallery.map((g, i) => `<button class="${i ? "" : "on"} ${g === p.look ? "is-look" : ""}" data-g="${i}" aria-label="View image ${i + 1}"><img src="${g}" alt=""></button>`).join("")}</div>
    </div>
    <div class="pdp-info">
      <p class="kz-chip">${p.type === "top" ? "Tops" : "Bottoms"} · Drop 01</p>
      <h1>${p.name}</h1>
      <p class="pdp-tag">${p.tagline}</p>
      <p class="pdp-price"><b>${KZ.inr(p.price)}</b> <s>${KZ.inr(p.was)}</s> <span>${off}% off</span></p>
      <p class="kz-small">Inclusive of all taxes. Shipping calculated at checkout.</p>
      <fieldset class="pdp-sizes"><legend>Size</legend>${SIZES.map(z => `<label><input type="radio" name="size" value="${z}"${z === "M" ? " checked" : ""}><span>${z}</span></label>`).join("")}</fieldset>
      <div class="pdp-buy">
        <div class="kz-qty pdp-qty"><button id="q-" aria-label="Decrease">−</button><span id="q">1</span><button id="q+" aria-label="Increase">+</button></div>
        <button class="kz-btn" id="add">Add to bag</button>
        <button class="kz-btn kz-btn-ghost" id="buy">Buy now</button>
      </div>
      <p class="pdp-desc">${p.desc}</p>
      <details><summary>Shipping &amp; returns</summary><p>Orders are dispatched with tracking. Unused, unworn pieces with tags intact can be returned — see our <a href="policies.html#returns">returns policy</a>.</p></details>
      <details><summary>Need help with size?</summary><p>Message us on Instagram <a href="https://instagram.com/kaafizyada.in" target="_blank" rel="noopener">@kaafizyada.in</a> and we’ll help you pick.</p></details>
    </div>
  </section>

  <section class="pdp-sec details">
    <div class="pdp-sec-head"><p class="kz-chip">Discover the Details</p><h2 class="kz-h2">Tap the dots.</h2><p>Every point tells you what went into the ${p.type === "top" ? "neckline, print and silhouette" : "cut and finish"}.</p></div>
    <div class="details-wrap">
      <div class="details-fig ${p.look ? "is-look" : ""}">
        <img src="${detailImg}" alt="${p.name} illustration">
        ${p.details.map((d, i) => `<button class="hot" style="left:${d.x}%;top:${d.y}%" data-hot="${i}" aria-label="${d.k}"><span>${i + 1}</span></button>`).join("")}
      </div>
      <ol class="details-list">${p.details.map((d, i) => `<li data-hot="${i}"><b>${d.k}</b><span>${d.v}</span></li>`).join("")}</ol>
    </div>
  </section>

  ${p.styles.length ? `
  <section class="pdp-sec styles">
    <div class="pdp-sec-head"><p class="kz-chip">Style It Your Way</p><h2 class="kz-h2">One top. Three moods.</h2></div>
    <div class="style-tabs" role="tablist">${p.styles.map((s, i) => `<button role="tab" class="${i ? "" : "on"}" data-st="${i}">${String(i + 1).padStart(2, "0")} · ${s.t}</button>`).join("")}</div>
    <div class="style-stage" id="style-stage"></div>
  </section>` : ""}

  <section class="pdp-sec pairs">
    <div class="pdp-sec-head"><p class="kz-chip">Shop the Complete Look</p><h2 class="kz-h2">Goes well with.</h2></div>
    <div class="pairs-grid">${p.pairs.map(pairCard).join("")}</div>
  </section>`;

  // gallery
  const main = document.getElementById("pdp-main");
  document.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
    document.querySelectorAll("[data-g]").forEach(x => x.classList.toggle("on", x === b));
    main.classList.toggle("is-look", gallery[+b.dataset.g] === p.look);
    main.querySelector("img").src = gallery[+b.dataset.g];
  });
  // qty + add
  let qty = 1; const qEl = document.getElementById("q");
  document.getElementById("q-").onclick = () => { qty = Math.max(1, qty - 1); qEl.textContent = qty; };
  document.getElementById("q+").onclick = () => { qty++; qEl.textContent = qty; };
  const size = () => document.querySelector("input[name=size]:checked").value;
  document.getElementById("add").onclick = () => { KZ.add(p.slug, size(), qty); KZ.openBag(true); };
  document.getElementById("buy").onclick = () => { KZ.add(p.slug, size(), qty); location.href = "checkout.html"; };
  // hotspots
  const setHot = (i) => document.querySelectorAll("[data-hot]").forEach(el => el.classList.toggle("on", +el.dataset.hot === i));
  document.querySelectorAll("[data-hot]").forEach(el => { el.addEventListener("click", () => setHot(+el.dataset.hot)); el.addEventListener("mouseenter", () => setHot(+el.dataset.hot)); });
  setHot(0);
  // style it your way
  const stage = document.getElementById("style-stage");
  function renderStyle(i) {
    const s = p.styles[i], q = KZ.bySlug(s.pair);
    document.querySelectorAll("[data-st]").forEach(b => b.classList.toggle("on", +b.dataset.st === i));
    stage.innerHTML = `
      <div class="style-board">
        <div class="style-fig"><img src="${p.look}" alt="${p.name} styled"><span class="style-tag">${s.t}</span></div>
        <div class="style-copy">
          <h3>${s.t}</h3><p class="style-d">${s.d}</p>
          <p class="kz-small">From KAAFIZYADA, complete the look with:</p>
          <div class="style-pieces">
            <div class="mini mini-row"><img src="${KZ.photo(p.photos[0])}" alt=""><div><span class="mini-name">${p.name}</span><b>${KZ.inr(p.price)}</b></div></div>
            <div class="mini mini-row"><a href="product.html?p=${q.slug}"><img src="${KZ.photo(q.photos[0])}" alt=""></a><div><a class="mini-name" href="product.html?p=${q.slug}">${q.name}</a><b>${KZ.inr(q.price)}</b></div></div>
          </div>
          <button class="kz-btn" data-look="${q.slug}">Add both to bag · ${KZ.inr(p.price + q.price)}</button>
          <p class="kz-small">Adds both pieces in your selected size (${"<span class='sel-size'>" + size() + "</span>"}).</p>
        </div>
      </div>`;
  }
  if (stage) {
    document.querySelectorAll("[data-st]").forEach(b => b.onclick = () => renderStyle(+b.dataset.st));
    renderStyle(0);
    document.querySelectorAll("input[name=size]").forEach(r => r.addEventListener("change", () => { const e = stage.querySelector(".sel-size"); if (e) e.textContent = size(); }));
  }
  document.addEventListener("click", e => {
    const lk = e.target.closest("[data-look]");
    if (lk) { KZ.add(p.slug, size()); KZ.add(lk.dataset.look, size()); KZ.openBag(true); }
    const pr = e.target.closest("[data-add-pair]");
    if (pr) KZ.add(pr.dataset.addPair, pr.parentElement.querySelector("select").value);
  });
})();
