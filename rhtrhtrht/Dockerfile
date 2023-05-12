# Docker multi-stage building, as recommended by https://fastapi.tiangolo.com/deployment/docker/#docker-image-with-poetry
FROM python:3.9.13-slim-buster as requirements-stage

WORKDIR /tmp

# Install curl, poetry
RUN apt-get -y update; apt-get -y install curl
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.2 python3 -
ENV HOME /root
ENV PATH=${PATH}:$HOME/.local/bin

# Export requirements.txt
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes --no-interaction --no-cache --only=main


FROM python:3.9.13-slim-buster

WORKDIR /code

# Install curl for healthcheck
RUN apt-get -y update; apt-get -y install curl

# Install dependencies with pip from exported requirements.txt
COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy API files
COPY src/api ./src/api

# Add and set a non-root user
RUN useradd appuser
USER appuser

# Start FastAPI
CMD uvicorn src.api.main:app --host 0.0.0.0 --port 80

## Healthcheck
HEALTHCHECK --interval=10s --timeout=1s --retries=3 CMD curl --fail http://localhost/health || exit 1
