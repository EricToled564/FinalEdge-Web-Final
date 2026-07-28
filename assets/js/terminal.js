/* ============================================================================
   FINAL EDGE — ">_" ASSISTANT TERMINAL
   Interactive command panel. Every substantive line it prints comes from the
   existing FE_I18N dictionary (nothing invented). Patterns implemented from
   the Agentic-UX research: status signals, intent preview, failure legibility.
   Vanilla JS · no backend · reduced-motion prints instantly.
   ========================================================================= */
(function () {
  "use strict";

  var root = document.getElementById("term");
  if (!root) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var out = root.querySelector(".term__out");
  var input = root.querySelector(".term__input");
  var chipsBox = root.querySelector(".term__chips");

  function lang() { return (document.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es"; }
  function dict() { return (window.FE_I18N || {})[lang()] || {}; }
  function strip(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

  var CMDS = {
    es: { help: "ayuda", phases: "fases", cases: "casos", edge: "ventaja", cta: "valoracion", clear: "limpiar" },
    en: { help: "help",  phases: "phases", cases: "cases", edge: "edge",   cta: "assessment", clear: "clear" }
  };
  var UI = {
    es: {
      hint: "escribe un comando — p. ej.",
      unknown: function (c) { return "no reconozco “" + c + "”. prueba: " + CMDS.es.help; },
      ok: "ok", ready: "listo_"
    },
    en: {
      hint: "type a command — e.g.",
      unknown: function (c) { return "I don't recognize “" + c + "”. try: " + CMDS.en.help; },
      ok: "ok", ready: "ready_"
    }
  };

  /* ---------------------------------------------------------- printing -- */
  var queue = [], printing = false;
  function print(text, cls) { queue.push({ t: text, c: cls || "" }); drain(); }
  function drain() {
    if (printing) return;
    var item = queue.shift();
    if (!item) return;
    printing = true;
    var line = document.createElement("div");
    line.className = "term__line " + item.c;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
    if (reduced) {
      line.textContent = item.t; printing = false; drain(); return;
    }
    var i = 0;
    (function step() {
      line.textContent = item.t.slice(0, i);
      out.scrollTop = out.scrollHeight;
      if (i++ <= item.t.length) setTimeout(step, 6);
      else { printing = false; setTimeout(drain, 40); }
    })();
  }

  /* ---------------------------------------------------------- commands -- */
  function run(cmdRaw) {
    var L = lang(), D = dict(), C = CMDS[L], T = UI[L];
    var cmd = (cmdRaw || "").trim().toLowerCase();
    if (!cmd) return;
    print(">_ " + cmd, "term__cmd");

    if (cmd === C.clear) { queue = []; out.innerHTML = ""; return; }

    if (cmd === C.help || cmd === "?") {
      print("[" + T.ok + "] " + T.hint);
      print("  " + C.phases + "  ·  " + C.cases + "  ·  " + C.edge + "  ·  " + C.cta + "  ·  " + C.clear);
      return;
    }
    if (cmd === C.phases) {
      print("[" + T.ok + "] " + strip(D["engine.h2"] || ""));
      ["p1", "p2", "p3"].forEach(function (p) {
        print("> " + (D["engine." + p + ".tag"] || ""), "term__tag");
        print("  " + (D["engine." + p + ".desc"] || ""));
      });
      return;
    }
    if (cmd === C.cases) {
      print("[" + T.ok + "] " + strip(D["cases.h2"] || ""));
      for (var i = 1; i <= 6; i++) print("> " + strip(D["cases.c" + i] || ""));
      return;
    }
    if (cmd === C.edge) {
      print("[" + T.ok + "] " + strip(D["edge.h2"] || ""));
      print("> " + (D["edge.c1.h"] || "") + " — " + (D["edge.c1.p"] || ""));
      print("> " + (D["edge.c2.h"] || "") + " — " + (D["edge.c2.p"] || ""));
      return;
    }
    if (cmd === C.cta) {
      /* intent preview: say what happens, then hand over the existing CTA */
      print("[" + T.ok + "] " + strip(D["plate.p"] || ""));
      print("→ " + strip(D["plate.cta"] || ""), "term__go");
      return;
    }
    /* failure legibility: name what failed, offer the recovery path */
    print(T.unknown(cmd), "term__err");
  }

  /* ------------------------------------------------------------- wiring -- */
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { run(input.value); input.value = ""; }
  });
  root.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-cmd]");
    if (chip) { run(chip.getAttribute("data-cmd")); input.focus(); }
    else if (e.target === root || e.target === out) input.focus();
  });

  function renderChips() {
    var L = lang(), C = CMDS[L];
    chipsBox.innerHTML = "";
    [C.phases, C.cases, C.edge, C.cta, C.help].forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("data-cmd", c); b.textContent = c;
      chipsBox.appendChild(b);
    });
  }
  document.addEventListener("fe:lang", renderChips);
  renderChips();

  /* auto-demo once, when the terminal scrolls into view */
  var demoDone = false;
  function demo() {
    if (demoDone) return; demoDone = true;
    var L = lang(), C = CMDS[L], T = UI[L];
    print(T.ready);
    if (reduced) { run(C.phases); return; }
    var word = C.phases, i = 0;
    setTimeout(function type() {
      input.value = word.slice(0, i);
      if (i++ <= word.length) setTimeout(type, 70);
      else setTimeout(function () { input.value = ""; run(word); }, 240);
    }, 500);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es, io) {
      es.forEach(function (en) { if (en.isIntersecting) { demo(); io.disconnect(); } });
    }, { threshold: 0.4 }).observe(root);
  } else demo();
})();
