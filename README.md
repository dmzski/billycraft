# Coco-erp

## Disclaimers : CI will be improved actually use each Makefile to upload images on registry then go on the server and do `./update`

## Prerequisite

- Node JS : 20.x.x
- Pnpm : >= 8
- Docker
- Rust (auth)
- Go (back)

## Folder structure

- docker-compose.yml : The docker-compose to mount the stack excluding front
- auth: The auth server (auth.coco-erp.fr)
- back: The coco erp API (api.coco-erp.fr)
- front: The coco erp Application (app.coco-erp.fr)
- www: The public website (coco-erp.fr)

## Frontend

```sh
cd front
pnpm install
pnpm start
```

### Update tailwind classes

- Build when changes
```sh
cd front
pnpm watch:css
```

- Build only
```sh
cd front
pnpm build:css
```

## Backend

```sh
cd back
make up
```

### Dev mode

```sh
cd back
make dev
```

## Auth

```sh
cd auth
make up
make start
```

## WWW

Open the index.html in your browser directly

### Build CSS

- `pnpm build:css` : One shot build
- `pnpm build:css:watch` : Rebuild when changes are detcted
