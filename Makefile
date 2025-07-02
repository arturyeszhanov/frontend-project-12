.PHONY: build start

build:
	npm install --prefix frontend && npm run build --prefix frontend

start:
	npm start
