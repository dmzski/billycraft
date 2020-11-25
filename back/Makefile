DC=docker-compose

up:
	${DC} up -d

down:
	${DC} down

start:
	${DC} start

stop:
	${DC} stop

build:
	${DC} build

dev:
	./mvnw clean compile quarkus:dev

package:
	./mvnw clean package -Pnative

update-docker:
	./mvnw clean package -Pnative && ${DC} build && ${DC} up -d

load-test:
	./scripts/loadtest.sh
