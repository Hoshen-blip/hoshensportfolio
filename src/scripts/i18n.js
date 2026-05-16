const supportedLanguages = ["en", "he"];

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

function applyLanguage(lang) {
  const normalized = supportedLanguages.includes(lang) ? lang : "en";
  setDocumentDirection(normalized);
  setTextTranslations(normalized);
  setLanguageButtons(normalized);
  localStorage.setItem("lang", normalized);
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(localStorage.getItem("lang") || "en");

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.getAttribute("data-lang-button") || "en");
    });
  });

  setNavShadow();
  setActiveNav();
});
