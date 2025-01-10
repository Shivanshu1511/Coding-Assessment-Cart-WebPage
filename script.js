// // Cart state management
let cartState = {
    items: [],
    originalTotal: 0,
    currency: 'INR'
};

// Mobile menu state
let isMobileMenuOpen = false;

// Format price in Indian Rupees
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(price / 100);
};

// Fetch cart data from API
const fetchCartData = async () => {
    showLoader();
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
        const data = await response.json();
        cartState = data;
        renderCart();
        updateTotals();
        saveToLocalStorage();
    } catch (error) {
        console.error('Error fetching cart data:', error);
    } finally {
        hideLoader();
    }
};

// Render cart items
const renderCart = () => {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = '';

    cartState.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p>${item.product_description}</p>
                <p>Price: ${formatPrice(item.price)}</p>
            </div>
            <input type="number" 
                   class="quantity-input" 
                   value="${item.quantity}" 
                   min="1" 
                   onchange="updateQuantity(${item.id}, this.value)">
            <button class="remove-item" onclick="showRemoveConfirmation(${item.id})">🗑️</button>
        `;
        cartItemsList.appendChild(cartItem);
    });
};

// Mobile menu functions
const toggleMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    navLinks.classList.toggle('active');
    mobileMenuBtn.textContent = isMobileMenuOpen ? '✕' : '☰';
};

const closeMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (isMobileMenuOpen) {
        isMobileMenuOpen = false;
        navLinks.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
    }
};

// Update item quantity
const updateQuantity = (itemId, newQuantity) => {
    const item = cartState.items.find(item => item.id === itemId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        item.line_price = item.price * item.quantity;
        item.final_line_price = item.line_price;
        updateTotals();
        saveToLocalStorage();
    }
};

// Remove item from cart
const removeItem = (itemId) => {
    cartState.items = cartState.items.filter(item => item.id !== itemId);
    renderCart();
    updateTotals();
    saveToLocalStorage();
    hideModal();
};

// Update totals
const updateTotals = () => {
    const subtotal = cartState.items.reduce((sum, item) => sum + item.final_line_price, 0);
    cartState.original_total_price = subtotal;

    document.getElementById('subtotalAmount').textContent = formatPrice(subtotal);
    document.getElementById('totalAmount').textContent = formatPrice(subtotal);
};

// Local Storage functions
const saveToLocalStorage = () => {
    localStorage.setItem('cartState', JSON.stringify(cartState));
};

const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartState');
    if (savedCart) {
        cartState = JSON.parse(savedCart);
        renderCart();
        updateTotals();
    } else {
        fetchCartData();
    }
};

// Modal functions
const showRemoveConfirmation = (itemId) => {
    const modal = document.getElementById('removeItemModal');
    modal.style.display = 'flex';
    
    document.getElementById('confirmRemove').onclick = () => removeItem(itemId);
    document.getElementById('cancelRemove').onclick = hideModal;
};

const hideModal = () => {
    document.getElementById('removeItemModal').style.display = 'none';
};

// Loader functions
const showLoader = () => {
    document.getElementById('loader').style.display = 'flex';
};

const hideLoader = () => {
    document.getElementById('loader').style.display = 'none';
};

// Initialize cart and mobile menu
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();

    // Mobile menu initialization
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navLinks && mobileMenuBtn && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
});

// Checkout button functionality
document.querySelector('.checkout-button').addEventListener('click', () => {
    alert('Proceeding to checkout...');
    
});