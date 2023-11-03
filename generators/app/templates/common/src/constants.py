"""Main constants of the project."""

from pathlib import Path

PROJECT_ROOT_PATH = Path(__file__).parents[1]

<% if (includeDvc) { -%>
PARAMETERS_YAML_PATH = PROJECT_ROOT_PATH / "params.yaml"

<% } -%>