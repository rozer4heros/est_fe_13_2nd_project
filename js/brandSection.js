const jsonPath = "data/products.json";

let allProducts = [];
let totalUniqueBrands = [];
let currentMasterPage = 0;
let subPageStatus = { 0: 0, 1: 0 };

const brandBannerMap = {
  "MIU MIU": "image/brand_section/miumiu_banner1.png",
  "RAY-BAN": "image/brand_section/rayban_banner.png",
  LASH: "image/brand_section/lash_banner.png",
  LOCOMOTIVE: "image/brand_section/locomotive_banner.png",
  OAKLEY: "image/brand_section/oakley_banner.png",
  "TART OPTICAL": "image/brand_section/tartoptical_banner.png",
  "RADIO EYES": "image/brand_section/radioeyes_banner.png",
  "ROUNZ ABSOLUTE": "image/brand_section/rounzabsolute_banner.png",
  PARANOID: "image/brand_section/paranoid_banner.png",
};

function isMobile() {
  return window.innerWidth <= 480 || document.documentElement.clientWidth <= 480;
}

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
  const mobile = isMobile();
  const itemsPerPage = mobile ? 1 : 2;

  const startIndex = currentMasterPage * itemsPerPage;
  const activeBrands = totalUniqueBrands.slice(startIndex, startIndex + itemsPerPage);
  const totalMasterPages = Math.ceil(totalUniqueBrands.length / itemsPerPage);

  const currentIndicator = document.querySelector(".master_pagination .current");
  const totalIndicator = document.querySelector(".master_pagination .total");

  if (currentIndicator) currentIndicator.textContent = currentMasterPage + 1;
  if (totalIndicator) totalIndicator.textContent = totalMasterPages || 1;

  // 현재 보이는 article에 slide_out 먼저 적용
  const visibleArticles = document.querySelectorAll(".brand_content_block");
  visibleArticles.forEach((el) => {
    if (el.style.display !== "none") {
      el.classList.add("slide_out");
    }
  });

  // 애니메이션 끝나고 새 콘텐츠 렌더링
  setTimeout(() => {
    for (let slotIndex = 0; slotIndex < 2; slotIndex++) {
      const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
      if (!article) continue;

      const brandName = activeBrands[slotIndex];

      if (!brandName || (mobile && slotIndex === 1)) {
        article.style.display = "none";
        article.classList.remove("slide_out", "slide_in");
        continue;
      }

      article.style.display = "flex";
      article.classList.remove("slide_out");
      article.classList.add("slide_in");

      // slide_in 클래스는 애니메이션 끝나면 제거
      article.addEventListener(
        "animationend",
        () => {
          article.classList.remove("slide_in");
        },
        { once: true },
      );

      subPageStatus[slotIndex] = 0;

      article.querySelector(".brand_name_title").textContent = brandName;

      const bannerImg = article.querySelector(".brand_wide_banner img");
      bannerImg.src = brandBannerMap[brandName] || "/image/brand_section/default_banner.png";
      bannerImg.alt = `${brandName} main banner`;

      const scrollContainer = article.querySelector(".brand_product_scroll_container");
      if (scrollContainer) scrollContainer.scrollLeft = 0;

      renderSubProductRow(slotIndex, brandName);
    }
  }, 300); // slide_out transition 시간(0.3s)과 맞춤
}

function renderSubProductRow(slotIndex, brandName) {
  const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
  const productContainer = article.querySelector(".brand_product_scroll_container .brand_product_row");
  const pageText = article.querySelector(".inner_sub_pagination .inner_page_text");

  const currentBrandProducts = allProducts.filter((p) => p.brand?.toUpperCase() === brandName);

  const mobile = isMobile();
  const totalSubPages = Math.min(Math.ceil(currentBrandProducts.length / 2), 3);

  let displayProducts = [];
  if (mobile) {
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
              <h3 class="prod_brand_name display_h4" title="${product.brand}">${product.brand}</h3>
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

  if (mobile) {
    setupMobileScrollEvent(slotIndex);
  } else {
    setupSubPaginationEvents(slotIndex, brandName, totalSubPages);
  }
}

function setupMobileScrollEvent(slotIndex) {
  const article = document.querySelector(`[data-block-index="${slotIndex}"]`);
  const scrollContainer = article.querySelector(".brand_product_scroll_container");

  if (!scrollContainer) return;

  if (scrollContainer.dataset.scrollBound) return;
  scrollContainer.dataset.scrollBound = "true";

  let isThrottled = false;

  scrollContainer.addEventListener("scroll", () => {
    if (isThrottled) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    if (scrollLeft + clientWidth >= scrollWidth - 5) {
      isThrottled = true;
      setTimeout(() => {
        const nextButton = document.querySelector(".master_pagination .btn_next");
        if (nextButton) nextButton.click();
        isThrottled = false;
      }, 400);
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

  prevBtn.addEventListener("click", () => {
    const mobile = isMobile();
    const itemsPerPage = mobile ? 1 : 2;
    const totalMasterPages = Math.ceil(totalUniqueBrands.length / itemsPerPage);

    if (currentMasterPage > 0) {
      currentMasterPage--;
    } else {
      currentMasterPage = totalMasterPages - 1;
    }
    renderMasterPage();
  });

  nextBtn.addEventListener("click", () => {
    const mobile = isMobile();
    const itemsPerPage = mobile ? 1 : 2;
    const totalMasterPages = Math.ceil(totalUniqueBrands.length / itemsPerPage);

    if (currentMasterPage < totalMasterPages - 1) {
      currentMasterPage++;
    } else {
      currentMasterPage = 0;
    }
    renderMasterPage();
  });
}

const row = document.querySelector(".brand_product_row");
const container = document.querySelector(".brand_product_scroll_container");

const masterTrack = document.querySelector(".brand_master_slider_track");

if (masterTrack) {
  masterTrack.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product_card");

    if (e.target.closest(".btn_wishlist")) {
      return;
    }

    if (productCard) {
      const productId = productCard.dataset.id;

      if (productId) {
        location.href = `details.html?productId=${productId}`;
      }
    }
  });
}
