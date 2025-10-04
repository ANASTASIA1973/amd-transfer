import type { Config } from "tailwindcss";

const config = {
  // Pfade zu all deinen Dateien, in denen Tailwind-Klassen vorkommen
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        // Custom Properties aus :root
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },

  plugins: [],
} satisfies Config;

export default config;
