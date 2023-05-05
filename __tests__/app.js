"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-sicarator:app:defaults", () => {
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

  it("creates hello-world files", () => {
    assert.file(["src/hello_world.py", "tests/test_hello_world.py"]);
  });

  it("does not create API files", () => {
    assert.noFile([
      "src/api/main.py",
      "src/api/types.py",
      "tests/api/test_main.py"
    ]);
  });

  it("creates correct poetry files", () => {
    assert.file(["poetry.lock", "pyproject.toml"]);
    assert.fileContent("pyproject.toml", 'python = "3.9.13"');
  });
});

describe("generator-sicarator:app:includeApi", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        projectName: "project-name",
        projectDescription: "Project Description",
        pythonVersion: "3.9.13", // Python version depends on the docker image of CI
        includeApi: true
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

  it("does not create hello-world files", () => {
    assert.noFile(["src/hello_world.py", "tests/test_hello_world.py"]);
  });

  it("creates API files", () => {
    assert.file([
      "src/api/main.py",
      "src/api/types.py",
      "tests/api/test_main.py"
    ]);
  });

  it("creates correct poetry files", () => {
    assert.file(["poetry.lock", "pyproject.toml"]);
    assert.fileContent("pyproject.toml", 'python = "3.9.13"');
  });
});
