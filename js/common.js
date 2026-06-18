// ==========================================
// Imports & External Libraries
// ==========================================

/* header, nav_drawer, footer - 유태구 작업 */
import { renderHeader } from "./modules/header.js";
import { renderNavDrawer } from "./modules/nav_drawer.js";
import { renderFooter } from "./modules/footer.js";
renderHeader();
renderNavDrawer();
renderFooter();

// ==========================================
// DOM Selectors
// ==========================================

/* header, nav_drawer, footer - 유태구 작업 */
const navDrawerWrapEl = document.querySelector(".nav_drawer_wrap");
const hamburgerBtnEl = document.querySelector(".hamburger_btn");
const navCloseBtnEl = document.querySelector(".nav_close_btn");
const navAccordionHeaderEls = document.querySelectorAll(".drawer_accordion_list li > div");
const navQuickLinksEl = document.querySelector(".drawer_quick_links");

// ==========================================
// Functions & Core Logic
// ==========================================

/* header, nav_drawer, footer - 유태구 작업 */
function openNavDrawer() {
  navDrawerWrapEl.classList.add("active");
}
function closeNavDrawer() {
  navDrawerWrapEl.classList.remove("active");
}
function toggleNavDrawer() {
  navDrawerWrapEl.classList.toggle("active");
}

function toggleAccordion(target = navDrawerWrapEl) {
  if (target.classList.contains("active")) {
    target.classList.remove("active");
    navQuickLinksEl.classList.remove("hidden");
    return;
  }

  navAccordionHeaderEls.forEach(acc => {
    acc.parentElement.classList.remove("active");
  });
  target.classList.add("active");
  navQuickLinksEl.classList.add("hidden");
}

// ==========================================
// Event Listeners
// ==========================================

/* header, nav_drawer, footer - 유태구 작업 */
navDrawerWrapEl.addEventListener("click", e => {
  if (e.target === e.currentTarget) {
    closeNavDrawer();
  }
});
hamburgerBtnEl.addEventListener("click", e => {
  toggleNavDrawer();
});
navCloseBtnEl.addEventListener("click", e => {
  closeNavDrawer();
});

navAccordionHeaderEls.forEach(accHead => {
  accHead.addEventListener("click", e => {
    toggleAccordion(e.currentTarget.parentElement);
  });
});
