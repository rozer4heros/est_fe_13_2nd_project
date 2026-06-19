// ==========================================
// Imports & External Libraries
// ==========================================

// ==========================================
// DOM Selectors
// ==========================================

const allLabelEls = document.querySelectorAll("label");

const filterDrawerBtnEl = document.querySelector(".filter_dropdown_list > button");
const filterDrawerWrapEl = document.querySelector(".filter_drawer_wrap");
const filterDrawerCloseEl = document.querySelector(".filter_drawer_header .close_btn");
const filterAccordionEls = document.querySelectorAll(".accordion_list > li");
const drawerPriceMinEl = document.querySelector("#drawer_price_min");
const drawerPriceMaxEl = document.querySelector("#drawer_price_max");

const productListTabEls = document.querySelectorAll(".product_list_tab");
const filterDropdownEls = document.querySelectorAll(".filter_dropdown");
const filterResetBtnEl = document.querySelector(".reset_btn");
const productCountEls = document.querySelectorAll(".product_count");

const sortDropdownEl = document.querySelector(".sort_dropdown");
const sortSelectedTextEl = document.querySelector(".sort_selected_text");
const sortMenuEls = sortDropdownEl.querySelectorAll(".sort_dropdown_menu li");

const inputElsCategory = document.querySelectorAll(".filter_category input");
const inputElsBrand = document.querySelectorAll(".filter_brand input");
const inputElsShape = document.querySelectorAll(".filter_shape input");
// const inputElsFace = document.querySelectorAll(".filter_face input");
const inputElsGender = document.querySelectorAll(".filter_gender input");
const inputElsSize = document.querySelectorAll(".filter_size input");
const inputElsPrice = document.querySelectorAll(".filter_price input");
const inputElsAll = [
  ...inputElsCategory,
  ...inputElsBrand,
  ...inputElsShape,
  ...inputElsGender,
  ...inputElsSize,
  ...inputElsPrice,
];

const resetBtnEls = document.querySelectorAll(".reset_btn");
const productListEl = document.querySelector(".product_list");

// Pagination DOM
const pager = document.querySelector(".product_list_pagination .pagination_pages");
const pagerPrevBtn = document.querySelector(".product_list_pagination .prev_btn");
const pagerNextBtn = document.querySelector(".product_list_pagination .next_btn");

// ==========================================
// State & Constants
// ==========================================

let allProducts = [];
let filteredProducts = [];

let selectedCategories = [];
let selectedBrands = [];
let selectedShapes = [];
// let selectedFaces = [];
let selectedGenders = [];
let selectedSizes = [];
let selectedPriceMin = 0;
let selectedPriceMax = 300000;

// Pagination State
const countPerPage = 12;
const pagerPerGroup = 5;
let curPage = 1;
let curGroup = 1;
let paginationCount = 0;

// ==========================================
// Functions & Core Logic
// ==========================================

async function fetchProducts() {
  await fetch("./data/products.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
      return response.json();
    })
    .then((result) => {
      allProducts = result;
    })
    .catch((error) => {
      console.error("데이터 로드 실패: ", error);
    });

  filteredProducts = allProducts;
  console.log(filteredProducts[0]);

  renderProducts();
  applySort("recommended");
  applyURLParams();
}

function renderProductCard(product) {
  if (!product) return;
  const itemEl = document.createElement("li");
  itemEl.innerHTML = `
    <article class="product_card">
      <a href="details.html?id=${product.productId ?? ""}" class="product_card_imgbox">
        <img src="${product.mainImage ?? ""}" alt="${escHTML(product.name ?? "")}" />
        <button class="try_on_btn body_xl text-center">TRY ON</button>
      </a>
      <div class="d-flex flex-column g-0-5">
        <h3 class="product_name body_xl">
          <a href="details.html?id=${product.productId ?? ""}">${escHTML(product.name ?? "")}</a>
        </h3>
        <div class="product_card_header d-flex justify-content-between align-items-center">
          <span class="brand display_h3">${escHTML(product.brand ?? "")}</span>
          <a href="../login.html" class="like product_card_wish_btn material-symbols-rounded">heart_plus</a>
        </div>
        <div class="product_card_footer d-flex justify-content-between align-items-center">
          <div class="product_card_price d-flex align-items-center g-0-5">
          ${
            product.isSoldOut
              ? `<span class="price display_h3">일시 품절</span>`
              : `
            <span class="price display_h3">${Number(product.salePrice ?? "").toLocaleString()}원</span>
            <span class="discount_rate body_xl">${product.discountRate ?? ""}%</span>
            `
          }
          </div>
          <button class="material-icons-outlined" ${product.isSoldOut ? `disabled` : ``}>shopping_cart</button>
        </div>
      </div>
    </article>
  `;

  itemEl.querySelector(".product_card_wish_btn").addEventListener("click", (e) => {
    window.localStorage.setItem("");
  });

  productListEl.appendChild(itemEl);
}
function renderProducts(firstIndex = (curPage - 1) * 12, lastIndex = firstIndex + 11) {
  productListEl.innerHTML = "";
  updateCount();
  if (filteredProducts.length === 0) {
    productListEl.textContent = "해당하는 상품이 없습니다.";
  } else {
    for (let i = firstIndex; i <= lastIndex; i++) {
      renderProductCard(filteredProducts[i]);
    }
  }
  createPagination();
}

function updateCount(count = filteredProducts.length) {
  [...productCountEls].forEach((countEl) => {
    countEl.textContent = `총 ${count}개`;
  });
}

function applyFilter() {
  updateLabel();

  // 디버깅을 위해 .filter() 함수 체인을 끊어야만 했다...
  // 카테고리
  filteredProducts = allProducts.filter((p) =>
    selectedCategories.includes("all_category") || selectedCategories.length === 0
      ? true
      : selectedCategories.includes(p.category),
  );
  // 브랜드
  filteredProducts = filteredProducts.filter((p) =>
    selectedBrands.length === 0
      ? true
      : selectedBrands.some((brand) => (brand === "ROUNZ" ? p.brand?.startsWith("ROUNZ") : p.brand === brand)),
  );
  // 모양
  filteredProducts = filteredProducts.filter((p) =>
    selectedShapes.length === 0 ? true : selectedShapes.includes(p.shape),
  );
  // 성별
  filteredProducts = filteredProducts.filter((p) =>
    selectedGenders.length === 0 ? true : selectedGenders.includes(p.gender),
  );
  // 프레임 크기
  filteredProducts = filteredProducts.filter((p) =>
    selectedSizes.includes("all_size") || selectedSizes.length === 0 ? true : selectedSizes.includes(p.frameSize),
  );
  // 가격
  filteredProducts = filteredProducts.filter((p) => Number(p.salePrice) >= selectedPriceMin);
  filteredProducts = filteredProducts.filter((p) =>
    selectedPriceMax >= 300000 ? true : Number(p.salePrice) <= selectedPriceMax,
  );

  curPage = 1;
  curGroup = 1;
  renderProducts();
}
function updateLabel() {
  allLabelEls.forEach((label) => {
    if (!label.control) return;
    label.control.checked ? label.classList.add("active") : label.classList.remove("active");
  });
}
function resetFilter() {
  inputElsAll.forEach((input) => {
    input.checked = input.value.startsWith("all_");
  });
  allLabelEls.forEach((label) => {
    label.classList.remove("active");
    if (label.getAttribute("for").endsWith("_all")) label.classList.add("active");
  });
  inputElsPrice[0].value = 0;
  inputElsPrice[1].value = 300000;
  drawerPriceMinEl.value = 0;
  drawerPriceMaxEl.value = 300000;

  selectedCategories = [];
  selectedBrands = [];
  selectedShapes = [];
  selectedGenders = [];
  selectedSizes = [];
  selectedPriceMin = 0;
  selectedPriceMax = 300000;
  applyFilter();
}

function applySort(sort) {
  switch (sort) {
    case "popular":
      filteredProducts.sort((a, b) => b.wish - a.wish);
      sortSelectedTextEl.textContent = "인기순";
      break;
    // case latest:
    // filteredProducts.sort((a,b)=>)
    // break;
    case "recommended":
      filteredProducts.sort(
        (a, b) =>
          (Number(b.wish) + Number(b.reviews) * 31) * (Number(b.discountRate) + 20) -
          (Number(a.wish) + Number(a.reviews) * 31) * (Number(a.discountRate) + 20),
      );
      sortSelectedTextEl.textContent = "추천순";
      break;
    case "price_asc":
      filteredProducts.sort((a, b) => a.salePrice - b.salePrice);
      sortSelectedTextEl.textContent = "낮은 가격순";
      break;
    case "price_desc":
      filteredProducts.sort((a, b) => b.salePrice - a.salePrice);
      sortSelectedTextEl.textContent = "높은 가격순";
      break;
    case "most_reviewed":
      filteredProducts.sort((a, b) => b.reviews - a.reviews);
      sortSelectedTextEl.textContent = "리뷰 많은순";
      break;
    default:
      filteredProducts.sort((a, b) => a.productId - b.productId);
      break;
  }

  curPage = 1;
  curGroup = 1;
  renderProducts();
}

function applyURLParams() {
  let params = new URLSearchParams(location.search);

  console.log(params.get("category"));

  inputElsCategory.forEach((input) => {
    input.checked = false;
  });

  switch (params.get("category")) {
    case "glasses":
    case "frame":
      inputElsAll.find((i) => i.value === "안경테").checked = true;
      break;
    case "sunglasses":
      inputElsAll.find((i) => i.value === "선글라스").checked = true;
      break;
    default:
      inputElsAll.find((i) => i.value === "all_category").checked = true;
      break;
  }
  selectedCategories = [...inputElsCategory].filter((l) => l.checked).map((l) => l.value);

  // switch (params.get("brand")) {
  //   case "rayban":
  //     break;
  //   case "oakley":
  //     break;
  //   case "lash":
  //     break;
  //   case "locomotive":
  //     break;
  //   case "rounz":
  //     break;
  //   case "izipizi":
  //     break;
  //   case "carven":
  //     break;
  //   case "chloe":
  //     break;
  //   default:
  //     break;
  // }
  // selectedBrands = [...inputElsBrand].filter((l) => l.checked).map((l) => l.value);

  // switch (params.get("shape")) {
  // }
  // selectedShapes = [...inputElsShape].filter((l) => l.checked).map((l) => l.value);

  // switch (params.get("gender")) {
  // }
  // selectedGenders = [...inputElsGender].filter((l) => l.checked).map((l) => l.value);

  // switch (params.get("size")) {
  // }
  // selectedSizes = [...inputElsSize].filter((l) => l.checked).map((l) => l.value);

  applyFilter();
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

function createPagination(total = filteredProducts.length) {
  paginationCount = Math.ceil(total / countPerPage);
  const pagerGroupCount = Math.ceil(paginationCount / pagerPerGroup);

  const startPage = (curGroup - 1) * pagerPerGroup + 1;
  const endPage = Math.min(startPage + pagerPerGroup - 1, paginationCount);

  let pagerHTML = "";
  for (let i = startPage; i <= endPage; i++) {
    pagerHTML += `<li class="page_num ${i === curPage ? "active" : ""}">${i}</li>`;
  }
  pager.innerHTML = pagerHTML;

  if (curGroup === 1) pagerPrevBtn.classList.add("disabled");
  else pagerPrevBtn.classList.remove("disabled");
  if (curGroup === pagerGroupCount) pagerNextBtn.classList.add("disabled");
  else pagerNextBtn.classList.remove("disabled");

  const pagerBtns = pager.querySelectorAll(".page_num");
  pagerBtns.forEach((curBtn) => {
    curBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let targetPage = Number(curBtn.textContent);

      if (curPage === targetPage) return;
      curPage = targetPage;
      renderProducts((curPage - 1) * 12, curPage * 12 - 1);

      // 모든 페이지에서 active 제거, 현재 활성화된 a에만 active 추가
      pagerBtns.forEach((b) => {
        b.classList.remove("active");
      });
      curBtn.classList.add("active");
    });
  });
}
function paginate(dataArray = [], page = 1) {
  const start = (page - 1) * countPerPage;
  const end = start + countPerPage;
  return dataArray.slice(start, end);
}

function moveGroup(dir) {
  curGroup += dir;
  curPage = (curGroup - 1) * 5 + 1;
  createPagination(allProducts.length);
  renderProducts((curPage - 1) * 12, curPage * 12 - 1);
}

// ==========================================
// Event Listeners
// ==========================================

filterDrawerBtnEl.addEventListener("click", (e) => {
  filterDrawerWrapEl.classList.add("active");
});
filterDrawerWrapEl.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    filterDrawerWrapEl.classList.remove("active");
  }
});
filterDrawerCloseEl.addEventListener("click", (e) => {
  filterDrawerWrapEl.classList.remove("active");
});
filterAccordionEls.forEach((acc) => {
  acc.querySelector(".accordion_header").addEventListener("click", (e) => {
    acc.classList.toggle("active");
  });
});

document.addEventListener("click", (e) => {
  filterDropdownEls.forEach((fdd) => {
    if (!fdd.contains(e.target)) {
      fdd.classList.remove("active");
    }
  });
  if (!sortDropdownEl.contains(e.target)) {
    sortDropdownEl.classList.remove("active");
  }
});
filterDropdownEls.forEach((fdd) => {
  fdd.querySelector(".filter_dropdown_trigger").addEventListener("click", (e) => {
    if (fdd.classList.contains("active")) {
      fdd.classList.remove("active");
      return;
    }
    filterDropdownEls.forEach((f) => f.classList.remove("active"));
    fdd.classList.add("active");
  });
});

sortDropdownEl.querySelector(".sort_dropdown_trigger").addEventListener("click", (e) => {
  sortDropdownEl.classList.toggle("active");
});
sortMenuEls.forEach((sort) => {
  sort.addEventListener("click", (e) => {
    sortMenuEls.forEach((s) => s.classList.remove("selected"));
    sort.classList.add("selected");
    sortDropdownEl.classList.remove("active");
    applySort(sort.dataset.value);
  });
});

inputElsCategory.forEach((input) => {
  input.addEventListener("change", (e) => {
    selectedCategories = [...inputElsCategory].filter((l) => l.checked).map((l) => l.value);
    applyFilter();
  });
});
inputElsBrand.forEach((input) => {
  input.addEventListener("change", (e) => {
    selectedBrands = [...inputElsBrand].filter((l) => l.checked).map((l) => l.value);
    applyFilter();
  });
});
inputElsShape.forEach((input) => {
  input.addEventListener("change", (e) => {
    selectedShapes = [...inputElsShape].filter((l) => l.checked).map((l) => l.value);
    applyFilter();
  });
});
inputElsGender.forEach((input) => {
  input.addEventListener("change", (e) => {
    selectedGenders = [...inputElsGender].filter((l) => l.checked).map((l) => l.value);
    applyFilter();
  });
});
inputElsSize.forEach((input) => {
  input.addEventListener("change", (e) => {
    if (e.target.value.startsWith("all_")) {
      inputElsSize.forEach((l) => {
        l.checked = false;
      });
      e.target.checked = true;
    } else {
      [...allLabelEls].find((l) => l.control?.value === "all_size").control.checked = false;
    }

    selectedSizes = [...inputElsSize].filter((l) => l.checked).map((l) => l.value);
    if (selectedSizes.length === 0) {
      [...allLabelEls].find((l) => l.control?.value === "all_size").control.checked = true;
    }
    applyFilter();
  });
});
inputElsPrice.forEach((input) => {
  input.addEventListener("change", (e) => {
    const priceValues = [...inputElsPrice].map((l) => Number(l.value));
    selectedPriceMin = Math.min(...priceValues);
    selectedPriceMax = Math.max(...priceValues);
    drawerPriceMinEl.value = String(selectedPriceMin);
    drawerPriceMaxEl.value = String(selectedPriceMax);
    applyFilter();
  });
});
drawerPriceMinEl.addEventListener("change", (e) => {
  let targetEl = [...inputElsPrice].sort((a, b) => Number(a.value) - Number(b.value))[0];
  targetEl.value = drawerPriceMinEl.value;
});
drawerPriceMaxEl.addEventListener("change", (e) => {
  let targetEl = [...inputElsPrice].sort((a, b) => Number(b.value) - Number(a.value))[0];
  targetEl.value = drawerPriceMaxEl.value;
});

resetBtnEls.forEach((reset) => {
  reset.addEventListener("click", (e) => {
    resetFilter();
  });
});

pagerPrevBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveGroup(-1);
});
pagerNextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveGroup(+1);
});

// ==========================================
// Initialization & Execution
// ==========================================

fetchProducts();
