const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#nav");

if (toggle && nav) {
  const openLabel = toggle.dataset.labelOpen || "Open menu";
  const closeLabel = toggle.dataset.labelClose || "Close menu";

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? closeLabel : openLabel);
  });
}

for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (nav) nav.classList.remove("open");
    if (toggle) {
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", toggle.dataset.labelOpen || "Open menu");
    }
  });
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const slider = document.getElementById("foodSlider");
if (slider) {
  const slides = Array.from(slider.querySelectorAll(".slide"));
  let index = 0;

  const show = (nextIndex) => {
    index = nextIndex;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });
  };

  if (slides.length > 1) {
    window.setInterval(() => {
      show((index + 1) % slides.length);
    }, 4200);
  } else {
    show(0);
  }
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(".reveal, .reveal-img");

if (revealTargets.length) {
  if (prefersReducedMotion) {
    revealTargets.forEach((element) => element.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }
}

(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-shrink", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();

(() => {
  const container = document.getElementById("ctImages");
  const prev = document.getElementById("ctPrev");
  const next = document.getElementById("ctNext");
  const name = document.getElementById("ctName");
  const meta = document.getElementById("ctDesig");
  const quote = document.getElementById("ctQuote");
  const wrap = document.getElementById("ctQuoteWrap");

  if (!container || !prev || !next || !name || !meta || !quote || !wrap) return;

  const isItalian = document.documentElement.lang === "it";
  const testimonials = isItalian
    ? [
        {
          name: "Marta R.",
          designation: "5 stelle - ospite recente",
          quote: "Assassina spettacolare, sala accogliente e un'atmosfera che invoglia a restare. Il sito ora rende molto meglio questa sensazione.",
          src: "assets/img/people/image.png"
        },
        {
          name: "Dario A.",
          designation: "4 stelle - visita serale",
          quote: "Cucina tipica barese fatta bene, servizio cordiale e piatti con carattere. La nuova presentazione visiva e piu curata e piu credibile.",
          src: "assets/img/people/DA.jpeg"
        },
        {
          name: "Vito U.",
          designation: "5 stelle - cliente soddisfatta",
          quote: "Pasta fatta bene, prezzi chiari e una bella energia complessiva. Anche la sezione recensioni adesso sembra parte del brand.",
          src: "assets/img/people/ubaldini.gif"
        }
      ]
    : [
        {
          name: "Marta R.",
          designation: "5 stars - recent guest",
          quote: "Excellent assassina, welcoming room, and an atmosphere that makes you want to stay longer. The redesign captures that feeling much better.",
          src: "assets/img/people/image.png"
        },
        {
          name: "Dario A.",
          designation: "4 stars - evening visit",
          quote: "Well-made Bari classics, friendly service, and dishes with real identity. The visual refresh now feels far more intentional.",
          src: "assets/img/people/DA.jpeg"
        },
        {
          name: "Vito U.",
          designation: "5 stars - happy customer",
          quote: "Great handmade pasta, clear pricing, and a stronger sense of place. Even the reviews section now feels branded instead of generic.",
          src: "assets/img/people/ubaldini.gif"
        }
      ];

  let active = 0;
  let timer = null;

  const images = testimonials.map((testimonial) => {
    const image = document.createElement("img");
    image.className = "ct-img";
    image.src = testimonial.src;
    image.alt = testimonial.name;
    container.appendChild(image);
    return image;
  });

  const gap = () => {
    const width = container.offsetWidth;
    return Math.min(84, Math.max(24, width * 0.2));
  };

  const renderImages = () => {
    const distance = gap();
    const rise = distance * 0.78;
    const total = testimonials.length;

    images.forEach((image, index) => {
      const isActive = index === active;
      const isLeft = (active - 1 + total) % total === index;
      const isRight = (active + 1) % total === index;

      if (isActive) {
        image.style.cssText = "z-index:3;opacity:1;transform:translateX(0) translateY(0) scale(1) rotateY(0deg);";
      } else if (isLeft) {
        image.style.cssText = `z-index:2;opacity:0.96;transform:translateX(-${distance}px) translateY(-${rise}px) scale(0.84) rotateY(16deg);`;
      } else if (isRight) {
        image.style.cssText = `z-index:2;opacity:0.96;transform:translateX(${distance}px) translateY(-${rise}px) scale(0.84) rotateY(-16deg);`;
      } else {
        image.style.cssText = "z-index:1;opacity:0;transform:scale(0.7);";
      }
    });
  };

  const renderText = () => {
    const current = testimonials[active];
    wrap.style.animation = "none";
    void wrap.offsetWidth;
    wrap.style.animation = "ctFade .35s ease";
    name.textContent = current.name;
    meta.textContent = current.designation;
    quote.textContent = current.quote;
  };

  const render = () => {
    renderImages();
    renderText();
  };

  const go = (direction) => {
    active = (active + direction + testimonials.length) % testimonials.length;
    render();
    restartAutoplay();
  };

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    timer = window.setInterval(() => {
      active = (active + 1) % testimonials.length;
      render();
    }, 5500);
  };

  const stopAutoplay = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  window.addEventListener("resize", renderImages);

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  });

  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);

  render();
  startAutoplay();
})();
