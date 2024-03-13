#!/bin/bash
docker network create coco_net 2>&1
docker run -p 80:80 -p 443:443 \
  --name coco_traefik \
  --network coco_net \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ./letsencrypt:/letsencrypt \
  -d traefik:v2.3 \
  traefik --log.level=INFO \
  --providers.docker=true \
  --providers.docker.exposedbydefault=false \
  --entrypoints.websecure.address=:443 \
  --certificatesresolvers.cocoresolver.acme.tlschallenge=true \
  --certificatesresolvers.cocoresolver.acme.email=maliszewskid3@gmail.com \
  --certificatesresolvers.cocoresolver.acme.storage=/letsencrypt/acme.json
