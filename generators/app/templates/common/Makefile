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
<% if (includeApi && apiInfrastructure !== null) { -%>
########################################################################################################################
# Deployment
########################################################################################################################

<% if (apiInfrastructure === "aws") { -%>
AWS_ACCOUNT_URL=<%= awsAccountId %>.dkr.ecr.<%= awsRegion %>.amazonaws.com
AWS_REGION=<%= awsRegion %>
ECR_REPOSITORY_NAME=dev_api_image
ECS_CLUSTER_NAME=dev_api_cluster
ECS_SERVICE_NAME=dev_api_service
IMAGE_URL=${AWS_ACCOUNT_URL}/${ECR_REPOSITORY_NAME}

ecr-login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_URL}

# Redeployment of ECS service to take into account the new image
redeploy-ecs-service:
	aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --force-new-deployment --no-cli-pager

<% } -%>
<% if (apiInfrastructure === "gcp") { -%>
GCP_PROJECT_ID=<%= gcpProjectId %>
GCP_REGION=<%= gcpRegion %>
ARTIFACT_REGISTRY_NAME=dev-api-docker-registry
CLOUD_RUN_SERVICE_NAME=dev-api-service
IMAGE_URL=${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_NAME}/${CLOUD_RUN_SERVICE_NAME}

artifact-registry-login:
	gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev

# Redeployment of Cloud Run service to take into account the new image
redeploy-cloud-run-service:
	gcloud run deploy ${CLOUD_RUN_SERVICE_NAME} \
	--image=${IMAGE_URL}:latest \
	--region=${GCP_REGION}

<% } -%>
deploy-api-from-x86:
<% if (apiInfrastructure === "aws") { -%>	make ecr-login<% } -%>
<% if (apiInfrastructure === "gcp") { -%>	make artifact-registry-login<% } -%>

	# build image
	docker build . -t api

	# tag and push image to ecr
	docker tag api ${IMAGE_URL}:latest
	docker push ${IMAGE_URL}:latest

<% if (apiInfrastructure === "aws") { -%>	make redeploy-ecs-service<% } -%>
<% if (apiInfrastructure === "gcp") { -%>	make redeploy-cloud-run-service<% } -%>


# When building an image from an ARM processor (Mac M1 or M2) with the standard way (`deploy-api-from-x86`), the
# resulting image can only be run on ARM machines (which is not the case of the provisioned instance). Using `buildx`
# allows to overcome this limitation, by specifying for which platform the image is built.
deploy-api-from-arm:
<% if (apiInfrastructure === "aws") { -%>	make ecr-login<% } -%>
<% if (apiInfrastructure === "gcp") { -%>	make artifact-registry-login<% } -%>

	docker buildx build --platform linux/amd64 --push -t ${IMAGE_URL}:latest .
<% if (apiInfrastructure === "aws") { -%>	make redeploy-ecs-service<% } -%>
<% if (apiInfrastructure === "gcp") { -%>	make redeploy-cloud-run-service<% } -%>

<% } -%>
<% if (includeStreamlit) { -%>
########################################################################################################################
# Streamlit
########################################################################################################################

start-streamlit-app:
	poetry run streamlit run "src/streamlit_app/🏠_Home_page.py"

<% } -%>