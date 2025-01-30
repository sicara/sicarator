# Docker multi-stage building, as recommended by https://fastapi.tiangolo.com/deployment/docker/#docker-image-with-poetry
FROM python:<%= pythonVersion %>-slim as curl-stage

# Install curl ; remove apt cache to reduce image size
RUN apt-get -y update && apt-get -y install curl  && rm -rf /var/lib/apt/lists/*

<% if (packageManager === "pyenv + poetry") { -%>
FROM curl-stage as poetry-requirements-stage

WORKDIR /tmp

ENV HOME /root
ENV PATH=${PATH}:$HOME/.local/bin

# Install poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.7.0 python3 -

# Export requirements.txt
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes --no-interaction --no-cache --only=main

<% } -%>
FROM curl-stage

WORKDIR /code

<% if (packageManager === "pyenv + poetry") { -%>
ENV \
    # Prevent Python from buffering stdout and stderr and loosing some logs (equivalent to python -u option)
    PYTHONUNBUFFERED=1 \
    # Prevent Pip from timing out when installing heavy dependencies
    PIP_DEFAULT_TIMEOUT=600 \
    # Prevent Pip from creating a cache directory to reduce image size
    PIP_NO_CACHE_DIR=1

# Install dependencies with pip from exported requirements.txt
COPY --from=poetry-requirements-stage /tmp/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
<% } else { -%>
# cf https://docs.astral.sh/uv/guides/integration/docker/#using-uv-temporarily
RUN --mount=from=ghcr.io/astral-sh/uv:0.5.5,source=/uv,target=/bin/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync --frozen --no-install-project --no-dev --no-cache
<% } -%>

# Copy API files
COPY src/api ./src/api

# Add and set a non-root user
RUN useradd appuser
USER appuser

# Start FastAPI
<% if (apiInfrastructure === "gcp") { -%>
# Use port 80 unless specified with $PORT env variable (as required by GCP Cloud Run)
CMD uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-80}
<% } else { -%>
CMD uvicorn src.api.main:app --host 0.0.0.0 --port 80
<% } -%>

# Healthcheck
HEALTHCHECK --interval=10s --timeout=1s --retries=3 CMD curl --fail http://localhost/health || exit 1
