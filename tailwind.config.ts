import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        spritePink: "#FFC7E3",
        spriteMint: "#B8F2E6",
        spriteYellow: "#FFEEA9",
        spriteLavender: "#E5D4FF",
        spriteSky: "#CDEBFF",
        spriteText: "#4A5568"
      },
      borderRadius: {
        "xl-soft": "1.25rem"
      },
      boxShadow: {
        "soft-card": "0 10px 30px rgba(148, 163, 184, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;

