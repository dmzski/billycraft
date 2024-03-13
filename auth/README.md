# COCO ERP - Auth Server

## Prerequesite

- Rust is installed
- `make install` : Install all deps

## Run in dev

- `make dev` : Start postgres
- `make migrate-up` : Run migrations on db
- `make start` : Start with cargo-watch

## Build for prod

- `make deploy` : Will build the dockerfile then upload it on the registry
- Then go on the server and do `./update` in home of user
