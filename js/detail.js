// detail.js

/* URL 상품 ID 확인 */

const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

if (!productId) {
  alert("잘못된 접근입니다.");
  location.replace("index.html");

  throw new Error("productId가 없어 상세페이지 실행을 중단합니다.");
}

/* DOM 선택 */

const mainSwiperWrapper = document.querySelector("[data-detail-main-wrapper]");

const thumbnailSwiperWrapper = document.querySelector("[data-detail-thumbnail-wrapper]");

const galleryCurrentEl = document.querySelector("[data-gallery-current]");

const galleryTotalEl = document.querySelector("[data-gallery-total]");

const detailImageStack = document.querySelector("[data-detail-image-stack]");

const brandEl = document.querySelector("[data-detail-brand]");

const nameEl = document.querySelector("[data-detail-name]");

const reviewsEl = document.querySelector("[data-detail-reviews]");

const salePriceEl = document.querySelector("[data-detail-sale-price]");

const originalPriceEl = document.querySelector("[data-detail-original-price]");

const discountRateEl = document.querySelector("[data-detail-discount-rate]");

const productDiscountEl = document.querySelector(".product_discount");

const colorList = document.querySelector("[data-detail-colors]");

const memberPriceEl = document.querySelector("[data-detail-member-price]");

const deliveryFeeEl = document.querySelector("[data-detail-delivery-fee]");

const rewardPointEl = document.querySelector("[data-detail-point]");

const cjPointEl = document.querySelector("[data-detail-cj-point]");

const recommendTrack = document.querySelector("[data-recommend-track]");

const wishBtn = document.querySelector(".wish_btn");

const tabButtons = document.querySelectorAll(".detail-tab-item");

const tabContents = document.querySelectorAll(".detail-tab-content");

const sizeButtons = document.querySelectorAll(".size_list button");

/* 상태값 */

let allProducts = [];
let currentProduct = null;

let mainSwiper = null;
let thumbnailSwiper = null;

/* 공통 함수 */

// 가격에 천 단위 콤마 적용
function formatPrice(price) {
  const numberPrice = Number(price || 0);

  return Number.isFinite(numberPrice) ? numberPrice.toLocaleString("ko-KR") : "0";
}

// 중복 이미지 주소 제거
function getUniqueImages(images = []) {
  return [...new Set(images.filter(Boolean))];
}

// JSON 문자열을 HTML에 안전하게 출력
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// 추천 상품 상세페이지 주소
function getProductDetailUrl(product) {
  return `details.html?productId=${encodeURIComponent(product.productId)}`;
}

/* 상품 데이터 불러오기 */

async function loadDetailProduct() {
  try {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
      throw new Error("products.json을 불러오지 못했습니다.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("상품 데이터 형식이 올바르지 않습니다.");
    }

    allProducts = data;

    currentProduct = allProducts.find(product => String(product.productId) === String(productId));

    if (!currentProduct) {
      alert("존재하지 않는 상품입니다.");
      location.href = "index.html";
      return;
    }

    renderProduct(currentProduct);
    renderRecommendations(currentProduct);
  } catch (error) {
    console.error("상세 상품 로딩 실패:", error);

    alert("상품 정보를 불러오지 못했습니다.");
  }
}

/* 상품 전체 출력 */

function renderProduct(product) {
  renderBasicInfo(product);
  renderGallery(product);
  renderDetailImages(product);
  renderColors(product.colors);
  renderBenefits(product);

  document.title = `${product.name || "상품 상세"} | ROUNZ`;
}

/* 상품 기본 정보 */

function renderBasicInfo(product) {
  const salePrice = Number(product.salePrice || 0);

  const originalPrice = Number(product.originalPrice || salePrice);

  const discountRate = Number(product.discountRate || 0);

  if (brandEl) {
    brandEl.textContent = product.brand || "ROUNZ";
  }

  if (nameEl) {
    nameEl.textContent = product.name || "상품명";
  }

  if (reviewsEl) {
    reviewsEl.textContent = `(${formatPrice(product.reviews)}개 리뷰)`;
  }

  if (salePriceEl) {
    salePriceEl.textContent = `${formatPrice(salePrice)}원`;
  }

  if (originalPriceEl) {
    originalPriceEl.textContent = `${formatPrice(originalPrice)}원`;
  }

  if (discountRateEl) {
    discountRateEl.textContent = `${discountRate}% 할인`;
  }

  // 할인 상품이 아닐 경우 원가와 할인율 숨김
  if (productDiscountEl) {
    productDiscountEl.hidden = discountRate <= 0 || originalPrice <= salePrice;
  }
}

/* 대표 이미지 + 썸네일 Swiper */

function renderGallery(product) {
  if (!mainSwiperWrapper || !thumbnailSwiperWrapper) {
    return;
  }

  const galleryImages = getUniqueImages([
    product.mainImage,

    ...(Array.isArray(product.thumbImgs) ? product.thumbImgs : []),

    product.image,
  ]);

  if (galleryImages.length === 0) {
    mainSwiperWrapper.innerHTML = "";
    thumbnailSwiperWrapper.innerHTML = "";

    if (galleryCurrentEl) {
      galleryCurrentEl.textContent = "0";
    }

    if (galleryTotalEl) {
      galleryTotalEl.textContent = "0";
    }

    return;
  }

  // 대표 이미지 생성
  mainSwiperWrapper.innerHTML = galleryImages
    .map(
      (image, index) => `
        <div class="swiper-slide">
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(product.name || "상품")} 상품 이미지 ${index + 1}"
          />
        </div>
      `,
    )
    .join("");

  // 썸네일 생성
  thumbnailSwiperWrapper.innerHTML = galleryImages
    .map(
      (image, index) => `
        <div
          class="swiper-slide"
          role="button"
          tabindex="0"
          aria-label="${escapeHtml(product.name || "상품")} 이미지 ${index + 1} 보기"
        >
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(product.name || "상품")} 썸네일 ${index + 1}"
          />
        </div>
      `,
    )
    .join("");

  if (galleryTotalEl) {
    galleryTotalEl.textContent = String(galleryImages.length);
  }

  initializeGallerySwiper();
}

/* Swiper 실행 */

function initializeGallerySwiper() {
  if (typeof Swiper === "undefined") {
    console.error("Swiper를 찾을 수 없습니다. Swiper JS가 detail.js보다 먼저 연결됐는지 확인해 주세요.");

    return;
  }

  // 기존 Swiper가 있다면 제거 후 다시 생성
  if (mainSwiper) {
    mainSwiper.destroy(true, true);
  }

  if (thumbnailSwiper) {
    thumbnailSwiper.destroy(true, true);
  }

  // 썸네일 Swiper
  thumbnailSwiper = new Swiper(".detail_thumbnail_swiper", {
    slidesPerView: "auto",
    spaceBetween: 8,

    freeMode: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,

    keyboard: {
      enabled: true,
    },

    scrollbar: {
      el: ".detail_thumbnail_swiper .swiper-scrollbar",
      draggable: true,
      hide: false,
    },

    breakpoints: {
      481: {
        spaceBetween: 12,
      },

      1276: {
        spaceBetween: 16,
      },
    },
  });

  // 대표 이미지 Swiper
  mainSwiper = new Swiper(".detail_main_swiper", {
    slidesPerView: 1,
    spaceBetween: 0,

    grabCursor: true,

    keyboard: {
      enabled: true,
    },

    thumbs: {
      swiper: thumbnailSwiper,
    },

    on: {
      init(swiper) {
        updateGalleryCount(swiper);
      },

      slideChange(swiper) {
        updateGalleryCount(swiper);
      },
    },
  });

  addThumbnailKeyboardEvents();
}

/* 현재 이미지 번호 */

function updateGalleryCount(swiper) {
  if (!galleryCurrentEl) return;

  galleryCurrentEl.textContent = String(swiper.realIndex + 1);
}

/* 썸네일 키보드 접근 */

function addThumbnailKeyboardEvents() {
  const thumbnailSlides = thumbnailSwiperWrapper?.querySelectorAll(".swiper-slide") || [];

  thumbnailSlides.forEach((slide, index) => {
    slide.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();

      mainSwiper?.slideTo(index);
    });
  });
}

/* 상품 상세 이미지 */

function renderDetailImages(product) {
  if (!detailImageStack) return;

  let detailImages = [];

  if (Array.isArray(product.detailImgs) && product.detailImgs.length > 0) {
    detailImages = product.detailImgs;
  } else if (Array.isArray(product.thumbImgs) && product.thumbImgs.length > 0) {
    detailImages = product.thumbImgs;
  } else {
    detailImages = [product.image, product.mainImage];
  }

  detailImages = getUniqueImages(detailImages);

  if (detailImages.length === 0) {
    detailImageStack.innerHTML = "";
    return;
  }

  detailImageStack.innerHTML = detailImages
    .map(
      (image, index) => `
        <img
          src="${escapeHtml(image)}"
          alt="${escapeHtml(product.name || "상품")} 상세 이미지 ${index + 1}"
          loading="lazy"
        />
      `,
    )
    .join("");
}

/* 색상 옵션 */

function renderColors(colors) {
  if (!colorList) return;

  const validColors = Array.isArray(colors) ? colors.filter(color => color?.hex) : [];

  /*
    colors가 없는 상품은
    common.css의 font 색상 변수 사용
  */
  const displayColors =
    validColors.length > 0
      ? validColors
      : [
          {
            label: "기본 색상",
            hex: "var(--font--color)",
          },
        ];

  colorList.innerHTML = displayColors
    .map(
      (color, index) => `
        <button
          type="button"
          class="color_chip ${index === 0 ? "is-active" : ""}"
          style="--chip-color: ${escapeHtml(color.hex)}"
          aria-label="${escapeHtml(color.label || `색상 ${index + 1}`)}"
          aria-pressed="${index === 0 ? "true" : "false"}"
        ></button>
      `,
    )
    .join("");

  const colorButtons = colorList.querySelectorAll(".color_chip");

  colorButtons.forEach(button => {
    button.addEventListener("click", () => {
      colorButtons.forEach(item => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");

      button.setAttribute("aria-pressed", "true");
    });
  });
}

/* 회원 혜택 */

function renderBenefits(product) {
  const salePrice = Number(product.salePrice || 0);

  /*
    JSON에 값이 있으면 JSON 사용
    없으면 판매가 기준으로 계산
  */
  const memberPrice = Number(product.memberPrice ?? Math.round(salePrice * 0.9));

  const rewardPoint = Number(product.rewardPoint ?? Math.round(salePrice * 0.05));

  const cjPoint = Number(product.cjPoint ?? Math.round(salePrice * 0.032));

  const deliveryFee = Number(product.deliveryFee ?? 0);

  if (memberPriceEl) {
    memberPriceEl.textContent = `${formatPrice(memberPrice)}원`;
  }

  if (deliveryFeeEl) {
    deliveryFeeEl.textContent = deliveryFee === 0 ? "무료 배송" : `${formatPrice(deliveryFee)}원`;
  }

  if (rewardPointEl) {
    rewardPointEl.textContent = `${formatPrice(rewardPoint)}P`;
  }

  if (cjPointEl) {
    cjPointEl.textContent = `${formatPrice(cjPoint)}P`;
  }
}

/* 추천 상품 */

function renderRecommendations(product) {
  if (!recommendTrack) return;

  // 현재 보고 있는 상품 제외
  const otherProducts = allProducts.filter(item => String(item.productId) !== String(product.productId));

  // 같은 카테고리 상품 우선
  const sameCategory = otherProducts.filter(item => item.category && item.category === product.category);

  // 그다음 같은 브랜드
  const sameBrand = otherProducts.filter(
    item => item.brand && item.brand === product.brand && !sameCategory.includes(item),
  );

  // 나머지 상품
  const remainingProducts = otherProducts.filter(item => !sameCategory.includes(item) && !sameBrand.includes(item));

  const recommendedProducts = [...sameCategory, ...sameBrand, ...remainingProducts].slice(0, 8);

  if (recommendedProducts.length === 0) {
    recommendTrack.innerHTML = "";
    return;
  }

  recommendTrack.innerHTML = recommendedProducts
    .map(productItem => {
      const salePrice = Number(productItem.salePrice || 0);

      const originalPrice = Number(productItem.originalPrice || salePrice);

      const discountRate = Number(productItem.discountRate || 0);

      const hasDiscount = discountRate > 0 && originalPrice > salePrice;

      return `
          <li class="recommend_item">
            <a href="${getProductDetailUrl(productItem)}">
              <div class="recommend_image">
                <img
                  src="${escapeHtml(productItem.image || productItem.mainImage || "")}"
                  alt="${escapeHtml(productItem.name || "추천 상품")}"
                  loading="lazy"
                />
              </div>

              <div
                class="recommend_info d-flex flex-column g-0-5"
              >
                <p
                  class="recommend_brand body_cap"
                >
                  ${escapeHtml(productItem.brand || "ROUNZ")}
                </p>

                <h3
                  class="recommend_name body_m"
                >
                  ${escapeHtml(productItem.name || "상품명")}
                </h3>

                <div
                  class="recommend_price d-flex align-items-center g-0-5"
                >
                  <strong
                    class="recommend_sale_price body_l"
                  >
                    ${formatPrice(salePrice)}원
                  </strong>

                  ${
                    hasDiscount
                      ? `
                        <del
                          class="recommend_original_price body_cap"
                        >
                          ${formatPrice(originalPrice)}원
                        </del>

                        <span
                          class="recommend_discount_rate body_cap"
                        >
                          ${discountRate}%
                        </span>
                      `
                      : ""
                  }
                </div>
              </div>
            </a>
          </li>
        `;
    })
    .join("");
}

/* 상세 탭*/

tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    tabButtons.forEach(item => {
      item.classList.remove("active");

      item.setAttribute("aria-selected", "false");
    });

    tabContents.forEach(content => {
      content.classList.remove("active");
    });

    button.classList.add("active");

    button.setAttribute("aria-selected", "true");

    tabContents[index]?.classList.add("active");
  });
});

/* 사이즈 선택 */

sizeButtons.forEach(button => {
  button.addEventListener("click", () => {
    sizeButtons.forEach(item => {
      item.classList.remove("is-active");

      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("is-active");

    button.setAttribute("aria-pressed", "true");
  });
});

/* 찜 버튼 */

wishBtn?.addEventListener("click", () => {
  const isActive = wishBtn.classList.toggle("is-active");

  wishBtn.setAttribute("aria-pressed", String(isActive));

  wishBtn.setAttribute("aria-label", isActive ? "찜 취소" : "찜하기");

  const icon = wishBtn.querySelector(".material-symbols-rounded");

  if (icon) {
    icon.textContent = isActive ? "favorite" : "heart_plus";
  }
});

loadDetailProduct();
