/**
 * Tailwind CSS Configuration
 *
 * Extends the shared design tokens from the design-tokens package
 */

import type { Config } from "tailwindcss";
import { tailwindPlugin } from "@jn74zky3xx5yj89rx9nes87swx7skt7x/design-tokens";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/src/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {},
  plugins: [tailwindPlugin],
};

export default config;
