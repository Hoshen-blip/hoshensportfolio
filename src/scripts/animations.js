function setMetricFinalValues() {
  document.querySelectorAll(".metric-value[data-count-target]").forEach((element) => {
    const target = Number(element.dataset.countTarget);
    if (!Number.isFinite(target)) return;
    const suffix = element.dataset.countSuffix ?? "";
    element.textContent = `${target}${suffix}`;
  });
}

function animateMetric(element) {
  const target = Number(element.dataset.countTarget);
  if (!Number.isFinite(target) || element.dataset.countAnimated === "true") return;

  element.dataset.countAnimated = "true";
  const suffix = element.dataset.countSuffix ?? "";
  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function setupProjectsCarouselDrift() {
  const carousel = document.getElementById("projects-carousel");
  if (!carousel) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const previousButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");
  const DRIFT_SPEED = 0.4;
  let animationId = null;
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let scrollStartX = 0;
  let resumeTimer = null;

  const cancelDrift = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const drift = () => {
    if (!isPaused && !isDragging) {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (maxScroll > 0) {
        carousel.scrollLeft += DRIFT_SPEED;

        if (carousel.scrollLeft >= maxScroll - 2) {
          carousel.scrollLeft = 0;
        }
      }
    }

    animationId = requestAnimationFrame(drift);
  };

  const startDrift = () => {
    if (reducedMotionQuery.matches || animationId !== null) return;
    animationId = requestAnimationFrame(drift);
  };

  const getPointerX = (pageX) => pageX - carousel.offsetLeft;
  const getScrollStep = () => {
    const firstCard = carousel.querySelector(".project-card");
    if (!firstCard) return carousel.clientWidth * 0.85;
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollByCard = (direction) => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (maxScroll <= 0) return;

    const nextLeft = carousel.scrollLeft + getScrollStep() * direction;
    carousel.scrollTo({
      left: nextLeft > maxScroll ? maxScroll : Math.max(nextLeft, 0),
      behavior: reducedMotionQuery.matches ? "auto" : "smooth"
    });
  };

  const pauseBriefly = () => {
    isPaused = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      isPaused = false;
    }, 1400);
  };

  previousButton?.addEventListener("click", () => {
    pauseBriefly();
    scrollByCard(-1);
  });

  nextButton?.addEventListener("click", () => {
    pauseBriefly();
    scrollByCard(1);
  });

  carousel.addEventListener("mouseenter", () => {
    window.clearTimeout(resumeTimer);
    isPaused = true;
  });

  carousel.addEventListener("mouseleave", () => {
    isPaused = false;
    isDragging = false;
    carousel.style.cursor = "";
    carousel.style.userSelect = "";
  });

  carousel.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = getPointerX(event.pageX);
    scrollStartX = carousel.scrollLeft;
    carousel.style.cursor = "grabbing";
    carousel.style.userSelect = "none";
  });

  carousel.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    const x = getPointerX(event.pageX);
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollStartX - walk;
  });

  carousel.addEventListener("mouseup", () => {
    isDragging = false;
    carousel.style.cursor = "";
    carousel.style.userSelect = "";
  });

  carousel.addEventListener(
    "touchstart",
    (event) => {
      isDragging = true;
      startX = getPointerX(event.touches[0].pageX);
      scrollStartX = carousel.scrollLeft;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;
      const x = getPointerX(event.touches[0].pageX);
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollStartX - walk;
    },
    { passive: true }
  );

  carousel.addEventListener("touchend", () => {
    isDragging = false;
  });

  reducedMotionQuery.addEventListener("change", (event) => {
    if (event.matches) {
      cancelDrift();
      return;
    }

    startDrift();
  });

  startDrift();
}

document.addEventListener("DOMContentLoaded", () => {
  setupProjectsCarouselDrift();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll("[data-reveal]");
  const metricElements = document.querySelectorAll(".metric-value[data-count-target]");
  const fadeSections = document.querySelectorAll(".section-fade");

  if (reducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    fadeSections.forEach((section) => section.classList.add("is-visible"));
    setMetricFinalValues();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    fadeSections.forEach((section) => section.classList.add("is-visible"));
    setMetricFinalValues();
    return;
  }

  document.documentElement.classList.add("reveal-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateMetric(entry.target);
        metricObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  metricElements.forEach((element) => metricObserver.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.classList.remove("is-leaving");
        } else {
          const rect = entry.target.getBoundingClientRect();
          if (rect.top < 0) {
            entry.target.classList.add("is-leaving");
            entry.target.classList.remove("is-visible");
          } else {
            entry.target.classList.remove("is-visible", "is-leaving");
          }
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
  );

  fadeSections.forEach((section) => sectionObserver.observe(section));
});
