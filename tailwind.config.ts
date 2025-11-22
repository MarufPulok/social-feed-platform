import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Dark mode configuration for next-themes
  darkMode: "class",
  
  // Note: Custom CSS classes (prefixed with _) are automatically preserved
  // because they're defined in CSS files, not as Tailwind utilities.
  // Tailwind only purges its own utility classes, not regular CSS classes.
  // Your 1,072+ custom classes in common.css, main.css, and responsive.css
  // will never be purged since they're regular CSS, not Tailwind utilities.
  
  // Strategy to avoid conflicts with Bootstrap:
  // Option 1: Use prefix (uncomment to enable)
  // prefix: "tw-",
  
  // Option 2: Use important flag (enabled by default)
  // This adds !important to all Tailwind utilities, giving them higher specificity
  // than Bootstrap classes. Use this if you want Tailwind to override Bootstrap.
  important: true,
  
  theme: {
    extend: {
      colors: {
        // Extend Tailwind colors here if needed
        // Bootstrap colors remain available via Bootstrap classes
      },
    },
  },
  
  plugins: [],
};

export default config;

