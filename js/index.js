// ==========================================
// Imports & External Libraries
// ==========================================

/* new collection */
import { initNewCollection } from "./newCollection.js";
import { initBrandSection } from "./brandSection.js";

// hero - 문송연
// slide 추가
const heroSwiperEl = document.querySelector(".hero_swiper");

const heroSwiper = new Swiper(".hero_swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: false,
  watchOverflow: true,

  scrollbar: {
    el: ".hero_swiper .swiper-scrollbar",
    draggable: true,
  },

  navigation: {
    nextEl: ".hero_arrow_next",
    prevEl: ".hero_arrow_prev",
  },

  on: {
    init(swiper) {
      changeHeroControlColor(swiper);
    },

    slideChange(swiper) {
      changeHeroControlColor(swiper);
    },
  },
});

function changeHeroControlColor(swiper) {
  // 0부터 시작하므로 세 번째 슬라이드는 2
  heroSwiperEl.classList.toggle("is-stylework", swiper.realIndex === 2);
}

// ==========================================
// DOM Selectors
// ==========================================

/* Limited Time Offer 섹션 - 김해나 작업 */
const sliderTrack = document.querySelector(".limited_slider_track");
const prevButton = document.querySelector(".limited_btn_prev");
const nextButton = document.querySelector(".limited_btn_next");

const daysEl = document.querySelector(".timer_days");
const hoursEl = document.querySelector(".timer_hours");
const minEl = document.querySelector(".timer_min");
const secEl = document.querySelector(".timer_sec");

/* widget coupon slide */
const widgetTrack = document.querySelector(".widget_coupon_track");
const widgetSlides = document.querySelectorAll(".widget_coupon_slide");

// ==========================================
// State & Constants
// ==========================================

/* Limited Time Offer 섹션 - 김해나 작업 */
const targetDate = new Date("July 17, 2026 10:00:00").getTime();
let timerInterval = null;

// ==========================================
// Functions & Core Logic
// ==========================================

/* Limited Time Offer 섹션 - 김해나 작업 */
function updateTimer() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minEl) minEl.textContent = "00";
    if (secEl) secEl.textContent = "00";
    if (timerInterval) clearInterval(timerInterval);
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minEl) minEl.textContent = String(minutes).padStart(2, "0");
  if (secEl) secEl.textContent = String(seconds).padStart(2, "0");
}
// updateTimer() failsafe
if (daysEl || hoursEl || minEl || secEl) {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}
// 여기까지가 타이머

function loadProductsData() {
  fetch("data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
      }
      return response.json();
    })
    .then((products) => {
      if (!products || !Array.isArray(products)) return;

      const limitedProducts = products.slice(0, 20);

      let cardHTML = "";
      limitedProducts.forEach((product) => {
        //가격 자동 콤마 변환 처리
        const formattedPrice = Number(product.salePrice || 0).toLocaleString();

        cardHTML += `
            <li class="limited_slide_item swiper-slide">
              <div class="limited_card_image_wrap">
                <img
                    src="${product.image || ""}"
                    alt="${product.name || ""}"
                    loading="lazy"/>
                <button type="button" class="wish_btn" aria-label="위시리스트 추가">
                  <span class="material-symbols-outlined">heart_plus</span>
                </button>
                
                <a href="details.html?productId=${product.productId}" class="detail_view_btn display_h4">
                  <span class="detail_text">detail view</span>
                  <span class="arrow_circle">&rarr;</span>
                </a>
                
              </div>
              <div class="limited_card_info">
                <h4 class="limited_brand_title display_h4">${product.brand || ""}</h4>
                <p class="limited_product_name body_xl">${product.name || ""}</p>
                <div class="limited_price_wrap">
                  <span class="limited_discount_rate body_xl">${product.discountRate || ""}&#37;</span>
                  <span class="limited_price body_xl">${formattedPrice}원</span>
                </div>
                <p class="delivery_badge body_cap"><span class="material-icons-round body_cap">shopping_cart</span> 무료/당일배송</p>
              </div>
            </li>
          `;
      });

      if (sliderTrack) {
        sliderTrack.innerHTML = cardHTML;
      }

      initSwiper();
    })
    .catch((error) => {
      console.error("데이터 로딩 실패:", error);
      if (sliderTrack) {
        sliderTrack.innerHTML = `<p style="text-align:center; padding: 40px; color: red;">데이터를 불러올 수 없습니다.</p>`;
      }
    });
}

function initSwiper() {
  if (typeof Swiper !== "undefined") {
    new Swiper(".mySwiper", {
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      scrollbar: {
        el: ".swiper_scrollbar",
        hide: false,
        draggable: true,
      },
      slidesPerView: 1,
      breakpoints: {
        481: {
          slidesPerView: 2.2, //태블릿
          spaceBetween: 0,
        },
        769: {
          slidesPerView: 5, //PC
          spaceBetween: 20,
        },
      },
    });
  }
}

function initBestPicksSlider() {
  const list = document.querySelector("#best_picks_list");
  const scroller = document.querySelector(".best_picks_scroller");
  const thumb = document.querySelector(".best_picks_scrollbar_thumb");
  const prevBtn = document.querySelector(".best_picks_btn_prev");
  const nextBtn = document.querySelector(".best_picks_btn_next");

  if (!list || !scroller) return;

  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const bestProducts = products.slice(0, 24);

      list.innerHTML = bestProducts
        .map((product) => {
          const formattedPrice = Number(product.salePrice || 0).toLocaleString();
          const discountBadge = product.discountRate
            ? `<span class="best_pick_rate body_xl">${product.discountRate}%</span>`
            : "";

          return `
          <li class="best_pick_item">
            <article class="best_pick_card">
              <a href="details.html?productId=${product.productId}" class="best_pick_link">
                <div class="best_pick_img_box">
                  <img src="${product.image || ""}" alt="${product.name || ""}" loading="lazy" />
                </div>
                <div class="best_pick_info d-flex flex-column">
                  <strong class="best_pick_brand display_h4">${product.brand || ""}</strong>
                  <p class="best_pick_name body_m">${product.name || ""}</p>
                  <div class="best_pick_price d-flex align-items-center">
                    ${discountBadge}
                    <span class="best_pick_sale body_xl">${formattedPrice}원</span>
                  </div>
                </div>
              </a>
              <button type="button" class="best_pick_wish_btn" aria-label="위시리스트 추가">
                <span class="material-symbols-rounded" aria-hidden="true">heart_plus</span>
              </button>
            </article>
          </li>
        `;
        })
        .join("");

      let currentPage = 0;

      function getCardsPerView() {
        const value = getComputedStyle(list).getPropertyValue("--best-picks-visible");
        return Number(value.trim()) || 4;
      }

      function goToPage(page) {
        const cardsPerView = getCardsPerView();
        const totalPages = Math.max(1, Math.ceil(bestProducts.length / cardsPerView));
        currentPage = Math.max(0, Math.min(page, totalPages - 1));

        const firstItem = list.querySelector(".best_pick_item");
        if (firstItem) {
          const itemWidth = firstItem.getBoundingClientRect().width;
          const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
          const moveDistance = itemWidth * cardsPerView + gap * cardsPerView;
          const maxTranslate = Math.max(0, list.scrollWidth - scroller.clientWidth);
          const targetX = Math.min(currentPage * moveDistance, maxTranslate);

          list.style.transform = `translateX(-${targetX}px)`;
        }

        if (thumb) {
          const thumbWidth = 100 / totalPages;
          const thumbMove = totalPages === 1 ? 0 : (currentPage / (totalPages - 1)) * (100 - thumbWidth);

          thumb.style.width = `${thumbWidth}%`;
          thumb.style.left = `${thumbMove}%`;
        }

        if (prevBtn) prevBtn.disabled = currentPage === 0;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
      }

      if (prevBtn) prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
      if (nextBtn) nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

      // 창 크기가 수시로 바뀔 때 카드가 튕기거나 깨지지 않도록 자동 재정렬 선 방어
      window.addEventListener("resize", () => {
        goToPage(currentPage);
      });

      goToPage(0);
    })
    .catch((err) => console.error("Best picks 로드 실패:", err));
}

/* widget coupon slide */
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

// ==========================================
// Event Listeners
// ==========================================

// ==========================================
// Initialization & Execution
// ==========================================

/* Brand 섹션 - 김해나 작업 */
loadProductsData();
initBrandSection();

/* new collection */
initNewCollection();

/* best picks - 김해나 작업 */
initBestPicksSlider();

/* celebs pick - 문송연 */
