import { initNewCollection } from "./newCollection.js";

/* widget coupon slide */

document.addEventListener("DOMContentLoaded", () => {
  const widgetTrack = document.querySelector(".widget_coupon_track");
  const widgetSlides = document.querySelectorAll(".widget_coupon_slide");

  if (widgetTrack && widgetSlides.length > 0) {
    let currentIndex = 0;
    const slideCount = widgetSlides.length;
    const slideInterval = 3000;

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      widgetTrack.style.transform = `translateX(-${currentIndex * (100 / slideCount)}%)`;
    }

    setInterval(nextSlide, slideInterval);
  }
});

/* widget coupon slide */

/* new collection */

document.addEventListener("DOMContentLoaded", () => {
  initNewCollection();
});

/* new collection */
