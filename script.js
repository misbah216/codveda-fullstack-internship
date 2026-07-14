const API_URL = "http://localhost:5000/api/products";
const form = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const productList = document.getElementById("productList");
const searchBox = document.getElementById("searchBox");

const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editPrice = document.getElementById("editPrice");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

let allProducts = [];
let currentEditId = null;


function formatPrice(price) {
  return Number(price).toLocaleString("en-IN");
}


function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `<li class="empty-state">No products found 👆</li>`;
    return;
  }

  products.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${product.name} - ₹${formatPrice(product.price)}</span>
      <span class="actions">
        <button class="edit-btn" onclick="openEditModal(${product.id}, '${product.name}', ${product.price})">Edit</button>
        <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
      </span>
    `;
    productList.appendChild(li);
  });
}


async function loadProducts() {
  productList.innerHTML = `<li class="empty-state">Loading products...</li>`;
  try {
    const res = await fetch(API_URL);
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    productList.innerHTML = `<li class="empty-state">⚠️ Could not connect to server. Is server.js running?</li>`;
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  });

  nameInput.value = "";
  priceInput.value = "";
  loadProducts();
});

async function deleteProduct(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadProducts();
}


function openEditModal(id, name, price) {
  currentEditId = id;
  editName.value = name;
  editPrice.value = price;
  editModal.classList.remove("hidden");
}


function closeEditModal() {
  editModal.classList.add("hidden");
  currentEditId = null;
}

cancelEdit.addEventListener("click", closeEditModal);


editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});


saveEdit.addEventListener("click", async () => {
  const newName = editName.value.trim();
  const newPrice = parseFloat(editPrice.value);

  if (!newName || isNaN(newPrice)) {
    alert("Please enter a valid name and price.");
    return;
  }

  await fetch(`${API_URL}/${currentEditId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, price: newPrice })
  });

  closeEditModal();
  loadProducts();
});


searchBox.addEventListener("input", () => {
  const term = searchBox.value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

loadProducts();