up:
	yarn start
.PHONY: up

publish:
	expo publish --release-channel production
.PHONY: publish

build:
	expo build:android --release-channel production
.PHONY: build
