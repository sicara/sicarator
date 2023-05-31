########################################################################################################################
# Quality checks
########################################################################################################################

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

<% if (includeApi) { -%>
########################################################################################################################
# Api
########################################################################################################################

start-api:
	docker compose up -d

<% } -%>
<% if (includeApi && includeAWSInfrastructureCodeForApi) { -%>
########################################################################################################################
# Deployment
########################################################################################################################

AWS_ACCOUNT_URL=<%= awsAccountId %>.dkr.ecr.<%= awsRegion %>.amazonaws.com
AWS_REGION=<%= awsRegion %>
ECR_REPOSITORY_NAME=dev_api_image
ECS_CLUSTER_NAME=dev_api_cluster
ECS_SERVICE_NAME=dev_api_service

ecr-login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_URL}

# Redeployment of ECS service to take into account the new image
redeploy-ecs-service:
	aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --force-new-deployment --no-cli-pager

deploy-api-from-x86:
	make ecr-login

	# build image
	docker build . -t api

	# tag and push image to ecr
	docker tag api ${AWS_ACCOUNT_URL}/${ECR_REPOSITORY_NAME}:latest
	docker push ${AWS_ACCOUNT_URL}/${ECR_REPOSITORY_NAME}:latest

	make redeploy-ecs-service

# When building an image from an ARM processor (Mac M1 or M2) with the standard way (`deploy-api-from-x86`), the
# resulting image can only be run on ARM machines (which is not the case of the provisioned instance). Using `buildx`
# allows to overcome this limitation, by specifying for which platform the image is built.
deploy-api-from-arm:
	make ecr-login
	docker buildx build --platform linux/amd64 --push -t ${AWS_ACCOUNT_URL}/${ECR_REPOSITORY_NAME}:latest .
	make redeploy-ecs-service

<% } -%>
<% if (includeStreamlit) { -%>
########################################################################################################################
# Streamlit
########################################################################################################################

start-streamlit-app:
	poetry run streamlit run "src/streamlit_app/🏠_Home_page.py"

<% } -%>