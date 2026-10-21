/* ==========================================================================
   DOOH.ph — Site behavior
   1. Header turns solid once the page is scrolled
   2. Mobile nav toggle
   3. Products dropdown (hover/focus on desktop, tap on touch)
   4. Highlight the current section in the nav (home page only)
   5. Footer year
   6. Loading screen (home entry only)
   7. Booking page: site picker, details and rates (data lives in js/sites.js)
   ========================================================================== */

initLoader();

document.addEventListener("DOMContentLoaded", () => {
  initHeaderState();
  initNavToggle();
  initDropdown();
  initScrollSpy();
  initBooking();
  setFooterYear();
});

/* ---------- 1. Header state ---------- */
function initHeaderState() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- 2. Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

  // Close after choosing a link (the Products button only opens its menu)
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- 3. Products dropdown ---------- */
function initDropdown() {
  const dropdown = document.querySelector(".nav-dropdown");
  const trigger = dropdown?.querySelector(".nav-dropdown__trigger");
  if (!dropdown || !trigger) return;

  const setOpen = (open) => {
    dropdown.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!dropdown.classList.contains("is-open"));
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/* ---------- 4. Current section in the nav (home page) ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const spyLinks = document.querySelectorAll("[data-spy]");
  if (!sections.length || !spyLinks.length || !document.getElementById("top")) return;

  const setActive = (id) => {
    spyLinks.forEach((link) => {
      const on = link.dataset.spy === id;
      link.classList.toggle("is-active", on);
      if (link.tagName === "A") {
        if (on) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 5. Footer year ---------- */
function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- 6. Loading screen ---------- */
// Runs the coded home-page intro on every home-page load, then fades away
// when the animation and page are ready. Other pages do not include a loader.
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const ANIMATION_MS = 4300;
  const MAX_MS = 6500; // safety net if the page is very slow

  if (document.documentElement.classList.contains("skip-loader")) {
    loader.remove();
    return;
  }
  const typing = document.getElementById("loaderTyping");
  const message = "make your brand stand out";
  let animationDone = false;
  let pageDone = document.readyState === "complete";
  let hidden = false;

  const hide = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add("is-hidden");
    document.documentElement.classList.remove("is-loading");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    setTimeout(() => loader.remove(), 1500);
  };
  const check = () => { if (animationDone && pageDone) hide(); };

  loader.classList.add("is-playing");
  if (typing) {
    message.split("").forEach((character, index) => {
      setTimeout(() => { typing.textContent += character; }, 1050 + index * 48);
    });
  }
  setTimeout(() => {
    animationDone = true;
    check();
  }, ANIMATION_MS);

  if (!pageDone) window.addEventListener("load", () => { pageDone = true; check(); });
  check();
  setTimeout(hide, MAX_MS);

  // Back/forward cache: never show a stale overlay
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      loader.remove();
      document.documentElement.classList.remove("is-loading");
    }
  });
}

/* ---------- 7. Booking page ---------- */
function initBooking() {
  const select = document.getElementById("siteSelect");
  if (!select || typeof SITES === "undefined") return;

  const title = document.getElementById("siteTitle");
  const photoWrap = document.getElementById("sitePhotoWrap");
  const photo = document.getElementById("sitePhoto");
  const spec = document.getElementById("siteSpec");
  const rates = document.getElementById("siteRates");
  const prev = document.getElementById("sitePrev");
  const next = document.getElementById("siteNext");
  const CHEVRON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const price = ([php, usd]) => "\u20B1" + php + (usd ? " / $" + usd : "");
  const indexOfCode = (code) => SITES.findIndex((s) => s.code.toLowerCase() === String(code).toLowerCase());

  // Dropdown
  SITES.forEach((site) => {
    select.add(new Option(site.name + " (" + site.code + ")", site.code));

  });

  function show(index, { push = false } = {}) {
    const site = SITES[index];
    if (!site) return;

    title.textContent = site.name;
    select.value = site.code;

    photoWrap.style.aspectRatio = site.w + " / " + site.h;
    photo.src = "assets/booking/" + site.photo;
    photo.width = site.w;
    photo.height = site.h;
    photo.alt = site.name + " digital billboard";

    const rows = [
      ["Site code", site.code],
      ["Size (feet)", site.feet],
      ["Size (pixels)", site.pixels],
      ["Orientation", site.orient],
      ["Location", site.loc],
    ].filter(([, value]) => value);
    spec.innerHTML = rows.map(([k, v]) => '<div class="spec-row"><dt>' + k + "</dt><dd>" + esc(v) + "</dd></div>").join("");

    const labels = site.labels || RATE_LABELS;
    rates.innerHTML = site.rates
      .map((rate, i) =>
        '<div class="rate"><div class="rate-head"><span>' + esc(labels[i]) + "</span>" + CHEVRON + "</div>" +
        '<p class="rate-price">' + esc(price(rate)) + '</p><p class="rate-note">(per spot) + VAT</p></div>')
      .join("");

    document.title = site.name + " \u2014 Booking | DOOH Philippines";
    prev.disabled = index === 0;
    next.disabled = index === SITES.length - 1;

    if (push) history.replaceState(null, "", "#" + site.code);
  }

  select.addEventListener("change", () => show(select.selectedIndex, { push: true }));
  prev.addEventListener("click", () => show(select.selectedIndex - 1, { push: true }));
  next.addEventListener("click", () => show(select.selectedIndex + 1, { push: true }));

  window.addEventListener("hashchange", () => {
    const i = indexOfCode(location.hash.slice(1));
    if (i > -1) show(i);
  });

  const start = indexOfCode(location.hash.slice(1));
  show(start > -1 ? start : 0);
}
