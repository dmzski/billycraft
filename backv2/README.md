# Backend COCOERP

## Prerequisite

- Docker and docker-compose

## How to start in dev

- Make sure these ports are free :
  - 5432 : Postgres
  - 8080 : API
  - 8081 : Keycloak
  - 1025 and 8025 : Fakesmtp
  - 80 : Traefik
- Run `make` or `make dev`

## API Testing

- Import `Insmonia.json` (export v4) in your Insomnia, all should be good.
