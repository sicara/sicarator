# Docker multi-stage building, as recommended by https://fastapi.tiangolo.com/deployment/docker/#docker-image-with-poetry
FROM python:<%= pythonVersion %>-slim-buster as requirements-stage

WORKDIR /tmp

# Install curl, poetry ; remove apt cache to reduce image size
RUN apt-get -y update && apt-get -y install curl  && rm -rf /var/lib/apt/lists/*
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.2 python3 -

ENV HOME /root
ENV PATH=${PATH}:$HOME/.local/bin

# Export requirements.txt
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes --no-interaction --no-cache --only=main


FROM python:<%= pythonVersion %>-slim-buster

WORKDIR /code

ENV \
    # Prevent Python from buffering stdout and stderr and loosing some logs (equivalent to python -u option)
    PYTHONUNBUFFERED=1 \
    # Prevent Pip from timing out when installing heavy dependencies
    PIP_DEFAULT_TIMEOUT=600 \
    # Prevent Pip from creating a cache directory to reduce image size
    PIP_NO_CACHE_DIR=1

# Install curl for healthcheck ; remove apt cache to reduce image size
RUN apt-get -y update && apt-get -y install curl && rm -rf /var/lib/apt/lists/*

# Install dependencies with pip from exported requirements.txt
COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy API files
COPY src/api ./src/api

# Add and set a non-root user
RUN useradd appuser
USER appuser

# Start FastAPI
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0"]

# Healthcheck
HEALTHCHECK --interval=10s --timeout=1s --retries=3 CMD curl --fail http://localhost/health || exit 1
