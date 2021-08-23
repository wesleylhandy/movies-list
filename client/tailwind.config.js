const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      error: '#ff8484',
      success: '#81e875',
      warning: '#ffff84',
      active: '#2e76ca',
      translucent: 'rgba(0,0,0,.25)',
      opaque: 'rgba(255,255,255,.75)',
      transparent: 'transparent',
  },
    extend: {
        gridTemplateRows: {
          8: 'repeat(8, minmax(0, 1fr))',
          12: 'repeat(12, minmax(0, 1fr))',
          16: 'repeat(16, minmax(0, 1fr))',
          20: 'repeat(20, minmax(0, 1fr))',
          24: 'repeat(24, minmax(0, 1fr))',
      },
      maxWidth: {
          '2xs': '16rem',
          '3xs': '12rem',
          '4xs': '8rem',
          '5xs': '4rem',
      },
      spacing: {
          '2xs': `16rem`,
          '50vh': `50vh`,
          '50vw': `50vw`,
      },
    },
    fontFamily: {
      sans: ['Ubuntu', 'sans-serif'],
      heading: ['"Rampart One"', 'cursive'],
      body: ['"PT Sans"', 'sans-serif'],
    },
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  variants: {
    animation: ['responsive', 'motion-safe', 'motion-reduce'],
    extend: {
      borderColor: ['active'],
      borderWidth: ['hover', 'focus', 'active'],
      boxShadow: ['active'],
      gradientColorStops: ['active', 'group-hover'],
      height: ['hover', 'focus'],
      maxHeight: ['hover', 'focus'],
      maxWidth: ['hover', 'focus'],
      minHeight: ['hover', 'focus'],
      minWidth: ['hover', 'focus'],
      opacity: ['active'],
      transform: ['hover', 'focus'],
      transitionProperty: ['hover', 'focus'],
      width: ['hover', 'focus'],
    },
    transitionProperty: ['responsive', 'motion-safe', 'motion-reduce'],
  },
  plugins: [],
}
