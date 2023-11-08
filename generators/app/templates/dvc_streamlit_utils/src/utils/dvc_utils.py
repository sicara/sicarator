"""Utils to manage DVC experiments and tracked files."""
from pathlib import Path
from typing import Any

import dvc.repo
from dvc.api import open as original_dvc_open
from dvc.api.data import _OpenContextManager

from src.constants import PROJECT_ROOT_PATH

DVC_REPO = dvc.repo.Repo()


def get_dvc_experiments() -> list[str]:
    """Get the list of local DVC experiments."""
    experiments_list = DVC_REPO.experiments.ls(all_commits=True)
    return [
        experiment_name
        for experiments_group in experiments_list.values()
        for experiment_name, commit_hash in experiments_group
    ]


def dvc_open(
    path: Path,
    rev: str | None = None,
    **kwargs: Any,
) -> _OpenContextManager:
    """Open a file from DVC using the dvc.api.open function.

    This function is a wrapper around dvc.api.open that:
     - allows using relative and absolute paths (the original `dvc.api.open` only allows
        relative paths, see https://github.com/iterative/dvc/issues/8038).
     - takes a Path object as input instead of a string.

    Args:
        path: path to the file to open
        rev: git revision to use by dvc
        kwargs: additional arguments to pass to `dvc.api.open`
    """
    return original_dvc_open(
        str(get_relative_path_without_failure(path)),
        rev=rev,
        **kwargs,
    )


def get_relative_path_without_failure(path: Path) -> Path:
    """Turn an absolute path into a relative path from the project root path.

    If the input path does not start with the project root path, return the path as is.

    Args:
        path: the absolute path to get the relative path from.

    Returns:
        the relative path from the project root path.
    """
    try:
        return path.relative_to(PROJECT_ROOT_PATH)
    except ValueError:
        return path
