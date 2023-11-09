# Streamlit

This folder contains all the code for the project [Streamlit](https://streamlit.io/) web app.

## Running the Streamlit app

To run the Streamlit app, run the following command from the root of the project:
```bash
streamlit run "src/streamlit_app/🏠_Home_page.py"
```
or
```bash
make start-streamlit-app
```

## Add a new Streamlit page

To add a new page, create a new python file in the `pages` folder.
The file name should contain:
- the order of the page in the sidebar
- an emoji to make the sidebar more visual
- the name of the page (with underscores instead of spaces)

Here is a template to start a new page:

```python
"""Streamlit page."""
import streamlit as st

from src.streamlit_app.utils.set_page_config import set_page_config


def main() -> None:
    """Main function of the page."""
    set_page_config()
    st.title("Page title")


if __name__ == "__main__":
    main()
```
