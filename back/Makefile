dev:
	docker compose up -d && docker compose logs -f back

up:
	docker compose up -d

down:
	docker compose down

build-dev:
	docker build -f ./Dockerfile.dev -t coco-erp/api:local .

build-prod:
	docker build -f ./Dockerfile -t coco-erp/api:local .

upload-migrations:
	scp migrations/* debian@coco-erp.fr:./api/migrations/

logs:
	docker-compose logs -f --tail=200 back

deploy-docker:
	docker build -f ./Dockerfile -t maliszewskid/coco-api:latest . && docker push maliszewskid/coco-api:latest
