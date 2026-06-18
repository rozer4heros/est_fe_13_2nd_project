import { renderHeader } from "./modules/header.js";
import { renderNavDrawer } from "./modules/nav_drawer.js";
import { renderFooter } from "./modules/footer.js";

/* new collection */
import { initNewCollection } from "./newCollection.js";

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
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
      }
      return response.json();
    })
    .then(products => {
      if (!products || !Array.isArray(products)) return;

      const limitedProducts = products.slice(0, 20);

      let cardHTML = "";
      limitedProducts.forEach(product => {
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
                <a href="#detail.html" class="detail_view_btn display_h4">
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
    .catch(error => {
      console.error("데이터 로딩 실패:", error);
      if (sliderTrack) {
        sliderTrack.innerHTML = `<p style="text-align:center; padding: 40px; color: red;">데이터를 불러올 수 없습니다.</p>`;
      }
    });
}

function initSwiper() {
  if (typeof Swiper !== "undefined") {
    new Swiper(".mySwiper", {
      slidesPerView: 5,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      grabCursor: true,
    });
  }
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

/* Render header, nav_drawer, footer - 유태구 작업 */
renderHeader();
renderNavDrawer();
renderFooter();
// best pick - 오예은 작업
(function () {
  const grid = document.getElementById("bestGrid");
  const track = grid.parentElement; // .best-grid-track
  const prevBtn = document.querySelector(".best-prev");
  const nextBtn = document.querySelector(".best-next");
  const progressLine = document.getElementById("progressLine");

  const TOTAL_GROUPS = 4;
  let currentPage = 0;

  /* 원본 카드 4장 복제해서 그룹 2~4 채우기 */
  const originals = [...grid.querySelectorAll(".best-card")];
  for (let g = 1; g < TOTAL_GROUPS; g++) {
    originals.forEach(card => grid.appendChild(card.cloneNode(true)));
  }

  /* 찜하기 토글 */
  grid.addEventListener("click", e => {
    const btn = e.target.closest(".best-wish-btn");
    if (btn) btn.classList.toggle("liked");
  });

  /* 페이지 이동 */
  function goTo(page) {
    currentPage = page;

    // 트랙 너비 = 한 그룹(4장+3gap)의 너비
    const trackW = track.offsetWidth;
    const gap = 24;
    // 페이지마다 (trackW + gap) 픽셀씩 이동
    grid.style.transform = `translateX(-${page * (trackW + gap)}px)`;

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === TOTAL_GROUPS - 1;

    // 진행 바: 그룹1=25% … 그룹4=100%
    progressLine.style.width = `${((page + 1) / TOTAL_GROUPS) * 100}%`;
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) goTo(currentPage - 1);
  });
  nextBtn.addEventListener("click", () => {
    if (currentPage < TOTAL_GROUPS - 1) goTo(currentPage + 1);
  });

  goTo(0);
  window.addEventListener("resize", () => goTo(currentPage));
})();

/* Limited Time Offer 섹션 - 김해나 작업 */
loadProductsData();

/* new collection */
initNewCollection();
