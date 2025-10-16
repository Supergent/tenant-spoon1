import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn74zky3xx5yj89rx9nes87swx7skt7x/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
