test:
	poetry run pytest tests --cov src --cov-report=html --junit-xml=tests-results.xml --cov-fail-under=<%= minCoverage %>

black:
	poetry run black . --check

lint:
	poetry run pylint src tests

isort:
	poetry run isort . --check

mypy:
	poetry run mypy src --explicit-package-bases --namespace-packages
