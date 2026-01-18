---
layout: default
---
<div class="product-details-wrapper">
    <div class="product-details-container">
        
        <div class="pd-gallery">
            <div class="pd-main-image">
                <img id="mainImage" src="{{ site.url }}{{ page.image }}" alt="{{ page.name }}" loading="lazy" decoding="async">
            </div>

            {% if page.gallery %}
            <div class="pd-thumbnails">
                <img src="{{ site.url }}{{ page.image }}" onclick="changeImage(this.src)" class="active" loading="lazy" decoding="async">

                {% for item in page.gallery %}
                <img src="{{ site.url }}{{ item.image }}" onclick="changeImage(this.src)" loading="lazy" decoding="async">
                {% endfor %}
            </div>
            {% endif %}
        </div>

        <div class="pd-info">
            <span class="pd-category">{{ page.category }}</span>
            <h1 class="pd-title">{{ page.name }}</h1>
            
            <div class="pd-price-box">
                <span class="pd-price">${{ page.price }}</span>
                {% if page.original_price %}
                <span class="pd-old-price">${{ page.original_price }}</span>
                {% endif %}
                {% if page.offer %}
                <span class="pd-offer">{{ page.offer }}</span>
                {% endif %}
            </div>

            <div class="pd-description">
                {{ content }}
            </div>

            <div class="pd-specs">
                <h3>Product Details</h3>
                <ul>
                    {% if page.specifications.material %}<li><strong>Material:</strong> {{ page.specifications.material }}</li>{% endif %}
                    {% if page.specifications.sizes %}<li><strong>Sizes:</strong> {{ page.specifications.sizes }}</li>{% endif %}
                    {% if page.specifications.colors %}<li><strong>Colors:</strong> {{ page.specifications.colors }}</li>{% endif %}
                    {% if page.specifications.care %}<li><strong>Care:</strong> {{ page.specifications.care }}</li>{% endif %}
                </ul>
            </div>

            <a href="/contact" class="pd-buy-btn">Enquire / Buy Now</a>
        </div>
    </div>
</div>

<!-- search -->

<div id="searchModal" class="search-modal"> <div class="search-wrapper">
    <input id="searchInput" type="text" placeholder="Search for products..." autocomplete="off" />
    
    <button id="searchGo" class="search-confirm-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </button>

    <button id="closeSearch" class="close-btn" aria-label="Close Search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
</div>
</div>

<script>
function changeImage(src) {
    document.getElementById('mainImage').src = src;
}
</script>

<style>
    /* FORCE FULL WIDTH CONTAINER */
    .product-details-wrapper {
        width: 100%;
        background: #fff;
        padding-top: 20px;
    }
    .product-details-container {
        max-width: 1200px; /* Wider container */
        margin: 0 auto;
        padding: 0 20px;
        display: grid;
        grid-template-columns: 1.2fr 1fr; /* Image slightly larger */
        gap: 40px;
    }

    /* IMAGES */
    .pd-main-image img { width: 100%; border-radius: 8px; object-fit: cover; }
    .pd-thumbnails { display: flex; gap: 10px; margin-top: 15px; overflow-x: auto; }
    .pd-thumbnails img { width: 70px; height: 70px; object-fit: cover; cursor: pointer; border-radius: 4px; border: 1px solid #eee; }

    /* TEXT */
    .pd-category { text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #888; }
    .pd-title { font-size: 28px; margin: 10px 0; line-height: 1.3; }
    .pd-price-box { margin: 20px 0; font-size: 24px; font-weight: bold; color: #333; }
    .pd-old-price { text-decoration: line-through; color: #999; font-size: 18px; margin-left: 10px; }
    .pd-offer { background: #ff4444; color: white; font-size: 12px; padding: 2px 8px; border-radius: 4px; vertical-align: middle; margin-left: 10px; }
    
    /* SPECS */
    .pd-specs { margin-top: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
    .pd-specs ul { padding-left: 20px; margin: 0; }
    .pd-specs li { margin-bottom: 8px; color: #555; }

    .pd-buy-btn {
        display: block;
        width: 100%;
        text-align: center;
        background: #000;
        color: #fff;
        padding: 15px;
        margin-top: 30px;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: bold;
        transition: 0.3s;
    }
    .pd-buy-btn:hover { background: #333; color: #fff; }

    /* MOBILE RESPONSE */
    @media (max-width: 768px) {
        .product-details-container { grid-template-columns: 1fr; gap: 20px; }
        .pd-title { font-size: 22px; }
    }
</style>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": {{ page.name | jsonify }},
  "image": [
    "{{ site.url }}{{ page.image }}"
  ],
  "description": {{ page.description | jsonify }},
  "sku": "{{ page.slug }}",
  "brand": {
    "@type": "Brand",
    "name": "Her Bird Boutique"
  },
  "offers": {
    "@type": "Offer",
    "url": "{{ site.url }}{{ page.url }}",
    "priceCurrency": "INR",
    "price": "{{ page.price }}",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31",
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "IN",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 7,
      "returnMethod": "https://schema.org/ReturnByMail"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": 0,
        "currency": "INR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "IN"
      }
    }
  }
}
</script>