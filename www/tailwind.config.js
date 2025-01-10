module.exports = {
	content: ["./src/index.html"],
	darkMode: "media", // or 'media' or 'class'
	theme: {
		extend: {
			animation: {
				"fade-in": "fade-in 2s ease-in-out",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
