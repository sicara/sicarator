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
  "src/api",
  "tests/api",
  "Dockerfile",
  "docker-compose.yml"
];
const TERRAFORM_FILES_PATHS = ["terraform", "docs/architecture.png"];

describe("generator-sicarator:app", () => {
  describe("Sicarator with default answers", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({
          projectName: "project-name",
          projectDescription: "Project Description",
          pythonVersion: "3.9.13", // Python version depends on the docker image of CI
          includeApi: false,
          includeHelloWorld: true
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
  describe("Sicarator with API, without Terraform", () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts({
          projectName: "project-name",
          projectDescription: "Project Description",
          pythonVersion: "3.9.13", // Python version depends on the docker image of CI
          includeApi: true,
          includeAWSInfrastructureCodeForApi: false
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
          projectDescription: "Project Description",
          pythonVersion: "3.9.13", // Python version depends on the docker image of CI
          includeApi: true,
          includeAWSInfrastructureCodeForApi: true,
          terraformBackendBucketName: "terraform-backend-bucket-name",
          awsRegion: "eu-west-1",
          awsAccountId: "1234567890",
          includeNatGateway: true
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
});
