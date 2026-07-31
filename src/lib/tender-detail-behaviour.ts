// @ts-nocheck
/* eslint-disable */
/* Ported verbatim from residensi-sinaran-detail.html (design canon).
   Behaviour is DOM-driven so the markup stays identical to the handoff HTML. */
export function initDetailPage(): () => void {
  const timers: number[] = [];
  const setInterval = (fn: TimerHandler, ms?: number) => {
    const id = window.setInterval(fn, ms);
    timers.push(id);
    return id;
  };
  void setInterval;

  /* Deep-link to the e-tender panel. The two countdown blocks that used to live here are
     GONE: they wrote into #tender-days-left, .t2-days-wrap, #cd-days and #cd-d, none of
     which survived the panel revamp — so they had been dead for a while, while still
     carrying a HARDCODED "2028-12-31" that ignored the listing data entirely. Every
     deadline on this page is React-rendered from SINARAN_TENDER.closingDate now. */
  (function () {
    var section = document.getElementById("tender");
    if (!section) return;
    if (window.location.hash === "#tender") {
      window.requestAnimationFrame(function () { section.scrollIntoView({ block: "start" }); });
    }
  })();

  // ── Sticky tender bar: reveal only when the primary tender action leaves view ──
  (function () {
    var bar = document.getElementById("bidbar");
    var action = document.getElementById("tender-action-panel");
    if (!bar || !action) return;
    function setVisible(show) {
      bar.classList.toggle("show", show);
      bar.setAttribute("aria-hidden", String(!show));
    }
    if (!("IntersectionObserver" in window)) {
      window.addEventListener("scroll", function () { setVisible(action.getBoundingClientRect().bottom < 80); }, { passive: true });
      return;
    }
    new IntersectionObserver(function (entries) {
      setVisible(!entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
    }, { threshold: 0.05 }).observe(action);
  })();

  /* GALLERY + LIGHTBOX REMOVED — both are React state in ResidensiSinaranDetail now.
     They lived here as DOM code and that is precisely what broke: the thumb handler
     APPENDED a seventh tile to a three-row grid, deforming the section permanently on
     one click, and the viewer had no navigation despite a hint promising all 7 photos.
     Anything React renders must be driven by React state — same rule that fixed the
     About toggle. Do not re-add DOM handlers for these. */

  /* Video / Drone media modal removed — no footage exists for this property. */

  // ── Save / Share ──
  (function () {
    var s = document.getElementById("save-btn");
    s.addEventListener("click", function () {
      var on = s.classList.toggle("on");
      s.setAttribute("aria-pressed", String(on));
      s.querySelector("span").textContent = on ? "Saved" : "Save";
    });
    document.getElementById("share-btn").addEventListener("click", function () {
      if (navigator.share) { navigator.share({ title: "Residensi Sinaran — TenderProp", url: location.href }).catch(function(){}); }
      else if (navigator.clipboard) { navigator.clipboard.writeText(location.href); }
    });
  })();

  // ── Scroll-spy sub-nav ──
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll(".subnav a"));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          if (map[en.target.id]) {
            map[en.target.id].classList.add("active");
            map[en.target.id].scrollIntoView({ inline: "nearest", block: "nearest" });
          }
        }
      });
    }, { rootMargin: "-135px 0px -62% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  })();

  // ── About view more: REMOVED 30 Jul. Now React state (`aboutOpen`) in
  //    ResidensiSinaranDetail. The imperative version only bound on mount, so a hot reload
  //    rebuilt the DOM without re-running the effect and the button went dead. Anything
  //    React renders must be driven by React state, not by a listener attached here. ──

  /* Price history tabs removed with the Price History section. */

  // ── FAQ accordion ──
  document.querySelectorAll(".faq-trigger").forEach(function (t) {
    t.addEventListener("click", function () {
      var open = t.getAttribute("aria-expanded") === "true";
      t.setAttribute("aria-expanded", String(!open));
      t.nextElementSibling.classList.toggle("open", !open);
    });
  });

  // ── Mortgage calculator ──
  (function () {
    var $ = function (id) { return document.getElementById(id); };
    function fmt(n) { return "RM " + Math.round(n).toLocaleString("en-MY"); }
    function calc() {
      var price = parseFloat($("c-price").value) || 0;
      var down = (parseFloat($("c-down").value) || 0) / 100;
      var years = parseInt($("c-tenure").value, 10) || 35;
      var rate = (parseFloat($("c-rate").value) || 0) / 100 / 12;
      var loan = price * (1 - down);
      var n = years * 12;
      var monthly = rate > 0 ? loan * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1) : loan / n;
      $("c-monthly").textContent = fmt(monthly);
      $("c-loan").textContent = fmt(loan);
      $("c-interest").textContent = fmt(monthly * n - loan);
      $("c-total").textContent = fmt(monthly * n);
    }
    ["c-price", "c-down", "c-tenure", "c-rate"].forEach(function (id) {
      $(id).addEventListener("input", calc);
      $(id).addEventListener("change", calc);
    });
    calc();
  })();

  return () => timers.forEach((id) => window.clearInterval(id));
}
