#!/bin/bash
cd ../ && docker compose down && cd ./scripts
docker rm -f coco_db
docker rm -f coco_traefik
docker network rm coco_net
docker volume rm coco_data
