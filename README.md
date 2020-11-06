# Coco-erp

## Prerequisite

- Java 11
- Node JS : 12.x.x
- Yarn : 1.19.2
- Docker :
- Docker-compose :

## Frontend

### First launch

```sh
cd front
yarn install
yarn start
```

### Next launch

```
cd front
yarn start
```

### Update from Tailwind.scss

- Realtime changes in main.scss

```sh
cd front
yarn watch:css
```

- Build new main.scss

```sh
cd front
yarn build:css
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
