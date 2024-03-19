#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER auth WITH PASSWORD 'auth';
    CREATE DATABASE coco_auth;
    GRANT ALL PRIVILEGES ON DATABASE coco_auth TO auth;

    CREATE USER coco_api WITH PASSWORD 'coco_api';
    CREATE DATABASE coco;
    GRANT ALL PRIVILEGES ON DATABASE coco TO coco_api;

EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname coco <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname coco_auth <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
