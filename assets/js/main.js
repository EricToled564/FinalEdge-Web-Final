/* ============================================================================
   FINAL EDGE — runtime
   - native bilingual switch (ES/EN), persisted + URL ?lang + browser default
   - hero video resilience (autoplay/mute/loop, pause when offscreen)
   ========================================================================= */
(function () {
  "use strict";
  var DICT = window.FE_I18N || {};
  var SUPPORTED = ["es", "en"];
  var KEY = "fe-lang";

  function resolveInitialLang() {
    var url = new URLSearchParams(location.search).get("lang");
    if (url && SUPPORTED.indexOf(url) !== -1) return url;
    var saved = localStorage.getItem(KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : "es";
  }

  function apply(lang) {
    var dict = DICT[lang] || DICT.es;
    document.documentElement.lang = dict["html.lang"] || lang;

    // text + html nodes
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v == null) return;
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = v;
      else el.textContent = v;
    });
    // attributes: data-i18n-attr="title:key;aria-label:key"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2 && dict[p[1]] != null) el.setAttribute(p[0].trim(), dict[p[1]]);
      });
    });
    // document meta
    if (dict["meta.title"]) document.title = dict["meta.title"];
    var md = document.querySelector('meta[name="description"]');
    if (md && dict["meta.desc"]) md.setAttribute("content", dict["meta.desc"]);

    // toggle pressed state
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    localStorage.setItem(KEY, lang);
  }

  function initLangToggle() {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () { apply(btn.getAttribute("data-lang")); });
    });
  }

  function initHeroVideo() {
    var v = document.querySelector(".hero__video");
    if (!v) return;
    v.muted = true; v.playsInline = true;
    var tryPlay = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    if (v.readyState >= 2) tryPlay(); else v.addEventListener("canplay", tryPlay, { once: true });

    // save battery: pause when the hero scrolls out of view
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? tryPlay() : v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(resolveInitialLang());
    initLangToggle();
    initHeroVideo();
  });
})();
