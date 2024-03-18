# Coco-erp

## Disclaimers 
- CI will be improved actually use Makefile to upload images on registry then go on the server and do `./update`
- We cant do without entries in hostfile because cookies are not considered as secure with localhost

## Prerequisite

- Node JS : 20.x.x
- Pnpm : >= 8
- Docker
- Rust (auth)
- Go (back)

Add in your host file (/etc/hosts):
```
127.0.0.1       auth.coco-erp.lan api.coco-erp.lan app.coco-erp.lan
```

## Folder structure

- docker-compose.yml : The docker-compose to mount the stack excluding front (to dev)
- auth: The auth server (auth.coco-erp.fr)
- back: The coco erp API (api.coco-erp.fr)
- front: The coco erp Application (app.coco-erp.fr)
- deploy: files to deploy the app on a server
- docs: Some documentation
- www: The public website (coco-erp.fr)
- Makefile: all you need to start the stack for back or front dev
- db: Just the init script when deploying a new db service
- package.json, pnpm-workspace.yaml, pnpm-lock.yaml : Use changeset to make versions and dependency management

## Changeset used here !

When making changes run : `pnpm changeset` complete the command then add it in git commit to generate a changelog entry

---

## Lets go dev

Here is all you need usually to dev auth, back, front or website

### Setup env

- copy paste .env.dist into .env and changes value for SCW_SECRET_KEY (if you need it)

### Dev back and auth

- Start back and auth for the first time 
```sh
make prepare # build dev images
make dev # or make up for detached process
```
- Then usually when you work on the api (no auth db changes) just do `make dev`
- Cleaning database
```sh
make clean
```
- Stop all (without cleaning db)
```sh
make down
```

### Frontend

```sh
cd front
pnpm install
pnpm start
# go to app.coco-erp.lan:3000
```

### WWW

- `pnpm install` : Install deps
- `pnpm run dev` : Launch vite server to dev

---


## Release

You have a make command to deploy each services on registry then pull the images on the server.

- Login to docker registry : `./deploy/login.sh`
- Generate changelogs : `pnpm changeset version` 
- Commit changes : `git add . && git commit -m "chore: release" && git push`

- Choose what you want to deploy
```sh
make release-auth-migrator
make release-auth
make release-back
make release-front
make release-www
```
