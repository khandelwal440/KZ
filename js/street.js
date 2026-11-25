/* Hand-drawn KAAFIZYADA street, drawn live with rough.js.
   drawStreet(svg, mode) — mode "bw" (pencil sketch) or "color" (brand palette).
   Every shape keeps a fixed seed, so the colour version is the same drawing, painted in. */
(function () {
  const C = { rani: "#c10046", cream: "#f3ecdc", teal: "#009e9e", plum: "#501943", blue: "#003b8b", orange: "#fc5425", ink: "#1d1a1a" };
  const NS = "http://www.w3.org/2000/svg";

  window.drawStreet = function (svg, mode, opt = {}) {
    const color = mode === "color";
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("viewBox", "0 0 1600 900");
    const rc = rough.svg(svg);
    let seed = 7;
    const ink = color ? "#2b1630" : "#2a2a2a";
    const layer = (id) => { const g = document.createElementNS(NS, "g"); if (id) g.id = id.startsWith("kz-") ? id : "st-" + id; svg.appendChild(g); return g; };

    // grey for sketch mode, colour for colour mode
    function o(fill, extra = {}) {
      const base = { seed: ++seed, stroke: ink, strokeWidth: 1.6, roughness: 1.3, bowing: 1.2 };
      if (fill) {
        if (color) Object.assign(base, { fill, fillStyle: extra.fs || "solid" , fillWeight: 1.4, hachureGap: 5 });
        else Object.assign(base, { fill: extra.g || "#7b7b7b", fillStyle: "hachure", hachureGap: extra.gap || 7, fillWeight: 0.7, hachureAngle: extra.ang || -41 });
      }
      return Object.assign(base, extra.o || {});
    }
    const add = (g, n) => (g.appendChild(n), n);
    const R = (g, x, y, w, h, f, e) => add(g, rc.rectangle(x, y, w, h, o(f, e)));
    const P = (g, d, f, e) => add(g, rc.path(d, o(f, e)));
    const L = (g, x1, y1, x2, y2, e) => add(g, rc.line(x1, y1, x2, y2, o(null, e)));
    const E = (g, x, y, w, h, f, e) => add(g, rc.ellipse(x, y, w, h, o(f, e)));
    const POLY = (g, pts, f, e) => add(g, rc.polygon(pts, o(f, e)));
    const T = (g, x, y, txt, size, fill, cls, anchor = "middle") => {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", x); t.setAttribute("y", y); t.setAttribute("font-size", size);
      t.setAttribute("text-anchor", anchor); t.setAttribute("fill", fill); if (cls) t.setAttribute("class", cls);
      t.textContent = txt; g.appendChild(t); return t;
    };

    /* ---------- sky + far skyline ---------- */
    const sky = layer("sky");
    if (color) {
      const r = document.createElementNS(NS, "rect"); r.setAttribute("width", 1600); r.setAttribute("height", 900); r.setAttribute("fill", "#f6d9c4"); sky.appendChild(r);
      E(sky, 1300, 150, 150, 150, C.orange, { o: { stroke: "none" } }); // sun
    }
    // distant domes + water tank skyline
    const far = layer("far");
    const fo = { o: { strokeWidth: 1, roughness: 1.6, stroke: color ? "#8a5a7e" : "#9a9a9a" }, g: "#bdbdbd", gap: 10 };
    P(far, "M430 330 L430 250 Q470 190 510 250 L510 330 Z", color ? "#e7b9c9" : "x", fo);
    L(far, 470, 200, 470, 175, fo);
    R(far, 1080, 250, 70, 80, color ? "#9fd3cf" : "x", fo);
    POLY(far, [[1075, 250], [1115, 225], [1155, 250]], color ? "#9fd3cf" : "x", fo);

    /* ---------- wires + crow + kite ---------- */
    const wires = layer("wires");
    P(wires, "M0 120 Q400 190 800 140 T1600 150", null, { o: { strokeWidth: 1.1 } });
    P(wires, "M0 150 Q420 230 820 175 T1600 190", null, { o: { strokeWidth: 1.1 } });
    // crow on wire
    P(wires, "M760 140 q10 -18 26 -10 q8 -6 14 2 l-8 4 q-2 12 -18 14 z", C.ink, { g: "#333", gap: 2 });
    L(wires, 776, 150, 774, 158); L(wires, 784, 150, 786, 158);
    // kite
    const kite = layer("kite");
    POLY(kite, [[1420, 60], [1450, 95], [1420, 135], [1390, 95]], C.rani, { g: "#888", gap: 5 });
    L(kite, 1390, 95, 1450, 95); L(kite, 1420, 60, 1420, 135);
    P(kite, "M1420 135 q-10 30 10 55 q20 25 -5 60", null, { o: { strokeWidth: 1 } });

    /* ---------- LEFT: haveli with jharokha ---------- */
    const hav = layer("haveli");
    R(hav, -10, 230, 450, 560, C.rani, { g: "#9d9d9d", gap: 11, ang: 60 });
    // cornice + parapet bumps
    R(hav, -20, 215, 470, 26, C.orange, { g: "#555", gap: 4 });
    for (let i = 0; i < 8; i++) P(hav, `M${i * 58} 215 q14 -28 28 0`, C.cream, { g: "#ccc" });
    // jharokha balcony
    P(hav, "M110 470 L110 360 Q110 300 165 290 Q220 300 220 360 L220 470 Z", C.plum, { g: "#444", gap: 4 });
    P(hav, "M125 470 L125 365 Q125 315 165 307 Q205 315 205 365 L205 470 Z", C.teal, { g: "#666", gap: 6, ang: 45 });
    P(hav, "M90 290 Q165 230 240 290 Z", C.orange, { g: "#555", gap: 5 }); // chhatri roof
    E(hav, 165, 232, 16, 16, C.cream);
    R(hav, 85, 470, 160, 22, C.cream, { g: "#bbb" });
    for (let i = 0; i < 6; i++) P(hav, `M${92 + i * 26} 492 l13 22 l13 -22`, null);
    // lower window + bricks texture
    R(hav, 290, 380, 90, 120, C.blue, { g: "#555", gap: 5 });
    L(hav, 335, 380, 335, 500); L(hav, 290, 440, 380, 440);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) R(hav, 270 + c * 52 + (r % 2) * 26, 560 + r * 26, 46, 20, null, { o: { strokeWidth: 0.8, roughness: 1.8, stroke: color ? "#7d1135" : "#777" } });
    // tree (like a neem) in front
    const tree = layer("tree");
    P(tree, "M60 790 C70 700 50 640 75 560 C90 520 70 470 95 430", null, { o: { strokeWidth: 3 } });
    P(tree, "M78 560 C110 530 150 520 170 480", null, { o: { strokeWidth: 2.2 } });
    for (const [x, y, w] of [[90, 400, 190], [180, 430, 150], [30, 450, 140], [130, 340, 150]])
      E(tree, x, y, w, w * 0.72, color ? "#2f8f6b" : "x", { g: "#666", gap: 6, ang: 20, fs: "zigzag" });
    // swing hanging from branch
    L(tree, 150, 500, 150, 640); L(tree, 200, 470, 200, 640);
    R(tree, 138, 640, 74, 10, C.orange, { g: "#555" });

    /* ---------- CENTER: KAAFIZYADA shop ---------- */
    const shop = layer("shop");
    R(shop, 470, 190, 620, 600, C.cream, { g: "#c9c9c9", gap: 14, ang: 30 });
    // scalloped parapet
    let pd = "M460 190";
    for (let i = 0; i < 10; i++) pd += ` q32 -34 64 0`;
    P(shop, pd + " L1100 200 L460 200 Z", C.rani, { g: "#777", gap: 5 });
    // pillars
    for (const x of [490, 1030]) { R(shop, x, 300, 40, 490, C.teal, { g: "#777", gap: 6 }); R(shop, x - 8, 290, 56, 18, C.orange); R(shop, x - 8, 772, 56, 18, C.orange); }
    // signboard
    const sign = layer("kz-sign");
    R(sign, 600, 225, 360, 86, C.blue, { g: "#333", gap: 3, ang: -20 });
    R(sign, 612, 236, 336, 64, null, { o: { stroke: color ? C.cream : "#ddd", strokeWidth: 1.2 } });
    T(sign, 780, 285, "kaafizyada", 52, color ? C.cream : "#f2f2f2", "kz-sign-text");
    // bulbs around sign
    for (let i = 0; i < 9; i++) E(sign, 610 + i * 42.5, 220, 9, 9, color ? "#ffd166" : "#eee", { o: { roughness: 0.6 } });
    // multifoil arch door frame
    const arch = "M600 790 L600 470 Q600 455 612 450 Q605 420 630 405 Q630 375 660 370 Q675 340 705 345 Q735 318 780 320 Q825 318 855 345 Q885 340 900 370 Q930 375 930 405 Q955 420 948 450 Q960 455 960 470 L960 790 Z";
    P(shop, arch, C.rani, { g: "#555", gap: 4, ang: 50 });
    const archIn = "M630 790 L630 480 Q630 470 640 466 Q635 442 655 430 Q656 405 680 400 Q693 377 718 380 Q745 355 780 357 Q815 355 842 380 Q867 377 880 400 Q904 405 905 430 Q925 442 920 466 Q930 470 930 480 L930 790 Z";
    P(shop, archIn, C.plum, { g: "#222", gap: 3 });
    // door glow (revealed when doors open)
    const glow = document.createElementNS(NS, "path"); glow.setAttribute("d", archIn); glow.setAttribute("id", "kz-door-glow");
    glow.setAttribute("fill", color ? C.rani : "#fff8"); shop.appendChild(glow);
    // the two door leaves (clickable)
    const door = layer("kz-door");
    const leafL = document.createElementNS(NS, "g"); leafL.id = "kz-leaf-l"; door.appendChild(leafL);
    const leafR = document.createElementNS(NS, "g"); leafR.id = "kz-leaf-r"; door.appendChild(leafR);
    P(leafL, "M640 790 L640 486 Q660 410 778 372 L778 790 Z", C.teal, { g: "#555", gap: 5, ang: 0 });
    P(leafR, "M782 790 L782 372 Q900 410 920 486 L920 790 Z", C.teal, { g: "#555", gap: 5, ang: 0 });
    for (const [g, x] of [[leafL, 660], [leafR, 800]]) {
      R(g, x, 520, 100, 110, C.orange, { g: "#888", gap: 6 });
      R(g, x, 650, 100, 120, C.orange, { g: "#888", gap: 6 });
      E(g, x + 50, 575, 34, 34, C.cream); E(g, x + 50, 710, 34, 34, C.cream);
    }
    E(leafL, 765, 600, 10, 10, "#d4a017"); E(leafR, 795, 600, 10, 10, "#d4a017");
    // KZ mark sticker on the door (the logo motif)
    const knock = document.createElementNS(NS, "use"); knock.setAttribute("href", "#kz-mark-sym");
    knock.setAttribute("x", 748); knock.setAttribute("y", 430); knock.setAttribute("width", 64); knock.setAttribute("height", 66);
    knock.setAttribute("class", "door-mark"); door.appendChild(knock);
    // steps
    R(shop, 590, 790, 380, 16, C.orange, { g: "#999" });
    R(shop, 570, 806, 420, 16, C.cream, { g: "#bbb" });
    // lanterns
    for (const x of [570, 990]) {
      L(shop, x, 330, x, 380);
      P(shop, `M${x - 18} 380 L${x + 18} 380 L${x + 12} 430 L${x - 12} 430 Z`, color ? "#ffd166" : "x", { g: "#aaa", gap: 4 });
      P(shop, `M${x - 22} 380 Q${x} 360 ${x + 22} 380`, C.rani);
    }
    // potted plants (tulsi) both sides
    for (const x of [545, 1015]) {
      P(shop, `M${x - 30} 740 L${x + 30} 740 L${x + 22} 790 L${x - 22} 790 Z`, C.orange, { g: "#777", gap: 4 });
      for (let i = -2; i <= 2; i++) P(shop, `M${x} 740 q${i * 14} -40 ${i * 22} -66`, null, { o: { stroke: color ? "#2f8f6b" : ink } });
      for (let i = -2; i <= 2; i++) E(shop, x + i * 22, 674, 18, 12, color ? "#2f8f6b" : "x", { g: "#666", gap: 3 });
    }
    // bunting
    const bunt = layer("bunting");
    P(bunt, "M470 330 Q780 400 1090 330", null, { o: { strokeWidth: 1.2 } });
    const bcol = [C.rani, C.teal, C.orange, C.blue, C.plum, "#ffd166"];
    for (let i = 0; i < 13; i++) {
      const t = (i + 0.5) / 13, x = 470 + 620 * t, y = 330 + 4 * 70 * t * (1 - t) * 0.92;
      POLY(bunt, [[x - 17, y], [x + 17, y + 2], [x, y + 34]], bcol[i % 6], { g: "#888", gap: 4, ang: i * 20 });
    }

    /* ---------- RIGHT: shutter shop + balcony ---------- */
    const rt = layer("right");
    R(rt, 1110, 250, 520, 540, C.teal, { g: "#a5a5a5", gap: 12, ang: -55 });
    R(rt, 1100, 236, 540, 22, C.plum, { g: "#444", gap: 3 });
    // shutter
    R(rt, 1170, 540, 300, 250, "#f4a6be", { g: "#ccc", gap: 9, ang: 0 });
    for (let i = 0; i < 12; i++) L(rt, 1170, 552 + i * 20, 1470, 552 + i * 20, { o: { strokeWidth: 0.9, roughness: 0.8 } });
    R(rt, 1160, 500, 320, 40, C.cream, { g: "#ddd" });
    T(rt, 1320, 530, "AMAR  CHAI  CORNER", 22, color ? C.plum : "#333", "kz-hand");
    // balcony with drying dupatta
    R(rt, 1200, 300, 120, 130, C.blue, { g: "#555", gap: 5 }); L(rt, 1260, 300, 1260, 430);
    R(rt, 1380, 300, 120, 130, C.blue, { g: "#555", gap: 5 }); L(rt, 1440, 300, 1440, 430);
    R(rt, 1180, 430, 340, 16, C.cream);
    for (let i = 0; i < 14; i++) L(rt, 1186 + i * 24, 446, 1186 + i * 24, 480, { o: { strokeWidth: 1 } });
    L(rt, 1180, 480, 1520, 480);
    P(rt, "M1200 455 Q1360 470 1510 452", null, { o: { strokeWidth: 1 } });
    P(rt, "M1300 462 L1300 505 Q1320 515 1345 504 L1350 466 Z", C.orange, { g: "#888", gap: 4 });
    P(rt, "M1380 465 L1378 498 Q1400 506 1420 497 L1424 462 Z", C.rani, { g: "#888", gap: 4 });
    // AC box
    R(rt, 1530, 330, 60, 44, C.cream, { g: "#ddd" });
    for (let i = 0; i < 4; i++) L(rt, 1536, 340 + i * 8, 1584, 340 + i * 8, { o: { strokeWidth: 0.8 } });

    /* ---------- ground ---------- */
    const ground = layer("ground");
    R(ground, -20, 790, 1640, 130, color ? "#e9c99e" : "x", { g: "#b5b5b5", gap: 13, ang: 8 });
    for (let i = 0; i < 18; i++) L(ground, 40 + i * 92, 830 + (i % 3) * 18, 90 + i * 92, 832 + (i % 3) * 18, { o: { strokeWidth: 0.8 } });

    /* ---------- props: chai thela, scooter, cat ---------- */
    const props = layer("props");
    // thela
    R(props, 1190, 700, 210, 70, C.orange, { g: "#777", gap: 5 });
    R(props, 1180, 690, 230, 14, C.cream);
    E(props, 1225, 785, 34, 34, C.plum); E(props, 1365, 785, 34, 34, C.plum);
    P(props, "M1230 690 q-4 -40 16 -44 h24 q20 4 16 44", "#b8b8b8", { g: "#999", gap: 3 }); // kettle
    P(props, "M1286 662 q24 -2 26 -16", null);
    for (let i = 0; i < 4; i++) R(props, 1310 + i * 18, 668, 12, 22, C.cream);
    P(props, "M1250 640 q-8 -14 4 -26 q10 -12 0 -24", null, { o: { strokeWidth: 0.9, stroke: color ? "#8a7a7a" : "#777" } }); // steam
    L(props, 1405, 700, 1450, 660, { o: { strokeWidth: 2 } });
    // scooter (generic vintage scooter)
    const sc = layer("scooter");
    P(sc, "M180 760 Q170 700 230 690 L330 690 Q370 690 380 730 L390 760 Z", C.teal, { g: "#666", gap: 5 });
    P(sc, "M380 760 L410 640 L430 640", null, { o: { strokeWidth: 2.2 } });
    L(sc, 400, 640, 450, 630, { o: { strokeWidth: 2 } });
    E(sc, 430, 625, 22, 14, color ? "#ffd166" : "#ddd");
    R(sc, 230, 676, 90, 16, C.plum, { g: "#333", gap: 3 });
    E(sc, 215, 770, 46, 46, "#333", { g: "#333", gap: 2 }); E(sc, 395, 770, 46, 46, "#333", { g: "#333", gap: 2 });
    E(sc, 215, 770, 16, 16, C.cream); E(sc, 395, 770, 16, 16, C.cream);
    // cat
    const cat = layer("cat");
    P(cat, "M1060 790 q-6 -40 18 -52 q-4 -16 4 -24 l8 12 q8 -3 16 0 l8 -12 q8 8 4 24 q24 12 18 52 z", color ? "#e0a96d" : "x", { g: "#888", gap: 4 });
    P(cat, "M1136 786 q30 -4 26 -36", null, { o: { strokeWidth: 1.6 } });
    E(cat, 1088, 734, 4, 4, ink); E(cat, 1104, 734, 4, 4, ink);

    /* ---------- figures (illustrated looks) ---------- */
    if (opt.figures !== false) {
      const figs = layer("figures");
      const list = [
        ["assets/img/kf-look-royal-bloom-blouse.webp", 270, 470, 330],
        ["assets/img/kf-look-gulabi-drape-top.webp", 410, 482, 318],
        ["assets/img/kf-look-noor-corset-top.webp", 1060, 474, 326],
        ["assets/img/kf-look-sheer-mehfil-top.webp", 1440, 466, 334]
      ];
      list.forEach(([src, x, y, h], i) => {
        const im = document.createElementNS(NS, "image");
        im.setAttribute("href", src); im.setAttribute("x", x - h * 0.24); im.setAttribute("y", y);
        im.setAttribute("width", h * 0.48); im.setAttribute("height", h);
        im.setAttribute("preserveAspectRatio", "xMidYMax meet");
        im.setAttribute("class", "fig fig-" + i);
        figs.appendChild(im);
      });
    }
    return svg;
  };
})();
