/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sf: ['"SF Pro"', "sans-serif"],
			},
			colors: {
				brown_text: "#B06222",
			},
		},
	},
	plugins: [],
};
