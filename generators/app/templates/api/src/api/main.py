import sys
import uuid

from loguru import logger

from src.api.fastapi_app import app
from src.api.types import ExampleAPIInput


# Create a new logger, with extra containing the event_id (c.f. below) and without the time, as it
# is already present in CloudWatch
logger.remove()
logger.add(sys.stdout, level="INFO", format="{extra} | {level: <8} | {message}")


@app.get("/health")
def health_check_route() -> None:
    pass


@app.post("/dummy-route")
def dummy_route(
    example_api_input: ExampleAPIInput,
):
    with logger.contextualize(event_id=uuid.uuid4().hex):
        logger.info(example_api_input.dummy)
