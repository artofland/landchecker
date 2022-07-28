REGISTRY=ghcr.io/artofland/landchecker

build:
	docker build --platform=linux/amd64 -t ${REGISTRY}:master .

push:
	docker push ${REGISTRY}:master