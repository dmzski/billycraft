REGISTRY=rg.fr-par.scw.cloud/coco-erp
FRONT_DOCKERFILES=../dockers/front

deploy-docker:
	docker build -t coco-front:latest -f ${FRONT_DOCKERFILES}/Dockerfile ../ && \
		docker tag coco-front:latest ${REGISTRY}/app:latest && \
		docker push ${REGISTRY}/app:latest && \
		ssh debian@billycraft.fr './update'

stg-deploy-docker:
	docker build -t coco-front:stg-latest -f ${FRONT_DOCKERFILES}/Dockerfile.stg ../ && \
		docker tag coco-front:stg-latest ${REGISTRY}/app:stg-latest && \
		docker push ${REGISTRY}/app:stg-latest && \
		ssh debian@51.75.21.161 './update'
	

build-prod:
	docker build -f ${FRONT_DOCKERFILES}/Dockerfile -t coco-erp/front:latest .
