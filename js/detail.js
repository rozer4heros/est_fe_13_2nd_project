document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  if (!productId) {
    alert("올바르지 않은 접근입니다. 메인 페이지로 이동합니다.");
    location.href = "index.html";
    return;
  }

  fetch("data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
      }
      return response.json();
    })
    .then((products) => {
      const product = products.find((p) => String(p.productId) === productId);

      if (!product) {
        alert("해당 상품을 찾을 수 없습니다.");
        location.href = "index.html";
        return;
      }
      renderProductDetail(product);
    })
    .catch((error) => {
      console.error("상세 페이지 로딩 실패:", error);
    });
});

function renderProductDetail(product) {
  // 가격 포맷팅
  const formattedSalePrice = Number(product.salePrice || 0).toLocaleString();
  const formattedOriginalPrice = Number(product.originalPrice || 0).toLocaleString();

  const heroImg = document.querySelector(".detail-hero-img img");
  if (heroImg) {
    heroImg.src = product.mainImage || product.image;
    heroImg.alt = product.name;
  }

  if (product.thumbImgs && product.thumbImgs.length > 0) {
    const detailImages = document.querySelectorAll(".detail-extra-images img");
    detailImages.forEach((img, index) => {
      if (product.thumbImgs[index]) {
        img.src = product.thumbImgs[index];
        img.alt = `${product.name} 상세 이미지 ${index + 1}`;
      }
    });
  }

  const brandEl = document.querySelector(".product-info-card .brand");
  if (brandEl) {
    brandEl.textContent = product.brand || "ROUNZ";
  }

  const nameEl = document.querySelector(".product-info-card .product-name");
  if (nameEl) {
    nameEl.textContent = product.name;
  }

  const reviewsEl = document.querySelector(".product-info-card .reviews");
  if (reviewsEl) {
    reviewsEl.textContent = `(${product.reviews || 0}개 리뷰)`;
  }

  const currentPriceEl = document.querySelector(".product-info-card .current-price");
  if (currentPriceEl) {
    currentPriceEl.textContent = `${formattedSalePrice}원`;
  }

  const originalPriceEl = document.querySelector(".product-info-card .original-price");
  const discountRateEl = document.querySelector(".product-info-card .discount-rate");
  const discountInfoEl = document.querySelector(".product-info-card .discount-info");

  if (product.discountRate && Number(product.discountRate) > 0) {
    if (originalPriceEl) originalPriceEl.textContent = `${formattedOriginalPrice}원`;
    if (discountRateEl) discountRateEl.textContent = `${product.discountRate}% 할인`;
    if (discountInfoEl) discountInfoEl.style.display = "flex";
  } else {
    if (discountInfoEl) discountInfoEl.style.display = "none";
  }

  const colorButtonsContainer = document.querySelector(".color-buttons");
  if (colorButtonsContainer && product.colors && product.colors.length > 0) {
    colorButtonsContainer.innerHTML = "";

    product.colors.forEach((color, index) => {
      const colorCircle = document.createElement("div");
      colorCircle.className = `color-circle ${index === 0 ? "selected" : ""}`;
      colorCircle.style.backgroundColor = color.hex;
      colorCircle.setAttribute("title", color.label);
      colorButtonsContainer.appendChild(colorCircle);
    });
  }

  const newMemberValueEl = document.querySelector(".new-member-value");
  if (newMemberValueEl) {
    const newMemberPrice = Math.floor(Number(product.salePrice) * 0.95);
    newMemberValueEl.textContent = `${newMemberPrice.toLocaleString()}원`;
  }

  const pointsEl = document.querySelectorAll(".info-row span:last-child");
  if (pointsEl.length >= 2) {
    const rewardPoints = Math.floor(Number(product.salePrice) * 0.05);
    pointsEl[1].textContent = `${rewardPoints.toLocaleString()}원`; // 적립금 칸
  }
}
