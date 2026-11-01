import { defineConfig } from "vite";

// GitHub Actions sets GITHUB_ACTIONS; Pages serves the site under the repo name.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/lu_loccitane/" : "/",
});
