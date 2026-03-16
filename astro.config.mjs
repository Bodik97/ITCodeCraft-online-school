import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import icon from 'astro-icon';
import node from "@astrojs/node";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: 'http://itcodecraft.tech/',
  integrations: [react(), icon()],
  build: {
    inlineStylesheets: "always",
  },
  adapter: vercel(),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
  },
});