# Backend COCOERP

## Prerequisite

- Docker and docker-compose

## How to start in dev

- Make sure these ports are free :
  - 8080 : API
  - 80 : Traefik

## API Testing

- Import `Insmonia.json` (export v4) in your Insomnia, all should be good.


## Deploy

- Run `make deploy-docker`
- Go on the server and run the script at $HOME/update-app
