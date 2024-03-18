up:
	docker compose up -d

up-prod:
	docker compose up -d

prepare:
	cd ./auth && make build && make build-migrator && cd ../back && make build-dev

prepare-prod:
	cd ./auth && make build-prod && make build-migrator && cd ../back && make build-prod

logs:
	docker compose logs -f

down:
	docker compose down

dev:
	docker compose up -d && docker compose logs -f

dev-auth:
	docker compose up -d && docker compose logs -f auth

dev-back:
	docker compose up -d && docker compose logs -f api

clean:
	docker compose down -v

build-back:
	cd ./back && make build-dev

build-back-prod:
	cd ./back && make build-prod

build-auth-prod:
	cd ./auth && make build-prod

build-auth:
	cd ./auth && make build

build-prod:
	cd ./auth && make build-prod && cd ../back && make build-prod

release-back:
	cd back && make deploy-docker

release-front:
	cd front && make deploy-docker

release-stg-front:
	cd front && make stg-deploy-docker

release-auth:
	cd auth && make deploy-docker

release-auth-migrator:
	cd auth && make deploy-migrator

release-www:
	cd www && pnpm run build && ./push-site.sh
