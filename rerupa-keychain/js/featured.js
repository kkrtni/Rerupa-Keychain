// Render featured products on home page
function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;
    
    // Show first 4 products or all if less than 4
    const featured = products.slice(0, 4);
    
    featuredGrid.innerHTML = '';
    
    featured.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
        ${product.labels.includes('Terlaris') ? '<span class="product-label">Terlaris</span>' : ''}
        ${product.labels.includes('Custom') ? '<span class="product-label">Custom</span>' : ''}
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='img/placeholder.svg'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="product-price">Rp${product.price.toLocaleString('id-ID')}</p>
            
            ${product.variants.length > 0 ? `
            <div class="product-variants">
                ${product.variants.map(v => `<button class="variant-btn" onclick="selectVariant(${product.id}, '${v}')">${v}</button>`).join('')}
            </div>
            ` : ''}
            
            ${product.name === 'Keychain Inisial' ? `
            <div class="form-group">
                <label for="initial-input-${product.id}">Pilih Huruf (A-Z):</label>
                <input type="text" id="initial-input-${product.id}" maxlength="1" placeholder="A" class="form-control">
            </div>
            ` : ''}
            
            ${product.name === 'Keychain Karakter' ? `
            <div class="form-group">
                <label for="design-notes-${product.id}">Catatan Desain:</label>
                <textarea id="design-notes-${product.id}" rows="2" placeholder="Deskripsikan karakter yang Anda inginkan..."></textarea>
            </div>
            ` : ''}
            
            <div class="product-actions">
                <button class="action-btn btn-add" onclick="
                    const variant = ${product.variants.length > 0 ? 
                        `document.querySelector('.variant-btn.active')?.textContent || '${product.variants[0]}'` : 
                        ````;`};
                    const customText = ${product.name === 'Keychain Inisial' ? 
                        `document.getElementById('initial-input-${product.id}').value.toUpperCase()` : 
                        `${product.name === 'Keychain Karakter' ? 
                            `document.getElementById('design-notes-${product.id}').value` : 
                            ````;}`};
                addToCart(${product.id}, variant, customText);
                ">Tambah ke Keranjang</button>
                <button class="action-btn btn-store" onclick="window.open('${product.links.shopee}', '_blank')">Shopee</button>
                <button class="action-btn btn-store" onclick="window.open('${product.links.tokopedia}', '_blank')">Tokopedia</button>
            </div>
        </div>
    `;
        
        // Add variant selection logic
        const variantBtns = card.querySelectorAll('.variant-btn');
        variantBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                variantBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        featuredGrid.appendChild(card);
    });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', renderFeaturedProducts);