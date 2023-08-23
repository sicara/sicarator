"""Test that each Streamlit page can be imported and run."""
from importlib import import_module
from pathlib import Path

import pytest

PROJECT_ROOT_PATH = Path(__file__).parent.parent.parent

STREAMLIT_PAGES = [
    f"src.streamlit_app.pages.{page.stem}"
    for page in (PROJECT_ROOT_PATH / "src" / "streamlit_app" / "pages").iterdir()
    if page.name.endswith(".py")
]


@pytest.mark.parametrize("page", STREAMLIT_PAGES)
def test_streamlit_page(page: str) -> None:
    """Test that each page can be imported and run."""
    if page.endswith("__init__"):
        return
    page_module = import_module(page)
    page_module.main()
