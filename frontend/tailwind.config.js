/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo 600
                secondary: '#9333EA', // Purple 600
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
