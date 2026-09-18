import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundBlendMode: {
        normal: "normal",
        multiply: "multiply",
        screen: "screen",
        overlay: "overlay",
        darken: "darken",
        lighten: "lighten",
        color: "color",
        colorBurn: "color-burn",
        colorDodge: "color-dodge",
      },
      background: {
        "theme-gradient": "linear-gradient(180deg, rgba(81, 75, 255, 0.6) 0%, rgba(163, 118, 254, 0.6) 100%)",
      },
      mixBlendMode: {
        luminosity: "luminosity",
        normal: "normal",
      },
      boxShadow: {
        custom: "0px 0px 50px 0px rgba(81, 75, 255, 0.20)",
        card: "0px 0px 20px 0px rgba(81, 75, 255, 0.10)",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      backgroundColor: {
        primary: "#514BFF",
      },
      colors: {
        primary: "#514BFF",
        secondary: "#333333",
        background: "#FFFFFF",
        foreground: "#333333",
      },
    },
  },
  plugins: [],
} satisfies Config;
