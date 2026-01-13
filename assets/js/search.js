// 1. Fixed the path to use single slash (root relative)
fetch("/search.json")
  .then(res => res.json())
  .then(products => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";

    // Safety check: ensure the label element exists before modifying
    const label = document.getElementById("search-query-label");
    if (label) {
        label.textContent = `Results for "${query}"`;
    }

    const results = products.filter(p => {
      const q = query.toLowerCase();
      // Added safety checks (?) to prevent crashes if a field is missing
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        String(p.price || "").includes(q)
      );
    });

    renderResults(results);
  })
  .catch(err => console.error("Search failed:", err)); // Added error logging

function renderResults(results) {
    const container = document.getElementById("search-results");
    if (!container) return; // Safety check

    container.innerHTML = "";
    container.classList.add("products-grid-full");
  
    if (!results.length) {
      container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No products found.</p>';
      return;
    }

    // ❌ REMOVED: const baseURL = "/Her-Bird"; 
    // You are on the main domain now, so you don't need this prefix.
  
    results.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
  
      card.setAttribute("data-category", product.category || "");
      card.setAttribute("data-price", product.price || 0);
      card.setAttribute("data-date", product.date || 0);
      
      // ✅ USE URL DIRECTLY from Jekyll
      // Since you fixed _config.yml, product.url is already correct (e.g., "/products/saree/")
      const correctUrl = product.url; 
  
      card.innerHTML = `
        <a href="${correctUrl}" class="product-image-link">
  
          <div class="product-image-wrapper">
            ${product.image ? `
              <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async">
            ` : ``}
  
            <div class="product-overlay">
              <button class="view-product-btn">View Product</button>
            </div>
          </div>
  
          <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
  
            <div class="product-price-section">
              <span class="product-price">₹${product.price}</span>
              ${product.offer ? `<span class="product-offer">${product.offer}</span>` : ``}
            </div>
          </div>
  
        </a>
      `;
  
      container.appendChild(card);
    });
}