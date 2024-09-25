import type { Config } from 'tailwindcss'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import svgToDataUri from 'mini-svg-data-uri'
import colors from 'tailwindcss/colors'

export const theme = {
  extend: {
    colors: {
      primary: '#F7E360',
      secondary: '#230B5B',
      dark: '#111',
      light: '#fff',
      loading: '#334155',
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      body: ['Source Sans Pro', 'sans-serif'],
    },
    spacing: {
      21: '21px',
      '21/2': '10.5px',
    },
    maxWidth: {
      1200: '1200px',
    },
    borderRadius: {
      large: '24px',
      medium: '16px',
      small: '12px',
      'extra-small': '6px',
    },
    backgroundColor: {
      dark: {
        0: '#000000',
        100: '#2f2e3e',
        200: '#003e70',
      },
      light: {
        100: '#f4f4f4',
        200: '#fff',
      },
    },
    textColor: {
      light: '#fff',
      darker: '#003e70',
      dark: '#000',
    },
    boxShadow: {
      'medium-light': '0px 2px 10px 1px rgba(255, 255, 255, 0.1)',
      medium: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
      small: '0px 2px 10px 1px rgba(0, 0, 0, 0.1)',
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    fill: {
      light: '#fff',
    },
    screens: {
      xs: '300px',

      sm: '640px',

      md: '768px',

      lg: '1024px',

      xl: '1280px',

      '2xl': '1536px',
    },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      'scale-wiggle': {
        '0%, 100%': { transform: 'rotate(-3deg) scale(1.2)' },
        '50%': { transform: 'rotate(3deg) scale(1.2)' },
      },
    },
    animation: {
      'spin-slow': 'spin 2s linear infinite',
      wiggle: 'wiggle 0.8s ease-in-out infinite',
      'scale-wiggle': 'scale-wiggle 0.8s ease-in-out infinite 0.2s',
    },
  },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme,
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'bg-grid': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="80" height="80" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          'bg-grid-small': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          'bg-dot': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      )
    },
  ],
}
export default config

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'))
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]))

  addBase({
    ':root': newVars,
  })
}
