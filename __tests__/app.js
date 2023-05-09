"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

const COMMON_FILES_PATHS = [
  "README.md",
  ".gitignore",
  ".yo-rc.json",
  "poetry.lock",
  "pyproject.toml"
];
const HELLO_WORLD_FILES_PATHS = [
  "src/hello_world.py",
  "tests/test_hello_world.py"
];
const API_FILES_PATHS = [
  "src/api/main.py",
  "src/api/types.py",
  "tests/api/test_main.py",
  "Dockerfile"
];

describe("generator-sicarator:app", () => {
  describe("Sicarator with default answers", () => {
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

    it("creates common files", () => {
      assert.file(COMMON_FILES_PATHS);
    });

    it("creates hello-world files", () => {
      assert.file(HELLO_WORLD_FILES_PATHS);
    });

    it("does not create API files", () => {
      assert.noFile(API_FILES_PATHS);
    });

    it("has correct Python version", () => {
      assert.fileContent("pyproject.toml", 'python = "3.9.13"');
    });
  });
  describe("Sicarator with includeApi set to true", () => {
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

    it("creates common files", () => {
      assert.file(COMMON_FILES_PATHS);
    });

    it("does not create hello-world files", () => {
      assert.noFile(HELLO_WORLD_FILES_PATHS);
    });

    it("creates API files", () => {
      assert.file(API_FILES_PATHS);
    });

    it("has correct Python version", () => {
      assert.fileContent("pyproject.toml", 'python = "3.9.13"');
    });
  });
});
