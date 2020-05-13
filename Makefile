up:
	yarn start
.PHONY: up

publish:
	expo publish --release-channel production
.PHONY: publish

build:
	expo build:android -t app-bundle --release-channel production
.PHONY: build

debug:
	open "rndebugger://set-debugger-loc?host=localhost&port=19003"
.PHONY: debug
