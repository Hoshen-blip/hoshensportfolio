const supportedLanguages = ["en", "he"];
const supportedThemes = ["light", "dark"];

function readTranslations(lang) {
  const node = document.getElementById(`i18n-${lang}`);
  if (!node?.textContent) return {};

  try {
    return JSON.parse(node.textContent);
  } catch {
    return {};
  }
}

const translations = {
  en: readTranslations("en"),
  he: readTranslations("he")
};

function t(lang, key) {
  return translations[lang]?.[key] ?? translations.en?.[key] ?? "";
}

function setTextTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = t(lang, key);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const key = element.getAttribute("data-i18n-html");
    const value = t(lang, key);
    if (value) element.innerHTML = value;
  });

  document.querySelectorAll("[data-i18n-list]").forEach((element) => {
    const key = element.getAttribute("data-i18n-list");
    const value = t(lang, key);
    if (!value) return;

    element.replaceChildren(
      ...value.split("|").map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      })
    );
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const mappings = element.getAttribute("data-i18n-attr")?.split(",") ?? [];
    mappings.forEach((mapping) => {
      const [attribute, key] = mapping.split(":");
      const value = t(lang, key);
      if (attribute && value) element.setAttribute(attribute, value);
    });
  });
}

function setLanguageButtons(lang) {
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    const buttonLang = button.getAttribute("data-lang-button");
    const isActive = buttonLang === lang;
    button.dataset.active = String(isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const heButton = document.querySelector('[data-lang-button="he"]');
  const enButton = document.querySelector('[data-lang-button="en"]');
  heButton?.setAttribute("aria-label", t(lang, "nav.switchToHebrew"));
  enButton?.setAttribute("aria-label", t(lang, "nav.switchToEnglish"));
}

function setDocumentDirection(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
}

function setActiveNav() {
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const update = () => {
    const current = sections.findLast((section) => section.getBoundingClientRect().top <= 120) ?? sections[0];
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current?.id}`;
      link.classList.toggle("border-color-primary", isActive);
      link.classList.toggle("text-color-text-primary", isActive);
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setNavShadow() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const update = () => {
    nav.classList.toggle("shadow-nav", window.scrollY > 0);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function getPreferredTheme() {
  let stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {}
  if (supportedThemes.includes(stored)) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setThemeButton(theme) {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  const isDark = theme === "dark";
  button.setAttribute("aria-pressed", String(isDark));
  button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function applyTheme(theme, persist = true) {
  const normalized = supportedThemes.includes(theme) ? theme : getPreferredTheme();
  document.documentElement.dataset.theme = normalized;
  document.getElementById("theme-color-meta")?.setAttribute("content", normalized === "dark" ? "#171815" : "#F7F7F2");
  setThemeButton(normalized);
  if (persist) {
    try {
      localStorage.setItem("theme", normalized);
    } catch {}
  }
}

function initTheme() {
  applyTheme(getPreferredTheme(), false);

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    try {
      if (localStorage.getItem("theme")) return;
    } catch {}
    applyTheme(event.matches ? "dark" : "light", false);
  });
}

function applyLanguage(lang) {
  const normalized = supportedLanguages.includes(lang) ? lang : "en";
  setDocumentDirection(normalized);
  setTextTranslations(normalized);
  setLanguageButtons(normalized);
  localStorage.setItem("lang", normalized);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  applyLanguage(localStorage.getItem("lang") || "en");

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.getAttribute("data-lang-button") || "en");
    });
  });

  setNavShadow();
  setActiveNav();
});
