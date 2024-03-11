#!/bin/bash
cd ../ && docker compose down
docker rm -f coco_db
docker rm -f coco_traefik
