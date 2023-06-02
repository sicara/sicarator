"""Home page of the Streamlit app."""

import streamlit as st

from src.streamlit_app.utils.set_page_config import set_page_config


def main() -> None:
    """Home page of the Streamlit app."""
    st.title("Welcome to <%= projectName %>")
    st.write("Use the sidebar to navigate to different pages.")


if __name__ == "__main__":
    set_page_config()
    main()
