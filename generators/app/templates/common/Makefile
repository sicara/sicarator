test:
	poetry run pytest tests --cov src --cov-report term --cov-report=html --cov-report xml --junit-xml=tests-results.xml

black:
	poetry run black . --check

lint:
	poetry run pylint src tests

isort:
	poetry run isort . --check

mypy:
	poetry run mypy src

<% if (includeApi) { %>
start-api:
	docker compose up -d
<% } %>
