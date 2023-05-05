"""Tests for `hello_world.py`."""

from unittest.mock import patch

from src import hello_world


@patch.object(hello_world, "print")
def test_hello_world(print_mock) -> None:
    hello_world.hello_world()
    print_mock.assert_called_once_with("Hello World!")
