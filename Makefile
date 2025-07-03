.PHONY: build start

build:
	cd frontend && npm install && npm run build

start:
	npm install
	cd frontend && npm install
	npx concurrently "cd frontend && npm run dev" "cd backend && node index.js"
