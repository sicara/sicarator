"""Python wrapper for params.yaml file.

We're using a YAML file (params.yaml) to write parameters so that they can be tracked
with DVC.
The Python file (params.py) allows to easily import these parameters in Python code.

Note: DVC also allows to directly track parameters from a `params.py` file, but it's
experimental and has some known issues (https://github.com/iterative/dvc/issues/6974).
"""

from pathlib import Path

import yaml

from src.constants import PARAMETERS_YAML_PATH

with Path.open(PARAMETERS_YAML_PATH) as parameters_yaml:
    PARAMETERS = yaml.safe_load(parameters_yaml)
<% if (includeStreamlit && includeDvcStreamlitUtils && includeDvcStreamlitExample) { -%>

# Used as an example param for the DVC pipeline and the DVC + Streamlit example page.
# TODO: remove this parameter if you don't need it.
RANDOM_SEED = PARAMETERS["random_seed"]
<% } -%>
