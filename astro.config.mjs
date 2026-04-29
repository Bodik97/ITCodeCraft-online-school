import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://itcodecraft.tech',
  integrations: [react(), icon(), sitemap()],
  adapter: node({ mode: "standalone" }),
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
  },
});