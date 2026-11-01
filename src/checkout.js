import { STORE_NAME, WHATSAPP_NUMBER } from "./config.js";
import { formatPrice } from "./catalog.js";

export function buildMessage(lines, total) {
  const items = lines.map(
    (line) => `- ${line.product.name} x${line.qty} = ${formatPrice(line.subtotal)}`,
  );

  return [
    `Olá! Gostaria de fazer um pedido na ${STORE_NAME}:`,
    ...items,
    `Total: ${formatPrice(total)}`,
    "",
    "Pode me informar sobre as formas de pagamento e a entrega?",
  ].join("\n");
}

export function checkoutUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
