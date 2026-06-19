// ==========================================
// Imports & External Libraries
// ==========================================

/* new collection */
import { initNewCollection } from "./newCollection.js";
import { initBrandSection } from "./brandSection.js";

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

/* Best Picks - 오예은 */
const bestSection = document.querySelector(".best-picks-section");
const bestGrid = bestSection?.querySelector("#bestGrid");

/* celebs pick - 문송연 */
const wrapper = document.querySelector(".celeb_slider_wrapper");
const glaBtn = document.querySelector(".gla_btn");
const sunBtn = document.querySelector(".sun_btn");

// ==========================================
// State & Constants
// ==========================================

/* Limited Time Offer 섹션 - 김해나 작업 */
const targetDate = new Date("July 17, 2026 10:00:00").getTime();
let timerInterval = null;

/* celebs pick */
let celebPicks = [];
let celebSwiper = null;
let bestSwiper = null;

// ==========================================
// Hero Swiper - 문송연
// ==========================================

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
  heroSwiperEl.classList.toggle("is-stylework", swiper.realIndex === 2);
}

// ==========================================
// Timer - 김해나 작업
// ==========================================

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

if (daysEl || hoursEl || minEl || secEl) {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

// ==========================================
// Limited Time Offer - 김해나 작업
// ==========================================

function renderLimitedOffer(products) {
  const limitedProducts = products.slice(0, 20);

  let cardHTML = "";
  limitedProducts.forEach((product) => {
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
          slidesPerView: 2.2,
          spaceBetween: 0,
        },
        769: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    });
  }
}

// ==========================================
// Best Picks - 오예은
// ==========================================

function formatPrice(price) {
  const numberPrice = Number(price || 0);
  return Number.isFinite(numberPrice) ? numberPrice.toLocaleString("ko-KR") : "0";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDetailUrl(product) {
  return `details.html?productId=${encodeURIComponent(product.productId)}`;
}

function getProductImage(product) {
  if (product.image) return product.image;
  if (product.mainImage) return product.mainImage;
  if (Array.isArray(product.thumbImgs) && product.thumbImgs.length > 0) return product.thumbImgs[0];
  return "";
}

function createBestCard(product) {
  const detailUrl = getDetailUrl(product);
  const image = getProductImage(product);

  const brand = product.brand || "ROUNZ";
  const name = product.name || "상품명";
  const salePrice = Number(product.salePrice || 0);
  const discountRate = Number(product.discountRate || 0);

  return `
    <article class="product_card best-card swiper-slide">
      <a href="${detailUrl}" class="product_card_imgbox">
        <img
          src="${escapeHtml(image)}"
          alt="${escapeHtml(name)}"
          loading="lazy"
        />
        <button type="button" class="try_on_btn body_xl text-center">
          TRY ON
        </button>
      </a>

      <div class="d-flex flex-column g-0-5">
        <h3 class="product_name body_xl">
          <a href="${detailUrl}">
            ${escapeHtml(name)}
          </a>
        </h3>

        <div class="product_card_header d-flex justify-content-between align-items-center">
          <span class="brand display_h4">
            ${escapeHtml(brand)}
          </span>

          <button
            type="button"
            class="like product_card_wish_btn material-symbols-rounded"
            aria-label="찜하기"
          >heart_plus</button>
        </div>

        <div class="product_card_footer d-flex justify-content-between align-items-center">
          <div class="product_card_price d-flex align-items-center g-0-5">
            <span class="price display_h4">
              ${formatPrice(salePrice)}원
            </span>

            ${
              discountRate > 0
                ? `
                  <span class="discount_rate body_xl">
                    ${discountRate}%
                  </span>
                `
                : ""
            }
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderBestPicks(products) {
  if (!bestGrid) return;

  const bestProducts = products
    .filter((product) => product && !product.isSoldOut)
    .sort((a, b) => Number(b.reviews || 0) - Number(a.reviews || 0))
    .slice(0, 8);

  bestGrid.innerHTML = bestProducts.map((product) => createBestCard(product)).join("");

  initBestSwiper();
}

function initBestSwiper() {
  if (typeof Swiper === "undefined") {
    console.error("Swiper를 찾을 수 없습니다.");
    return;
  }

  if (bestSwiper) {
    bestSwiper.destroy(true, true);
  }

  bestSwiper = new Swiper(".best-swiper", {
    slidesPerView: 2,
    spaceBetween: 16,
    grabCursor: true,

    scrollbar: {
      el: ".best-swiper .swiper-scrollbar",
      draggable: true,
      hide: false,
    },

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1440: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
}

if (bestGrid) {
  bestGrid.addEventListener("click", (event) => {
    const wishBtn = event.target.closest(".product_card_wish_btn");
    const cartBtn = event.target.closest(".material-icons-outlined");
    const tryOnBtn = event.target.closest(".try_on_btn");

    if (wishBtn) {
      event.preventDefault();
      event.stopPropagation();

      wishBtn.classList.toggle("is-active");

      const isActive = wishBtn.classList.contains("is-active");
      wishBtn.textContent = isActive ? "favorite" : "heart_plus";
      wishBtn.setAttribute("aria-label", isActive ? "찜 취소" : "찜하기");
      return;
    }

    if (cartBtn) {
      event.preventDefault();
      event.stopPropagation();
      alert("장바구니에 담겼습니다.");
      return;
    }

    if (tryOnBtn) {
      event.preventDefault();
      event.stopPropagation();
      alert("가상피팅 페이지로 이동합니다.");
    }
  });
}

// ==========================================
// Celeb Picks - 문송연
// ==========================================

function createCelebCard(pick, product) {
  return `
    <article class="celeb_slide swiper-slide">
      <div class="celeb_video_box">
        <iframe
            class="celeb_video"
            data-video-id="${pick.youtubeId}"
            data-start="${pick.start}"
            src="https://www.youtube.com/embed/${pick.youtubeId}?start=${pick.start}&mute=1&controls=0&rel=0&playsinline=1"
            title="${pick.celebrity} 착용 영상"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
      </div>

      <div class="celeb_product">
        <a href="details.html?productId=${product.productId}" class="celeb_product_link">
          <div class="celeb_product_img_box">
            <img src="${product.image}" alt="${product.name}" class="celeb_product_img" />
          </div>

          <div class="celeb_product_info">
            <p class="celeb_product_brand display_h4">${product.brand}</p>
            <p class="celeb_product_name body_m">${product.name}</p>
            <p class="celeb_product_price body_s">
              ${Number(product.salePrice).toLocaleString()}원
            </p>
          </div>
        </a>

        <button type="button" class="celeb_like" aria-label="좋아요">
          <span class="material-symbols-rounded">heart_plus</span>
        </button>
      </div>
    </article>
  `;
}

function renderCelebPick(category, products) {
  const filteredProducts = products.filter((product) => product.category === category);

  const matchedData = celebPicks
    .map((pick) => {
      const product = filteredProducts.find((item) => item.productId === pick.productId);
      return product ? { pick, product } : null;
    })
    .filter((item) => item !== null);

  wrapper.innerHTML = matchedData.map((item) => createCelebCard(item.pick, item.product)).join("");

  if (celebSwiper) {
    celebSwiper.destroy(true, true);
  }

  celebSwiper = new Swiper(".celeb_swiper", {
    slidesPerView: 1.25,
    spaceBetween: 16,

    navigation: {
      nextEl: ".celeb_next",
      prevEl: ".celeb_prev",
    },

    pagination: {
      el: ".celeb_fraction",
      type: "fraction",
    },

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });

  connectLikeButtons();
  connectYoutubeHover();
}

function connectLikeButtons() {
  const likeButtons = document.querySelectorAll(".celeb_like");
  likeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-active");
    });
  });
}

function connectYoutubeHover() {
  const iframes = document.querySelectorAll(".celeb_video");
  iframes.forEach((iframe) => {
    const videoId = iframe.dataset.videoId;
    const start = iframe.dataset.start;

    const pauseSrc = `https://www.youtube.com/embed/${videoId}?start=${start}&mute=1&controls=0&rel=0&playsinline=1`;
    const playSrc = `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=1&mute=1&controls=0&rel=0&playsinline=1`;

    iframe.addEventListener("mouseenter", () => {
      iframe.src = playSrc;
    });
    iframe.addEventListener("mouseleave", () => {
      iframe.src = pauseSrc;
    });
  });
}

glaBtn?.addEventListener("click", () => {
  location.href = "product_list.html?category=안경테";
});

sunBtn?.addEventListener("click", () => {
  location.href = "product_list.html?category=선글라스";
});

// ==========================================
// 통합 데이터 로딩 (products.json 1번만 fetch)
// ==========================================

async function loadAllData() {
  try {
    const [productsRes, celebPickRes] = await Promise.all([
      fetch("data/products.json"),
      fetch("./data/celebPicks.json"),
    ]);

    if (!productsRes.ok) throw new Error(`products.json 로딩 실패: ${productsRes.status}`);
    if (!celebPickRes.ok) throw new Error(`celebPicks.json 로딩 실패: ${celebPickRes.status}`);

    const products = await productsRes.json();
    celebPicks = await celebPickRes.json();

    if (!Array.isArray(products)) throw new Error("상품 데이터가 배열이 아닙니다.");

    renderLimitedOffer(products);
    renderBestPicks(products);
    renderCelebPick("안경테", products);
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
    if (sliderTrack) {
      sliderTrack.innerHTML = `<p style="text-align:center; padding: 40px; color: red;">데이터를 불러올 수 없습니다.</p>`;
    }
  }
}

// ==========================================
// 매장 찾기 섹션 - 유태구 작업
// ==========================================

const storeDropdownEls = document.querySelectorAll(".store_locator .dropdown");
const storeArticleEls = document.querySelectorAll(".store_list article");
const mapEl = document.getElementById("map_api");

const mapOptions = {
  center: new naver.maps.LatLng(37.4935506, 127.0310534),
  zoom: 16,
};

let map = null;
let marker = null;

const mapObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        map = new naver.maps.Map(mapEl, mapOptions);
        marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(37.4935506, 127.0310534),
          map: map,
        });
        mapObserver.unobserve(mapEl); // 한 번만 실행
      }
    });
  },
  {
    rootMargin: "200px", // 지도 200px 위에서 미리 로드
  },
);

mapObserver.observe(mapEl);

document.addEventListener("click", (e) => {
  storeDropdownEls.forEach((sdd) => {
    if (!sdd.contains(e.target)) {
      sdd.classList.remove("active");
    }
  });
});

storeDropdownEls.forEach((sdd) => {
  sdd.querySelector(".dropdown_trigger").addEventListener("click", () => {
    if (sdd.classList.contains("active")) {
      sdd.classList.remove("active");
      return;
    }
    storeDropdownEls.forEach((f) => f.classList.remove("active"));
    sdd.classList.add("active");
  });
});

storeArticleEls.forEach((store) => {
  store.addEventListener("click", () => {
    if (store.classList.contains("active")) {
      store.classList.remove("active");
      return;
    }
    storeArticleEls.forEach((s) => s.classList.remove("active"));
    store.classList.add("active");

    if (!map) return;
    const pos = new naver.maps.LatLng(store.dataset.lat, store.dataset.lng);
    map.setCenter(pos);

    if (!marker) return;
    marker.setPosition(pos);
  });
});

// ==========================================
// Initialization & Execution
// ==========================================

initBrandSection();
initNewCollection();
loadAllData();
