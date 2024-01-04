# Coco-erp

## Prerequisite

- Go 19
- Node JS : 20.x.x
- Pnpm : >= 8
- Docker

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
