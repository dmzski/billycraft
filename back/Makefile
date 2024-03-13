build-dev:
	docker build -f ./Dockerfile.dev -t coco-erp/api:local .

build-prod:
	docker build -f ./Dockerfile -t coco-erp/api:latest .

upload-migrations:
	scp migrations/* debian@coco-erp.fr:./api/migrations/

logs:
	cd ../ && docker-compose logs -f --tail=200 api

deploy-docker:
	docker build -f ./Dockerfile -t maliszewskid/coco-api:latest . && docker push maliszewskid/coco-api:latest
