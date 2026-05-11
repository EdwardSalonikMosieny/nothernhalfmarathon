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
let activeGalleryIndex = 0;

if (year) {
  year.textContent = new Date().getFullYear();
}

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
