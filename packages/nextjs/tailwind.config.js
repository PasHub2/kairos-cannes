/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors that work with both Tailwind v3 and v4
        primary: "#FAFAFA",
        "primary-content": "#0D0D0D",
        secondary: "#9A999C",
        accent: "#3b82f6",
        neutral: "#C7C6CB",
        "base-100": "#0D0D0D",
        "base-200": "#202021",
        "base-300": "#2a2a2e",
        "base-content": "#FAFAFA",
        info: "#3b82f6",
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171",
      },
      borderRadius: {
        "rounded-box": "1rem",
        "rounded-btn": "0.5rem",
      },
    },
  },
  plugins: [
    // DaisyUI plugin - works with both v3 and v4
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        "beyou-dark": {
          "primary": "#FAFAFA",
          "primary-content": "#0D0D0D",
          "secondary": "#9A999C",
          "accent": "#3b82f6",
          "neutral": "#C7C6CB",
          "base-100": "#0D0D0D",
          "base-200": "#202021",
          "base-300": "#2a2a2e",
          "base-content": "#FAFAFA",
          "info": "#3b82f6",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",

          "--rounded-box": "1rem", // 16px
          "--rounded-btn": "0.5rem", // 8px
        },
      },
    ],
  },
}; 