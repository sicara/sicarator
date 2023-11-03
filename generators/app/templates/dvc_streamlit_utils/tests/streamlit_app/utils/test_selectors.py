from unittest.mock import patch

from streamlit.testing.v1 import AppTest

from src.streamlit_app.utils import selectors


def call_select_revision():
    # tested function must contain import, see https://docs.streamlit.io/library/api-reference/app-testing/st.testing.v1.apptest#apptestfrom_function
    from src.streamlit_app.utils import selectors

    selectors.select_revision()


class TestSelectRevision:
    @staticmethod
    @patch.object(selectors, "get_dvc_experiments", return_value=["exp_1", "exp_2"])
    def test_select_revision_with_selectbox(get_dvc_experiments_mock):
        app_test = AppTest.from_function(call_select_revision)
        app_test.run()

        get_dvc_experiments_mock.assert_called_once_with()
        assert not app_test.exception
        assert len(app_test.text_input) == 0
        assert len(app_test.selectbox) == 1
        assert app_test.selectbox[0].options == ["", "HEAD", "main", "exp_1", "exp_2"]

    @staticmethod
    def test_select_revision_with_text_input():
        app_test = AppTest.from_function(call_select_revision)
        app_test.run()

        app_test.checkbox[0].check().run()

        assert not app_test.exception
        assert len(app_test.text_input) == 1
        assert len(app_test.selectbox) == 0


def call_select_revisions():
    # tested function must contain import, see https://docs.streamlit.io/library/api-reference/app-testing/st.testing.v1.apptest#apptestfrom_function
    from src.streamlit_app.utils import selectors

    selectors.select_revisions()


class TestSelectRevisions:
    @staticmethod
    @patch.object(selectors, "get_dvc_experiments", return_value=["exp_1", "exp_2"])
    def test_select_revisions_with_multiselect(get_dvc_experiments_mock):
        app_test = AppTest.from_function(call_select_revisions)
        app_test.run()

        get_dvc_experiments_mock.assert_called_once_with()
        assert not app_test.exception
        assert len(app_test.text_input) == 0
        assert len(app_test.multiselect) == 1
        assert app_test.multiselect[0].options == ["", "HEAD", "main", "exp_1", "exp_2"]
        assert not app_test.multiselect[0].disabled
        assert app_test.multiselect[0].value == []

    @staticmethod
    @patch.object(
        selectors, "get_dvc_experiments", return_value=["exp_a1", "exp_a2", "exp_b1"]
    )
    def test_select_revisions_with_regex(get_dvc_experiments_mock):
        app_test = AppTest.from_function(call_select_revisions)
        app_test.run()

        get_dvc_experiments_mock.assert_called_once_with()

        app_test.checkbox[0].check().run()

        assert not app_test.exception
        assert len(app_test.text_input) == 1
        assert len(app_test.multiselect) == 0

        app_test.text_input[0].input("exp_a.*").run()

        assert not app_test.exception
        assert len(app_test.multiselect) == 1
        assert app_test.multiselect[0].disabled
        assert app_test.multiselect[0].value == ["exp_a1", "exp_a2"]
