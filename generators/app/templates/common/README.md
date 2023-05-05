# <%= projectName %>

> <%- projectDescription %>

## Project requirements

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
  curl -sSL https://install.python-poetry.org | python - --version 1.4.2
  ```
  *If you have not previously installed any Python version, you may need to set your global Python version before installing Poetry:*
    ```bash
    pyenv global <%= pythonVersion %>
    ```

## Installation

### Create a virtual environment

Create your virtual environment and link it to your project folder:

```bash
pyenv virtualenv <%= pythonVersion %> <%= projectName %>
pyenv local <%= projectName %>
```
Now, every time you are in your project directory your virtualenv will be activated thanks to `pyenv`!

### Install Python dependencies through poetry

```bash
poetry install --no-root
```

### Install git hooks (running before commit and push commands)

```bash
poetry run pre-commit install
```

## Testing

To run unit tests, run `pytest` with:
```bash
pytest tests --cov src
```
or
```bash
make test
```

## Formatting and static analysis

### Code formatting with `black`

To check code formatting, run `black` with:
```bash
black . --check
```
or
```bash
make black
```

You can also [integrate it to your IDE](https://black.readthedocs.io/en/stable/integrations/editors.html) to reformat
your code each time you save a file.

### Static analysis with `pylint`

To run static analysis, run `pylint` with:
```bash
pylint src tests
```
or
```bash
make lint
```

### Order imports with `isort`

To check the imports order, run `isort` with:
```bash
isort . --check
```
or
```bash
make isort
```

### Type checking with `mypy`

To type check your code, run `mypy` with:
```bash
mypy src --explicit-package-bases --namespace-packages
```
or
```bash
make mypy
```

<% if (includeApi) { %>
## API
The **<%= projectName %>** project includes an API built with [FastAPI](https://fastapi.tiangolo.com/). Its code can be found at `src/api`!

To start the API, run the `start-api` Makefile command:
```bash
make start-api
```
You can test the `hello_world` route by [importing the Postman collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data) at `postman`.

For more details on the API routes, check the automatically generated [swagger](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data) at the `/docs` url.

<% } %>
