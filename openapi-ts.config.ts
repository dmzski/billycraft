import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
	input: "./back/docs/swagger.yaml",
  logs: 'debug',
	output: {
		lint: "biome",
		format: "biome",
		path: "./front/src/sdk",
	},
	plugins: [
    "@hey-api/schemas",
    '@hey-api/typescript',
		"@hey-api/client-fetch",
		{
			asClass: true,
			name: "@hey-api/sdk",
		},
	],
})
