# Deploy on server

## First deployment

Actually not a good CI is implemented so :

- Go on the server
- Upload the deploy/traefik.sh
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

Then run `docker-compose up -d` it will update the servics you have downloaded previously
