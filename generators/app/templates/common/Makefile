test:
	poetry run pytest tests --cov src --cov-report term --cov-report=html --cov-report xml --junit-xml=tests-results.xml

black:
	poetry run black . --check

ruff:
	poetry run ruff check src tests

fix-ruff:
	poetry run ruff check src tests --fix

mypy:
	poetry run mypy src

<% if (includeApi) { %>
start-api:
	docker compose up -d
<% } %>

<% if (includeAWSTerraformCodeForApi) { %>
# Deployment
AWS_ACCOUNT_ID=<%= AwsAccountId %>
ECR_REPOSITORY_NAME=dev_api_image
AWS_REGION=<%= AwsRegion %>

ecr_login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}

build_api_image:
	docker build . -t api

tag_and_push_image_to_ecr:
	docker tag api ${AWS_ACCOUNT_ID}/${ECR_REPOSITORY_NAME}:latest
	docker push ${AWS_ACCOUNT_ID}/${ECR_REPOSITORY_NAME}:latest

build_and_push_image_from_amd:
	make ecr_login
	make build_model_api_image
	make tag_and_push_image_to_ecr

build_and_push_image_from_arm:
	make ecr_login
	docker buildx build --platform linux/amd64 --push -t ${AWS_ACCOUNT_ID}/${ECR_REPOSITORY_NAME}:latest .
<% } %>
