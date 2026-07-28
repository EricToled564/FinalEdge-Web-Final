/* ============================================================================
   FINAL EDGE — MOTION SYSTEM  (v3 · ">_ as operating system")
   Vanilla JS. No dependencies. Progressive enhancement only:
   - Without JS, every element is fully visible and readable (SEO/AA safe).
   - With prefers-reduced-motion, all sequences are skipped.
   Reference moves: Terminal Industries (decode/scan), Lazarev (counters),
   Subduxion (HUD rail), Microsoft AI (calm easing/pacing).
   ========================================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
  var SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";

  /* ------------------------------------------------------------------ utils */
  function raf(fn) { return requestAnimationFrame(fn); }
  function now() { return performance.now(); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ==========================================================================
     1 · BOOT SEQUENCE — terminal init on first visit per session (~1.1s)
     ======================================================================= */
  function boot() {
    var el = document.getElementById("boot");
    if (!el) return;
    var done = false;
    function finish() {
      if (done) return; done = true;
      el.classList.add("boot--out");
      setTimeout(function () { el.remove(); document.documentElement.classList.remove("booting"); }, 380);
      try { sessionStorage.setItem("fe_boot", "1"); } catch (e) {}
    }
    if (reduced || (function(){ try { return sessionStorage.getItem("fe_boot")==="1"; } catch(e){ return false; } })()) {
      el.remove(); document.documentElement.classList.remove("booting"); return;
    }
    document.documentElement.classList.add("booting");
    var lines = el.querySelectorAll(".boot__line");
    var t = 90;
    lines.forEach(function (ln) {
      var full = ln.getAttribute("data-line") || "";
      setTimeout(function () { typeLine(ln, full, 11); }, t);
      t += 90 + full.length * 11;
    });
    setTimeout(finish, t + 240);
    el.addEventListener("click", finish);           // always skippable
    window.addEventListener("keydown", finish, { once: true });
  }
  function typeLine(node, text, speed) {
    var i = 0;
    node.classList.add("is-typing");
    (function step() {
      node.textContent = text.slice(0, i);
      if (i++ <= text.length) setTimeout(step, speed);
      else node.classList.remove("is-typing");
    })();
  }

  /* ==========================================================================
     2 · DECODE / SCRAMBLE — headlines resolve from noise (Terminal Industries)
     Fixed-width mono ⇒ zero layout shift while characters cycle.
     ======================================================================= */
  function scramble(node) {
    var finalText = node.getAttribute("data-final");
    var len = finalText.length;
    var start = now(), DUR = Math.min(900, 380 + len * 22);
    (function frame() {
      var p = Math.min(1, (now() - start) / DUR);
      var reveal = Math.floor(easeOut(p) * len);
      var out = finalText.slice(0, reveal);
      for (var i = reveal; i < len; i++) {
        var c = finalText[i];
        out += (c === " " || Math.random() < 0.12) ? c
             : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      node.textContent = out;
      if (p < 1) raf(frame);
      else node.textContent = finalText;
    })();
  }

  /* ==========================================================================
     3 · TYPED EYEBROWS — section eyebrows type in like commands
     ======================================================================= */
  function typeEyebrow(node) {
    var target = node.querySelector("[data-type]");
    if (!target) return;
    var full = target.getAttribute("data-full");
    var i = 0;
    target.classList.add("is-typing");
    (function step() {
      target.textContent = full.slice(0, i);
      if (i++ <= full.length) setTimeout(step, 17);
      else target.classList.remove("is-typing");
    })();
  }

  /* ==========================================================================
     4 · COUNTERS — stats count up on entry (Lazarev)
     ======================================================================= */
  function countUp(node) {
    var runs = [];
    (function collect(n) {
      n.childNodes.forEach(function (ch) {
        if (ch.nodeType === 3 && /\d/.test(ch.nodeValue)) runs.push(ch);
        else if (ch.nodeType === 1) collect(ch);
      });
    })(node);
    runs.forEach(function (tn) {
      var tmpl = tn.nodeValue;
      var start = now(), DUR = 950;
      (function frame() {
        var p = easeOut(Math.min(1, (now() - start) / DUR));
        tn.nodeValue = tmpl.replace(/\d+/g, function (m) {
          return String(Math.round(parseInt(m, 10) * p));
        });
        if (p < 1) raf(frame); else tn.nodeValue = tmpl;
      })();
    });
  }

  /* ==========================================================================
     5 · REVEALS — calm fade+rise, staggered per section (Microsoft AI pacing)
     ======================================================================= */
  function arm() {
    if (reduced || !("IntersectionObserver" in window)) return;

    // arm reveal targets (JS adds the hidden state ⇒ no-JS users see all)
    var targets = document.querySelectorAll(
      ".section__inner > *, .plate__inner > *, .footer__inner > *, .hero__inner > *"
    );
    targets.forEach(function (t, i) { t.classList.add("rv"); });

    // headline decode targets
    document.querySelectorAll("h1 span[data-i18n], .section h2, .plate h2 span").forEach(function (h) {
      if (!h.getAttribute("data-final")) h.setAttribute("data-final", h.textContent);
      h.classList.add("dc");
    });

    // eyebrow typing targets: wrap text after the prompt
    document.querySelectorAll(".eyebrow").forEach(function (eb) {
      var parts = [];
      eb.childNodes.forEach(function (ch) {
        if (ch.nodeType === 3 && ch.nodeValue.trim()) parts.push(ch);
        if (ch.nodeType === 1 && !ch.classList.contains("prompt")) parts.push(ch);
      });
      parts.forEach(function (p) {
        var span = document.createElement("span");
        span.setAttribute("data-type", "");
        span.setAttribute("data-full", p.textContent);
        span.textContent = p.textContent;
        p.parentNode ? eb.replaceChild(span, p) : null;
      });
    });

    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || seen.has(en.target)) return;
        seen.add(en.target);
        var sec = en.target;

        // stagger the reveal of the section's children
        var kids = sec.querySelectorAll(".rv");
        kids.forEach(function (k, i) {
          k.style.transitionDelay = Math.min(i * 80, 480) + "ms";
          k.classList.add("rv--on");
        });
        // decode its headlines
        sec.querySelectorAll(".dc").forEach(function (h) {
          if (h.getAttribute("data-final")) scramble(h);
        });
        // type its eyebrow
        var eb = sec.querySelector(".eyebrow");
        if (eb) typeEyebrow(eb);
        // counters
        sec.querySelectorAll(".stats").forEach(function (s) { countUp(s); });
        io.unobserve(sec);
      });
    }, { threshold: 0.18 });

    document.querySelectorAll(".section, .plate, .hero, .site-footer").forEach(function (s) { io.observe(s); });
  }

  /* ==========================================================================
     6 · HUD RAIL — engineering index 01…N + scroll progress (Subduxion)
     ======================================================================= */
  function hud() {
    var rail = document.getElementById("hud");
    if (!rail) return;
    var links = rail.querySelectorAll("a");
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("on"); });
        var a = map[en.target.id];
        if (a) a.classList.add("on");
      });
    }, { rootMargin: "-42% 0px -42% 0px" });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });

    var bar = rail.querySelector(".hud__bar i");
    if (bar) {
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return; ticking = true;
        raf(function () {
          var h = document.documentElement;
          var p = h.scrollTop / (h.scrollHeight - h.clientHeight);
          bar.style.transform = "scaleY(" + p + ")";
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ==========================================================================
     init
     ======================================================================= */
  function init() { boot(); arm(); hud(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
