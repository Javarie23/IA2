// ===============================
// NAVIGATION & HOMEPAGE INTERACTIONS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav item
  document.querySelectorAll(".nav li a").forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("current");
    }
  });

  // Browse button animation
  const browseBtn = document.querySelector(".browsebtn");
  if (browseBtn) {
    browseBtn.addEventListener("mouseover", () => {
      browseBtn.style.transform = "scale(1.05)";
      browseBtn.style.transition = "transform 0.3s ease";
    });
    browseBtn.addEventListener("mouseout", () => {
      browseBtn.style.transform = "scale(1)";
    });
  }

  // Smooth scroll to footer
  const contactLink = document.querySelector(".footer h2");
  if (contactLink) {
    contactLink.addEventListener("click", () => {
      document.querySelector(".footer").scrollIntoView({ behavior: "smooth" });
    });
  }
});

// ===============================
// USER AUTHENTICATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.querySelector(".login form");

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value;
      const dob = document.getElementById("dob").value;
      const email = document.getElementById("email").value;
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      if (!fullName || !dob || !email || !username || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const user = { fullName, dob, email, username, password };
      localStorage.setItem("registeredUser", JSON.stringify(user));
      alert("Registration successful! You can now log in.");
      window.location.href = "login.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("userName").value;
      const password = document.getElementById("userPword").value;
      const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

      if (!storedUser) {
        alert("No user registered. Please register first.");
        window.location.href = "register.html";
        return;
      }

      if (username === storedUser.username && password === storedUser.password) {
        alert(`Welcome back, ${storedUser.fullName}!`);
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }
});

function showpassword() {
  const pwField = document.getElementById("userPword");
  pwField.type = pwField.type === "password" ? "text" : "password";
}

// ===============================
// INVENTORY & CART MANAGEMENT
// ===============================
let stock = [
  { name: "Honda Civic", price: 5900000, qty: 20 },
  { name: "Toyota Corolla", price: 4800000, qty: 20 },
  { name: "Ford Mustang", price: 9000000, qty: 20 },
  { name: "Toyota Camry", price: 7500000, qty: 20 },
  { name: "Hyundai Tucson", price: 9920000, qty: 20 },
  { name: "Hyundai Creta", price: 9000000, qty: 20 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(carName, carPrice) {
  const existingItem = cart.find(item => item.name === carName);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name: carName, price: carPrice, qty: 1 });
  }
  saveCart();
  alert(`${carName} has been added to your cart!`);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
  const carItems = document.querySelectorAll(".car-item");
  carItems.forEach(item => {
    const button = item.querySelector(".btn");
    if (!button) return;

    const carName = item.querySelector("h3").textContent;
    const carPriceText = item.querySelector("p").textContent;
    const carPrice = parseFloat(carPriceText.replace(/[^0-9.]/g, ""));

    button.addEventListener("click", () => addToCart(carName, carPrice));
  });
});


// ===============================
// CART RENDERING & UPDATING
// ===============================
function renderCart() {
  const cartContainer = document.getElementById("cartItems");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-row");
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: $${item.price.toLocaleString()}</p>
      <label>Qty: 
        <input type="number" min="1" value="${item.qty}" data-index="${index}" class="qty-input">
      </label>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const idx = e.target.dataset.index;
      cart[idx].qty = parseInt(e.target.value);
      saveCart();
      renderCart();
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    });
  });

  updateCartSummary();
}

// ===============================
// CART TOTALS
// ===============================
function calculateTotals() {
  let totalItems = 0;
  let subtotal = 0;

  cart.forEach(item => {
    totalItems += item.qty;
    subtotal += item.price * item.qty;
  });

  const taxRate = 0.15;
  const taxAmount = subtotal * taxRate;
  const totalPrice = subtotal + taxAmount;

  return { totalItems, subtotal, taxAmount, totalPrice };
}

function updateCartSummary() {
  const totals = calculateTotals();

  if (document.getElementById("totalItems")) {
    document.getElementById("totalItems").textContent = totals.totalItems;
    document.getElementById("subtotal").textContent = totals.subtotal.toFixed(2);
    document.getElementById("taxAmount").textContent = totals.taxAmount.toFixed(2);
    document.getElementById("totalPrice").textContent = totals.totalPrice.toFixed(2);
  }
}

// ===============================
// CHECKOUT LOGIC
// ===============================
function confirmCheckout() {
  const fullName = document.querySelector("input[placeholder='Full Name']").value;
  const phone = document.querySelector("input[placeholder='Phone Number']").value;
  const address1 = document.querySelector("input[placeholder='Address Line 1']").value;
  const parish = document.querySelector("input[placeholder='Parish']").value;
  const paymentMethod = document.querySelector("input[name='paymentmethod']:checked");
  const amountPaid = document.querySelector("input[placeholder='Amount Paid']").value;

  if (!fullName || !phone || !address1 || !parish || !paymentMethod || !amountPaid) {
    alert("Please fill in all required fields.");
    return;
  }

  alert(`Thank you, ${fullName}! Your order has been placed.\nPayment Method: ${paymentMethod.value}\nAmount Paid: $${amountPaid}`);
  cart = [];
  saveCart();
  updateCartSummary();

  window.location.href = "index.html";
}

function cancelCheckout() {
  if (confirm("Are you sure you want to cancel your order?")) {
    cart = [];
    saveCart();
    renderCart();
    updateCartSummary();
    alert("Order cancelled.");

    window.location.href = "index.html";
  }
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartSummary();

  const confirmBtn = document.getElementById("confirm");
  const cancelBtn = document.getElementById("cancel");
  if (confirmBtn) confirmBtn.addEventListener("click", confirmCheckout);
  if (cancelBtn) cancelBtn.addEventListener("click", cancelCheckout);
});