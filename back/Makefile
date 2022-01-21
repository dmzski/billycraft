
dev:
	docker-compose up -d && docker-compose logs -f back

up:
	docker-compose up -d

down:
	docker-compose down

build-preprod:
	docker build -f Dockerfile.prod -t maliszewskid/compta-back:local .

upload-migrations:
	scp migrations/* debian@coco-erp.fr:./app/migrations/

logs:
	docker-compose logs -f --tail=200 back

some-coffee:
	docker build -f Dockerfile.prod -t maliszewskid/compta-back:v2 . && docker push maliszewskid/compta-back:v2
