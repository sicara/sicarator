"""FastAPI app creation, logger configuration and main API routes."""
import sys
import uuid

from fastapi import FastAPI
from loguru import logger

from src.api.types import HealthRouteOutput, HelloWorldRouteInput, HelloWorldRouteOutput

# Remove pre-configured logging handler
logger.remove(0)
# Create a new logging handler same as the pre-configured one but with the extra
# attribute `request_id`
logger.add(
    sys.stdout,
    level="INFO",
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "ID: {extra[request_id]} - <level>{message}</level>"
    ),
)

app = FastAPI()


@app.get("/health")
def health_check_route() -> HealthRouteOutput:
    """Health check route to check that the API is up.

    Returns:
        a dict with a "status" key
    """
    return HealthRouteOutput(status="ok")


@app.post("/hello-world")
def hello_world(
    hello_world_input: HelloWorldRouteInput,
) -> HelloWorldRouteOutput:
    """Says hello to the name provided in the input.

    Args:
        hello_world_input: a dict with a "name" key

    Returns:
        a dict with a "message" key
    """
    with logger.contextualize(request_id=uuid.uuid4().hex):
        response_message = f"Hello, {hello_world_input.name}!"
        logger.info(f"Responding '{response_message}'")
        return HelloWorldRouteOutput(message=response_message)
