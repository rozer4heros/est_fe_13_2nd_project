export function renderNavDrawer() {
  const target = document.querySelector(".nav_drawer_wrap");
  if (!target) return;
  target.classList.add("drawer_wrap", "below_pc");
  target.innerHTML = `
      <div class="drawer">
        <div>
          <span class="material-icons-round">arrow_back</span>
          <div>
            <input type="text" id="search" />
            <label for="search"></label>
          </div>
        </div>
        <!-- 검색 버튼 누르면 오버레이(모바일/태블릿) 또는 팝업(웹) -->
        <dialog></dialog>
        <ul class="display_h3 drawer_accordion_list d-flex flex-column g-1">
          <li class="active">
            <div class="d-flex justify-content-between align-items-center">
              <span>쇼핑</span>
              <span class="material-icons-round">chevron_right</span>
            </div>
            <ul>
              <li><a href="product_list.html">안경테</a></li>
              <li><a href="product_list.html">선글라스</a></li>
              <li><a href="product_list.html">베스트</a></li>
              <li><a href="product_list.html">신상품</a></li>
            </ul>
          </li>
          <li class="">
            <div class="d-flex justify-content-between align-items-center">
              <span>브랜드</span>
              <span class="material-icons-round">chevron_right</span>
            </div>
            <ul>
              <li><a href="product_list.html"></a></li>
              <li><a href="product_list.html"></a></li>
            </ul>
          </li>
          <li class="">
            <div class="d-flex justify-content-between align-items-center">
              <span>AI피팅</span>
              <span class="material-icons-round">chevron_right</span>
            </div>
            <ul>
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
            </ul>
          </li>
          <li class="">
            <div class="d-flex justify-content-between align-items-center">
              <span>스토어</span>
              <span class="material-icons-round">chevron_right</span>
            </div>
            <ul>
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
            </ul>
          </li>
          <li class="">
            <div class="d-flex justify-content-between align-items-center">
              <span>이벤트</span>
              <span class="material-icons-round">chevron_right</span>
            </div>
            <ul>
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
            </ul>
          </li>
          <li class="">
            <div class="d-flex justify-content-between align-items-center">
              <span>고객지원</span>
              <span class="material-icons-round">chevron_right</span>
            </div>
            <ul>
              <li><a href="#"></a></li>
              <li><a href="#"></a></li>
            </ul>
          </li>
        </ul>
        <ul class="body_l d-flex flex-column g-1">
          <li>
            <a href="product_list.html" class="d-flex align-items-center">
              <span>찜한 상품</span>
              <span class="material-icons-round">arrow_outward</span>
            </a>
          </li>
          <li>
            <a href="cart.html" class="d-flex align-items-center">
              <span>장바구니</span>
              <span class="material-icons-round">arrow_outward</span>
            </a>
          </li>
        </ul>
        <div></div>
        <div class="display_h3">
          <a href="login.html" class="drawer_login">log in</a>
          <a href="signup.html" class="drawer_signup">sign up</a>
        </div>
      </div>
  `;
}
