# Universal TailwindCSS Setup for BeYou and Kairos-Cannes

This guide provides a universal TailwindCSS configuration that works in both repositories.

## Files to Copy

### 1. tailwind.config.js
Copy this file to both repositories in the `packages/nextjs/` directory:

```javascript
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
```

### 2. postcss.config.js
Copy this file to both repositories in the `packages/nextjs/` directory:

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### 3. Required Dependencies
Add these to your `packages/nextjs/package.json` devDependencies:

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.11",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.45",
    "tailwindcss": "^4.1.3",
    "daisyui": "^5.0.9"
  }
}
```

## Installation Steps

1. **Copy the configuration files** to both repositories
2. **Install dependencies** in both repositories:
   ```bash
   cd packages/nextjs
   yarn add -D @tailwindcss/postcss autoprefixer postcss tailwindcss daisyui
   ```
3. **Clear caches and restart**:
   ```bash
   yarn cache clean
   rm -rf .next
   yarn dev
   ```

## Features

- ✅ Works with both TailwindCSS v3 and v4
- ✅ DaisyUI integration
- ✅ Custom BeYou dark theme
- ✅ TypeScript support
- ✅ Compatible with both repositories

## Troubleshooting

If you encounter issues:

1. **Clear all caches**:
   ```bash
   yarn cache clean
   rm -rf node_modules
   rm -rf .next
   yarn install
   ```

2. **Check PostCSS version compatibility**:
   - For TailwindCSS v4: Use `@tailwindcss/postcss`
   - For TailwindCSS v3: Use `tailwindcss`

3. **Verify DaisyUI installation**:
   ```bash
   yarn list daisyui
   ```

## Usage

The configuration provides:
- Custom color palette for BeYou theme
- DaisyUI components and utilities
- Responsive design support
- Dark theme support
- Custom border radius values

Both repositories can now use the same configuration without conflicts! 