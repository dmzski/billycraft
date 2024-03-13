dev:
	docker compose up -d postgres

up:
	docker compose up -d

down:
	docker compose down

prepare:
	cargo sqlx prepare

build:
	docker build -f ./Dockerfile.dev -t coco-erp/auth:local .

build-prod:
	docker build -f ./Dockerfile -t coco-erp/auth:latest .

build-migrator:
	docker build -f ./Dockerfile.migrator -t coco-erp/migrator:local .

build-migrator-prod:
	docker build -f ./Dockerfile.migrator -t coco-erp/migrator:latest .

migrate-up:
	sqlx migrate run

migrate-down:
	sqlx migrate revert

start:
	cargo watch -q -c -w src/ -x run

install:
	cargo add axum
	cargo add axum-extra -F cookie
	cargo add time
	cargo add tokio -F full
	cargo add tower-http -F "cors"
	cargo add serde_json
	cargo add serde -F derive
	cargo add chrono -F serde
	cargo add dotenv
	cargo add uuid -F "serde v4"
	cargo add sqlx -F "runtime-async-std-native-tls postgres chrono uuid"
	cargo add jsonwebtoken
	cargo add argon2
	cargo add rand_core --features "std"
	# HotReload
	cargo install cargo-watch
	# SQLX-CLI
	cargo install sqlx-cli

deploy-docker:
	docker build -f ./Dockerfile -t coco-erp/auth:latest . && docker push coco-erp/auth:latest

deploy-migrator:
	docker build -f ./Dockerfile.migrator -t coco-erp/migrator:latest . && docker push coco-erp/migrator:latest
