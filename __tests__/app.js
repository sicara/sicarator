"use strict";
const assert = require("yeoman-assert");
const { exec } = require("child_process");
const helpers = require("yeoman-test");
const path = require("path");

jest.setTimeout(60000); // 1 minute timeout for poetry lock command

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
const TERRAFORM_FILES_PATHS = ["terraform/main.tf", "terraform/variables.tf"]; // Not exhaustive
const DVC_FILES_PATHS = [".dvcignore", ".dvc/config", ".dvc/.gitignore"];
const STREAMLIT_FILES_PATHS = ["src/streamlit_app"];

const PROJECT_NAME = "Sicarator Test";
const PROJECT_SLUG = "sicarator-test";
const LAST_PYTHON_VERSION = "3.11.4";
const TERRAFORM_BACKEND_BUCKET_NAME = "terraform-backend-bucket-name";
const AWS_ACCOUNT_ID = "1234567890";
const AWS_REGION = "us-east-1";
const GCP_PROJECT_ID = "gcp-project-id";
const GCP_REGION = "us-west1";

const DEFAULT_ANSWERS = {
  pythonVersion: LAST_PYTHON_VERSION,
  includeApi: false,
  apiInfrastructure: null,
  includeDvc: false,
  includeStreamlit: false,
  includeHelloWorld: false,
  awsRegion: null,
  awsAccountId: null,
  terraformBackendBucketName: null
};
const ALL_OPTIONS_EXCEPT_INFRA_ANSWERS = {
  includeApi: true,
  includeDvc: true,
  includeStreamlit: true
};
const AWS_INFRA_ANSWERS = {
  terraformBackendBucketName: TERRAFORM_BACKEND_BUCKET_NAME,
  awsAccountId: AWS_ACCOUNT_ID,
  awsRegion: AWS_REGION
};
const GCP_INFRA_ANSWERS = {
  terraformBackendBucketName: TERRAFORM_BACKEND_BUCKET_NAME,
  gcpProjectId: GCP_PROJECT_ID,
  gcpRegion: GCP_REGION
};

describe("generator-sicarator:app", () => {
  describe.each([
    {
      description: "no option",
      ...DEFAULT_ANSWERS
    },
    {
      description: "API",
      ...DEFAULT_ANSWERS,
      includeApi: true
    },
    {
      description: "API & AWS infra",
      ...DEFAULT_ANSWERS,
      includeApi: true,
      ...AWS_INFRA_ANSWERS
    },
    {
      description: "API & GCP infra",
      ...DEFAULT_ANSWERS,
      includeApi: true,
      ...GCP_INFRA_ANSWERS
    },
    {
      description: "DVC",
      ...DEFAULT_ANSWERS,
      includeDvc: true
    },
    {
      description: "Streamlit",
      ...DEFAULT_ANSWERS,
      includeStreamlit: true
    },
    {
      description: "HelloWorld",
      ...DEFAULT_ANSWERS,
      includeHelloWorld: true
    },
    {
      description: "all options & AWS infra",
      ...DEFAULT_ANSWERS,
      ...ALL_OPTIONS_EXCEPT_INFRA_ANSWERS,
      ...AWS_INFRA_ANSWERS
    },
    {
      description: "all options & GCP infra",
      ...DEFAULT_ANSWERS,
      ...ALL_OPTIONS_EXCEPT_INFRA_ANSWERS,
      ...GCP_INFRA_ANSWERS
    },
    {
      description: "Python 3.10 (all options & AWS infra)",
      ...DEFAULT_ANSWERS,
      ...ALL_OPTIONS_EXCEPT_INFRA_ANSWERS,
      ...AWS_INFRA_ANSWERS,
      pythonVersion: "3.10.11"
    },
    {
      description: "Python 3.9 (all options & AWS infra)",
      ...DEFAULT_ANSWERS,
      ...ALL_OPTIONS_EXCEPT_INFRA_ANSWERS,
      ...AWS_INFRA_ANSWERS,
      pythonVersion: "3.9.16"
    },
    {
      description: "Python 3.8 (all options & AWS infra)",
      ...DEFAULT_ANSWERS,
      ...ALL_OPTIONS_EXCEPT_INFRA_ANSWERS,
      ...AWS_INFRA_ANSWERS,
      pythonVersion: "3.8.16"
    }
  ])(
    "Generate project with $description",
    ({
      pythonVersion,
      includeApi,
      apiInfrastructure,
      includeDvc,
      includeStreamlit,
      includeHelloWorld,
      awsRegion,
      awsAccountId,
      terraformBackendBucketName
    }) => {
      beforeAll(done => {
        helpers
          .run(path.join(__dirname, "../generators/app"))
          .withPrompts({
            projectName: PROJECT_NAME,
            pythonVersion,
            includeApi,
            apiInfrastructure,
            includeDvc,
            includeStreamlit,
            includeHelloWorld,
            awsRegion,
            awsAccountId,
            terraformBackendBucketName
          })
          .withLocalConfig({})
          .on("end", () => {
            exec("make install", (error, stdout, stderr) => {
              if (stdout) {
                console.log(`stdout:\n ${stdout}`);
              }

              if (stderr) {
                console.log(`stderr:\n ${stderr}`);
              }

              if (error) {
                done(error);
              } else {
                done();
              }
            });
          });
      });

      afterAll(done => {
        exec(
          `pyenv virtualenv-delete --force ${PROJECT_SLUG}`,
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(`stdout:\n ${stdout}`);
            }

            if (stderr) {
              console.log(`stderr:\n ${stderr}`);
            }

            if (error) {
              done(error);
            } else {
              done();
            }
          }
        );
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

      it("creates .git folder", () => {
        assert.file(".git");
      });

      it("creates .yo-rc.json", () => {
        assert.file(".yo-rc.json");
      });

      it("creates hello-world files when needed", () => {
        if (includeHelloWorld) {
          assert.file(HELLO_WORLD_FILES_PATHS);
        } else {
          assert.noFile(HELLO_WORLD_FILES_PATHS);
        }
      });

      it("creates API files when needed", () => {
        if (includeApi) {
          assert.file(API_FILES_PATHS);
        } else {
          assert.noFile(API_FILES_PATHS);
        }
      });

      it("creates API infrastructure code when needed", () => {
        if (apiInfrastructure === null) {
          assert.noFile(TERRAFORM_FILES_PATHS);
        } else {
          assert.file(TERRAFORM_FILES_PATHS);
        }
      });

      it("creates DVC files when needed", () => {
        if (includeDvc) {
          assert.file(DVC_FILES_PATHS);
        } else {
          assert.noFile(DVC_FILES_PATHS);
        }
      });

      it("creates Streamlit files when needed", () => {
        if (includeStreamlit) {
          assert.file(STREAMLIT_FILES_PATHS);
        } else {
          assert.noFile(STREAMLIT_FILES_PATHS);
        }
      });

      it("has correct project slug", () => {
        assert.fileContent("pyproject.toml", `name = "${PROJECT_SLUG}"`);
      });

      it("has correct Python version", () => {
        assert.fileContent("pyproject.toml", `python = "${pythonVersion}"`);
      });

      it("has correct terraform backend bucket name", () => {
        if (apiInfrastructure !== null) {
          assert.fileContent(
            "terraform/backend.tf",
            `bucket  = "${terraformBackendBucketName}"`
          );
        }
      });

      it("has correct AWS account URL", () => {
        if (apiInfrastructure === "aws") {
          assert.fileContent(
            "Makefile",
            `AWS_ACCOUNT_URL=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com`
          );
        }
      });

      it("has correct GCP project ID", () => {
        if (apiInfrastructure === "gcp") {
          assert.fileContent("Makefile", `GCP_PROJECT_ID=${GCP_PROJECT_ID}`);
          assert.fileContent(
            "terraform/variables.tf",
            `default     = "${GCP_PROJECT_ID}"`
          );
        }
      });

      it("runs unit tests successfully", done => {
        if (includeHelloWorld || includeApi || includeStreamlit) {
          exec("make test", (error, stdout, stderr) => {
            if (stdout) {
              console.log(`stdout:\n ${stdout}`);
            }

            if (stderr) {
              console.log(`stderr:\n ${stderr}`);
            }

            if (error) {
              done(error);
            } else {
              done();
            }
          });
        } else {
          // No tests to run
          done();
        }
      });

      it("runs linter successfully", done => {
        exec("make ruff", (error, stdout, stderr) => {
          if (stdout) {
            console.log(`stdout:\n ${stdout}`);
          }

          if (stderr) {
            console.log(`stderr:\n ${stderr}`);
          }

          if (error) {
            done(error);
          } else {
            done();
          }
        });
      });

      it("runs type checking successfully", done => {
        exec("make mypy", (error, stdout, stderr) => {
          if (stdout) {
            console.log(`stdout:\n ${stdout}`);
          }

          if (stderr) {
            console.log(`stderr:\n ${stderr}`);
          }

          if (error) {
            done(error);
          } else {
            done();
          }
        });
      });

      it("runs formatting check successfully", done => {
        exec("make black", (error, stdout, stderr) => {
          if (stdout) {
            console.log(`stdout:\n ${stdout}`);
          }

          if (stderr) {
            console.log(`stderr:\n ${stderr}`);
          }

          if (error) {
            done(error);
          } else {
            done();
          }
        });
      });
    }
  );
});
