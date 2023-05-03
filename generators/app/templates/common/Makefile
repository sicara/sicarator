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
	poetry run uvicorn src.api.main:app --reload
<% } %>
