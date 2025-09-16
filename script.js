// =========================
// Review Section Scroll
// =========================
const reviewTrack = document.getElementById("reviewTrack");

function scrollReviews(direction) {
  const cardWidth = reviewTrack.querySelector(".card").offsetWidth + 16; // card width + margin
  reviewTrack.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
}

// =========================
// Sticky Header Scroll Color
// =========================
window.addEventListener("scroll", function () {
  const header = document.getElementById("header-section");
  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// =========================
// Apple Cards Carousel Scroll
// =========================
const cardsContainer = document.querySelector(".cards-container");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

// Scroll amount per click = half the container width
const scrollAmount = cardsContainer.offsetWidth / 2;

leftBtn.addEventListener("click", () => {
  cardsContainer.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
  preloadNearby("left");
});

rightBtn.addEventListener("click", () => {
  cardsContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
  preloadNearby("right");
});

// =========================
// Lazy Loading + Preload for Cards
// =========================
const cardTops = document.querySelectorAll(".card-top");
const preloadCount = 2; // number of cards to preload ahead/behind

function loadCardImage(el) {
  if (!el.dataset.loaded) {
    const img = new Image();
    img.src = el.dataset.src;
    img.onload = () => {
      el.style.backgroundImage = `url('${el.dataset.src}')`;
      el.dataset.loaded = "true";
    };
  }
}

// Lazy load when in view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        loadCardImage(el);

        // preload next N
        let idx = Array.from(cardTops).indexOf(el);
        let next = Array.from(cardTops).slice(idx + 1, idx + 1 + preloadCount);
        next.forEach(loadCardImage);

        observer.unobserve(el);
      }
    });
  },
  { rootMargin: "200px" }
);

cardTops.forEach((card) => observer.observe(card));

// Preload nearby cards on arrow click
function preloadNearby(direction) {
  const visibleCards = Array.from(cardTops).filter((card) => {
    const rect = card.getBoundingClientRect();
    return rect.right > 0 && rect.left < window.innerWidth;
  });

  if (direction === "right") {
    let lastVisibleIndex = Array.from(cardTops).indexOf(
      visibleCards[visibleCards.length - 1]
    );
    let next = Array.from(cardTops).slice(
      lastVisibleIndex + 1,
      lastVisibleIndex + 1 + preloadCount
    );
    next.forEach(loadCardImage);
  } else {
    let firstVisibleIndex = Array.from(cardTops).indexOf(visibleCards[0]);
    let prev = Array.from(cardTops).slice(
      Math.max(0, firstVisibleIndex - preloadCount),
      firstVisibleIndex
    );
    prev.forEach(loadCardImage);
  }
}

window.addEventListener("scroll", function () {
  const header = document.getElementById("header-section");
  const logo = document.getElementById("header-logo");

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
