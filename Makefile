.PHONY: build start install

install:
	npm install
	cd frontend && npm install

build: install
	cd frontend && npm run build

start:
	npx concurrently "npx @hexlet/chat-server" "sleep 2 && cd frontend && npm run dev"
