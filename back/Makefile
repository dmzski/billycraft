REGISTRY=rg.fr-par.scw.cloud/coco-erp
BACK_DOCKERFILES=../dockers/back

build-dev:
	docker build -f ${BACK_DOCKERFILES}/Dockerfile.dev -t billycraft/api:local ../

build-prod:
	docker build -f ${BACK_DOCKERFILES}/Dockerfile -t billycraft/api:latest ../

upload-migrations:
	scp migrations/* ${PROD_SERVER}:./api/migrations/

logs:
	cd ../ && docker-compose logs -f --tail=200 api

deploy-docker:
	docker build -f ${BACK_DOCKERFILES}/Dockerfile -t ${REGISTRY}/api:latest ../ && docker push ${REGISTRY}/api:latest

format:
	gofmt -w .
