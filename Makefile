install: install-deps

develop:
	npx webpack-dev-server --open

install-deps:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

test:
	npm test

lint:
	npx run eslint .

publish:
	npm publish

.PHONY: test
