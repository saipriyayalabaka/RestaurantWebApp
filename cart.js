// Redirect if not logged in
if (!localStorage.getItem('potatoUser')) {
  window.location.href = 'login.html';
}

// Greet user
document.getElementById('user-greet').textContent =
  `Hi, ${localStorage.getItem('potatoUser')}`;

// Cart rendering
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('potatoCart') || '{}');
  let total = 0;
  cartList.innerHTML = '';
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
  });
  cartTotal.textContent = total.toFixed(2);
}
renderCart();

// Logout
document.getElementById('logout-link').onclick = function(e) {
  e.preventDefault();
  localStorage.removeItem('potatoUser');
  localStorage.removeItem('potatoCart');
  window.location.href = 'login.html';
};
// Back to menu
document.getElementById('back-menu').onclick = function() {
  window.location.href = 'index.html';
};