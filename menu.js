
// Redirect if not logged in
if (!localStorage.getItem('potatoUser')) {
  window.location.href = 'login.html';
}

// Menu items
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
  }
];

// Greet user
document.getElementById('user-greet').textContent =
  `Hi, ${localStorage.getItem('potatoUser')}`;

// Render menu
const menuList = document.getElementById('menu-list');
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "½";
  stars = stars.padEnd(5, "☆");
  return stars;
}
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
renderMenu();

// Search functionality
document.getElementById('search-btn').onclick = function() {
  renderMenu(document.getElementById('search-bar').value);
};
document.getElementById('search-bar').onkeyup = function(e) {
  if (e.key === "Enter") renderMenu(this.value);
};

// Cart
function getCart() {
  return JSON.parse(localStorage.getItem('potatoCart') || '{}');
}
function setCart(cart) {
  localStorage.setItem('potatoCart', JSON.stringify(cart));
}
function updateCartCount() {
  const cart = getCart();
  let count = Object.values(cart).reduce((a, i) => a + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
}
window.addToCart = function(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value) || 1;
  const item = menuItems.find(i => i.id === id);
  const cart = getCart();
  if (!cart[id]) cart[id] = { ...item, qty };
  else cart[id].qty += qty;
  setCart(cart);
  updateCartCount();
};
updateCartCount();

// Logout
document.getElementById('logout-link').onclick = function(e) {
  e.preventDefault();
  localStorage.removeItem('potatoUser');
  localStorage.removeItem('potatoCart');
  window.location.href = 'login.html';
};

/*
  Add search bar and button to the page dynamically if not present.
  Place them above the menu list.
*/
const menuContainer = document.getElementById('menu-container') || document.body;
if (!document.getElementById('search-bar')) {
  const searchDiv = document.createElement('div');
  searchDiv.style.marginBottom = '16px';
  searchDiv.innerHTML = `
    <input type="text" id="search-bar" placeholder="Search dishes..." style="padding:6px;width:200px;">
    <button id="search-btn" style="padding:6px 12px;">Search</button>
  `;
  menuContainer.insertBefore(searchDiv, menuContainer.firstChild);
}
