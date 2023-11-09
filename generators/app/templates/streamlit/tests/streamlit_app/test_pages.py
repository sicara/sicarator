"""Test that each Streamlit page can be run."""
import pytest
from streamlit.testing.v1 import AppTest

from src.constants import PROJECT_ROOT_PATH

STREAMLIT_APP_PATH = PROJECT_ROOT_PATH / "src" / "streamlit_app"

STREAMLIT_PAGES_PATHS = [STREAMLIT_APP_PATH / "🏠_Home_page.py"] + [
    page_path
    for page_path in (STREAMLIT_APP_PATH / "pages").iterdir()
    if page_path.name.endswith(".py") and page_path.name != "__init__.py"
]


@pytest.mark.parametrize("page_path", STREAMLIT_PAGES_PATHS)
def test_streamlit_page(page_path: str) -> None:
    app_test = AppTest.from_file(str(page_path))
    app_test.run()

    assert not app_test.exception
