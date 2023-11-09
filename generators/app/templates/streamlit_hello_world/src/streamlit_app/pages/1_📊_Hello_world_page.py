"""Hello world! page of the Streamlit app.

TODO: replace this page with your own.
"""

import streamlit as st

from src.streamlit_app.utils.set_page_config import set_page_config


def main() -> None:
    """Print "Hello world!"."""
    set_page_config()
    st.title("Hello world! page")
    st.write("Hello world!")


if __name__ == "__main__":
    main()
