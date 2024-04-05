# Deploy on server

## Deployments steps

- Replace $SSH_HOST by your ssh connection (like debian@exemple.com) and $SSH_FOLDER by the folder you want the app into (like ~/app) make sure the folder is already created on the server.
```
scp deploy/login.sh $SSH_HOST
scp deploy/docker-compose.yml $SSH_HOST:$SSH_FOLDER
scp deploy/.env $SSH_HOST:$SSH_FOLDER
scp db/init-db.sh $SSH_HOST:$SSH_FOLDER
```
- Go on your server: `ssh $SSH_HOST`
- Run commands
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
SCW_SECRET_KEY=XXXXXXX ./login.sh
cd $SSH_FOLDER
nano .env #Change values acccording to your environnement
docker compose up -d
```
- Everything should run fine but you can run : `docker compose ps` to see list of services Up/Down


## Update the application

- `docker compose pull`: To update all services
- `docker compose pull back`: To update back
- `docker compose pull front`: To update front
- `docker compose pull auth`: To update auth
- `docker compose pull migrate-auth-db`: To update auth migrator container

Then run `docker-compose up -d` it will update the services you have downloaded previously
