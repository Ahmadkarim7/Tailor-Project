//Service section
const track = document.getElementById("servicesTrack");
    const leftBtn = document.getElementById("scrollLeftBtn");
    const rightBtn = document.getElementById("scrollRightBtn");

    function getScrollAmount() {
      const card = track.querySelector(".service-slide");
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return card.offsetWidth + gap;
    }

    function updateArrows() {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      leftBtn.disabled = track.scrollLeft <= 5;
      rightBtn.disabled = track.scrollLeft >= maxScrollLeft - 5;
    }

    leftBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateArrows);
    window.addEventListener("load", updateArrows);
    window.addEventListener("resize", updateArrows);