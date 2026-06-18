document.addEventListener("DOMContentLoaded", () => {
  const cartLayoutContainer = document.querySelector(".cart_layout_container");
  if (!cartLayoutContainer) return;

  if (localStorage.getItem("rounz_cart") === null) {
    const dummyCart = [
      { productId: "3003222", quantity: 1 },
      { productId: "11536", quantity: 2 },
    ];
    localStorage.setItem("rounz_cart", JSON.stringify(dummyCart));
  }

  let productsDB = [];

  async function loadProductsData() {
    try {
      const response = await fetch("data/products.json");

      if (!response.ok) {
        throw new Error("상품 데이터를 불러오는 데 실패했습니다.");
      }
      productsDB = await response.json();
      renderCart();
      renderBestPicks();
    } catch (error) {
      console.error("에러 발생:", error);
      cartLayoutContainer.innerHTML = `
        <div style="text-align:center; padding: 100px 0;">
          <p class="body_l text-danger">데이터를 로드하는 중 오류가 발생했습니다.</p>
        </div>
      `;
    }
  }

  //담긴 상품
  function renderCart() {
    const cartItems = JSON.parse(localStorage.getItem("rounz_cart")) || [];

    // 상품이 없으면
    if (cartItems.length === 0) {
      cartLayoutContainer.innerHTML = `
        <div class="cart_empty_container d-flex flex-column align-items-center justify-content-center">
          <div class="empty_icon_box d-flex align-items-center justify-content-center">
            <span class="material-icons-round">shopping_bag</span>
          </div>
          <h2 class="display_h3 empty_title">장바구니에 담긴 상품이 없습니다.</h2>
          <p class="body_xl empty_subtitle">라운즈의 다양한 안경과 선글라스를 확인해보세요.</p>
          
          <div class="empty_action_buttons d-flex justify-content-center align-items-center">
            <a href="product_list.html?category=glasses" class="btn_empty_nav body_xl btn_blue d-flex align-items-center justify-content-center">
              안경 보러가기 &rarr;
            </a>
            <a href="product_list.html?category=sunglasses" class="btn_empty_nav body_xl btn_dark d-flex align-items-center justify-content-center">
              선글라스 보러가기 &rarr;
            </a>
          </div>
          
          <a href="product_list.html?category=lens" class="link_lens_nav body_l d-flex align-items-center justify-content-center">
            콘택트렌즈 보러가기 &rarr;
          </a>
        </div>
      `;
      return;
    }
    // 상품이 담기면
    cartLayoutContainer.innerHTML = `
      <div class="cart_left_content">
        <h2 class="display_h2 cart_title">장바구니</h2>
        <p class="body_l cart_subtitle text-muted"><span id="total_count_header">0</span>개의 상품이 담겨 있습니다.</p>

        <div class="select_all_box d-flex justify-content-between align-items-center">
          <label class="checkbox_container d-flex align-items-center">
            <input type="checkbox" checked id="selectAll">
            <span class="checkmark"></span>
            <span class="body_l">전체 선택 (<span id="selected_count">0</span>/<span id="total_count_bar">0</span>)</span>
          </label>
          <div class="select_actions d-flex align-items-center g-0-5 body_m text-muted">
            <button type="button" class="action_btn" id="btn_delete_selected">선택 삭제</button>
            <span class="divider">|</span>
            <button type="button" class="action_btn" id="btn_clear_cart">장바구니 비우기</button>
          </div>
        </div>

        <div class="cart_items_list d-flex flex-column"></div>

        <div class="price_math_bar justify-content-between align-items-center">
          <div class="math_block text-center">
            <div class="math_label body_m text-muted">판매 금액</div>
            <div class="math_val body_xl" id="math_base_price">0원</div>
          </div>
          <div class="math_operator body_m text-muted">-</div>
          <div class="math_block text-center">
            <div class="math_label body_m text-muted">할인 금액</div>
            <div class="math_val body_xl rdcolor" id="math_discount_price">0원</div>
          </div>
          <div class="math_operator body_m text-muted">+</div>
          <div class="math_block text-center">
            <div class="math_label body_m text-muted">배송비</div>
            <div class="math_val body_xl" id="math_shipping_fee">무료</div>
          </div>
          <div class="math_operator body_m text-muted">=</div>
          <div class="math_block text-center">
            <div class="math_label body_m text-muted">최종 금액</div>
            <div class="math_val body_xl ptcolor" id="math_final_price">0원</div>
          </div>
        </div>
      </div>

      <div class="cart_right_sidebar">
        <div class="sidebar_sticky_card">
          <div class="sidebar_header pc_only">
            <h3 class="body_l d-flex align-items-center g-0-5">
              <span class="material-icons-round ">shopping_cart</span> 결제 정보
            </h3>
          </div>
          <div class="shipping_destination_box pc_only">
            <div class="d-flex align-items-center g-0-5 text-muted body_m">
              <span class="material-icons-round">place</span> 배송정보
            </div>
            <button type="button" class="select_destination_btn d-flex justify-content-between align-items-center body_cap">
              <span>배송지를 선택해주세요</span>
              <span class="material-icons-round">chevron_right</span>
            </button>
          </div>
          <div class="summary_details_box">
            <div class="summary_title pc_only body_m text-muted">
              <span class="material-icons-round">list_alt</span> 주문 요약
            </div>
            <div class="summary_row d-flex justify-content-between align-items-center body_m">
              <span class="body_cap text-muted">상품</span>
              <div>
                <span class="text-muted mo_ta_only body_l">총 <span id="summary_qty">0</span>개 </span>
                <span class="body_l" id="summary_total_price">0원</span>
              </div>
            </div>
            <div class="summary_row pc_only d-flex justify-content-between align-items-center body_l">
              <span class="body_cap text-muted">수량</span>
              <span class="body-m"><span id="sidebar_qty">0</span>개</span>
            </div>
            <div class="summary_row pc_only d-flex justify-content-between align-items-center body_m">
              <span class="body_cap text-muted">배송비</span>
              <span class="body_l ptcolor">무료</span>
            </div>
            <div class="summary_row points_row d-flex justify-content-between align-items-center body_m">
              <span class="body_cap text-muted ">적립 예정 포인트</span>
              <span class="body-l ptcolor" id="summary_points">0P</span>
            </div>
          </div>
          <div class="final_total_box d-flex justify-content-between align-items-center">
            <span class="body_xl">최종 결제 금액</span>
            <span class="body_xl ptcolor" id="footer_final_price">0원</span>
          </div>
          <div class="checkout_action_box">
            <button type="button" class="submit-button checkout_btn body_xl" id="btn_checkout">0원 결제하기</button>
          </div>
        </div>
      </div>
    `;

    const itemsListContainer = document.querySelector(".cart_items_list");

    //담길 상품 정보
    cartItems.forEach(cartItem => {
      const product = productsDB.find(p => p.productId === cartItem.productId);
      if (!product) return;

      const itemCard = document.createElement("div");
      itemCard.className = "cart_item_card d-flex";
      itemCard.dataset.id = product.productId;

      itemCard.innerHTML = `
        <label class="checkbox_container item_checkbox">
          <input type="checkbox" checked class="single_checkbox">
          <span class="checkmark"></span>
        </label>
        <div class="item_img_box d-flex  align-items-center">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="item_info_details d-flex flex-column justify-content-between">
          <div class="item_header_info">
            <div class="d-flex justify-content-between align-items-start">
              <h3 class="body_m brand_name">${product.brand}</h3>
              <button type="button" class="delete_item_btn"><span class="material-icons-round">close</span></button>
            </div>
            <p class="body_m model_name">${product.name}</p>
            <p class="body_cap category_name text-muted">${product.category}</p>
            ${!product.isSoldOut ? '<span class="badge_free_shipping body_cap">무료 배송</span>' : ""}
          </div>
          <div class="item_bottom_row d-flex justify-content-between align-items-center">
            <div class="quantity_selector d-flex align-items-center">
              <button type="button" class="qty_btn btn_minus">-</button>
              <input type="number" value="${cartItem.quantity}" min="1" readonly class="qty_input text-center">
              <button type="button" class="qty_btn btn_plus">+</button>
            </div>
            <div class="item_price display_h4" data-price="${product.salePrice}">
              ${(Number(product.salePrice) * cartItem.quantity).toLocaleString()}원
            </div>
          </div>
        </div>
      `;
      itemsListContainer.appendChild(itemCard);
    });

    bindEvents();
    calculatePrice();
  }

  //추천 상품
  function renderBestPicks() {
    const sliderTrack = document.getElementById("bestPicksContainer");
    const page1 = document.getElementById("bestPicksPage1");
    const page2 = document.getElementById("bestPicksPage2");

    if (!sliderTrack || !page1 || !page2) return;

    const bestItems = productsDB.slice(0, 8);
    page1.innerHTML = "";
    page2.innerHTML = "";

    bestItems.forEach((product, index) => {
      const bestCardHtml = `
        <div class="best_picks_card d-flex flex-column ${product.isSoldOut ? "is_soldout" : ""}" data-id="${product.productId}">
          <div class="best_picks_imagebox">
            <img src="${product.mainImage}" alt="${product.name}" class="best_picks_img" loading="lazy">
            
            ${product.isSoldOut ? `<div class="best_picks_soldout_badge body_cap">품절</div>` : ""}
            
            <button type="button" class="best_picks_wishbtn d-flex align-items-center justify-content-center" aria-label="위시리스트 추가">
              <span class="material-icons-round best_picks_heart">heart_plus</span>
            </button>
          </div>

          <div class="best_picks_infobox">
            <h3 class="best_picks_brand body_m">${product.brand}</h3>
            <p class="best_picks_name body_cap">${product.name}</p>
            
            <div class="best_picks_pricebox d-flex flex-column">
              <div class="best_picks_discountrow d-flex align-items-center">
                <span class="best_picks_original">${Number(product.originalPrice).toLocaleString()}원</span>
                <span class="best_picks_rate body_cap">${product.discountRate}%</span>
              </div>
              <div class="best_picks_current display_h4">${Number(product.salePrice).toLocaleString()}원</div>
            </div>
          </div>
        </div>
      `;
      if (index < 4) {
        page1.insertAdjacentHTML("beforeend", bestCardHtml);
      } else {
        page2.insertAdjacentHTML("beforeend", bestCardHtml);
      }
    });

    bindBestPicksEvents(page1);
    bindBestPicksEvents(page2);

    initBestPicksManualSlider(sliderTrack);
  }

  //추천상품 클릭 시 이벤트
  function bindBestPicksEvents(container) {
    container.addEventListener("click", e => {
      const wishBtn = e.target.closest(".best_picks_wishbtn");
      const card = e.target.closest(".best_picks_card");

      if (wishBtn) {
        e.stopPropagation();
        wishBtn.classList.toggle("active");
        return;
      }

      if (card && card.dataset.id) {
        window.location.href = `details.html?id=${card.dataset.id}`;
      }
    });
  }

  //슬라이더
  function initBestPicksManualSlider(sliderTrack) {
    const indicatorTrack = document.getElementById("bestPicksIndicatorTrack");
    const indicatorBar = document.getElementById("bestPicksIndicatorBar");
    if (!sliderTrack || !indicatorTrack || !indicatorBar) return;

    let currentPage = 0;

    indicatorTrack.addEventListener("click", () => {
      currentPage = currentPage === 0 ? 1 : 0;

      if (currentPage === 1) {
        sliderTrack.style.transform = "translateX(-50%)";
        indicatorBar.style.transform = "translateX(100%)";
      } else {
        sliderTrack.style.transform = "translateX(0)";
        indicatorBar.style.transform = "translateX(0)";
      }
    });
  }

  //체크박스, 수량
  function bindEvents() {
    const selectAllCheckbox = document.getElementById("selectAll");
    const singleCheckboxes = document.querySelectorAll(".single_checkbox");

    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener("change", e => {
        singleCheckboxes.forEach(cb => (cb.checked = e.target.checked));
        calculatePrice();
      });
    }

    singleCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checkedCount = document.querySelectorAll(".single_checkbox:checked").length;
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = checkedCount === singleCheckboxes.length;
        }
        calculatePrice();
      });
    });

    const itemsListContainer = document.querySelector(".cart_items_list");
    if (itemsListContainer) {
      itemsListContainer.addEventListener("click", e => {
        const target = e.target;
        const card = target.closest(".cart_item_card");
        if (!card) return;

        const productId = card.dataset.id;
        let cartItems = JSON.parse(localStorage.getItem("rounz_cart")) || [];
        const itemIndex = cartItems.findIndex(item => item.productId === productId);

        if (target.classList.contains("btn_plus")) {
          if (itemIndex > -1) {
            cartItems[itemIndex].quantity += 1;
            localStorage.setItem("rounz_cart", JSON.stringify(cartItems));
            renderCart();
          }
        } else if (target.classList.contains("btn_minus")) {
          if (itemIndex > -1 && cartItems[itemIndex].quantity > 1) {
            cartItems[itemIndex].quantity -= 1;
            localStorage.setItem("rounz_cart", JSON.stringify(cartItems));
            renderCart();
          }
        } else if (target.closest(".delete_item_btn")) {
          if (itemIndex > -1) {
            cartItems.splice(itemIndex, 1);
            localStorage.setItem("rounz_cart", JSON.stringify(cartItems));
            renderCart();
          }
        }
      });
    }

    const btnClearCart = document.getElementById("btn_clear_cart");
    if (btnClearCart) {
      btnClearCart.addEventListener("click", () => {
        localStorage.setItem("rounz_cart", JSON.stringify([]));
        renderCart();
      });
    }

    const btnDeleteSelected = document.getElementById("btn_delete_selected");
    if (btnDeleteSelected) {
      btnDeleteSelected.addEventListener("click", () => {
        const checkedCards = document.querySelectorAll(".cart_item_card");
        let cartItems = JSON.parse(localStorage.getItem("rounz_cart")) || [];

        checkedCards.forEach(card => {
          const cb = card.querySelector(".single_checkbox");
          if (cb && cb.checked) {
            const productId = card.dataset.id;
            cartItems = cartItems.filter(item => item.productId !== productId);
          }
        });

        localStorage.setItem("rounz_cart", JSON.stringify(cartItems));
        renderCart();
      });
    }
  }

  //가격계산
  function calculatePrice() {
    const cards = document.querySelectorAll(".cart_item_card");
    let totalBasePrice = 0;
    let totalItemsCount = cards.length;
    let selectedItemsCount = 0;

    cards.forEach(card => {
      const cb = card.querySelector(".single_checkbox");
      if (cb && cb.checked) {
        selectedItemsCount++;
        const qty = Number(card.querySelector(".qty_input").value);
        const price = Number(card.querySelector(".item_price").dataset.price);
        totalBasePrice += price * qty;
      }
    });

    const headerCount = document.getElementById("total_count_header");
    const barSelectedCount = document.getElementById("selected_count");
    const barTotalCount = document.getElementById("total_count_bar");

    if (headerCount) headerCount.textContent = totalItemsCount;
    if (barSelectedCount) barSelectedCount.textContent = selectedItemsCount;
    if (barTotalCount) barTotalCount.textContent = totalItemsCount;

    const mathBasePrice = document.getElementById("math_base_price");
    const mathFinalPrice = document.getElementById("math_final_price");
    const summaryQty = document.getElementById("summary_qty");
    const sidebarQty = document.getElementById("sidebar_qty");
    const summaryTotalPrice = document.getElementById("summary_total_price");
    const summaryPoints = document.getElementById("summary_points");
    const footerFinalPrice = document.getElementById("footer_final_price");
    const btnCheckout = document.getElementById("btn_checkout");

    const formattedPrice = totalBasePrice.toLocaleString() + "원";
    const calculatedPoints = Math.floor(totalBasePrice * 0.01).toLocaleString() + "P";

    if (mathBasePrice) mathBasePrice.textContent = formattedPrice;
    if (mathFinalPrice) mathFinalPrice.textContent = formattedPrice;
    if (summaryQty) summaryQty.textContent = selectedItemsCount;
    if (sidebarQty) sidebarQty.textContent = selectedItemsCount;
    if (summaryTotalPrice) summaryTotalPrice.textContent = formattedPrice;
    if (summaryPoints) summaryPoints.textContent = calculatedPoints;
    if (footerFinalPrice) footerFinalPrice.textContent = formattedPrice;
    if (btnCheckout) {
      btnCheckout.textContent = `${formattedPrice} 결제하기`;
    }
  }

  loadProductsData();
});
