"""Tests for functions inside the hello_world.py module"""

from unittest.mock import patch

from src.hello_world import hello_world


@patch("builtins.print")
def test_hello_world(print_mock) -> None:
    hello_world()
    print_mock.assert_called_once_with("Hello World!")
