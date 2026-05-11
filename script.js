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
