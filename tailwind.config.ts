import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        primary: "var(--primary-color)",
        secundary: "var(--secundary-color)",
        third: "var(--third-color)",
        fourth: "var(--fourth-color)",
        danger: "var(--danger)",
        gray: {
          100: "var(--gray-100)",
        },
        background: {
          primary: "var(--background-primary-color)",
          secondary: "var(--background-secundary-color)",
          input: "var(--background-input-color)",
          container: "var(--background-container-color)",
        },
      },
    },
  },
  plugins: [],
};
