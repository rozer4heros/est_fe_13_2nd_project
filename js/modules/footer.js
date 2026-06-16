export function renderFooter() {
  const target = document.querySelector("footer");
  if (!target) return;
  target.innerHTML = `
      <div class="wrap d-flex flex-column">
        <div class="footer_heading">
          <h2 class="logo">rounz</h2>
          <p class="tagline">optical clarity</p>
        </div>

        <nav class="footer_nav">
          <ul class="body_m d-flex flex-column justify-content-between">
            <li class="footer_accordion d-flex flex-column g-1">
              <div class="d-flex justify-content-between">
                <h3 class="body_xl">services</h3>
                <span class="mo_only material-icons-round">expand_more</span>
              </div>
              <ul class="body_cap d-flex flex-column">
                <li><a href="#">라운즈앱 (ROUNZ App)</a></li>
                <li><a href="#">라운즈 해외 (ROUNZ Global)</a></li>
                <li><a href="#">라운즈 파트너스 (ROUNZ Partners)</a></li>
              </ul>
            </li>
            <li class="footer_accordion d-flex flex-column g-1">
              <div class="d-flex justify-content-between">
                <h3 class="body_xl">legal</h3>
                <span class="mo_only material-icons-round">expand_more</span>
              </div>
              <ul class="body_cap d-flex flex-column">
                <li><a href="#">고객센터 (Customer Center)</a></li>
                <li><a href="#">개인정보처리방침 (Privacy Policy)</a></li>
                <li><a href="#">이용약관 (Terms of Use)</a></li>
              </ul>
            </li>
            <li class="footer_accordion d-flex flex-column g-1">
              <div class="d-flex justify-content-between">
                <h3 class="body_xl">business</h3>
                <span class="mo_only material-icons-round">expand_more</span>
              </div>
              <ul class="body_cap d-flex flex-column">
                <li><a href="#">글라스박스 (Glassbox)</a></li>
                <li><a href="#">가맹문의 (Franchise Inquiry)</a></li>
              </ul>
            </li>
          </ul>
        </nav>

        <div class="footer_info d-flex flex-column g-1">
          <div class="business_info footer_accordion d-flex flex-column g-1">
            <div class="d-flex justify-content-between">
              <h3 class="body_m">
                <span class="above_mo">(주)라운즈 ROUNZ 사업자정보</span>
                <span class="mo_only">사업자정보확인</span>
              </h3>
              <span class="mo_only material-icons-round">expand_more</span>
            </div>
            <div class="body_cap d-flex flex-column">
              <a href="#">사업자정보확인</a>
              <span class="above_mo">|</span>
              <a href="#">라운즈 플래그십 스토어</a>
              <span class="above_mo">|</span>
              <a href="#">라운즈 파트너 안경원</a>
            </div>
          </div>
          <div class="address body_cap pc_only">
            <p>
              주소: 서울특별시 서초구 강남대로 123, 4층 | 대표이사: 김라운 | 사업자등록번호: 000-00-00000 |
              통신판매업신고: 제2023-서울서초-0000호 | 개인정보관리책임자: 박안경
            </p>
            <p>COPYRIGHT © ROUNZ CO., LTD. ALL RIGHTS RESERVED.</p>
          </div>
        </div>

        <ul class="footer_social social_button_list">
          <li>
            <a href="#" class="social_kakao">
              <img src="image/social_icon/Button_Kakao_Login.png" alt="카카오로 로그인하기" />
            </a>
          </li>
          <li>
            <a href="#" class="social_naver">
              <img src="image/social_icon/Button_Naver_Login.png" alt="네이버로 로그인하기" />
            </a>
          </li>
          <li>
            <a href="#" class="social_google">
              <img src="image/social_icon/Button_Google_Login.png" alt="구글로 로그인하기" />
            </a>
          </li>
          <li>
            <a href="#" class="social_apple">
              <img src="image/social_icon/Button_Apple_Login.png" alt="애플로 로그인하기" />
            </a>
          </li>
        </ul>

        <div class="footer_contact d-flex flex-column">
          <h3>customer center</h3>
          <div class="body_cap d-flex g-1">
            <p class="footer_phone_no">1600-0000</p>
            <span class="mo_only">|</span>
            <p><a href="#">support@rounz.com</a></p>
          </div>
        </div>

        <div class="footer_locale above_mo">
          <span class="material-icons-round">language</span>
          <span class="body_cap">korea (krw)</span>
        </div>
      </div>
  `;
}
