// ==========================================
// Imports & External Libraries
// ==========================================

// ==========================================
// DOM Selectors
// ==========================================

// ==========================================
// State & Constants
// ==========================================

let allProducts = [];

// ==========================================
// Functions & Core Logic
// ==========================================

async function fetchProducts() {
  await fetch("../data/products.json")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(result => {
      allProducts = result;
    })
    .catch(error => {
      console.error("데이터 로드 실패: ", error);
    });

  console.log(allProducts);
}

// ==========================================
// Event Listeners
// ==========================================

// ==========================================
// Initialization & Execution
// ==========================================

fetchProducts();
