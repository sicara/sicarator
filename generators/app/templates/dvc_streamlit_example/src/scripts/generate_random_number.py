"""Script to generate a random number.

Used as an example for the DVC pipeline and the DVC + Streamlit example page.
TODO: remove this script.
"""

import random
from pathlib import Path
from typing import Annotated

import typer
import yaml
from loguru import logger

from src.params import RANDOM_SEED


def generate_random_number(
    output_path: Annotated[Path, typer.Option()],
) -> None:  # pragma: no cover
    """Generate a random number between 0 and 1 and save it to a yaml file.

    Args:
        output_path: path to the output yaml file.
    """
    random.seed(RANDOM_SEED)
    random_number = random.random()
    logger.info(f"Random number: {random_number}")
    logger.info(f"Saving random number to {output_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as output_file:
        yaml.dump(random_number, output_file)


if __name__ == "__main__":
    typer.run(generate_random_number)
