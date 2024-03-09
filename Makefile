
up:
	docker compose up -d

logs:
	docker compose logs -f

down:
	docker compose down

dev:
	docker compose up

dev-back:
	docker compose up -d && docker compose logs -f api

clean-db:
	docker compose down -v

prepare:
	cd ./auth && make build && cd ../back && make build-dev

prepare-prod:
	cd ./auth && make build && cd ../back && make build-prod

release-back:
	cd back && make deploy-docker

release-front:
	cd front && make deploy-docker

release-auth:
	cd auth && make deploy-docker
