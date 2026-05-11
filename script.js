const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navItems = document.querySelectorAll(".nav-menu a, .nav-menu button");
const counters = document.querySelectorAll("[data-count]");
const backToTop = document.querySelector(".back-to-top");
const year = document.querySelector("#year");
const donationDialog = document.querySelector("#donation-dialog");
const donateButtons = document.querySelectorAll(".donate-toggle");
const donationClose = document.querySelector(".donation-close");
const internalLinks = document.querySelectorAll('a[href^="#"]');
const galleryDialog = document.querySelector("#gallery-dialog");
const galleryImages = Array.from(document.querySelectorAll(".photo-grid img"));
const galleryViewerImage = document.querySelector(".gallery-viewer-image");
const galleryClose = document.querySelector(".gallery-close");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryCounter = document.querySelector(".gallery-counter");
const countdownEdition = document.querySelector("[data-countdown-edition]");
const countdownDate = document.querySelector("[data-countdown-date]");
const countdownDays = document.querySelector("[data-countdown-days]");
const countdownHours = document.querySelector("[data-countdown-hours]");
const countdownMinutes = document.querySelector("[data-countdown-minutes]");
const countdownSeconds = document.querySelector("[data-countdown-seconds]");
let activeGalleryIndex = 0;

if (year) {
  year.textContent = new Date().getFullYear();
}

const padTime = (value) => String(value).padStart(2, "0");

const getNextEvent = (now = new Date()) => {
  const baseEdition = 3;
  const baseDate = new Date("2026-05-16T00:00:00+03:00");
  const eventDate = new Date(baseDate);
  let edition = baseEdition;

  while (now >= eventDate) {
    eventDate.setFullYear(eventDate.getFullYear() + 1);
    edition += 1;
  }

  return { edition, eventDate };
};

const formatEventDate = (eventDate) =>
  new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(eventDate);

const updateCountdown = () => {
  if (
    !countdownEdition ||
    !countdownDate ||
    !countdownDays ||
    !countdownHours ||
    !countdownMinutes ||
    !countdownSeconds
  ) {
    return;
  }

  const now = new Date();
  const { edition, eventDate } = getNextEvent(now);
  const remaining = Math.max(eventDate - now, 0);
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownEdition.textContent = edition;
  countdownDate.textContent = formatEventDate(eventDate);
  countdownDays.textContent = days;
  countdownHours.textContent = padTime(hours);
  countdownMinutes.textContent = padTime(minutes);
  countdownSeconds.textContent = padTime(seconds);
};

updateCountdown();
setInterval(updateCountdown, 1000);

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();

    if (targetId === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    history.pushState(null, "", targetId);
  });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || 0);
  const duration = 1300;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    counter.textContent = target === 1 ? value : `${value}+`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = target === 1 ? "1" : `${target}+`;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

counters.forEach((counter) => counterObserver.observe(counter));

donateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!donationDialog) return;
    if (typeof donationDialog.showModal === "function") {
      donationDialog.showModal();
    } else {
      donationDialog.setAttribute("open", "");
    }
  });
});

if (donationDialog) {
  donationDialog.addEventListener("click", (event) => {
    if (event.target === donationDialog) {
      donationDialog.close();
    }
  });
}

if (donationClose && donationDialog) {
  donationClose.addEventListener("click", () => donationDialog.close());
}

const showGalleryImage = (index) => {
  if (!galleryViewerImage || !galleryCounter || galleryImages.length === 0) return;

  activeGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeGalleryIndex];

  galleryViewerImage.src = image.currentSrc || image.src;
  galleryViewerImage.alt = image.alt;
  galleryCounter.textContent = `${activeGalleryIndex + 1} / ${galleryImages.length}`;
};

const openGallery = (index) => {
  if (!galleryDialog) return;

  showGalleryImage(index);

  if (typeof galleryDialog.showModal === "function") {
    galleryDialog.showModal();
  } else {
    galleryDialog.setAttribute("open", "");
  }
};

const closeGallery = () => {
  if (!galleryDialog) return;

  if (typeof galleryDialog.close === "function") {
    galleryDialog.close();
  } else {
    galleryDialog.removeAttribute("open");
  }
};

galleryImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.addEventListener("click", () => openGallery(index));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(index);
    }
  });
});

if (galleryPrev) {
  galleryPrev.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
}

if (galleryNext) {
  galleryNext.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
}

if (galleryClose) {
  galleryClose.addEventListener("click", closeGallery);
}

if (galleryDialog) {
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) closeGallery();
  });

  galleryDialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
    if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
  });
}

const toggleBackToTop = () => {
  if (!backToTop) return;
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
};

window.addEventListener("scroll", toggleBackToTop, { passive: true });
toggleBackToTop();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
