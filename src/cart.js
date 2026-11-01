const STORAGE_KEY = "lulocc-cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function setQuantity(id, quantity) {
  const cart = getCart();
  if (quantity > 0) cart[id] = quantity;
  else delete cart[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addOne(id) {
  setQuantity(id, (getCart()[id] ?? 0) + 1);
}

// Splits the stored cart into purchasable lines and ids no longer available in products.json.
export function resolveCart(cart, products) {
  const lines = [];
  const unavailableIds = [];

  for (const [id, qty] of Object.entries(cart)) {
    const product = products.find((p) => p.id === id);
    if (!product || !product.available) {
      unavailableIds.push(id);
      continue;
    }
    lines.push({ product, qty, subtotal: product.price * qty });
  }

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  return { lines, total: Math.round(total * 100) / 100, unavailableIds };
}
