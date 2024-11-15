<% let packageManagerRunPrefix = (packageManager === "pyenv + poetry") ? "poetry run" : "uv run"; -%>
# <%= projectName %>

> <%- projectDescription %>

## Project requirements

<% if (packageManager === "pyenv + poetry") { -%>
### Pyenv and `Python <%= pythonVersion %>`

- Install [pyenv](https://github.com/pyenv/pyenv) to manage your Python versions and virtual environments:

  ```bash
  curl -sSL https://pyenv.run | bash
  ```

  - If you are on MacOS and experiencing errors on python install with pyenv, follow this [comment](https://github.com/pyenv/pyenv/issues/1740#issuecomment-738749988)
  - Add these lines to your `~/.bashrc` or `~/.zshrc` to be able to activate `pyenv virtualenv`:

      ```bash
      eval "$(pyenv init -)"
      eval "$(pyenv virtualenv-init -)"
      eval "$(pyenv init --path)"
      ```

  - Restart your shell

- Install the right version of `Python` with `pyenv`:

  ```bash
  pyenv install <%= pythonVersion %>
  ```

### Poetry

- Install [Poetry](https://python-poetry.org) to manage your dependencies and tooling configs:

  ```bash
  curl -sSL https://install.python-poetry.org | python - --version 1.7.0
  ```

  *If you have not previously installed any Python version, you may need to set your global Python version before installing Poetry:*

    ```bash
    pyenv global <%= pythonVersion %>
    ```
<% } else { -%>
### Astral/uv

- Install [uv](https://github.com/astral-sh/uv) to manage your Python version, virtual environments, dependencies and
tooling configs: see [installation docs](https://github.com/astral-sh/uv?tab=readme-ov-file#installation).
<% } -%>

<% if (includeApi) { -%>

### Docker Engine

Install [Docker Engine](https://docs.docker.com/engine/install/) to build and run the API's Docker image locally.
<% } -%>
<% if (includeApi && apiInfrastructure === "aws") { -%>

### AWS Command Line Interface

Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to be able to interact
with AWS services from your terminal.
<% } -%>
<% if (includeApi && apiInfrastructure === "gcp") { -%>

### Google Cloud SDK

Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) to be able to interact with GCP services from your
terminal.
<% } -%>
<% if (includeApi && apiInfrastructure !== null) { -%>

### Terraform and associated tools

To manage the project infrastructure, you will need to install:

- [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli#install-terraform)
- [TFlint](https://github.com/terraform-linters/tflint#installation)
- [terraform-docs](https://github.com/terraform-docs/terraform-docs#installation)
<% } -%>

## Installation

### Python virtual environment and dependencies

<% if (packageManager === "pyenv + poetry") { -%>
1. Create a `pyenv` virtual environment and link it to your project folder:

    ```bash
    pyenv virtualenv <%= pythonVersion %> <%= projectSlug %>
    pyenv local <%= projectSlug %>
    ```

    *Now, every time you are in your project directory your virtualenv will be activated!*

2. Install dependencies with `Poetry`:

    ```bash
    poetry install --no-root
    ```

Steps 1. and 2. can also be done in one command:
<% } else { -%>
Run the following command:

```bash
uv sync
```

or else:
<% } -%>

```bash
make install
```

<% if (includeApi && apiInfrastructure === "aws") { -%>

### Setup environment variables

Duplicate the `.env.example` file and rename it to `.env`. Fill in the environment variables with the right values.

Make sure to install [direnv](https://github.com/direnv/direnv/tree/master) to load the environment variables automatically whenever you enter the project directory.
On MacOS, you can install it with Homebrew:

```bash
brew install direnv
```

### Setup AWS for your project

Set up your AWS account locally to be able to access the different resources:

- Get your AWS credentials from the AWS console, or ask an administrator to provide them to you.
- If you are managing only this AWS account in your computer
  - Run `aws configure` and specify your ACCESS_KEY_ID and SECRET_ACCESS_KEY
- If you are managing several AWS accounts in your computer
  - Modify your local file located in `~/.aws/credentials` to add:

    ```bash
    [<%= projectSlug %>]
    aws_access_key_id=XXXXXX
    aws_secret_access_key=XXXXXXXX
    region=<%= awsRegion %>
    ```

  - *(Optional)* In your IDE, modify the default terminal env variables of your project to add `AWS_PROFILE=<%= projectSlug %>`.
  It allows you to use the right AWS profile when calling Python files.
<% } -%>
<% if (includeApi && apiInfrastructure === "gcp") { -%>

### Setup GCP for your project

Set up your GCP account locally to be able to access the different resources:

- Run `gcloud auth login` and follow the instructions to log in to your GCP account.
- Set the GCP project ID:

  ```bash
  gcloud config set project <%= gcpProjectId %>
  ```

<% } -%>
<% if (includeApi && apiInfrastructure !== null) { -%>

### Set-up Terraform

*All commands below are to be run from `terraform` folder.*
<% if (includeApi && apiInfrastructure === "gcp") { -%>

- Set up your gcloud application default credentials (which will be used by Terraform):

  ```bash
  gcloud auth application-default login
  ```

<% } -%>

- Init the project locally:

  ```bash
  terraform init
  ```

- Install TFlint plugins:

  ```bash
  tflint --init
  ```

- Select the development workspace:

  ```bash
  terraform workspace select dev
  ```

<% } -%>

### Install git hooks (running before commit and push commands)

```bash
<%= packageManagerRunPrefix %> pre-commit install
```

<% if (includeDvc && dvcRemoteType) { -%>

### Pull data from DVC remote

- Make sure you have access to the DVC remote bucket (see bucket URL in `.dvc/config` file). If not, ask an administrator to give you access.
- Pull the data:

  ```bash
  <%= packageManagerRunPrefix %> dvc pull
  ```

<% } -%>

## Testing

To run unit tests, run `pytest` with:

```bash
<%= packageManagerRunPrefix %> pytest tests --cov src
```

or

```bash
make test
```

## Formatting and static analysis

### Code formatting with `ruff`

To check code formatting, run `ruff format` with:

```bash
<%= packageManagerRunPrefix %> ruff format --check .
```

or

```bash
make format-check
```

You can also [integrate it to your IDE](https://docs.astral.sh/ruff/integrations/) to reformat
your code each time you save a file.

### Static analysis with `ruff`

To run static analysis, run `ruff` with:

```bash
<%= packageManagerRunPrefix %> ruff check src tests
```

or

```bash
make lint-check
```

To run static analysis and to apply auto-fixes, run `ruff` with:

```bash
make lint-fix
```

### Type checking with `mypy`

To type check your code, run `mypy` with:

```bash
<%= packageManagerRunPrefix %> mypy src --explicit-package-bases --namespace-packages
```

or

```bash
make type-check
```

<% if (includeApi) { -%>

## API

The project includes an API built with [FastAPI](https://fastapi.tiangolo.com/). Its code can be found at `src/api`.

The API is containerized using a [Docker](https://docs.docker.com/get-started/) image, built from the `Dockerfile` and `docker-compose.yml` at the root.

To build and start the API, use the following Makefile command:

```bash
make start-api
```

You can test the `hello_world` route by [importing the Postman collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data) at `postman`.

For more details on the API routes, check the automatically generated [swagger](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data) at the `/docs` url.
<% } -%>
<% if (includeApi && apiInfrastructure !== null) { -%>

### Deploy the API

To deploy the API, run (depending on your computer's architecture):

```bash
make deploy-api-from-x86 # E.g. Linux or Mac intel
```

or

```bash
make deploy-api-from-arm # E.g. Mac M1 or M2
```

<% } -%>
<% if (includeApi && apiInfrastructure !== null) { -%>

## Infrastructure

<% if (apiInfrastructure === "aws") { -%>
The infrastructure of the project consists of AWS resources, provisioned with Terraform.
<% } -%>
<% if (apiInfrastructure === "gcp") { -%>
The infrastructure of the project consists of GCP resources, provisioned with Terraform.
<% } -%>
The Terraform code for all resources can be found in the `terraform` folder.
<% if (apiInfrastructure === "aws") { -%>

### Architecture and communication between the components

![Architecture and communication between the components](docs/architecture.png)
<% } -%>

### Pricing of the infrastructure

<% if (apiInfrastructure === "aws") { -%>

- EC2: ~38$ per month. ([see official doc](https://aws.amazon.com/ec2/pricing/on-demand/))
<% if (includeNatGateway) { -%>
- NAT Gateway: ~32$ per month ([see official doc](https://aws.amazon.com/vpc/pricing/))
<% } -%>
- Application Load Balancer: ~16$ per month. ([see official doc](https://aws.amazon.com/elasticloadbalancing/pricing/))
- API gateway: free for the first 1M requests per month, then ~$1 per million requests  ([see official doc](https://aws.amazon.com/api-gateway/pricing/))
- ECR: <1$ per month. ([see official doc](https://aws.amazon.com/ecr/pricing/))
- S3: <1$ per month. ([see official doc](https://aws.amazon.com/s3/pricing/))
- ECS, VPC, ASG: Free (no overhead charge)
<% } -%>
<% if (apiInfrastructure === "gcp") { -%>
- Cloud Run costs depend on the number of requests to the API. You can estimate them with the [GCP pricing calculator](https://cloud.google.com/products/calculator).
- Artifact Registry: <1$ per month. ([see official doc](https://cloud.google.com/artifact-registry/pricing))
<% } -%>

### Process to add/delete/update resources

Select the environment you want to provision:

```bash
terraform workspace select <env_name>
```

Then check the module adding/deletion plan

  ```bash
  terraform plan
  ```

If the plan suits what you were expecting, provision the development environment by running:

  ```bash
  terraform apply
  ```

<% if (apiInfrastructure === "gcp") { -%>

### Access the API

If you try to reach the API with the URL given by Terraform, you should have an error. See [this guide](https://cloud.google.com/run/docs/authenticating/developers?hl=en) to connect to your API in Cloud Run.
<% } -%>
<% } -%>
<% if (includeStreamlit) { -%>

## Streamlit

The project includes a Streamlit app.
See its documentation in the [specific README](src/streamlit_app/README.md).
<% } -%>
