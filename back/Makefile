REGISTRY=rg.fr-par.scw.cloud/coco-erp
BACK_DOCKERFILES=../dockers/back

build-dev:
	docker build -f ${BACK_DOCKERFILES}/Dockerfile.dev -t coco-erp/api:local ../

build-prod:
	docker build -f ${BACK_DOCKERFILES}/Dockerfile -t coco-erp/api:latest ../

upload-migrations:
	scp migrations/* debian@coco-erp.fr:./api/migrations/

logs:
	cd ../ && docker-compose logs -f --tail=200 api

deploy-docker:
	docker build -f ${BACK_DOCKERFILES}/Dockerfile -t ${REGISTRY}/api:latest ../ && docker push ${REGISTRY}/api:latest
