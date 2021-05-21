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

logs: ## Show docker compose logs
	${DC} logs -f

ps: ## Show docker compose status
	${DC} ps

update-docker: ## Maven clean package and docker-compose build and docker-compose up -d
	./mvnw clean package && ${DC} build && ${DC} up -d

load-test: ## Loadtesting the application with scripts/loadtest.sh
	./scripts/loadtest.sh

help: ## This help dialog.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

