from pydantic import BaseModel  # pylint:disable=no-name-in-module # false positive


class ExampleAPIInput(BaseModel):
    dummy: str

