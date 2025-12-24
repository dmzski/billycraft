#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER auth WITH PASSWORD 'auth';
    CREATE DATABASE billy_auth;
    GRANT ALL PRIVILEGES ON DATABASE billy_auth TO auth;

    CREATE USER billy WITH PASSWORD 'billy';
    CREATE DATABASE billy;
    GRANT ALL PRIVILEGES ON DATABASE billy TO billy;

EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname coco <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname coco_auth <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
