# Deploy on server

## First deployment

Actually not a good CI is implemented so :

- Go on the server
- Upload the deploy/docker-compose.yml
- Upload deploy/.env
- Upload db/init-db.sh
- Changes values
- Run
- `docker compose up -d`

## Update only

- `docker compose pull back`: To update back
- `docker compose pull front`: To update front
- `docker compose pull auth`: To update auth
- `docker compose pull migrate-auth-db`: To update auth migrator container

Then run `docker-compose up -d` it will update the services you have downloaded previously
