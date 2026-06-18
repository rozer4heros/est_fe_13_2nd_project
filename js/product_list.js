// ==========================================
// Imports & External Libraries
// ==========================================

// ==========================================
// DOM Selectors
// ==========================================

const filterDrawerBtnEl = document.querySelector(".filter_dropdown_list > button");
const filterDrawerWrapEl = document.querySelector(".filter_drawer_wrap");
const filterDrawerCloseEl = document.querySelector(".filter_drawer_header .close_btn");
const filterAccordionEls = document.querySelectorAll(".accordion_list > li");

const productListTabs = document.querySelectorAll(".product_list_tab");
const filterDropdownEls = document.querySelectorAll(".filter_dropdown");
const filterResetBtnEl = document.querySelector(".reset_btn");
const productCountEl = document.querySelector(".product_count");
const sortDropdownEl = document.querySelector(".sort_dropdown");

const productListEl = document.querySelector(".product_list");

// ==========================================
// State & Constants
// ==========================================

let allProducts = [];
let filteredProducts = [];

// ==========================================
// Functions & Core Logic
// ==========================================

async function fetchProducts() {
  await fetch("../data/products.json")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
      return response.json();
    })
    .then(result => {
      allProducts = result;
    })
    .catch(error => {
      console.error("데이터 로드 실패: ", error);
    });

  filteredProducts = allProducts;
  // filteredProducts = allProducts.filter(product => !product.isSoldOut);
  console.log(filteredProducts[0]);

  renderProducts();
  updateCount();
}

function renderProductCard(product) {
  const itemEl = document.createElement("li");
  itemEl.innerHTML = `
    <article class="product_card">
      <a href="details.html?id=${product.productId}" class="product_card_imgbox">
        <img src="${product.mainImage}" alt="${escHTML(product.name)}" />
        <button class="try_on_btn body_xl text-center">TRY ON</button>
      </a>
      <div class="d-flex flex-column g-0-5">
        <h3 class="product_name body_xl">
          <a href="details.html?id=${product.productId}">${escHTML(product.name)}</a>
        </h3>
        <div class="product_card_header d-flex justify-content-between align-items-center">
          <span class="brand display_h3">${escHTML(product.brand)}</span>
          <button class="like product_card_wish_btn material-symbols-rounded">heart_plus</button>
        </div>
        <div class="product_card_footer d-flex justify-content-between align-items-center">
          <div class="product_card_price d-flex align-items-center g-0-5">
          ${
            product.isSoldOut
              ? `<span class="price display_h3">매진</span>`
              : `
            <span class="price display_h3">${Number(product.salePrice).toLocaleString()}원</span>
            <span class="discount_rate body_xl">${product.discountRate}%</span>
            `
          }
          </div>
          <button class="material-icons-outlined" ${product.isSoldOut ? `disabled` : ``}>shopping_cart</button>
        </div>
      </div>
    </article>
  `;

  itemEl.querySelector(".product_card_wish_btn").addEventListener("click", e => {
    window.localStorage.setItem("");
  });

  productListEl.appendChild(itemEl);
}
function renderProducts(firstIndex = 0, lastIndex = firstIndex + 11) {
  productListEl.innerHTML = "";
  for (let i = firstIndex; i <= lastIndex; i++) {
    renderProductCard(filteredProducts[i]);
  }
}

function updateCount(count = filteredProducts.length) {
  productCountEl.textContent = `총 ${count}개`;
}

function escHTML(string) {
  if (!string) return "";
  return string
    .toString()
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("&", "&amp;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;");
}

// ==========================================
// Event Listeners
// ==========================================

filterDrawerBtnEl.addEventListener("click", e => {
  filterDrawerWrapEl.classList.add("active");
});
filterDrawerWrapEl.addEventListener("click", e => {
  if (e.target === e.currentTarget) {
    filterDrawerWrapEl.classList.remove("active");
  }
});
filterDrawerCloseEl.addEventListener("click", e => {
  filterDrawerWrapEl.classList.remove("active");
});
filterAccordionEls.forEach(acc => {
  acc.querySelector(".accordion_header").addEventListener("click", e => {
    acc.classList.toggle("active");
  });
});

document.addEventListener("click", e => {
  filterDropdownEls.forEach(fdd => {
    if (!fdd.contains(e.target)) {
      fdd.classList.remove("active");
    }
  });
  if (!sortDropdownEl.contains(e.target)) {
    sortDropdownEl.classList.remove("active");
  }
});
filterDropdownEls.forEach(fdd => {
  fdd.querySelector(".filter_dropdown_trigger").addEventListener("click", e => {
    if (fdd.classList.contains("active")) {
      fdd.classList.remove("active");
      return;
    }
    filterDropdownEls.forEach(f => f.classList.remove("active"));
    fdd.classList.add("active");
  });
});
sortDropdownEl.querySelector(".sort_dropdown_trigger").addEventListener("click", e => {
  sortDropdownEl.classList.toggle("active");
});
// ==========================================
// Initialization & Execution
// ==========================================

fetchProducts();
