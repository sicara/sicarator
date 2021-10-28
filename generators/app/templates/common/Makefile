test:
	poetry run pytest tests --cov src --cov-report=html --junit-xml=tests-results.xml

black:
	poetry run black . --check

lint:
	poetry run pylint src tests

isort:
	poetry run isort . --check
