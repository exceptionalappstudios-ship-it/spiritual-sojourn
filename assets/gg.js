/* Gyaan Ganga 2026 · page behaviour
   ------------------------------------------------------------------
   EDIT THIS BLOCK. Everything else can stay as it is.
   ------------------------------------------------------------------ */
var GG = {
  // Page 1 (pay): where every "Reserve my seat" button goes.
  // Replace with your payment link if it is different from the registration link.
  PAYMENT_URL: "https://tinyurl.com/GyaanGanga2026",

  // Page 2 (register): where people go after they submit their WhatsApp number.
  REGISTER_URL: "https://tinyurl.com/GyaanGanga2026",

  // Optional: a Google Apps Script web-app URL that saves WhatsApp numbers to a sheet.
  // Leave "" to skip saving. See README.md for the 2-minute setup.
  LEAD_ENDPOINT: "",

  // Countdown target (India time) and the last day of the event.
  EVENT_START: "2026-11-06T06:00:00+05:30",
  EVENT_END: "2026-11-12T23:59:00+05:30",

  // Optional seats meter. Only shown when BOTH numbers are set, so it never shows a made-up figure.
  // Example: SEATS_TOTAL: 3000, SEATS_LEFT: 410
  SEATS_TOTAL: null,
  SEATS_LEFT: null,

  // Optional Meta Pixel ID for this event (fires PageView, InitiateCheckout and Lead). Leave "" to skip.
  PIXEL_ID: ""
};
/* ------------------------------------------------------------------ */

(function () {
  "use strict";
  var d = document, w = window, root = d.documentElement;
  root.classList.add("js");
  var MODE = d.body.getAttribute("data-mode"); // "pay" or "lead"

  /* ---- Meta Pixel (optional) ---- */
  function track(ev, data) { try { if (w.fbq) w.fbq("track", ev, data || {}); } catch (e) {} }
  if (GG.PIXEL_ID) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(w, d, "script", "https://connect.facebook.net/en_US/fbevents.js");
    w.fbq("init", GG.PIXEL_ID); track("PageView");
  }

  /* ---- CTA links ---- */
  var ctas = d.querySelectorAll("[data-cta]");
  for (var i = 0; i < ctas.length; i++) {
    var a = ctas[i];
    if (MODE === "pay") {
      a.href = GG.PAYMENT_URL;
      a.addEventListener("click", function () { track("InitiateCheckout", { content_name: "Gyaan Ganga 2026" }); });
    } else {
      a.href = GG.REGISTER_URL; // fallback if the step below fails
      a.addEventListener("click", function (e) { e.preventDefault(); openSheet(); });
    }
  }

  /* ---- Countdown ---- */
  var start = Date.parse(GG.EVENT_START), end = Date.parse(GG.EVENT_END);
  var counts = d.querySelectorAll("[data-count]");
  var labels = d.querySelectorAll("[data-count-label]");
  var stickyTime = d.querySelector("[data-sticky-time]");
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tickCount() {
    var now = Date.now(), diff = start - now, k, j;
    if (diff <= 0) {
      var live = now < end;
      for (k = 0; k < labels.length; k++) labels[k].textContent = live ? "Guru Sanidhya is happening now" : "Guru Sanidhya 2026 has concluded";
      for (k = 0; k < counts.length; k++) counts[k].style.display = "none";
      if (stickyTime) stickyTime.textContent = live ? "Happening now · last seats" : "Thank you for joining";
      return false;
    }
    var s = Math.floor(diff / 1000), dd = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
    var vals = [dd, pad(hh), pad(mm), pad(ss)];
    for (k = 0; k < counts.length; k++) {
      var b = counts[k].querySelectorAll("b");
      for (j = 0; j < b.length && j < 4; j++) if (b[j].textContent != vals[j]) b[j].textContent = vals[j];
    }
    if (stickyTime) stickyTime.textContent = "Begins in " + dd + "d " + pad(hh) + "h " + pad(mm) + "m " + pad(ss) + "s";
    return true;
  }
  if (tickCount()) var cd = setInterval(function () { if (!tickCount()) clearInterval(cd); }, 1000);

  /* ---- Seats meter (only with real numbers) ---- */
  var seatEls = d.querySelectorAll("[data-seats]");
  if (GG.SEATS_TOTAL && GG.SEATS_LEFT !== null && GG.SEATS_LEFT >= 0) {
    var pct = Math.max(4, Math.min(100, Math.round((1 - GG.SEATS_LEFT / GG.SEATS_TOTAL) * 100)));
    for (var q = 0; q < seatEls.length; q++) {
      var el = seatEls[q]; el.hidden = false;
      el.querySelector("[data-seats-left]").textContent = GG.SEATS_LEFT.toLocaleString("en-IN");
      el.querySelector("[data-seats-pct]").textContent = pct + "%";
      (function (bar) { setTimeout(function () { bar.style.width = pct + "%"; }, 400); })(el.querySelector(".bar i"));
    }
  }

  /* ---- Reveal on scroll + pause loops off-screen ---- */
  var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in w) {
    var rv = d.querySelectorAll(".rv");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    for (var r = 0; r < rv.length; r++) io.observe(rv[r]);
    // Safety net for very fast flings: after scrolling stops, show anything already passed.
    var settle;
    w.addEventListener("scroll", function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var left = d.querySelectorAll(".rv:not(.in)"), vh = w.innerHeight;
        for (var t = 0; t < left.length; t++) if (left[t].getBoundingClientRect().top < vh) left[t].classList.add("in");
      }, 160);
    }, { passive: true });

    var loops = d.querySelectorAll("[data-loop]");
    var lo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("off", !e.isIntersecting); });
    });
    for (var l = 0; l < loops.length; l++) lo.observe(loops[l]);

    /* sticky bar: show once the hero button has scrolled away, hide near the final call to action */
    var sticky = d.querySelector(".sticky"), heroCta = d.querySelector("#hero-cta"), finalSec = d.querySelector("#final");
    if (sticky && heroCta) {
      var heroGone = false, finalIn = false;
      var upd = function () { sticky.classList.toggle("on", heroGone && !finalIn); };
      new IntersectionObserver(function (es) { heroGone = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; upd(); }).observe(heroCta);
      if (finalSec) new IntersectionObserver(function (es) { finalIn = es[0].isIntersecting; upd(); }, { threshold: 0.25 }).observe(finalSec);
    }
  } else {
    var all = d.querySelectorAll(".rv"); for (var z = 0; z < all.length; z++) all[z].classList.add("in");
  }
  if (reduce) { var allr = d.querySelectorAll(".rv"); for (var y = 0; y < allr.length; y++) allr[y].classList.add("in"); }

  /* ---- Page 2: WhatsApp step ---- */
  var modal = d.getElementById("wa-step");
  if (!modal || MODE !== "lead") return;
  var sheet = modal.querySelector(".sheet"), form = modal.querySelector("form"), input = modal.querySelector("input[type=tel]"),
      box = modal.querySelector(".phone"), err = modal.querySelector(".err"), go = modal.querySelector("[data-go]"), lastFocus = null;

  try { var saved = localStorage.getItem("gg_wa"); if (saved) input.value = saved; } catch (e) {}
  go.href = GG.REGISTER_URL;

  function openSheet() {
    lastFocus = d.activeElement;
    modal.classList.add("on"); modal.setAttribute("aria-hidden", "false");
    d.body.style.overflow = "hidden";
    setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 250);
    track("ViewContent", { content_name: "Gyaan Ganga WhatsApp step" });
  }
  function closeSheet() {
    modal.classList.remove("on"); modal.setAttribute("aria-hidden", "true");
    d.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  w.openSheet = openSheet;
  modal.querySelector(".scrim").addEventListener("click", closeSheet);
  modal.querySelector(".x").addEventListener("click", closeSheet);
  d.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("on")) closeSheet(); });

  function clean(v) {
    v = String(v || "").replace(/\D/g, "");
    if (v.length > 10 && v.indexOf("91") === 0) v = v.slice(2);
    if (v.length === 11 && v.charAt(0) === "0") v = v.slice(1);
    return v;
  }
  input.addEventListener("input", function () {
    var v = input.value.replace(/[^\d\s+]/g, "");
    if (v !== input.value) input.value = v;
    box.classList.remove("bad"); err.textContent = "";
  });

  function utm() {
    var out = {}, p = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach(function (k) { if (p.get(k)) out[k] = p.get(k); });
    return out;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var num = clean(input.value);
    if (!/^[6-9]\d{9}$/.test(num)) {
      box.classList.add("bad");
      err.textContent = "Please enter a valid 10-digit WhatsApp number.";
      input.focus(); return;
    }
    try { localStorage.setItem("gg_wa", num); } catch (e2) {}
    if (GG.LEAD_ENDPOINT) {
      var data = new URLSearchParams(Object.assign({ phone: "+91" + num, page: location.pathname, ts: new Date().toISOString() }, utm()));
      var sent = false;
      try { sent = navigator.sendBeacon && navigator.sendBeacon(GG.LEAD_ENDPOINT, data); } catch (e3) {}
      if (!sent) { try { fetch(GG.LEAD_ENDPOINT, { method: "POST", mode: "no-cors", body: data, keepalive: true }); } catch (e4) {} }
    }
    track("Lead", { content_name: "Gyaan Ganga 2026" });
    sheet.classList.add("sent");
    setTimeout(function () { location.href = GG.REGISTER_URL; }, 1400);
  });
})();
