"use strict";
const chalk = require("chalk");
const Generator = require("yeoman-generator");
const mkdirp = require("mkdirp");
const path = require("path");
const slugify = require("slugify");
const yosay = require("yosay");

const {
  mainMessage,
  infoMessage,
  warningMessage,
  costMessage
} = require("./utils/messages");

const TEMPLATE_OPTIONS = {};
const COPY_OPTIONS = { globOptions: { dot: true } };

function strictlySlugify(projectName, trim = true) {
  return slugify(projectName, {
    lower: true,
    strict: true,
    trim
  });
}

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Hi, I'm ${chalk.red(
          "Sicarator"
        )}! I'm going to help you set up your ${chalk.yellow("data project")}!`
      )
    );

    this.answers = await this.prompt([
      // Common
      {
        name: "projectName",
        message: `${mainMessage("Project name?")}${infoMessage(
          "Should be short, but can contain any character ; to be used in the README.md, etc."
        )}`,
        default: this.config.get("projectName") || path.basename(process.cwd())
      },
      {
        name: "projectSlug",
        message: `${mainMessage("Project slug?")}${infoMessage(
          "Should contain only lowercase letters, numbers and hyphens (-) ; to be used in URLs, etc."
        )}`,
        default: ({ projectName }) =>
          this.config.get("projectSlug") || strictlySlugify(projectName),
        // Transform in real time without trimming
        transformer: projectName => strictlySlugify(projectName, false),
        // Transform in the end with trimming
        filter: strictlySlugify
      },
      {
        name: "projectDescription",
        message: mainMessage("Project description in one line?"),
        default:
          this.config.get("projectDescription") ||
          "Project generated with Sicarator"
      },
      {
        name: "authorName",
        message: mainMessage("The author's name?"),
        default: this.user.git.name(),
        store: true
      },
      {
        name: "authorEmail",
        message: mainMessage("The author's email?"),
        default: this.user.git.email(),
        store: true
      },
      {
        name: "pythonVersion",
        message: `${mainMessage(
          "Which Python version do yo want to use?"
        )}${warningMessage(
          "Older versions are not recommended unless your project has some specific requirements"
        )}${infoMessage(
          "You can check their compatibility with the main Python packages on https://pyreadiness.org/."
        )}${infoMessage(
          "If the chosen version is not installed on your machine, it will be automatically installed by PyEnv."
        )}`,
        type: "list",
        default: "3.11.3",
        choices: [
          {
            name: "3.11.3",
            value: "3.11.3"
          },
          {
            name: "3.10.11 (not recommended)",
            value: "3.10.11"
          },
          {
            name: "3.9.16 (not recommended)",
            value: "3.9.16"
          },
          {
            name: "3.8.16 (not recommended)",
            value: "3.8.16"
          }
        ]
      },
      {
        name: "ci",
        message: mainMessage(
          "Which CI (Continuous Integration) tool do you want to use?"
        ),
        type: "list",
        default: ".circleci",
        choices: [
          {
            name: "CircleCI",
            value: ".circleci"
          },
          {
            name: "Gitlab CI/CD",
            value: ".gitlab-ci.yml"
          },
          {
            name: "GitHub Actions",
            value: ".github"
          },
          {
            name: "Azure Pipelines",
            value: ".azure-pipelines.yml"
          },
          {
            name: "None of these",
            value: null
          }
        ],
        store: true
      },

      // API
      {
        name: "includeApi",
        message: `${mainMessage("Include an API?")}${infoMessage(
          "It will be built with FastAPI and containerized with Docker."
        )}`,
        type: "confirm",
        default: false,
        store: true
      },

      // API infrastructure
      {
        when: ({ includeApi }) => includeApi,
        name: "includeAWSInfrastructureCodeForApi",
        message: `${mainMessage(
          "Include Terraform code to provision the API infrastructure on AWS?"
        )}${infoMessage(
          "Stack main components: API Gateway, ASG, ECS, EC2."
        )}${costMessage(
          "AWS costs: ~16$/month + price of the EC2 instances (~38$/month for one t2.medium instance)."
        )}`,
        type: "confirm",
        default: false,
        store: true
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "terraformBackendBucketName",
        message: `${mainMessage(
          "Name of the S3 bucket that will be used to store Terraform state?"
        )}${infoMessage(
          "You can create the bucket later, and update the backend configuration file (backend.tf) accordingly if needed."
        )}`,
        default: ({ projectSlug }) =>
          this.config.get("terraformBackendBucketName") ||
          `${projectSlug}-terraform-backend`,
        transformer: bucketName => strictlySlugify(bucketName, false),
        filter: strictlySlugify
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "awsRegion",
        message: mainMessage(
          "AWS region in which you want to provision your infrastructure?"
        ),
        default: "eu-west-3",
        store: true
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "awsAccountId",
        message: `${mainMessage("ID of your AWS account?")}${infoMessage(
          "Keep it blank if you don't have it yet: you can update the AWS_ACCOUNT_URL variable in the Makefile once you know it."
        )}`,
        default: this.config.get("awsAccountId") || "",
        filter: awsAccountId => awsAccountId || "*your-aws-account-id*"
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "includeNatGateway",
        message: `${mainMessage(
          "Include a NAT Gateway to allow the API instance to access internet?"
        )}${costMessage("Extra AWS cost: ~32$/month.")}`,
        type: "confirm",
        default: false,
        store: true
      },

      // Hello world code
      {
        when: ({ includeApi }) => !includeApi,
        name: "includeHelloWorld",
        message: `${mainMessage(
          "Include 'hello world' function and unit test?"
        )}${warningMessage(
          "If 'no', CI testing step will fail due to empty tests."
        )}`,
        type: "confirm",
        default: true,
        store: true
      },

      // DVC
      {
        name: "includeDvc",
        message: `${mainMessage("Include DVC on the project?")}${infoMessage(
          "This tool allows to version data files and create data pipelines (see https://dvc.org/)."
        )}${infoMessage("Strongly recommended for ML projects!")}`,
        type: "confirm",
        default: false,
        store: true
      },
      {
        when: ({ includeDvc }) => includeDvc,
        name: "dvcRemoteType",
        message: mainMessage("Which DVC remote type do you want to use?"),
        type: "list",
        default: "s3",
        choices: [
          {
            name: "AWS S3",
            value: "s3"
          },
          {
            name: "Google Cloud Storage",
            value: "gs"
          },
          {
            name: "Azure Blob Storage",
            value: "azure"
          },
          {
            name: "Other (not recommended ; need to be configured manually)",
            value: null
          }
        ],
        store: true
      },
      {
        when: ({ dvcRemoteType }) => dvcRemoteType,
        name: "dvcRemoteBucketName",
        message: ({ dvcRemoteType }) =>
          `${mainMessage("DVC remote bucket name?")}${infoMessage(
            "You can create the remote later, and update the DVC configuration file (.dvc/config) accordingly if needed."
          )}\n${dvcRemoteType}://`,
        default: ({ projectSlug }) =>
          this.config.get("dvcRemoteBucketName") || `${projectSlug}-dvc-remote`,
        transformer: bucketName => strictlySlugify(bucketName, false),
        filter: strictlySlugify
      },

      // Streamlit
      {
        name: "includeStreamlit",
        message: `${mainMessage(
          "Include Streamlit on the project?"
        )}${infoMessage(
          "This Python package allows to easily build interactive web apps for ML projects (see https://streamlit.io/)."
        )}${infoMessage(
          "Very useful to analyze data and model results, and to share them with non-technical people."
        )}`,
        type: "confirm",
        default: false,
        store: true
      }
    ]);

    // Save user answers without `store: true` to the local config file (.yo-rc.json)
    // Answers with `store: true` are indeed already saved to the local config file (as well as to the global config file).
    // Following answers don't have `store: true` because we don't want to save them to the global config file.
    [
      "projectName",
      "projectSlug",
      "projectDescription",
      "terraformBackendBucketName",
      "awsAccountId",
      "dvcRemoteBucketName"
    ].forEach(promptName => {
      if (this.answers[promptName]) {
        this.config.set(promptName, this.answers[promptName]);
      }
    });
  }

  default() {
    // If current directory is not the project name or the project slug, create a root folder named after the project slug
    if (
      path.basename(this.destinationPath()) !== this.answers.projectName &&
      path.basename(this.destinationPath()) !== this.answers.projectSlug
    ) {
      this.log(`${chalk.green("create folder")} ${this.answers.projectSlug}`);
      mkdirp.sync(this.answers.projectSlug);
      this.destinationRoot(this.destinationPath(this.answers.projectSlug));

      // A ".yo-rc.json" file may have been created at the starting path during the prompting step
      if (
        this.fs.exists(this.destinationPath(path.join("..", ".yo-rc.json")))
      ) {
        this.fs.move(
          this.destinationPath(path.join("..", ".yo-rc.json")),
          this.destinationPath(".yo-rc.json")
        );
      }
    }
  }

  writing() {
    let pythonMajorVersion = this.answers.pythonVersion
      .split(".")
      .slice(0, 2)
      .join(".");
    let pythonMajorVersionShortcut = pythonMajorVersion.replace(".", "");

    this.fs.copyTpl(
      this.templatePath("common"),
      this.destinationPath(),
      { ...this.answers, pythonMajorVersion, pythonMajorVersionShortcut },
      TEMPLATE_OPTIONS,
      COPY_OPTIONS
    );

    this.fs.copyTpl(
      this.templatePath("gitignore/gitignore"),
      this.destinationPath(".gitignore"),
      this.answers,
      TEMPLATE_OPTIONS,
      COPY_OPTIONS
    );

    if (this.answers.ci !== null) {
      this.fs.copyTpl(
        this.templatePath(path.join("ci", this.answers.ci)),
        this.destinationPath(this.answers.ci),
        this.answers,
        TEMPLATE_OPTIONS,
        COPY_OPTIONS
      );
    }

    if (this.answers.includeApi) {
      this.fs.copyTpl(
        this.templatePath("api"),
        this.destinationPath(),
        this.answers,
        TEMPLATE_OPTIONS,
        COPY_OPTIONS
      );
      if (this.answers.includeAWSInfrastructureCodeForApi) {
        this.fs.copyTpl(
          this.templatePath("terraform"),
          this.destinationPath(),
          this.answers,
          TEMPLATE_OPTIONS,
          COPY_OPTIONS
        );
      }
    }

    if (this.answers.includeHelloWorld) {
      this.fs.copyTpl(
        this.templatePath("hello_world"),
        this.destinationPath(),
        this.answers,
        TEMPLATE_OPTIONS,
        COPY_OPTIONS
      );
    }

    if (this.answers.includeDvc) {
      this.fs.copyTpl(
        this.templatePath("dvc"),
        this.destinationPath(),
        this.answers,
        TEMPLATE_OPTIONS,
        COPY_OPTIONS
      );
    }

    if (this.answers.includeStreamlit) {
      this.fs.copyTpl(
        this.templatePath("streamlit"),
        this.destinationPath(),
        this.answers,
        TEMPLATE_OPTIONS,
        COPY_OPTIONS
      );
    }
  }

  install() {
    this.spawnCommandSync("pyenv", [
      "install",
      this.answers.pythonVersion,
      "--skip-existing"
    ]);

    this.log("Generating Poetry lock file in a temporary virtual environment");
    this.spawnCommandSync("poetry", ["lock"], {
      env: {
        ...process.env,
        PYENV_VERSION: this.answers.pythonVersion, // Allow Poetry to find the correct Python version
        POETRY_VIRTUALENVS_IN_PROJECT: 1 // Allow to easily delete the .venv, see below
      }
    });
    // Delete Poetry environment, because the developer will create its own Pyenv environment when installing the project
    this.log("Deleting temporary virtual environment");
    this.spawnCommandSync("rm", ["-rf", ".venv"]);
  }

  end() {
    // Initialize git repository
    this.spawnCommandSync("git", ["init"]);

    // Create initial commit if there is no commit yet
    if (
      this.spawnCommandSync("git", ["rev-parse", "--verify", "HEAD"], {
        stdio: "ignore"
      }).status !== 0
    ) {
      this.spawnCommandSync("git", ["add", "."]);
      this.log("Creating initial commit");
      this.spawnCommandSync("git", [
        "commit",
        "--quiet",
        "--message",
        "Initial commit (generated by Sicarator)"
      ]);
    }
  }
};
