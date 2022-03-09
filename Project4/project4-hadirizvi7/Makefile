all: build

build:
	cd wasm_frontend && wasm-pack build --target web
	cp js_frontend/js_frontend.js backend/static/
	cp wasm_frontend/pkg/wasm_frontend.js backend/static/
	cp wasm_frontend/pkg/wasm_frontend_bg.wasm backend/static/

run: build
	cd backend && FLASK_APP=hockey.py flask run
