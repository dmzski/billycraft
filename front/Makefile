REGISTRY=rg.fr-par.scw.cloud/coco-erp
FRONT_DOCKERFILES=../dockers/front

deploy-docker:
	docker build -t billycraft:latest -f ${FRONT_DOCKERFILES}/Dockerfile ../ && \
		docker tag billycraft:latest ${REGISTRY}/app:latest && \
		docker push ${REGISTRY}/app:latest && \
		ssh ${PROD_SERVER} './update'

stg-deploy-docker:
	docker build -t billycraft:stg-latest -f ${FRONT_DOCKERFILES}/Dockerfile.stg ../ && \
		docker tag billycraft:stg-latest ${REGISTRY}/app:stg-latest && \
		docker push ${REGISTRY}/app:stg-latest && \
		ssh ${STG_SERVER} './update'
	

build-prod:
	docker build -f ${FRONT_DOCKERFILES}/Dockerfile -t billycraft/front:latest .
