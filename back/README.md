# Backend COCOERP

## Prerequisite

- Docker and docker-compose

## How to start in dev

- Make sure these ports are free :
  - 5432 : Postgres
  - 8080 : API
  - 8090 : Auth
  - 80 : Traefik
- Run `make` or `make dev`

## API Testing

- Import `Insmonia.json` (export v4) in your Insomnia, all should be good.


## Deploy

- Run `make deploy-docker`
- Go on the server and run the script at $HOME/update-app
