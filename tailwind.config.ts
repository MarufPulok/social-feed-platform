import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Include CSS files to detect custom classes
    "./src/styles/**/*.css",
  ],
  
  // Safelist to preserve all custom classes (prefixed with _)
  // This ensures all 1,072+ custom classes are never purged
  safelist: [
    {
      pattern: /^_/,
      // Match all classes starting with underscore
    },
  ],
  
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

