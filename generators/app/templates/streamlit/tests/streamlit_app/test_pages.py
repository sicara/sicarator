"""Test that each Streamlit page can be imported and run."""
from importlib import import_module

import pytest

from src.constants import PROJECT_ROOT_PATH

STREAMLIT_PAGES_DOTTED_PATHS = [
    f"src.streamlit_app.pages.{page_path.stem}"
    for page_path in (PROJECT_ROOT_PATH / "src" / "streamlit_app" / "pages").iterdir()
    if page_path.name.endswith(".py") and page_path.name != "__init__.py"
]


@pytest.mark.parametrize("page_dotted_path", STREAMLIT_PAGES_DOTTED_PATHS)
def test_streamlit_page(page_dotted_path: str) -> None:
    """Test that each page can be imported and run."""
    page_module = import_module(page_dotted_path)
    page_module.main()
