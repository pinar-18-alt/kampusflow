import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /** KampüsFlow — lacivert / mavi premium tema */
        primary: "#1E3A8A",
        primaryDark: "#172554",
        primaryMid: "#2563EB",
        primaryLight: "#3B82F6",
        accent: "#60A5FA",
        surface: "#F8FAFF",
        card: "#FFFFFF",
        ink: "#0F172A",
        inkMuted: "#475569",
        line: "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
