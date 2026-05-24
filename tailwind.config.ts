
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        // Aureus Narrative design tokens (from Stitch designs)
        "primary": "#735c00",
        "on-primary": "#ffffff",
        "primary-container": "#d4af37",
        "on-primary-container": "#554300",
        "primary-fixed": "#ffe088",
        "primary-fixed-dim": "#e9c349",
        "on-primary-fixed": "#241a00",
        "on-primary-fixed-variant": "#574500",
        "inverse-primary": "#e9c349",
        "secondary": "#4c5e86",
        "on-secondary": "#ffffff",
        "secondary-container": "#bccefd",
        "on-secondary-container": "#46577f",
        "secondary-fixed": "#d9e2ff",
        "secondary-fixed-dim": "#b4c6f4",
        "on-secondary-fixed": "#041a3f",
        "on-secondary-fixed-variant": "#34466d",
        "tertiary": "#415ba4",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#97b0ff",
        "on-tertiary-container": "#254188",
        "tertiary-fixed": "#dbe1ff",
        "tertiary-fixed-dim": "#b4c5ff",
        "on-tertiary-fixed": "#00174b",
        "on-tertiary-fixed-variant": "#27438a",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "surface": "#f8f9fa",
        "surface-bright": "#f8f9fa",
        "surface-dim": "#d9dadb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        "surface-tint": "#735c00",
        "surface-variant": "#e1e3e4",
        "on-surface": "#191c1d",
        "on-surface-variant": "#4d4635",
        "background": "#f8f9fa",
        "on-background": "#191c1d",
        "outline": "#7f7663",
        "outline-variant": "#d0c5af",
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f2",
        // ShadCN tokens (kept for compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
      },
      spacing: {
        "container-margin": "24px",
        "gutter": "16px",
        "section-gap": "40px",
        "base": "8px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        "label-md": ["Manrope"],
        "label-sm": ["Manrope"],
        "headline-lg": ["Manrope"],
        "body-lg": ["Manrope"],
        "headline-xl": ["Manrope"],
        "body-md": ["Manrope"],
        "headline-md": ["Manrope"],
        "headline-lg-mobile": ["Manrope"],
      },
      fontSize: {
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'shimmer': { from: { backgroundPosition: '0 0' }, to: { backgroundPosition: '-200% 0' } }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
