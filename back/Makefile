DC=docker-compose

up: ## DC up
	${DC} up -d

down: ## DC down
	${DC} down

start: ## DC start
	${DC} start

stop: ## DC stop
	${DC} stop

build: ## DC build
	${DC} build

dev: ## Launch dev server
	./mvnw clean compile quarkus:dev

package: ## Maven clean package
	./mvnw clean package

package-native: ## Maven clean package
	./mvnw package -Pnative -Dquarkus.native.container-build=true

logs: ## Show docker compose logs
	${DC} logs -f

ps: ## Show docker compose status
	${DC} ps

update-docker: ## Maven clean package and docker-compose build and docker-compose up -d
	./mvnw clean package -Dquarkus.container-image.build=true -Dquarkus.container-image.additional-tags=local && ${DC} up -d

load-test: ## Loadtesting the application with scripts/loadtest.sh
	./scripts/loadtest.sh

push: ## Build and push docker
	./mvnw clean package -Dquarkus.container-image.push=true -Dquarkus.container-image.build=true -Dquarkus.container-image.additional-tags=latest

help: ## This help dialog.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
