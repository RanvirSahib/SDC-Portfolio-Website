/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sdc: {
          bg:     '#fbf6ec',
          coral:  '#e0575c',
          coral2: '#fb6b6e',
          teal:   '#1f2d2e',
          ink:    '#3a1a22',
          mute:   '#76655e',
          card:   '#ffffff',
        },
      },
      fontFamily: {
        cinzel:         ['"Cinzel"', 'Georgia', 'serif'],
        'cinzel-decor': ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        times:          ['"Times New Roman"', 'Times', 'serif'],
        inter:          ['Inter', 'system-ui', 'sans-serif'],
        playfair:       ['"Playfair Display"', 'Georgia', 'serif'],
        instrument:     ['"Instrument Serif"', 'Georgia', 'serif'],
        montserrat:     ['Montserrat', 'system-ui', 'sans-serif'],
        poppins:        ['Poppins', 'system-ui', 'sans-serif'],
        jakarta:        ['Poppins', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        gurmukhi:       ['Noto Sans Gurmukhi', 'Poppins', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          to: { backgroundPosition: '200%' },
        },
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
        slideUp: {
          to: { opacity: '1', transform: 'translateY(0) rotateX(0deg)' },
        },
        ldbFill: {
          to: { width: '100%' },
        },
        pulse2: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.07)' },
        },
        pop: {
          '50%': { transform: 'scale(1.12)' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(34px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          to: { transform: 'scale(4)', opacity: '0' },
        },
      },
      animation: {
        float:        'float 5s ease-in-out infinite',
        shimmer:      'shimmer 5s linear infinite',
        marquee:      'marquee 30s linear infinite',
        ldb:          'ldbFill 1.5s ease-in-out forwards',
        logoPulse:    'pulse2 1.4s ease-in-out infinite',
        pop:          'pop 0.35s ease-in-out',
        fadeSlideUp:  'fadeSlideUp 0.9s cubic-bezier(0.2,0.7,0.2,1) forwards',
        ripple:       'ripple 0.6s linear',
      },
      backgroundSize: {
        '200': '200%',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.3,1.6,0.5,1)',
      },
    },
  },
  plugins: [],
}
