import path from "path"
import react from "@vitejs/plugin-react-swc"
import { readPackage } from "read-pkg"
import { type UserConfig, defineConfig } from "vite"

const pkg = await readPackage()

const externalPkgs = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.optionalDependencies || {}),
	...Object.keys(pkg.peerDependencies || {}),
]

const external = (id: string) => {
	const match = (dependency: string) => new RegExp(`^${dependency}`).test(id)
	const isExternal = externalPkgs.some(match)
	const isBundled = pkg.bundleDependencies?.some(match) // alias of bundledDependencies package.json field array

	return isExternal && !isBundled
}

export const defaultConfig: UserConfig = {
	resolve: {
		alias: [
			{
				find: "components",
				replacement: path.resolve(__dirname, "./src/components"),
			},
			{ find: "hooks", replacement: path.resolve(__dirname, "./src/hooks") },
			{ find: "lib", replacement: path.resolve(__dirname, "./src/lib") },
		],
	},
	build: {
		outDir: "dist",
		target: ["es2020"],
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			name: pkg.name,
			fileName: pkg.name,
		},
		rollupOptions: {
			external,
			output: {
				preserveModules: true,
				entryFileNames: "[name].js",
			},
		},
	},
	plugins: [react()],
}

export default defineConfig(defaultConfig)
