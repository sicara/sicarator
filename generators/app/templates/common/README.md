# <%= projectName %>

> <%- projectDescription %>

## Installation

To install this project, you need `Python 3.9.7`.
The recommended way to install it is using [pyenv](https://github.com/pyenv/pyenv).

### Install poetry

```bash
python -m pip install --upgrade pip
pip install poetry==1.1.10
```

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

### Imports ordering

To check imports ordering, run `isort` with:
```bash
poetry run isort . --check
```
or
```bash
make isort
```
