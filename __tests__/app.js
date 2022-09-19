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
        projectDescription: "Project Description"
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
});
