"""Selectors to be used in Streamlit pages."""
import re

import streamlit as st

from src.utils.dvc_utils import get_dvc_experiments

DEFAULT_GIT_REVISIONS = [
    "",  # current workspace
    "HEAD",
    "main",
]

EMPTY_REVISION_HELP_TEXT = "Empty revision means current workspace."


def select_revision(
    label: str = "Revision name:",
) -> str:
    """Select a Git revision with a select box or a text input in sidebar.

    Suggested revisions are "" (current workspace), "HEAD", "main" and all local DVC
    experiments.

    Args:
        label: text input label

    Returns:
        selected revision value
    """
    with st.sidebar:
        st.subheader("Select revision")
        use_custom_text = st.checkbox(
            "Custom text",
            help="Custom text can be used for Git branches, tags, commit hashes, etc.",
        )
        selected_revision: str | None
        if use_custom_text:
            selected_revision = st.text_input(
                label=label,
                help=EMPTY_REVISION_HELP_TEXT,
            )
            return selected_revision

        experiments_list = get_dvc_experiments()

        selected_revision = st.selectbox(
            label=label,
            options=[*DEFAULT_GIT_REVISIONS, *experiments_list],
            index=0,
            placeholder="Choose a revision",
            help=EMPTY_REVISION_HELP_TEXT,
        )

        return selected_revision or ""


def select_revisions() -> list[str]:
    """Select several Git revisions with a multi-select or a regex input in sidebar.

    Possible revisions are "" (current workspace), "HEAD", "main" and all local DVC
        experiments.

    Returns:
        list of selected revision names
    """
    with st.sidebar:
        st.subheader("Select revisions")
        use_regex = st.checkbox("Search with regex")
        available_revisions = [
            *DEFAULT_GIT_REVISIONS,
            *get_dvc_experiments(),
        ]
        if use_regex:
            regex = st.text_input("Enter regex")
            if regex:
                revisions = list(filter(re.compile(regex).search, available_revisions))
                st.multiselect(
                    "Selected revisions", available_revisions, revisions, disabled=True
                )
            else:
                revisions = []
        else:
            revisions = st.multiselect(
                label="Selected revisions",
                options=available_revisions,
                placeholder="Choose revisions",
                help=EMPTY_REVISION_HELP_TEXT,
            )
    return revisions
