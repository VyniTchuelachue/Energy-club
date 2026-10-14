(function () {
  "use strict";

  var DATA = window.EC_DATA;
  var I18N = window.EC_I18N;
  var WEEK = [1, 2, 3, 4, 5, 6, 0]; // lundi en premier

  var lang = "fr";
  try {
    var saved = localStorage.getItem("ec-lang");
    if (saved === "fr" || saved === "en") lang = saved;
  } catch (e) { /* stockage indisponible : on reste en français */ }

  function dyn() {
    return I18N.dyn[lang];
  }

  // ---------- Heure de Douala (UTC+1, sans heure d'été) ----------

  function doualaNow() {
    var d = new Date(Date.now() + 60 * 60 * 1000);
    return { day: d.getUTCDay(), mins: d.getUTCHours() * 60 + d.getUTCMinutes() };
  }

  function formatTime(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    if (lang === "en") {
      var suffix = h >= 12 ? "pm" : "am";
      var h12 = h % 12 === 0 ? 12 : h % 12;
      return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + " " + suffix;
    }
    return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
  }

  function toMins(hhmm) {
    var parts = hhmm.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  // ---------- Ouvert / fermé ----------

  function renderStatus() {
    var el = document.querySelector("[data-status]");
    if (!el) return;
    var now = doualaNow();
    var today = DATA.hours[now.day];
    var open = now.mins >= today[0] && now.mins < today[1];
    var text;
    if (open) {
      text = dyn().open.replace("{t}", formatTime(today[1]));
    } else if (now.mins < today[0]) {
      text = dyn().opensToday.replace("{t}", formatTime(today[0]));
    } else {
      text = dyn().opensTomorrow.replace("{t}", formatTime(DATA.hours[(now.day + 1) % 7][0]));
    }
    el.classList.toggle("is-open", open);
    el.querySelector("[data-status-text]").textContent = text;
    el.hidden = false;
  }

  function renderHours() {
    var today = String(doualaNow().day);
    document.querySelectorAll(".hours tr").forEach(function (row) {
      var range = row.querySelector("[data-range]").dataset.range.split(",").map(Number);
      row.querySelector("[data-range]").textContent = formatTime(range[0]) + " – " + formatTime(range[1]);
      row.classList.toggle("is-today", row.dataset.days.split(",").indexOf(today) !== -1);
    });
  }

  // ---------- Planning ----------

  var tabsEl = document.querySelector("[data-tabs]");
  var panelEl = document.querySelector("[data-panel]");
  var activeDay = doualaNow().day;

  function renderPlanning() {
    if (!tabsEl || !panelEl) return;
    tabsEl.textContent = "";

    WEEK.forEach(function (day) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "tab";
      tab.id = "tab-" + day;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", "planning-panel");
      tab.setAttribute("aria-selected", String(day === activeDay));
      tab.tabIndex = day === activeDay ? 0 : -1;
      tab.dataset.day = day;
      tab.textContent = dyn().daysShort[day];
      tab.setAttribute("aria-label", dyn().days[day]);
      tabsEl.appendChild(tab);
    });

    panelEl.setAttribute("aria-labelledby", "tab-" + activeDay);
    panelEl.textContent = "";
    var list = document.createElement("ol");
    DATA.planning[activeDay].forEach(function (s) {
      var li = document.createElement("li");
      li.className = "slot slot--" + s[3];
      var time = document.createElement("span");
      time.className = "slot__time";
      time.textContent = formatTime(toMins(s[0]));
      var name = document.createElement("span");
      name.className = "slot__name";
      name.textContent = s[1];
      var room = document.createElement("span");
      room.className = "slot__room";
      room.textContent = dyn().rooms[s[2]];
      li.append(time, name, room);
      list.appendChild(li);
    });
    panelEl.appendChild(list);
  }

  function selectDay(day, focus) {
    activeDay = day;
    renderPlanning();
    var tab = document.getElementById("tab-" + day);
    if (tab) {
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  if (tabsEl) {
    tabsEl.addEventListener("click", function (e) {
      var tab = e.target.closest(".tab");
      if (tab) selectDay(Number(tab.dataset.day), true);
    });

    tabsEl.addEventListener("keydown", function (e) {
      var i = WEEK.indexOf(activeDay);
      if (e.key === "ArrowRight") i = (i + 1) % 7;
      else if (e.key === "ArrowLeft") i = (i + 6) % 7;
      else if (e.key === "Home") i = 0;
      else if (e.key === "End") i = 6;
      else return;
      e.preventDefault();
      selectDay(WEEK[i], true);
    });
  }

  // ---------- Activités : la photo suit la ligne survolée ----------

  var acts = document.querySelectorAll(".act");
  acts.forEach(function (act) {
    function activate() {
      acts.forEach(function (a) { a.classList.toggle("is-active", a === act); });
    }
    act.addEventListener("mouseenter", activate);
    act.addEventListener("focusin", activate);
  });

  // ---------- Menu mobile ----------

  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  // ---------- Demande de visite ----------

  var form = document.querySelector("[data-visit-form]");
  var daySelect = document.querySelector("[data-day-select]");

  function renderDayOptions() {
    if (!daySelect) return;
    var current = daySelect.value || String(doualaNow().day);
    daySelect.textContent = "";
    WEEK.forEach(function (day) {
      var opt = document.createElement("option");
      opt.value = day;
      opt.textContent = dyn().days[day];
      daySelect.appendChild(opt);
    });
    daySelect.value = current;
  }

  function visitMessage() {
    var fd = new FormData(form);
    var d = dyn();
    var lines = [
      d.msgHello,
      d.msgName.replace("{v}", String(fd.get("name")).trim()),
      d.msgWhen.replace("{d}", d.days[Number(fd.get("day"))]).replace("{w}", d.when[fd.get("when")])
    ];
    var interests = fd.getAll("interest").map(function (k) { return d.interests[k]; });
    if (interests.length) lines.push(d.msgInterest.replace("{v}", interests.join(", ")));
    return lines.join("\n");
  }

  if (form) {
    var nameInput = form.elements.name;
    var nameError = form.querySelector("[data-error]");

    nameInput.addEventListener("input", function () {
      if (nameInput.value.trim()) {
        nameInput.removeAttribute("aria-invalid");
        nameError.hidden = true;
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!nameInput.value.trim()) {
        nameInput.setAttribute("aria-invalid", "true");
        nameError.hidden = false;
        nameInput.focus();
        return;
      }
      var message = encodeURIComponent(visitMessage());
      var via = e.submitter && e.submitter.value;
      if (via === "email") {
        window.location.href = "mailto:" + DATA.email + "?subject=" + encodeURIComponent(dyn().mailSubject) + "&body=" + message;
      } else {
        window.open("https://wa.me/" + DATA.phone + "?text=" + message, "_blank", "noopener");
      }
    });
  }

  // « Parler à un coach » coche l'intérêt correspondant dans le formulaire.
  document.querySelectorAll("[data-interest]").forEach(function (link) {
    link.addEventListener("click", function () {
      var box = form && form.querySelector('input[name="interest"][value="' + link.dataset.interest + '"]');
      if (box) box.checked = true;
    });
  });

  // ---------- Langue ----------

  var frText = new Map();
  var frAttrs = new Map();

  function applyLang() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!frText.has(el)) frText.set(el, el.innerHTML);
      var en = I18N.en[el.dataset.i18n];
      el.innerHTML = lang === "en" && en != null ? en : frText.get(el);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      if (!frAttrs.has(el)) frAttrs.set(el, {});
      var cache = frAttrs.get(el);
      el.dataset.i18nAttr.split(";").forEach(function (pair) {
        var attr = pair.split(":")[0];
        var en = I18N.en[pair.split(":")[1]];
        if (!(attr in cache)) cache[attr] = el.getAttribute(attr);
        el.setAttribute(attr, lang === "en" && en != null ? en : cache[attr]);
      });
    });

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    var tarifsLink = document.querySelector("[data-wa-tarifs]");
    if (tarifsLink) tarifsLink.href = "https://wa.me/" + DATA.phone + "?text=" + encodeURIComponent(dyn().tarifs);

    renderStatus();
    renderHours();
    renderPlanning();
    renderDayOptions();
  }

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      lang = btn.dataset.lang;
      try { localStorage.setItem("ec-lang", lang); } catch (e) { /* sans stockage, le choix vaut pour la page */ }
      applyLang();
    });
  });

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  applyLang();
  setInterval(function () { renderStatus(); renderHours(); }, 60 * 1000);
})();
