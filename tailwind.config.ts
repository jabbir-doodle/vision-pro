import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            transform: 'translateY(0%)',
          },
          '50%': {
            transform: 'translateY(-100%)',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            transform: 'translateX(0%)',
          },
          '50%': {
            transform: 'translateX(-100%)',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            transform: 'translate(0%, 0%)',
          },
          '25%': {
            transform: 'translate(-100%, 0%)',
          },
          '50%': {
            transform: 'translate(-100%, -100%)',
          },
          '75%': {
            transform: 'translate(0%, -100%)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          'from': {
            textShadow: '0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff',
          },
          'to': {
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;