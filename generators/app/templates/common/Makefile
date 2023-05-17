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
## DEPLOYMENT ##
AWS_ACCOUNT_ADDRESS=<%= AwsAccountId %>.dkr.ecr.<%= awsRegion %>.amazonaws.com
AWS_REGION=<%= awsRegion %>
ECR_REPOSITORY_NAME=dev_api_image
ECS_CLUSTER_NAME=dev_api_cluster
ECS_SERVICE_NAME=dev_api_service

ecr_login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ADDRESS}

build_api_image:
	docker build . -t api

tag_and_push_image_to_ecr:
	docker tag api ${AWS_ACCOUNT_ADDRESS}/${ECR_REPOSITORY_NAME}:latest
	docker push ${AWS_ACCOUNT_ADDRESS}/${ECR_REPOSITORY_NAME}:latest

# Redeployment of ECS service to take into account the new image
redeploy_ecs_service:
	aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --force-new-deployment

deploy_image_on_api_from_amd:
	make ecr_login
	make build_model_api_image
	make tag_and_push_image_to_ecr
	make redeploy_ecs_service

deploy_image_on_api_from_arm:
	make ecr_login
	docker buildx build --platform linux/amd64 --push -t ${AWS_ACCOUNT_ADDRESS}/${ECR_REPOSITORY_NAME}:latest .
	make redeploy_ecs_service
<% } %>
