# <%= projectName %>

> <%- projectDescription %>

## Installation

To install this project, you need `Python <%= pythonVersion %>`.
The recommended way to install it is using [pyenv](https://github.com/pyenv/pyenv).

### Install poetry

```bash
curl -sSL https://install.python-poetry.org | python - --version 1.1.10
```
### Create a virtual environment 

Install [pyenv](https://github.com/pyenv/pyenv) to manage your Python versions and virtual environments.
- If you are on MacOS and experiencing errors on python install with pyenv, follow this [comment](https://github.com/pyenv/pyenv/issues/1740#issuecomment-738749988)
- Add these lines to your ~/.bashrc or ~/.zshrc to be able to activate pyenv virtualenvs:

    ```bash
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
    eval "$(pyenv init --path)"
    ```

Then create your virtual environment and configure it for your project :

```bash
pyenv virtualenv <%= pythonVersion %> <env name>
pyenv local <env name>
```
Now, everytime you are in your project directory your env will be activated thanks to pyenv!
### Install requirements through poetry

```bash
poetry install --no-root
```

### Install git hooks (running before commit and push commands)

```bash
poetry run pre-commit install -t pre-commit
poetry run pre-commit install -t pre-push
```

## Testing

To run unit tests, run `pytest` with:
```bash
poetry run pytest tests --cov src
```
or
```bash
make test
```

## Formatting and static analysis

### Code formatting with `black`

To check code formatting, run `black` with:
```bash
poetry run black . --check
```
or
```bash
make black
```

You can also [integrate it to your IDE](https://black.readthedocs.io/en/stable/integrations/editors.html) to reformat
your code each time you save a file.

### Static analysis

To run static analysis, run `pylint` with:
```bash
poetry run pylint src tests
```
or
```bash
make lint
```

### Order imports with `isort`

To check the imports order, run `isort` with:
```bash
make isort
```

### Type checking with `mypy`

To type check your code, run `mypy` with:
```bash
make mypy
```


## Update dependencies
:warning: Before doing so, remember you might create dependency breaks in the project. <br />
You can use :
```bash
poetry update
```
