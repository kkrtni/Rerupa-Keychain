// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('rerupaCart')) || [];
  
  // Update cart count in nav
  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }
  
  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('rerupaCart', JSON.stringify(cart));
    updateCartCount();
  }
  
  // Add to cart
  window.addToCart = (productId, variant, customText = '') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if same product with same variant/custom already in cart
    const existingIndex = cart.findIndex(item => 
      item.id === productId && 
      item.variant === variant && 
      item.customText === customText
    );
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        variant: variant,
        customText: customText,
        quantity: 1,
        image: product.image
      });
    }
    
    saveCart();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
  };
  
  // Remove from cart
  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  };
  
  // Update quantity
  window.updateQuantity = (index, change) => {
    if (cart[index].quantity + change < 1) {
      if (confirm('Hapus item dari keranjang?')) {
        removeFromCart(index);
      }
    } else {
      cart[index].quantity += change;
      saveCart();
      renderCart();
    }
  };
  
  // Show notification
  function showNotification(message) {
    // Remove any existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.background = '#C2377A';
    notif.style.color = 'white';
    notif.style.padding = '1rem 1.5rem';
    notif.style.borderRadius = '8px';
    notif.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    notif.style.zIndex = '1000';
    notif.style.animation = 'slideIn 0.3s forwards';
    
    // Add animation style if not exists
    if (!document.getElementById('notification-style')) {
      const style = document.createElement('style');
      style.id = 'notification-style';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s forwards';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }
  
  // Render product list (used in produk.html)
  function renderProducts(filter = '') {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Filter products
    const filteredProducts = products.filter(product => 
      !filter || product.category === filter
    );
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
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
                `''`};
              const customText = ${product.name === 'Keychain Inisial' ? 
                `document.getElementById('initial-input-${product.id}').value.toUpperCase()` : 
                `${product.name === 'Keychain Karakter' ? 
                  `document.getElementById('design-notes-${product.id}').value` : 
                  `''`}`};
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
      
      productsGrid.appendChild(card);
    });
  }
  
  // Select variant helper
  window.selectVariant = (productId, variant) => {
    const btns = document.querySelectorAll(`.variant-btn`);
    btns.forEach(btn => {
      if (btn.textContent === variant) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };
  
  // Render cart (used in keranjang.html)
  function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartEmpty = document.getElementById('cart-empty');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
      cartItems.style.display = 'none';
      if (cartTotal) cartTotal.style.display = 'none';
      return;
    }
    
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    if (cartTotal) cartTotal.style.display = 'block';
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src='img/placeholder.svg'">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          ${item.variant ? `<div>Varian: ${item.variant}</div>` : ''}
          ${item.customText ? `<div>Catatan: ${item.customText}</div>` : ''}
          <div class="cart-item-price">Rp${(item.price * item.quantity).toLocaleString('id-ID')}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            <button class="qty-btn" style="background: #ff6b6b; color: white;" onclick="removeFromCart(${index})">×</button>
          </div>
        </div>
      `;
      cartItems.appendChild(itemElement);
    });
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
      cartTotal.innerHTML = `<strong>Total: Rp${total.toLocaleString('id-ID')}</strong>`;
    }
  }
  
  // WhatsApp summary
  window.sendWhatsAppSummary = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }
    
    let message = 'Halo Rerupa Keychain, saya ingin memesan:\n\n';
    cart.forEach(item => {
      message += `- ${item.name}`;
      if (item.variant) message += ` (${item.variant})`;
      if (item.customText) message += ` - ${item.customText}`;
      message += ` x${item.quantity} = Rp${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    message += `\n*Total: Rp${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('id-ID')}*\n\n`;
    message += 'Terima kasih!';
    
    // Replace with actual WhatsApp number
    const whatsappNumber = '6289662533518'; // Placeholder
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  
  // FAQ accordion
  document.addEventListener('click', (e) => {
    if (e.target.closest('.faq-question')) {
      const faqItem = e.target.closest('.faq-item');
      faqItem.classList.toggle('active');
    }
  });
  
  // Initialize based on page
  if (document.getElementById('products-grid')) {
    renderProducts(); // Show all products initially
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
      });
    });
  }
  
  if (document.getElementById('cart-items')) {
    renderCart();
  }
  
  // Update cart count on load
  updateCartCount();
});