import "./style.css";
import { STORE_NAME } from "./config.js";
import { loadProducts, renderCatalog, formatPrice } from "./catalog.js";
import { getCart, addOne, setQuantity, resolveCart } from "./cart.js";
import { buildMessage, checkoutUrl } from "./checkout.js";

const $ = (id) => document.getElementById(id);

const els = {
  status: $("status"),
  catalog: $("catalog"),
  cartToggle: $("cart-toggle"),
  cartCount: $("cart-count"),
  drawer: $("cart-drawer"),
  overlay: $("overlay"),
  cartClose: $("cart-close"),
  cartItems: $("cart-items"),
  cartTotal: $("cart-total"),
  checkoutBtn: $("checkout-btn"),
};

let products = [];

document.title = STORE_NAME;
$("store-name").textContent = STORE_NAME;

function setDrawer(open) {
  els.drawer.classList.toggle("open", open);
  els.drawer.setAttribute("aria-hidden", String(!open));
  els.overlay.hidden = !open;
}

function makeButton(label, ariaLabel, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  button.addEventListener("click", onClick);
  return button;
}

function createCartItem({ product, qty, subtotal }) {
  const item = document.createElement("li");
  item.className = "cart-item";

  const info = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = product.name;
  const amount = document.createElement("p");
  amount.textContent = formatPrice(subtotal);
  info.append(name, amount);

  const controls = document.createElement("div");
  controls.className = "qty";
  const quantity = document.createElement("span");
  quantity.textContent = qty;
  controls.append(
    makeButton("−", `Diminuir ${product.name}`, () => changeQuantity(product.id, qty - 1)),
    quantity,
    makeButton("+", `Aumentar ${product.name}`, () => changeQuantity(product.id, qty + 1)),
  );

  item.append(info, controls);
  return item;
}

function changeQuantity(id, quantity) {
  setQuantity(id, quantity);
  renderCart();
}

function renderCart() {
  const { lines, total } = resolveCart(getCart(), products);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  els.cartCount.textContent = count;
  els.cartTotal.textContent = formatPrice(total);
  els.checkoutBtn.disabled = lines.length === 0;

  if (lines.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Seu carrinho está vazio.";
    els.cartItems.replaceChildren(empty);
    return;
  }
  els.cartItems.replaceChildren(...lines.map(createCartItem));
}

// Removes cart entries whose products were deleted or marked unavailable.
function pruneCart() {
  const { unavailableIds } = resolveCart(getCart(), products);
  for (const id of unavailableIds) setQuantity(id, 0);
  return unavailableIds.length;
}

els.checkoutBtn.addEventListener("click", () => {
  const { lines, total } = resolveCart(getCart(), products);
  if (lines.length === 0) return;
  window.open(checkoutUrl(buildMessage(lines, total)), "_blank", "noopener");
});

els.cartToggle.addEventListener("click", () => setDrawer(true));
els.cartClose.addEventListener("click", () => setDrawer(false));
els.overlay.addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setDrawer(false);
});

async function init() {
  try {
    products = await loadProducts();
  } catch (error) {
    console.error(error);
    els.status.textContent = "Não foi possível carregar os produtos. Tente novamente mais tarde.";
    return;
  }

  renderCatalog(els.catalog, products, (id) => {
    addOne(id);
    renderCart();
  });

  const removed = pruneCart();
  els.status.hidden = removed === 0;
  els.status.textContent = `${removed} item(ns) foram removidos do carrinho por não estarem mais disponíveis.`;

  renderCart();
}

init();
