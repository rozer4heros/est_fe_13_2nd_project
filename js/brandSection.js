const jsonPath = "data/products.json";

let allProducts = [];
let totalUniqueBrands = [];
let currentMasterPage = 0;

let subPageStatus = { 0: 0, 1: 0 };

const brandBannerMap = {
  "MIU MIU": "/image/brand_section/miumiu_banner1.png",
  "RAY-BAN": "/image/brand_section/rayban_banner.png",
  LASH: "/image/brand_section/lash_banner.png",
  LOCOMOTIVE: "/image/brand_section/locomotive_banner.png",
  OAKLEY: "/image/brand_section/oakley_banner.png",
  "TART OPTICAL": "/image/brand_section/tartoptical_banner.png",
  "RADIO EYES": "/image/brand_section/radioeyes_banner.png",
  "ROUNZ ABSOLUTE": "/image/brand_section/rounzabsolute_banner.png",
  PARANOID: "/image/brand_section/paranoid_banner.png",
};

export async function initBrandSection() {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    allProducts = await response.json();

    const rawBrands = [...new Set(allProducts.map((p) => p.brand?.toUpperCase()))].filter(Boolean);
    totalUniqueBrands = rawBrands.slice(0, 8);

    renderMasterPage();
    setupMasterPagination();
  } catch (error) {
    console.error("Brand Section 로드 실패:", error);
  }
}

function renderMasterPage() {
  const itemsPerPage = 2;
  const startIndex = currentMasterPage * itemsPerPage;
  const activeBrands = totalUniqueBrands.slice(startIndex, startIndex + itemsPerPage);
  const totalMasterPages = Math.ceil(totalUniqueBrands.length / itemsPerPage);

  const currentIndicator = document.querySelector(".master_pagination .current");
  const totalIndicator = document.querySelector(".master_pagination .total");

  if (currentIndicator) currentIndicator.textContent = currentMasterPage + 1;
  if (totalIndicator) totalIndicator.textContent = totalMasterPages || 1;

  for (let slotIndex = 0; slotIndex < 2; slotIndex++) {
    const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
    if (!article) continue;

    const brandName = activeBrands[slotIndex];

    if (!brandName) {
      article.style.display = "none";
      continue;
    }
    article.style.display = "block";

    subPageStatus[slotIndex] = 0;

    article.querySelector(".brand_name_title").textContent = brandName;
    const bannerImg = article.querySelector(".brand_wide_banner img");
    bannerImg.src = brandBannerMap[brandName] || "/image/brand_section/default_banner.png";
    bannerImg.alt = `${brandName} main banner`;

    // 스크롤바 위치 초기화
    const scrollContainer = article.querySelector(".brand_product_scroll_container");
    if (scrollContainer) scrollContainer.scrollLeft = 0;

    renderSubProductRow(slotIndex, brandName);
  }
}

function renderSubProductRow(slotIndex, brandName) {
  const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
  const productContainer = article.querySelector(".brand_product_row");
  const pageText = article.querySelector(".inner_sub_pagination .inner_page_text");

  const currentBrandProducts = allProducts.filter((p) => p.brand?.toUpperCase() === brandName);

  // 모바일 스크롤 처리를 위해 슬라이스 범위를 조건부로 변경 (모바일 환경이면 전체 로드, 웹이면 2개씩 분할)
  const isMobile = window.innerWidth <= 480;
  const totalSubPages = Math.min(Math.ceil(currentBrandProducts.length / 2), 3);

  let displayProducts = [];
  if (isMobile) {
    // 모바일에서는 스크롤바 이동을 고려하여 최대 6개(3페이지 분량)를 한 번에 그립니다.
    displayProducts = currentBrandProducts.slice(0, 6);
  } else {
    const currentSubPage = subPageStatus[slotIndex];
    const prodStartIndex = currentSubPage * 2;
    displayProducts = currentBrandProducts.slice(prodStartIndex, prodStartIndex + 2);
  }

  if (pageText) pageText.textContent = `${subPageStatus[slotIndex] + 1} / ${totalSubPages || 1}`;

  productContainer.innerHTML = displayProducts
    .map((product) => {
      const formattedPrice = Number(product.salePrice || 0).toLocaleString();
      const discountBadge = product.discountRate ? `<span class="discount_rate">${product.discountRate}%</span>` : "";

      return `
      <div class="product_card" data-id="${product.productId}">
        <div class="prod_img_wrap">
          <img src="${product.image || ""}" alt="${product.name}" />
        </div>
        <div class="prod_info_wrap">
          <div class="prod_brand_header d-flex justify-content-between align-items-center">
            <h3 class="prod_brand_name display_h3" title="${product.brand}">${product.brand}</h3>
            <button type="button" class="btn_wishlist">
              <span class="material-symbols-outlined">heart_plus</span>
            </button>
          </div>
          <p class="prod_desc body_xl">${product.name}</p>
          <div class="prod_price_info d-flex align-items-center">
            <span class="discount_rate body_xl">${discountBadge}</span>
            <span class="price_val body_xl">${formattedPrice}원</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  if (isMobile) {
    setupMobileScrollEvent(slotIndex, totalSubPages);
  } else {
    setupSubPaginationEvents(slotIndex, brandName, totalSubPages);
  }
}

// [핵심 추가] 모바일에서 가로 스크롤이 끝에 닿았을 때 다음 액션을 지시하는 스크롤 리스너 함수
function setupMobileScrollEvent(slotIndex, totalSubPages) {
  const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
  const scrollContainer = article.querySelector(".brand_product_scroll_container");

  if (!scrollContainer) return;

  let isThrottled = false; // 연속 트리거 방지용 불리언 변수

  scrollContainer.addEventListener("scroll", () => {
    if (isThrottled) return;

    // 현재 스크롤 위치값 계산 (오른쪽 끝 검사)
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    // 우측 끝에 도달하기 대략 5px 전 상황 감지
    if (scrollLeft + clientWidth >= scrollWidth - 5) {
      isThrottled = true;

      setTimeout(() => {
        const nextButton = document.querySelector(".master_pagination .btn_next");
        if (nextButton) {
          // 자연스럽게 다음 마스터 브랜드로 페이지를 넘김
          nextButton.click();
        }
        isThrottled = false;
      }, 400); // 0.4초 딜레이를 주어 급격한 화면 튕김 현상 방지
    }
  });
}

function setupSubPaginationEvents(slotIndex, brandName, totalSubPages) {
  const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
  const prevBtn = article.querySelector(".btn_inner_prev");
  const nextBtn = article.querySelector(".btn_inner_next");

  const newPrevBtn = prevBtn.cloneNode(true);
  const newNextBtn = nextBtn.cloneNode(true);

  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

  newPrevBtn.addEventListener("click", () => {
    if (subPageStatus[slotIndex] > 0) {
      subPageStatus[slotIndex]--;
    } else {
      subPageStatus[slotIndex] = totalSubPages - 1;
    }
    renderSubProductRow(slotIndex, brandName);
  });

  newNextBtn.addEventListener("click", () => {
    if (subPageStatus[slotIndex] < totalSubPages - 1) {
      subPageStatus[slotIndex]++;
    } else {
      subPageStatus[slotIndex] = 0;
    }
    renderSubProductRow(slotIndex, brandName);
  });
}

function setupMasterPagination() {
  const prevBtn = document.querySelector(".master_pagination .btn_prev");
  const nextBtn = document.querySelector(".master_pagination .btn_next");
  const totalMasterPages = Math.ceil(totalUniqueBrands.length / 2);

  prevBtn.addEventListener("click", () => {
    if (currentMasterPage > 0) {
      currentMasterPage--;
    } else {
      currentMasterPage = totalMasterPages - 1;
    }
    renderMasterPage();
  });

  nextBtn.addEventListener("click", () => {
    if (currentMasterPage < totalMasterPages - 1) {
      currentMasterPage++;
    } else {
      currentMasterPage = 0;
    }
    renderMasterPage();
  });
}
