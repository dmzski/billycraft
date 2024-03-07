# Coco-erp

## Disclaimers : CI will be improved actually use each Makefile to upload images on registry then go on the server and do `./update`

## Prerequisite

- Go 19
- Node JS : 20.x.x
- Pnpm : >= 8
- Docker
- Rust for auth

## Folder structure

- docker-compose.yml : The docker-compose exemple used in production

## Frontend

### First launch

```sh
cd front
pnpm install
pnpm start
```

### Next launch

```
cd front
pnpm start
```

### Update from Tailwind.scss

- Realtime changes in main.scss

```sh
cd front
pnpm watch:css
```

- Build new main.scss

```sh
cd front
pnpm build:css
```

## Backend

### First launch

```sh
cd back
make update-docker
sleep 30 #Keycloak is launching
make up
```

### Next launch

```sh
cd back
make up
sleep 30 # Keycloak is launching
make up
```

### Dev mode

```sh
cd back
make dev
```
