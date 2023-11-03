from pathlib import Path
from unittest.mock import patch

from src.constants import PROJECT_ROOT_PATH
from src.utils import dvc_utils


class TestGetDvcExperiments:
    @staticmethod
    @patch.object(
        dvc_utils.DVC_REPO.experiments,
        "ls",
        return_value={
            "commit_a": [("exp_a1", "hash_a1")],
            "commit_b": [("exp_b1", "hash_b1"), ("exp_b2", "hash_b2")],
        },
    )
    def test_get_dvc_experiments(dvc_repo_experiments_ls_mock):
        experiments = dvc_utils.get_dvc_experiments()

        dvc_repo_experiments_ls_mock.assert_called_once_with(all_commits=True)
        assert experiments == ["exp_a1", "exp_b1", "exp_b2"]


class TestDvcOpen:
    @staticmethod
    @patch.object(dvc_utils, "original_dvc_open")
    @patch.object(dvc_utils, "get_relative_path_without_failure")
    def test_call_original_dvc_open(
        get_relative_path_without_failure_mock, original_dvc_open_mock
    ):
        path = Path("test.file")
        revision = "test_revision"

        dvc_utils.dvc_open(path, revision)

        get_relative_path_without_failure_mock.assert_called_once_with(path)
        original_dvc_open_mock.assert_called_once_with(
            str(get_relative_path_without_failure_mock()),
            rev=revision,
        )


class TestGetRelativePathWithoutFailure:
    @staticmethod
    def test_get_relative_path_inside_project():
        absolute_path = PROJECT_ROOT_PATH / "subdir" / "test.file"

        output_path = dvc_utils.get_relative_path_without_failure(absolute_path)

        assert output_path == Path("subdir") / "test.file"

    @staticmethod
    def test_keep_relative_path_unchanged():
        relative_path = Path("subdir") / "test.file"

        output_path = dvc_utils.get_relative_path_without_failure(relative_path)

        assert output_path == relative_path
