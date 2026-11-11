# build environment
FROM node:20-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./front ./front
COPY ./ui ./ui
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./package.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN cd ./front && pnpm run build

# production environment
FROM nginx:stable-alpine

# URLs BAKED dans le bundle JS au build (doivent matcher front/.env.production).
# Ce sont les chaînes que sub_filter va chercher dans le bundle à runtime.
ARG BAKED_API_URL=https://api.billycraft.fr/api/v1
ARG BAKED_AUTH_API_URL=https://auth.billycraft.fr/api

# API_URL / AUTH_API_URL = valeurs de remplacement au runtime (override possible
# avec `docker run -e ...`). Par défaut on retombe sur l'URL du build => no-op.
ENV BAKED_API_URL=${BAKED_API_URL} \
    BAKED_AUTH_API_URL=${BAKED_AUTH_API_URL} \
    API_URL=${BAKED_API_URL} \
    AUTH_API_URL=${BAKED_AUTH_API_URL}

COPY --from=build /app/front/dist /usr/share/nginx/html
EXPOSE 80
# Template envsubst automatiquement au boot par l'image officielle nginx
COPY ./front/nginx.conf.template /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]
