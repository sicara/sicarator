"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-sicarator:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        projectName: "project-name",
        projectDescription: "Project Description",
        pythonVersion: "3.9.13" // Python version depends on the docker image of CI
      })
      .withLocalConfig({});
  });

  it("creates README.md", () => {
    assert.file(["README.md"]);
  });

  it("creates .gitignore", () => {
    assert.file([".gitignore"]);
  });

  it("creates .yo-rc.json", () => {
    assert.file([".yo-rc.json"]);
  });

  it("creates correct poetry files", () => {
    assert.file(["poetry.lock", "pyproject.toml"]);
    assert.fileContent("pyproject.toml", 'python = "3.9.13"');
  });
});
