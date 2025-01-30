"use strict";
const assert = require("yeoman-assert");
const { exec } = require("child_process");
const helpers = require("yeoman-test");
const path = require("path");

jest.setTimeout(180000); // 3 minutes timeout for poetry lock command

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
const DVC_FILES_PATHS = [
  ".dvcignore",
  ".dvc/config",
  ".dvc/.gitignore",
  "params.yaml",
  "src/params.py"
];
const STREAMLIT_FILES_PATHS = ["src/streamlit_app"];
const DVC_STREAMLIT_UTILS_FILES_PATHS = [
  "src/utils/dvc_utils.py",
  "src/streamlit_app/utils/selectors.py",
  "tests/utils/test_dvc_utils.py",
  "tests/streamlit_app/utils/test_selectors.py"
];
const DVC_STREAMLIT_EXAMPLE_FILES_PATHS = [
  "src/scripts/generate_random_number.py",
  "dvc.yaml",
  "src/streamlit_app/pages/1_📊_DVC_+_Streamlit_example.py"
];

const PROJECT_NAME = "Sicarator Test";
const PROJECT_SLUG = "sicarator-test";
const LAST_PYTHON_VERSION = "3.11.6";
const TERRAFORM_BACKEND_BUCKET_NAME = "terraform-backend-bucket-name";
const AWS_ACCOUNT_ID = "1234567890";
const AWS_REGION = "us-east-1";
const GCP_PROJECT_ID = "gcp-project-id";
const GCP_REGION = "us-west1";

const DEFAULT_ANSWERS = {
  packageManager: "pyenv + poetry",
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
  includeStreamlit: true,
  includeDvcStreamlitUtils: true,
  includeDvcStreamlitExample: true
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
const UV_PACKAGE_MANAGER_ANSWERS = {
  packageManager: "astral/uv"
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
      description: "uv package manager",
      ...DEFAULT_ANSWERS,
      ...UV_PACKAGE_MANAGER_ANSWERS
    },
    {
      description: "Python 3.10 (all options & AWS infra)",
      ...DEFAULT_ANSWERS,
      ...ALL_OPTIONS_EXCEPT_INFRA_ANSWERS,
      ...AWS_INFRA_ANSWERS,
      pythonVersion: "3.10.11"
    }
  ])(
    "Generate project with $description",
    ({
      packageManager,
      pythonVersion,
      includeApi,
      apiInfrastructure,
      includeDvc,
      includeStreamlit,
      includeDvcStreamlitUtils,
      includeDvcStreamlitExample,
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
            packageManager,
            pythonVersion,
            includeApi,
            apiInfrastructure,
            includeDvc,
            includeStreamlit,
            includeDvcStreamlitUtils,
            includeDvcStreamlitExample,
            includeHelloWorld,
            awsRegion,
            awsAccountId,
            terraformBackendBucketName
          })
          .withLocalConfig({})
          .on("end", () => {
            exec("make install", defaultCallback(done));
          });
      });

      afterAll(done => {
        let cleanVirtualenvCommand =
          packageManager === "pyenv + poetry"
            ? `pyenv virtualenv-delete --force ${PROJECT_SLUG}`
            : "rm -rf .venv/";
        exec(cleanVirtualenvCommand, defaultCallback(done));
      });

      it("creates common files", () => {
        assert.file(COMMON_FILES_PATHS);
      });

      it("creates lock file", () => {
        let lockfile =
          packageManager === "pyenv + poetry" ? "poetry.lock" : "uv.lock";
        assert.file(lockfile);
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

      it("creates DVC + Streamlit utils files when needed", () => {
        if (includeDvcStreamlitUtils) {
          assert.file(DVC_STREAMLIT_UTILS_FILES_PATHS);
        } else {
          assert.noFile(DVC_STREAMLIT_UTILS_FILES_PATHS);
        }
      });

      it("creates DVC + Streamlit example files when needed", () => {
        if (includeDvcStreamlitExample) {
          assert.file(DVC_STREAMLIT_EXAMPLE_FILES_PATHS);
        } else {
          assert.noFile(DVC_STREAMLIT_EXAMPLE_FILES_PATHS);
        }
      });

      it("creates hello-world files when needed", () => {
        if (includeHelloWorld) {
          assert.file(HELLO_WORLD_FILES_PATHS);
        } else {
          assert.noFile(HELLO_WORLD_FILES_PATHS);
        }
      });

      it("has correct project slug", () => {
        assert.fileContent("pyproject.toml", `name = "${PROJECT_SLUG}"`);
      });

      it("has correct Python version", () => {
        if (packageManager === "pyenv + poetry") {
          assert.fileContent("pyproject.toml", `python = "${pythonVersion}"`);
        } else {
          assert.fileContent("pyproject.toml", `python = "==${pythonVersion}"`);
        }
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
          execInVenv("make test", packageManager, defaultCallback(done));
        } else {
          // No tests to run
          done();
        }
      });

      it("runs linter successfully", done => {
        execInVenv("make lint-check", packageManager, defaultCallback(done));
      });

      it("runs type checking successfully", done => {
        execInVenv("make type-check", packageManager, defaultCallback(done));
      });

      it("runs formatting check successfully", done => {
        execInVenv("make format-check", packageManager, defaultCallback(done));
      });
    }
  );
});

function execInVenv(command, packageManager, callback) {
  if (packageManager === "pyenv + poetry") {
    execInPyenvVenv(command, callback);
  } else {
    exec(command, { env: { ...process.env } }, (error, stdout, stderr) => {
      callback(error, stdout, stderr);
    });
  }
}

function execInPyenvVenv(command, callback) {
  // Execute 'pyenv prefix' command to get the venv path
  exec("pyenv prefix", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing pyenv prefix: ${error}`);
      return callback(error, null, null);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return callback(new Error(stderr), null, null);
    }

    // Trim the new line or white space from the end of the output
    const pyenvPrefix = stdout.trim();

    // Set the VIRTUAL_ENV environment variable to the pyenv prefix and execute the provided command
    exec(
      command,
      {
        env: {
          ...process.env,
          VIRTUAL_ENV: pyenvPrefix
        }
      },
      (error, stdout, stderr) => {
        callback(error, stdout, stderr);
      }
    );
  });
}

function defaultCallback(done) {
  return (error, stdout, stderr) => {
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
  };
}
