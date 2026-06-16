const jsonPath = "data/products.json";

export async function initNewCollection() {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    renderPageChunkList(data.slice(0, 8));
  } catch (error) {
    console.error("New Collection 로드 실패:", error);
  }
}

function renderPageChunkList(products) {
  const trackContainer = document.querySelector(".new_collection_track");
  if (!trackContainer) return;

  trackContainer.innerHTML = "";

  const productChunks = [];
  for (let i = 0; i < products.length; i += 4) {
    productChunks.push(products.slice(i, i + 4));
  }

  productChunks.forEach(chunkItems => {
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("new_collection_page");

    const ul = document.createElement("ul");
    ul.classList.add("new_collection_list");

    chunkItems.forEach(product => {
      const formattedPrice = Number(product.salePrice).toLocaleString();
      const li = document.createElement("li");
      li.classList.add("new_collection_item");

      li.innerHTML = `
        <a href="details.html?productId=${product.productId}" class="new_collection_card d-flex">
          <div class="new_collection_img_box d-flex justify-content-center align-items-center">
            <img src="${product.image}" alt="${product.name}" class="new_card_img" loading="lazy" />
            <button type="button" class="new_card_wish_btn d-flex justify-content-center align-items-center" data-product-id="${product.productId}">
              <span class="material-symbols-rounded">heart_plus</span>
            </button>
          </div>
          <div class="new_collection_info d-flex flex-column">
            <strong class="new_card_brand display_h3">${product.brand}</strong>
            <p class="new_card_name body_m">${product.name}</p>
            <span class="new_card_price display_h3">${formattedPrice}원</span>
            <p class="new_card_shipping d-flex align-items-center body_cap">
              <span class="material-icons-outlined" aria-hidden="true">shopping_cart</span>
              <span>무료배송</span>
            </p>
          </div>
        </a>
      `;
      ul.appendChild(li);
    });

    pageDiv.appendChild(ul);
    trackContainer.appendChild(pageDiv);
  });

  setupWishEvents();
  setupIndicatorEvent(trackContainer);
}

function setupIndicatorEvent(scrollContainer) {
  const indicatorBar = document.querySelector(".indicator_bar");
  if (!indicatorBar) return;

  const totalPages = scrollContainer.children.length;
  if (totalPages <= 1) return;
  const barWidthPercentage = 100 / totalPages;
  indicatorBar.style.width = `${barWidthPercentage}%`;

  scrollContainer.addEventListener("scroll", () => {
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (maxScrollLeft <= 0) return;
    const scrollRatio = scrollContainer.scrollLeft / maxScrollLeft;
    const maxMoveRange = 100 - barWidthPercentage;
    const movePercentage = scrollRatio * maxMoveRange;
    indicatorBar.style.transform = `translateX(${movePercentage}%)`;
  });
}

function setupWishEvents() {
  const buttons = document.querySelectorAll(".new_card_wish_btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      btn.classList.toggle("active");
      const icon = btn.querySelector(".material-symbols-rounded");
      icon.textContent = btn.classList.contains("active") ? "favorite" : "heart_plus";
    });
  });
}
