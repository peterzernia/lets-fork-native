install:
	yarn install --network-concurrency 1
.PHONY: install

up:
	yarn start
.PHONY: up

test:
	yarn test
.PHONY: test

lint:
	yarn lint
.PHONY: lint

publish:
	expo publish --release-channel production
.PHONY: publish

build-android:
	expo build:android -t app-bundle --release-channel production
.PHONY: build-android

build-amazon:
	expo build:android -t apk --release-channel production
.PHONY: build-amazon

upload-android:
	expo upload:android --track production --key ./api-key.json
.PHONY: upload-android

build-ios:
	expo build:ios --apple-id peter@peterzernia.com -t archive --release-channel production
.PHONY: build-ios

upload-ios:
	expo upload:ios --apple-id peter@peterzernia.com --app-name "Let's Fork"
.PHONY: upload-ios

debug:
	open "rndebugger://set-debugger-loc?host=localhost&port=19003"
.PHONY: debug
