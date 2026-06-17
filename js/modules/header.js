export function renderHeader() {
  const target = document.querySelector("header");
  if (!target) return;
  target.innerHTML = `
      <div class="wrap d-flex justify-content-between align-items-center">
        <button class="below_pc"><span class="material-icons-round"> menu </span></button>
        <h1 class="logo"><a href="index.html">rounz</a></h1>
        <nav class="display_h4 pc_only">
          <ul class="d-flex justify-content-between">
            <li><a href="product_list.html">쇼핑</a></li>
            <li><a href="product_list.html">브랜드</a></li>
            <li><a href="#">AI 피팅</a></li>
            <li><a href="#">스토어</a></li>
            <li><a href="#">이벤트</a></li>
            <li><a href="#">고객지원</a></li>
          </ul>
        </nav>
        <ul class="d-flex">
          <li class="pc_only">
            <a href="product_list.html"><span class="material-icons-round">favorite_border</span></a>
          </li>
          <li class="pc_only">
            <button><span class="material-icons-round">search</span></button>
          </li>
          <li>
            <a href="cart.html"><span class="material-icons-outlined">shopping_cart</span></a>
          </li>
          <li>
            <a href="login.html"><span class="material-icons-outlined">person</span></a>
          </li>
        </ul>
      </div>
  `;
}
