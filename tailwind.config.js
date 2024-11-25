/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        screens: {
            xs: '320px',
            sm: '480px',
            md: '768px',
            lg: '1024px',
            xl: '1200px',
        },
        extend: {
            fontFamily: {
                Jost: ['Jost', 'sans-serif'],
            },
            colors: {
                primary: '#5C44F4',
                accent: '#f97427',
                secondary: '#e0e0ff',
            },
        },
    },
    plugins: [],
}
