FROM python:<%= pythonVersion %>

# Set HOME, WORKDIR
ENV HOME /root
WORKDIR /code

# Install poetry and project dependencies
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.2 python3 -
ENV PATH=${PATH}:$HOME/.local/bin
COPY pyproject.toml poetry.lock ./
RUN poetry --no-interaction --no-cache install --only=main

# Copy API files
COPY src/api ./src/api

# Start FastAPI
CMD poetry run uvicorn src.api.main:app --host 0.0.0.0