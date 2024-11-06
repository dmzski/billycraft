import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		Unfonts({
			custom: {
				families: [
					{
						name: "Geist",
						src: "./src/assets/fonts/Geist/webfonts/*.woff2",
					},
				],
			},
		}),
	],
	server: {
		port: 3000,
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
});
