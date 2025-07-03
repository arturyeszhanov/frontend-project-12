.PHONY: build start

build:
	cd frontend && npm install && npm run build

start:
	npm install
	cd backend && node index.js
