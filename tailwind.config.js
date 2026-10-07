/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#f1f8f5',
          100: '#def0e8',
          200: '#bee0d2',
          300: '#92cbb6',
          400: '#63b095',
          500: '#41947b',
          600: '#307763',
          700: '#286051',
          800: '#1b4332', // Xanh lá thông đặc trưng
          900: '#17372a',
          950: '#0c1f18',
        },
        mist: {
          50: '#f5f7f8',
          100: '#e9eef0',
          200: '#d7e1e5',
          300: '#baccd2',
          400: '#96b1bb',
          500: '#7797a3',
          600: '#617d8a',
          700: '#526772',
          800: '#47565f',
          900: '#3e4a52',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f4ecdc',
          300: '#ebdcc2',
          400: '#dfc6a2',
          500: '#d3ae82',
        },
        earth: {
          50: '#fbf7f4',
          100: '#f6ece5',
          200: '#eed8cb',
          300: '#e1bea9',
          400: '#d19d82',
          500: '#b86d4c',
          600: '#a35539',
          700: '#87422d',
          800: '#6f3727',
          900: '#5c3024',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 50, 0.06), 0 2px 6px -1px rgba(27, 67, 50, 0.04)',
        'float': '0 12px 32px -4px rgba(27, 67, 50, 0.12), 0 4px 12px -2px rgba(27, 67, 50, 0.06)',
      }
    },
  },
  plugins: [],
}
