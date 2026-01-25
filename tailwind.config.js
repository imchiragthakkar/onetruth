/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff5ec',
                    100: '#ffe8d3',
                    200: '#ffcca5',
                    300: '#ffad72',
                    400: '#ff893f',
                    500: '#ff6b35', // Sunrise Orange
                    600: '#f05a22',
                    700: '#c84318',
                    800: '#9f3619',
                    900: '#802f18',
                },
                secondary: {
                    DEFAULT: '#fdf6e3', // Soft Cream
                    100: '#ffffff',
                    200: '#fdf6e3',
                    300: '#fceecc',
                },
                accent: {
                    DEFAULT: '#ffd700', // Light Gold
                    light: '#ffe44d',
                },
                sun: { // Keeping for backward compatibility temporarily
                    50: '#fff8f1',
                    100: '#ffefd8',
                    200: '#ffd09a',
                    300: '#ffb05c',
                    400: '#ff911e',
                    500: '#ff7300',
                    600: '#e05000',
                    700: '#b43606',
                    800: '#912a0d',
                    900: '#75240f',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
                serif: ['Playfair Display', 'Merriweather', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
