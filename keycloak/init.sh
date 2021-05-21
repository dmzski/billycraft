#!/bin/bash
docker pull quay.io/keycloak/keycloak
docker build -t test-keycloak . -f Dockerfile
docker run --name theme_coco \
  -p 10001:8080 \
  --rm \
  -v $PWD/theme:/opt/jboss/keycloak/themes/coco-erp  \
  -e KEYCLOAK_USER=admin \
  -e KEYCLOAK_PASSWORD=admin \
  test-keycloak

