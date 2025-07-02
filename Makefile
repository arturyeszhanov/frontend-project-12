.PHONY: build start

build:
	npm run build

start:
	npx start-server -s ./frontend/dist
