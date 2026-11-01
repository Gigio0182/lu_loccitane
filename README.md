# LuLocc

Product catalog with cart and WhatsApp checkout. Static site, no database.

## Editing the catalog

Edit `public/data/products.json`. Each product has:

- `id`: unique text, never reuse it
- `name`, `description`
- `price`: number in reais, e.g. `49.9`
- `image`: path under `public/`, e.g. `images/item-1.jpg`
- `available`: `true` or `false`

Put photos in `public/images/`. If a photo file is missing, the placeholder image is shown.

Products removed or set to `available: false` are dropped from visitors' carts on their next visit.

## WhatsApp number

Set `WHATSAPP_NUMBER` in `src/config.js`: country code, area code and number, digits only (e.g. `5511999999999`).

## Local development

```
npm install
npm run dev
```

## Publishing

Push to `main`. GitHub Actions builds and deploys the site.

First time only: in the repository, go to Settings > Pages and set Source to "GitHub Actions".

Site URL: `https://<user>.github.io/lu_loccitane/`
