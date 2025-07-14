.PHONY: build start install

install:
	npm install
	cd frontend && npm install

build: install
	cd frontend && npm run build

start:
	npx concurrently "cd frontend && npm run dev" "npx @hexlet/chat-server"
