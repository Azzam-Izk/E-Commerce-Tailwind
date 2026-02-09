// Product Data
const products = [
    { id: 1, name: "Minimalist Watch", category: "accessories", price: 1500000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600", description: "Elegant minimalist watch with genuine leather strap." },
    { id: 2, name: "Premium Backpack", category: "accessories", price: 850000, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600", description: "Durable and stylish backpack for daily commute." },
    { id: 3, name: "Wireless Headphones", category: "electronics", price: 2300000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600", description: "Noise-cancelling wireless headphones with premium sound." },
    { id: 4, name: "Bee Hoodie", category: "home", price: 450000, image: "https://shirtz.cool/cdn/shop/files/BeeHoodieFinalArtboard2_1200x1200.jpg?v=1763272250", description: "An official merchandise from minecraft itself." },
    { id: 5, name: "Desk Lamp", category: "home", price: 650000, image: "https://lostine.com/cdn/shop/files/LOSTINE_ALEC_DESK-LAMP_RED_1068-FINAL-Credit-Jason-Varney_1200x.jpg?v=1758302983", description: "Adjustable LED desk lamp with modern design." },
    { id: 6, name: "Leather Wallet", category: "accessories", price: 350000, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600", description: "Slim genuine leather wallet with RFID protection." },
    { id: 7, name: "Ear Buds", category: "electronics", price: 1800000, image: "https://nos.jkt-1.neo.id/artikel/2024/03/Perbedaan-TWS-dengan-Earbuds-dan-Earphone.jpg", description: "Comfortable ear buds for every day use" },
    { id: 8, name: "Sunglasses", category: "accessories", price: 950000, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600", description: "UV protection sunglasses with classic frame." }
];

// State Management
let cart = JSON.parse(localStorage.getItem('eshop_cart')) || [];

// DOM Elements & Utility Functions
const formatCurrency = (num) => 'Rp ' + num.toLocaleString('id-ID');

function saveCart() {
    localStorage.setItem('eshop_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    }
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }

    saveCart();

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded shadow-lg transform transition-all duration-300 translate-y-full';
    toast.textContent = 'Produk ditambahkan ke keranjang';
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.remove('translate-y-full'), 10);
    // Animate out
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart(); // Re-render cart page if open
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Page Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Check which page we are on
    const path = window.location.pathname;

    // Home Page logic (Featured products)
    const featuredGrid = document.getElementById('featured-products');
    if (featuredGrid) {
        featuredGrid.innerHTML = products.slice(0, 4).map(product => createProductCard(product)).join('');
    }

    // Products Page logic
    const productsGrid = document.getElementById('all-products');
    if (productsGrid) {
        renderAllProducts(products); // Initial render

        // Filter Logic
        const filterSelect = document.getElementById('category-filter');
        const searchInput = document.getElementById('search-input');

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => filterAndSearch(e.target.value, searchInput?.value));
        }
        if (searchInput) {
            searchInput.addEventListener('input', (e) => filterAndSearch(filterSelect?.value, e.target.value));
        }
    }

    // Product Detail Page Logic
    const detailContainer = document.getElementById('product-detail-container');
    if (detailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            document.title = `${product.name} - E-Shop`;
            detailContainer.innerHTML = `
                <div class="grid md:grid-cols-2 gap-12 items-center fade-in">
                    <div class="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <span class="text-sm text-gray-500 uppercase tracking-wider">${product.category}</span>
                        <h1 class="text-4xl font-bold text-gray-900 mt-2 mb-4">${product.name}</h1>
                        <p class="text-3xl text-gray-900 font-light mb-6">${formatCurrency(product.price)}</p>
                        <p class="text-gray-600 leading-relaxed mb-8">${product.description}</p>
                        
                        <div class="flex gap-4 mb-8">
                            <div class="flex items-center border border-gray-300 rounded-lg">
                                <button class="px-4 py-2 hover:bg-gray-50 text-gray-600" onclick="adjustDetailQty(-1)">-</button>
                                <input type="number" id="detail-qty" value="1" min="1" class="w-16 text-center border-none focus:ring-0" readonly>
                                <button class="px-4 py-2 hover:bg-gray-50 text-gray-600" onclick="adjustDetailQty(1)">+</button>
                            </div>
                            <button onclick="addToCart(${product.id}, parseInt(document.getElementById('detail-qty').value))" 
                                class="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition transform active:scale-95">
                                Add to Cart
                            </button>
                        </div>
                        
                        <div class="border-t pt-6 text-sm text-gray-500 space-y-2">
                            <p>✓ Free Shipping on orders over Rp 5,000,000</p>
                            <p>✓ 30 Days Return Policy</p>
                            <p>✓ Secure Payment</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            detailContainer.innerHTML = `<div class="text-center py-20"><p class="text-xl text-gray-500">Product not found.</p><a href="products.html" class="text-blue-600 hover:underline mt-4 block">Back to Products</a></div>`;
        }
    }

    // Cart Page Logic
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        renderCart();
    }
});

// Helper Functions
function createProductCard(product) {
    return `
        <div class="group">
            <div class="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] mb-4">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                <button onclick="addToCart(${product.id})" class="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0 hover:bg-gray-900 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </button>
            </div>
            <a href="product-detail.html?id=${product.id}" class="block">
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition">${product.name}</h3>
                <p class="text-gray-500 mt-1">${formatCurrency(product.price)}</p>
            </a>
        </div>
    `;
}

function renderAllProducts(productsToRender) {
    const grid = document.getElementById('all-products');
    if (!grid) return;

    if (productsToRender.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">No products found matching your criteria.</div>`;
        return;
    }
    grid.innerHTML = productsToRender.map(createProductCard).join('');
}

function filterAndSearch(category = 'all', query = '') {
    let filtered = products;

    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }

    renderAllProducts(filtered);
}

function adjustDetailQty(change) {
    const input = document.getElementById('detail-qty');
    if (input) {
        let val = parseInt(input.value) + change;
        if (val < 1) val = 1;
        input.value = val;
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('order-summary');
    if (!container) return; // Not on cart page

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16">
                <p class="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                <a href="products.html" class="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">Continue Shopping</a>
            </div>
        `;
        if (summary) summary.style.display = 'none';
        return;
    }

    if (summary) summary.style.display = 'block';

    container.innerHTML = cart.map(item => `
        <div class="flex gap-6 py-6 border-b items-center">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg bg-gray-100">
            <div class="flex-1">
                <div class="flex justify-between mb-2">
                    <h3 class="font-semibold text-gray-900">${item.name}</h3>
                    <p class="font-medium text-gray-900">${formatCurrency(item.price * item.quantity)}</p>
                </div>
                <p class="text-sm text-gray-500 mb-4">${formatCurrency(item.price)} each</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center border rounded-md">
                        <button onclick="updateQuantity(${item.id}, -1)" class="px-3 py-1 hover:bg-gray-50 text-gray-600">-</button>
                        <span class="px-3 py-1 text-sm font-medium w-8 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="px-3 py-1 hover:bg-gray-50 text-gray-600">+</button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-sm text-red-500 hover:text-red-700 underline">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    // Update Summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free for now
    const total = subtotal + shipping;

    document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cart-shipping').textContent = 'Free';
    document.getElementById('cart-total').textContent = formatCurrency(total);
}
