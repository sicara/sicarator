"""Tests for `api/main.py`"""
from src.api.types import HelloWorldRouteInput, HelloWorldRouteOutput, HealthRouteOutput
from src.api.main import hello_world, health_check_route


def test_health_check_route() -> None:
    assert health_check_route() == HealthRouteOutput(status="ok")


def test_hello_world() -> None:
    assert (
        hello_world(HelloWorldRouteInput(name="Sicarator"))
        == HelloWorldRouteOutput(message="Hello, Sicarator!")
    )
