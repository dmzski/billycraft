up:
	cd scripts && ./up.sh && cd ../ && docker compose up -d

logs:
	docker compose logs -f

down:
	cd scripts && ./down.sh

dev:
	docker compose up -d && docker compose logs -f

dev-auth:
	docker compose up -d && docker compose logs -f auth

dev-back:
	docker compose up -d && docker compose logs -f api

prepare:
	cd scripts && ./prepare.sh

clean:
	cd scripts && ./clean.sh

build:
	cd ./auth && make build && cd ../back && make build-dev

build-prod:
	cd ./auth && make build && cd ../back && make build-prod

release-back:
	cd back && make deploy-docker

release-front:
	cd front && make deploy-docker

release-auth:
	cd auth && make deploy-docker
