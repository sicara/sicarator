"""Tests for `api/main.py`."""
from src.api.main import health_check_route, hello_world
from src.api.types import HealthRouteOutput, HelloWorldRouteInput, HelloWorldRouteOutput


def test_health_check_route() -> None:
    assert health_check_route() == HealthRouteOutput(status="ok")


def test_hello_world() -> None:
    assert hello_world(HelloWorldRouteInput(name="World")) == HelloWorldRouteOutput(
        message="Hello, World!"
    )
