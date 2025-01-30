"""Util to set common page config to all streamlit pages."""

import streamlit as st

STREAMLIT_TITLE = "<%= projectName %>"


def set_page_config() -> None:
    """Set page config with wide layout and page title."""
    st.set_page_config(layout="wide", page_title=STREAMLIT_TITLE)
