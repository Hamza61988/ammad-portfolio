// ============================
// CUSTOM CURSOR
// ============================
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + "px";
  follower.style.top = followerY + "px";
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effects
document.querySelectorAll("a, button, .portfolio-card, .stat-card, .social-btn").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "16px";
    cursor.style.height = "16px";
    follower.style.width = "50px";
    follower.style.height = "50px";
    follower.style.opacity = "0.3";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "10px";
    cursor.style.height = "10px";
    follower.style.width = "34px";
    follower.style.height = "34px";
    follower.style.opacity = "0.5";
  });
});

// ============================
// DARK MODE TOGGLE
// ============================
const themeToggle = document.getElementById("theme-toggle");
const moonIcon = themeToggle.querySelector(".icon-moon");
const sunIcon = themeToggle.querySelector(".icon-sun");
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (theme === "dark") {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  } else {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  }
}

// ============================
// SMOOTH SCROLL + NAV ACTIVE
// ============================
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

let isManualNavClick = false;
let manualNavTimeout;

// Smooth scroll
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href");
    const targetEl = document.querySelector(target);
    if (targetEl) {
      isManualNavClick = true;
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      clearTimeout(manualNavTimeout);
      manualNavTimeout = setTimeout(() => {
        isManualNavClick = false;
      }, 800);
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length > 1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Active nav link on scroll (ScrollSpy)
function updateActiveNav() {
  if (isManualNavClick) return;

  const scrollPosition = window.scrollY + 220;
  let currentSection = "home";

  if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
    currentSection = "contact";
  } else {
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.id;
      }
    });
  }

  if (currentSection) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-section") === currentSection);
    });
  }
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// ============================
// SCROLL REVEAL ANIMATIONS
// ============================
const revealEls = document.querySelectorAll(".reveal-up, .reveal-card");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ============================
// COUNTER ANIMATION
// ============================
const statNumbers = document.querySelectorAll(".stat-number");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((el) => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"));
  const duration = 1800;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// ============================
// TESTIMONIAL SLIDER
// ============================
const testimonials = document.querySelectorAll(".testimonial-card");
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((t) => t.classList.remove("active"));
  testimonials[index].classList.add("active");
}

document.getElementById("testimonial-next").addEventListener("click", () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

document.getElementById("testimonial-prev").addEventListener("click", () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

// Auto-advance testimonials
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

// ============================
// SCROLL INDICATOR CLICK
// ============================
const scrollIndicator = document.getElementById("scroll-indicator");
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    document.getElementById("portfolio").scrollIntoView({ behavior: "smooth" });
  });
}

// ============================
// PORTFOLIO CARD HOVER TILT
// ============================
document.querySelectorAll(".portfolio-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -5;
    const rotY = ((x - centerX) / centerX) * 5;
    card.style.transform = `translateY(-4px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = "transform 0.1s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    card.style.transition = "transform 0.4s ease";
  });
});

// ============================
// INITIAL HERO ANIMATION
// ============================
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".hero-section .reveal-up").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 150);
    });
  }, 100);
});

// ============================
// HAMBURGER MENU
// ============================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay");
const mobileClose = document.getElementById("mobile-menu-close");

function openMobileMenu() {
  hamburger.classList.add("open");
  mobileMenu.classList.add("open");
  mobileOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
  mobileOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  mobileMenu.classList.contains("open") ? closeMobileMenu() : openMobileMenu();
});

mobileClose.addEventListener("click", closeMobileMenu);
mobileOverlay.addEventListener("click", closeMobileMenu);

// Close when a mobile nav link is clicked
document.querySelectorAll(".mobile-nav-link, .mobile-menu-cta").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});



// ============================
// SMOOTH SCROLLER
// ============================
(function () {
  let current = window.scrollY;
  let target = window.scrollY;
  let raf = null;
  const ease = 0.14; // 0.06 = floaty, 0.18 = snappy

  function update() {
    const delta = target - current;
    if (Math.abs(delta) < 0.5) {
      current = target;
      window.scrollTo(0, current);
      raf = null;
      return;
    }
    current += delta * ease;
    window.scrollTo(0, current);
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    target = Math.max(0, Math.min(target + e.deltaY * 0.7, maxScroll));
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: false });

  // Sync when scroll is triggered externally (nav links, sidebar CTA, etc.)
  window.addEventListener('scroll', () => {
    if (!raf) {
      current = window.scrollY;
      target = window.scrollY;
    }
  }, { passive: true });
})();

