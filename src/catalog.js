import { CURRENCY, PLACEHOLDER_IMAGE } from "./config.js";

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: CURRENCY });

export const formatPrice = (value) => formatter.format(value);

export const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export async function loadProducts() {
  const response = await fetch(assetUrl("data/products.json"));
  if (!response.ok) throw new Error(`Failed to load products: HTTP ${response.status}`);
  return response.json();
}

export function renderCatalog(container, products, onAdd) {
  container.replaceChildren(...products.map((product) => createCard(product, onAdd)));
}

function createCard(product, onAdd) {
  const card = document.createElement("article");
  card.className = "card";

  const img = document.createElement("img");
  img.src = assetUrl(product.image);
  img.alt = product.name;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    img.src = assetUrl(PLACEHOLDER_IMAGE);
  }, { once: true });

  const body = document.createElement("div");
  body.className = "card-body";

  const name = document.createElement("h2");
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = product.description;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "add-button";
  button.disabled = !product.available;
  button.textContent = product.available ? "Adicionar" : "Indisponível";
  button.addEventListener("click", () => onAdd(product.id));

  body.append(name, description, price, button);
  card.append(img, body);
  return card;
}
