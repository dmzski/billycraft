
#
# General
#
prepare:
	cd ./auth && make build && make build-migrator && cd ../back && make build-dev

prepare-prod:
	cd ./auth && make build-prod && make build-migrator && cd ../back && make build-prod

up:
	docker compose up -d

dev:
	docker compose up -d && docker compose logs -f

logs:
	docker compose logs -f

down:
	docker compose down

clean:
	docker compose down -v

#
# Format
#
format-back-front:
	cd ./back && gofmt -w . && cd ../front && pnpm run format

format-auth:
	cd ./auth && rustfmt --edition 2021 --emit files ./src/**

format-back:
	cd ./back && gofmt -w .

format-front:
	cd ./front && pnpm run format

format-ui:
	cd ./ui && pnpm run format

#
# Back
#
back-dev:
	docker compose up -d && docker compose logs -f api

back-build:
	cd ./back && make build-dev

back-build-prod:
	cd ./back && make build-prod

back-release:
	cd back && make deploy-docker

#
# Auth
#
auth-dev:
	docker compose up -d && docker compose logs -f auth

auth-build-prod:
	cd ./auth && make build-prod

auth-build:
	cd ./auth && make build

auth-release:
	cd auth && make deploy-docker

# Auth Migrator
auth-migrator-release:
	cd auth && make deploy-migrator

#
# Front
#
front-release:
	cd front && make deploy-docker

front-stg-release:
	cd front && make stg-deploy-docker

generate-sdk:
	# cd back && swag init --ot json && cd ../ && pnpm openapi-generator-cli generate --generator-key sdk-front --skip-validate-spec
	cd back && swag init --ot json -q && cd ../ && pnpx @hey-api/openapi-ts -i back/docs/swagger.json -o front/src/sdk -c @hey-api/client-fetch


#
# WWW
#
www-release:
	cd www && pnpm run build && ./push-site.sh
