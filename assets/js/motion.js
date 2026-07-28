/* ============================================================================
   FINAL EDGE — ">_ OS" MOTION SYSTEM  (v3)
   Vanilla JS · no dependencies · progressive enhancement.
   Motion grammar (curves measured on the reference sites):
     movement  : cubic-bezier(.19,1,.22,1)   600–700ms   (Terminal Industries)
     opacity   : cubic-bezier(.39,.575,.565,1) 300–600ms (Terminal Industries)
     hover     : 200ms ease
     ambient   : 1100ms                       (Microsoft AI bg-fade)
   Rules: without JS everything is visible; prefers-reduced-motion skips all.
   ========================================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SCRAMBLE = "!<>-_\\/[]{}=+*^?#";

  function now() { return performance.now(); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ================================================================ BOOT */
  function boot() {
    var el = document.getElementById("boot");
    if (!el) return;
    var skip = reduced;
    try { skip = skip || sessionStorage.getItem("fe_boot") === "1"; } catch (e) {}
    if (skip) { el.remove(); document.documentElement.classList.remove("booting"); return; }

    var done = false;
    function finish() {
      if (done) return; done = true;
      try { sessionStorage.setItem("fe_boot", "1"); } catch (e) {}
      el.classList.add("boot--out");
      document.documentElement.classList.remove("booting");
      setTimeout(function () { el.remove(); }, 460);
    }
    var lines = el.querySelectorAll(".boot__line");
    var t = 120;
    lines.forEach(function (ln) {
      var full = ln.getAttribute("data-line") || "";
      setTimeout(function () {
        ln.classList.add("is-typing");
        var i = 0;
        (function step() {
          ln.textContent = full.slice(0, i);
          if (i++ <= full.length) setTimeout(step, 12);
          else ln.classList.remove("is-typing");
        })();
      }, t);
      t += 110 + full.length * 12;
    });
    setTimeout(finish, Math.min(t + 260, 1650));   // hard cap < 1.7s
    el.addEventListener("click", finish);
    window.addEventListener("keydown", finish, { once: true });
  }

  /* ========================================================= DECODE (h1/h2) */
  function decode(node) {
    var txt = node.getAttribute("data-final") || node.textContent;
    node.setAttribute("data-final", txt);
    var len = txt.length, start = now(), DUR = Math.min(880, 360 + len * 20);
    (function frame() {
      var p = Math.min(1, (now() - start) / DUR);
      var reveal = Math.floor(easeOut(p) * len);
      var out = txt.slice(0, reveal);
      for (var i = reveal; i < len; i++) {
        var c = txt[i];
        out += (c === " " || Math.random() < 0.14) ? c
             : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
      }
      node.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else node.textContent = txt;
    })();
  }

  /* ============================================ EYEBROWS — typed, hot edge */
  /* ">_ 01 EL PROBLEMA" — prompt blue, index from section, last char runs hot
     (Terminal Industries: fresh characters render in accent before settling) */
  function prepEyebrow(section) {
    var eb = section.querySelector(".eyebrow");
    if (!eb || eb.getAttribute("data-armed")) return null;
    var raw = eb.textContent.replace(/\s+/g, " ").trim();
    var label = raw.replace(/^>_\s*/, "");
    var idx = section.getAttribute("data-idx") || "";
    eb.setAttribute("data-armed", "1");
    eb.textContent = "";
    var pr = document.createElement("span"); pr.className = "prompt"; pr.textContent = ">_";
    var ix = document.createElement("span"); ix.className = "eyebrow__idx"; ix.textContent = idx ? idx + " ·" : "";
    var lb = document.createElement("span"); lb.className = "eyebrow__label"; lb.setAttribute("data-full", label);
    eb.appendChild(pr); if (idx) eb.appendChild(ix); eb.appendChild(lb);
    return lb;
  }
  function typeEyebrow(lb) {
    if (!lb) return;
    var full = lb.getAttribute("data-full") || "";
    var i = 0;
    lb.classList.add("is-typing");
    (function step() {
      if (i > full.length) { lb.classList.remove("is-typing"); lb.textContent = full; return; }
      var head = full.slice(0, Math.max(0, i - 1));
      var hot = full.slice(Math.max(0, i - 1), i);
      lb.textContent = "";
      lb.appendChild(document.createTextNode(head));
      if (hot) { var h = document.createElement("span"); h.className = "hot"; h.textContent = hot; lb.appendChild(h); }
      i++; setTimeout(step, 16);
    })();
  }

  /* ==================================================== COUNTERS (odometer) */
  function countUp(scope) {
    var nodes = [];
    (function collect(n) {
      n.childNodes.forEach(function (ch) {
        if (ch.nodeType === 3 && /\d/.test(ch.nodeValue)) nodes.push(ch);
        else if (ch.nodeType === 1) collect(ch);
      });
    })(scope);
    nodes.forEach(function (tn) {
      var tmpl = tn.nodeValue, start = now(), DUR = 1000;
      (function frame() {
        var p = easeOut(Math.min(1, (now() - start) / DUR));
        tn.nodeValue = tmpl.replace(/\d+/g, function (m) { return String(Math.round(parseInt(m, 10) * p)); });
        if (p < 1) requestAnimationFrame(frame); else tn.nodeValue = tmpl;
      })();
    });
  }

  /* ============================================= MANIFESTO — word scrub
     (Terminal Industries dream sequence: grey words fill to white on scroll) */
  var maniWords = [];
  function splitManifesto(showAll) {
    var p = document.querySelector(".manifesto__p");
    if (!p) return;
    var words = p.textContent.replace(/\s+/g, " ").trim().split(" ");
    p.textContent = "";
    maniWords = words.map(function (w, i) {
      var s = document.createElement("span");
      s.className = "w" + (showAll ? " w-on" : "");
      s.textContent = w;
      p.appendChild(s);
      p.appendChild(document.createTextNode(" "));
      return s;
    });
  }
  function scrubManifesto() {
    var sec = document.querySelector(".manifesto");
    if (!sec || !maniWords.length) return;
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.82 - r.top) / (r.height + vh * 0.35);
    p = Math.max(0, Math.min(1, p));
    var on = Math.floor(p * maniWords.length);
    maniWords.forEach(function (w, i) { w.classList.toggle("w-on", i <= on); });
  }

  /* ======================================================== HUD + AMBIENT */
  function hud() {
    var rail = document.getElementById("hud");
    if (!rail) return;
    var links = rail.querySelectorAll("a"), map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("on"); });
        if (map[en.target.id]) map[en.target.id].classList.add("on");
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id); if (s) io.observe(s);
    });
  }
  function ambientAndProgress() {
    var glow = document.getElementById("glow");
    var bar = document.querySelector("#hud .hud__bar i");
    var glowSecs = [].slice.call(document.querySelectorAll("[data-glow]"));
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        if (bar) bar.style.transform = "scaleY(" + (h.scrollTop / (h.scrollHeight - h.clientHeight)) + ")";
        if (glow) {
          var mid = window.innerHeight / 2, onAny = false;
          for (var i = 0; i < glowSecs.length; i++) {
            var r = glowSecs[i].getBoundingClientRect();
            if (r.top < mid && r.bottom > mid) { onAny = true; break; }
          }
          glow.style.opacity = onAny ? "1" : "0";
        }
        scrubManifesto();
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ================================================== SECTION ORCHESTRATOR */
  function arm() {
    if (reduced || !("IntersectionObserver" in window)) { splitManifesto(true); return; }

    splitManifesto(false);

    var sections = [].slice.call(document.querySelectorAll(".hero, .section, .plate, .site-footer"));
    sections.forEach(function (sec) {
      var kids = sec.querySelectorAll(
        ".hero__inner > *, .section__inner > *, .plate__inner > *, .footer__inner > *"
      );
      var d = 0;
      kids.forEach(function (k) {
        k.classList.add("rv");
        k.style.setProperty("--d", Math.min(d, 480) + "ms");
        d += 80;                                        /* 80ms stagger */
      });
      /* log-line stagger for the case list (Terminal OS-readout pattern) */
      sec.querySelectorAll(".cases li").forEach(function (li, i) {
        li.classList.add("rv");
        li.style.setProperty("--d", (i * 60) + "ms");   /* 60ms per log line */
      });
      prepEyebrow(sec);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sec = en.target;
        io.unobserve(sec);
        sec.classList.add("sec-on");
        var lb = sec.querySelector(".eyebrow__label");
        if (lb) typeEyebrow(lb);
        sec.querySelectorAll(".section__inner > h2, .plate__inner > h2 span, .hero h1 span[data-i18n]")
           .forEach(function (h) { decode(h); });
        sec.querySelectorAll(".stats").forEach(countUp);
      });
    }, { threshold: 0.16 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* re-arm text after a language switch wipes the spans */
  document.addEventListener("fe:lang", function () {
    splitManifesto(true);
    document.querySelectorAll("[data-final]").forEach(function (n) { n.removeAttribute("data-final"); });
  });

  function init() { boot(); arm(); hud(); ambientAndProgress(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
