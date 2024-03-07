
release:
	cd back && make deploy-docker && cd ../front && make deploy-docker
