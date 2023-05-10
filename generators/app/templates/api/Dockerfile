# Docker multi-stage building, as recommended by https://fastapi.tiangolo.com/deployment/docker/#docker-image-with-poetry
FROM python:<%= pythonVersion %>-slim-buster as requirements-stage

WORKDIR /tmp

# Install curl, poetry
RUN apt-get -y update; apt-get -y install curl
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.2 python3 -
ENV HOME /root
ENV PATH=${PATH}:$HOME/.local/bin

# Export requirements.txt
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes --no-interaction --no-cache --only=main


FROM python:<%= pythonVersion %>-slim-buster

WORKDIR /code

# Install dependencies with pip from exported requirements.txt
COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy API files
COPY src/api ./src/api

# Add and set a non-root user
RUN useradd appuser
USER appuser

# Start FastAPI
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "80"]

# Healthcheck
HEALTHCHECK CMD http://localhost/health
