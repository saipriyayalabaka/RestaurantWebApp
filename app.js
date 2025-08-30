
// Sample menu items, each with image, rating, and initial quantity = 1
const menuItems = [
  {
    id: 1, 
    name: "Margherita Pizza", 
    price: 10, 
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    rating: 4.5
  },
  {
    id: 2, 
    name: "Pasta Alfredo", 
    price: 12, 
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    rating: 4.2
  },
  {
    id: 3, 
    name: "Caesar Salad", 
    price: 8, 
    img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    rating: 4.0
  },
  {
    id: 4, 
    name: "Chicken Burger", 
    price: 11, 
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
    rating: 4.7
  },
  {
    id: 5, 
    name: "French Fries", 
    price: 5, 
    img: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80",
    rating: 4.3
  },
  {
    id: 6, 
    name: "Chocolate Cake", 
    price: 6,
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    rating: 4.8
  },
];

const menuList = document.getElementById('menu-list');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const loginLink = document.getElementById('login-link');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const navbarIcons = document.getElementById('navbar-icons');
const cartLink = document.getElementById('cart-link');

// Cart object: { id: { ...item, qty: N } }
const cart = {};
// Simple login state (simulate with localStorage)
let loggedInUser = localStorage.getItem('potatoUser') || null;

// STAR rendering
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "½";
  stars = stars.padEnd(5, "☆");
  return stars;
}

// MENU rendering
function renderMenu(filterText = "") {
  menuList.innerHTML = '';
  let filteredItems = menuItems;
  if (filterText && filterText.trim() !== "") {
    const ft = filterText.trim().toLowerCase();
    filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(ft));
  }
  if (filteredItems.length === 0) {
    menuList.innerHTML = "<li>No dishes found.</li>";
    return;
  }
  filteredItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `
      <img class="menu-img" src="${item.img}" alt="${item.name}">
      <div class="menu-details">
        <div class="menu-name">${item.name}</div>
        <div class="menu-rating">${renderStars(item.rating)} <span style="font-size:13px;color:#555;vertical-align:middle;">(${item.rating})</span></div>
        <div class="menu-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="menu-actions">
        <input type="number" min="1" value="1" id="qty-${item.id}" />
        <button onclick="addToCart(${item.id})">Add</button>
      </div>
    `;
    menuList.appendChild(li);
  });
}

// CART rendering
function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  let itemCount = 0;
  Object.values(cart).forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty">x${item.qty}</span>
      <span class="item-price">$${(item.price * item.qty).toFixed(2)}</span>
    `;
    cartList.appendChild(li);
    total += item.price * item.qty;
    itemCount += item.qty;
  });
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = itemCount;
}

// ADD TO CART button
window.addToCart = function(id) {
  const qtyInput = document.getElementById(`qty-${id}`);
  let qty = parseInt(qtyInput.value, 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  const item = menuItems.find(i => i.id === id);
  if (!cart[id]) {
    cart[id] = { ...item, qty };
  } else {
    cart[id].qty += qty;
  }
  renderCart();
}

// SEARCH functionality
searchBtn.addEventListener('click', () => {
  renderMenu(searchBar.value);
});
searchBar.addEventListener('keyup', (e) => {
  if (e.key === "Enter") {
    renderMenu(searchBar.value);
  }
});

// LOGIN MODAL HANDLING
loginLink && loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  openLoginModal();
});

function openLoginModal() {
  loginModal.style.display = "block";
  document.body.style.overflow = "hidden";
  loginError.textContent = "";
  loginForm.reset();
}
closeModal && closeModal.addEventListener('click', () => {
  loginModal.style.display = "none";
  document.body.style.overflow = "";
});
window.onclick = function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
    document.body.style.overflow = "";
  }
};

// LOGIN FORM
loginForm && loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();
  // Demo: Accept any non-empty username/password
  if (username && password) {
    loggedInUser = username;
    localStorage.setItem('potatoUser', username);
    updateNavbarLogin();
    loginModal.style.display = "none";
    document.body.style.overflow = "";
  } else {
    loginError.textContent = "Invalid username or password";
  }
});

// UPDATE NAVBAR LOGIN/LOGOUT
function updateNavbarLogin() {
  if (loggedInUser) {
    navbarIcons.innerHTML = `
      <div class="user-dropdown">
        <a href="#" class="user-link">
          <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(loggedInUser)}" class="user-avatar" />
          <span style="font-size:1em;">${loggedInUser}</span>
          <i class="fa fa-caret-down"></i>
        </a>
        <div class="user-dropdown-content">
          <a href="#" id="logout-link">Logout</a>
        </div>
      </div>
      <a href="#" title="Cart" class="cart-icon" id="cart-link">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" id="cart-count">0</span>
      </a>
    `;
    document.getElementById('logout-link').onclick = function(e) {
      e.preventDefault();
      loggedInUser = null;
      localStorage.removeItem('potatoUser');
      updateNavbarLogin();
    };
    // Update cart icon events
    document.getElementById('cart-link').onclick = cartClickHandler;
    // Update cart count
    renderCart();
  } else {
    navbarIcons.innerHTML = `
      <a href="#" id="login-link" title="Login"><i class="fas fa-user"></i></a>
      <a href="#" title="Cart" class="cart-icon" id="cart-link">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" id="cart-count">0</span>
      </a>
    `;
    document.getElementById('login-link').onclick = (e) => { e.preventDefault(); openLoginModal(); };
    document.getElementById('cart-link').onclick = cartClickHandler;
    // Update cart count
    renderCart();
  }
}

// CART ICON REDIRECTION
function cartClickHandler(e) {
  e.preventDefault();
  if (!loggedInUser) {
    openLoginModal();
    return;
  }
  // Simulate page redirection
  alert("Redirecting to cart page...");
  // To do real page redirection, use: window.location.href = "cart.html";
}

// On page load
updateNavbarLogin();
renderMenu();
renderCart();
