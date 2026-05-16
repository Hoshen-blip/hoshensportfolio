/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,ts,json}"],
  theme: {
    extend: {
      colors: {
        "color-primary": "var(--color-primary)",
        "color-primary-dark": "var(--color-primary-dark)",
        "color-accent": "var(--color-accent)",
        "color-accent-dark": "var(--color-accent-dark)",
        "color-bg": "var(--color-bg)",
        "color-surface": "var(--color-surface)",
        "color-surface-tinted": "var(--color-surface-tinted)",
        "color-featured-bg": "var(--color-featured-bg)",
        "color-tech-bg": "var(--color-tech-bg)",
        "color-text-primary": "var(--color-text-primary)",
        "color-text-secondary": "var(--color-text-secondary)",
        "color-border": "var(--color-border)",
        "color-border-focus": "var(--color-border-focus)",
        "color-link": "var(--color-link)",
        "color-link-hover": "var(--color-link-hover)",
        "color-error": "var(--color-error)",
        "color-warning": "var(--color-warning)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      fontFamily: {
        "display-en": ["Cormorant Garamond", "Frank Ruhl Libre", "serif"],
        "display-he": ["Frank Ruhl Libre", "serif"],
        "body-en": ["DM Sans", "Heebo", "system-ui", "sans-serif"],
        "body-he": ["Heebo", "DM Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 8px rgba(74,74,74,0.06)",
        "card-hover": "0 6px 20px rgba(74,74,74,0.10)",
        nav: "0 2px 12px rgba(74,74,74,0.08)"
      }
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("rtl", '[dir="rtl"] &');
      addVariant("ltr", '[dir="ltr"] &');
    }
  ]
};
