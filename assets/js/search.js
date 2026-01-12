fetch("/search.json")
  .then(res => res.json())
  .then(products => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";

    document.getElementById("search-query-label").textContent =
      `Results for "${query}"`;

    const results = products.filter(p => {
      const q = query.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        String(p.price || "").includes(q)
      );
    });

    renderResults(results);
  });

function renderResults(results) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  if (!results.length) {
    container.innerHTML =
      '<p style="grid-column: 1 / -1; text-align: center;">No products found.</p>';
    return;
  }

  results.forEach(product => {

    const productUrl = product.url; // already correct (/products/xxx/)
    const imageUrl = product.image.startsWith("/")
      ? product.image
      : "/" + product.image;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <a href="${productUrl}" class="product-image-link">

        <div class="product-image-wrapper">
          ${product.image ? `
            <img src="${imageUrl}" alt="${product.title}" loading="lazy" decoding="async">
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
