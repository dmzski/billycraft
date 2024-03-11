#!/bin/bash

docker rm -f coco_db > /dev/null
docker rm -f coco_traefik > /dev/null

docker run -p 80:80 \
  -p 8080:8080 \
  --name coco_traefik \
  --network coco_net \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -d traefik:v2.3 \
  traefik --log.level=DEBUG --api.insecure=true --providers.docker=true --providers.docker.exposedbydefault=false

docker run -p 5432:5432 \
  --name coco_db \
  --network coco_net \
  -e POSTGRES_PASSWORD=postgres \
  -e PGDATA=/var/lib/postgresql/data \
  -v coco_data:/var/lib/postgresql/data \
  -v ./init-db.sh:/docker-entrypoint-initdb.d/init.sh \
  -d postgres:10

cd ../auth/ && make migrate-up
