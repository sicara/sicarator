"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

jest.setTimeout(60000); // 1 minute timeout for poetry lock command

const PYTHON_VERSION = "3.11.3"; // Should match the version used in the CI (see .circleci/config.yml)

const COMMON_FILES_PATHS = [
  "src",
  "tests",
  ".pre-commit-config.yaml",
  "Makefile",
  "pyproject.toml",
  "README.md"
];
const HELLO_WORLD_FILES_PATHS = [
  "src/hello_world.py",
  "tests/test_hello_world.py"
];
const API_FILES_PATHS = [
  "src/api",
  "tests/api",
  "Dockerfile",
  "docker-compose.yml"
];
const TERRAFORM_FILES_PATHS = ["terraform", "docs/architecture.png"];
const DVC_FILES_PATHS = [".dvcignore", ".dvc/config", ".dvc/.gitignore"];

describe("generator-sicarator:app", () => {
  describe("Sicarator with default answers", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({
          projectName: "project-name",
          pythonVersion: PYTHON_VERSION,
          includeApi: false,
          includeHelloWorld: true,
          includeDvc: false
        })
        .withLocalConfig({});
    });

    it("creates common files", () => {
      assert.file(COMMON_FILES_PATHS);
    });

    it("creates poetry.lock", () => {
      assert.file("poetry.lock");
    });

    it("creates .gitignore", () => {
      assert.file(".gitignore");
    });

    it("creates .yo-rc.json", () => {
      assert.file(".yo-rc.json");
    });

    it("creates hello-world files", () => {
      assert.file(HELLO_WORLD_FILES_PATHS);
    });

    it("does not create API files", () => {
      assert.noFile(API_FILES_PATHS);
    });

    it("does not create DVC files", () => {
      assert.noFile(DVC_FILES_PATHS);
    });

    it("creates .git folder", () => {
      assert.file(".git");
    });

    it("has correct Python version", () => {
      assert.fileContent("pyproject.toml", `python = "${PYTHON_VERSION}"`);
    });
  });
  describe("Sicarator with API, without Terraform", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({
          projectName: "project-name",
          pythonVersion: PYTHON_VERSION,
          includeApi: true,
          includeAWSInfrastructureCodeForApi: false,
          includeDvc: false
        })
        .withLocalConfig({});
    });

    it("creates common files", () => {
      assert.file(COMMON_FILES_PATHS);
    });

    it("creates poetry.lock", () => {
      assert.file("poetry.lock");
    });

    it("does not create hello-world files", () => {
      assert.noFile(HELLO_WORLD_FILES_PATHS);
    });

    it("creates API files", () => {
      assert.file(API_FILES_PATHS);
    });

    it("does not create terraform files", () => {
      assert.noFile(TERRAFORM_FILES_PATHS);
    });
  });
  describe("Sicarator with API and Terraform", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({
          projectName: "project-name",
          pythonVersion: PYTHON_VERSION,
          includeApi: true,
          includeAWSInfrastructureCodeForApi: true,
          terraformBackendBucketName: "terraform-backend-bucket-name",
          awsRegion: "eu-west-1",
          awsAccountId: "1234567890",
          includeNatGateway: true,
          includeDvc: false
        })
        .withLocalConfig({});
    });

    it("creates common files", () => {
      assert.file(COMMON_FILES_PATHS);
    });

    it("creates poetry.lock", () => {
      assert.file("poetry.lock");
    });

    it("does not create hello-world files", () => {
      assert.noFile(HELLO_WORLD_FILES_PATHS);
    });

    it("creates API files", () => {
      assert.file(API_FILES_PATHS);
    });

    it("creates terraform files", () => {
      assert.file(TERRAFORM_FILES_PATHS);
    });

    it("has correct terraform backend bucket name", () => {
      assert.fileContent(
        "terraform/backend.tf",
        'bucket  = "terraform-backend-bucket-name"'
      );
    });

    it("has correct AWS account URL", () => {
      assert.fileContent(
        "Makefile",
        "AWS_ACCOUNT_URL=1234567890.dkr.ecr.eu-west-1.amazonaws.com"
      );
    });
  });
  describe("Sicarator with DVC", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({
          projectName: "project-name",
          pythonVersion: PYTHON_VERSION,
          includeDvc: true
        })
        .withLocalConfig({});
    });

    it("creates common files", () => {
      assert.file(COMMON_FILES_PATHS);
    });

    it("creates poetry.lock", () => {
      assert.file("poetry.lock");
    });

    it("creates DVC files", () => {
      assert.file(DVC_FILES_PATHS);
    });
  });
});
