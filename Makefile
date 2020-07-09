build:
	npm run build
publish:
	aws s3 sync build s3://andrewgrowney.com