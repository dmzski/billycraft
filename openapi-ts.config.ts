import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: './back/docs/swagger.json',
  output: {
    lint: 'biome',
    format: 'biome',
    path:'./front/src/sdk'
  },
  experimentalParser: true,
  plugins: [
    '@hey-api/schemas', // preserves default output
    '@hey-api/typescript', // preserves default output
    {
      asClass: true, // default
      name: '@hey-api/sdk',
    },
  ],
});
