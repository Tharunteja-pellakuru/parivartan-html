/* ==================================================================
   Work — App Details page
   Handles the "More Projects" horizontal carousel navigation.
   (Header / mobile-drawer behaviour is provided by index.js.)
   ================================================================== */
(function () {
  "use strict";

  const track = document.getElementById("appMoreTrack");
  if (!track) return;

  const prevBtn = document.querySelector('.app-more-arrow[data-dir="prev"]');
  const nextBtn = document.querySelector('.app-more-arrow[data-dir="next"]');

  // Scroll by one card (card width + gap) each click.
  function stepSize() {
    const card = track.querySelector(".app-more-card");
    if (!card) return track.clientWidth * 0.8;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "22") || 22;
    return card.getBoundingClientRect().width + gap;
  }

  // Enable/disable arrows depending on scroll position.
  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  function scrollByStep(direction) {
    track.scrollBy({ left: direction * stepSize(), behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => scrollByStep(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => scrollByStep(1));

  track.addEventListener("scroll", function () {
    window.requestAnimationFrame(updateArrows);
  });

  window.addEventListener("resize", function () {
    window.requestAnimationFrame(updateArrows);
  });

  updateArrows();
})();
