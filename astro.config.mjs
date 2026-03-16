import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://itcodecraft.tech',
  integrations: [react(), icon()],
  build: {
    inlineStylesheets: "always",
  },
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
  },
});