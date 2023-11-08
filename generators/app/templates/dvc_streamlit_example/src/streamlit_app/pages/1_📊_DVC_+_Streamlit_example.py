"""DVC + Streamlit example page.

TODO: replace this page with your own "DVC + Streamlit" analysis dashboard.
"""
from pathlib import Path

import streamlit as st
import yaml

from src.constants import PARAMETERS_YAML_PATH
from src.streamlit_app.utils.selectors import select_revisions
from src.streamlit_app.utils.set_page_config import set_page_config
from src.utils.dvc_utils import dvc_open

DATA_PATH = Path("data")
GENERATED_NUMBER_PATH = DATA_PATH / "generate_random_number" / "random_number.yaml"


def main() -> None:
    """DVC + Streamlit example."""
    set_page_config()
    st.title("DVC + Streamlit example")
    st.info(
        "This example shows how to use DVC + Streamlit utils (`src/utils/dvc_utils.py` "
        "and `src/streamlit_app/utils/selectors.py`) to compare and analyse results of "
        "different DVC experiments or Git revisions.\n"
        "- Run `dvc repro` to reproduce the example pipeline; then, select empty "
        "revision (= current workspace) in the sidebar to see the results.\n"
        "- Run `dvc exp run --name test_seed_42 --set-param random_seed=42` to "
        "generate a new experiment, refresh this page and select the experiment in the"
        "sidebar to see the results.",
        icon="ℹ️",  # noqa: RUF001 (false positive with emoji)
    )
    with st.expander(
        "💡 Once you've understood how it works, you can delete following code...",
    ):
        st.markdown(
            "- Example pipeline in `dvc.yaml`\n"
            "- `dvc.lock`\n"
            "- `src/scripts/generate_random_number.py`\n"
            "- `random_seed` parameter in `params.yaml` and `params.py`\n"
            "- `data/generate_random_number/`\n"
            "- `src/streamlit_app/pages/1_📊_DVC_+_Streamlit_example.py`\n"
        )
    revisions = select_revisions()

    for revision in revisions:
        with dvc_open(PARAMETERS_YAML_PATH, rev=revision) as parameters_yaml:
            parameters = yaml.safe_load(parameters_yaml)
        with dvc_open(GENERATED_NUMBER_PATH, rev=revision) as generated_number_yaml:
            generated_number = yaml.safe_load(generated_number_yaml)
        st.markdown(f"## {revision}")
        st.text("Parameters:")
        st.write(parameters)
        st.metric("Generated number", generated_number)


if __name__ == "__main__":
    main()
