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
- Makefile: all you need to start the stack for back or front dev


# Main Folder

Here is all you need usually to dev back folder or front

## Start the stack

```sh
make prepare
make dev # make up instead if you don't want the console output but trust me use make dev
```

## Clean database
```sh
make clean-db
```

## Start the stack only for front with iso prod build

```sh
make prepare-prod
make up
```

## Release

You have a make command to deploy each services.
```sh
make release-auth
make release-back
make release-front
```

__WARNING : When making changes on auth you need to apply migrations on the server manually__

## Frontend

After starting the stack

```sh
cd front
pnpm install
pnpm start
```

### Update tailwind classes (TO IMPROVE YEAH)

Sometimes if you use a classes that havent be used before you need to rerun tailwinf because I didn't put postcss in webpack

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


## To dev on Auth

```sh
cd auth
make dev
make migrate-up
make start
```

## WWW

Open the index.html in your browser directly

### Build CSS

Use this when you use a tailwind class for the first time in the page. (NEED TO IMPROVE YEAH)

- `pnpm build:css` : One shot build
- `pnpm build:css:watch` : Rebuild when changes are detected
