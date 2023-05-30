"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");
const slugify = require("slugify");

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
        )}! I'm going to help you to set up your new project!`
      )
    );

    this.answers = await this.prompt([
      {
        name: "projectName",
        message: `Project name?
💡 Should be short, but can contain any character ; to be used in the README.md, etc.`,
        default: this.config.get("projectName") || path.basename(process.cwd())
      },
      {
        name: "projectSlug",
        message: `Project slug?
💡 Should contain only lowercase letters, numbers and hyphens (-) ; to be used in URLs, etc.`,
        default: ({ projectName }) =>
          this.config.get("projectSlug") || strictlySlugify(projectName),
        // Transform in real time without trimming
        transformer: projectName => strictlySlugify(projectName, false),
        // Transform in the end with trimming
        filter: strictlySlugify
      },
      {
        name: "projectDescription",
        message: "Project description in one line?",
        default:
          this.config.get("projectDescription") ||
          "Project generated with Sicarator"
      },
      {
        name: "authorName",
        message: "The author's name?",
        default: this.user.git.name(),
        store: true
      },
      {
        name: "authorEmail",
        message: "The author's email?",
        default: this.user.git.email(),
        store: true
      },
      {
        name: "pythonVersion",
        message: `Which Python version do yo want to use?
🚨️ Older versions are not recommended unless your project has some specific requirements.
💡 You can check their compatibility with the main Python packages on https://pyreadiness.org/.
💡 If the chosen version is not installed on your machine, it will be automatically installed by PyEnv.`,
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
        message: "Which CI (Continuous Integration) tool do you want to use?",
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
      {
        name: "includeApi",
        message: `Include an API?
💡 It will be built with FastAPI and containerized with Docker.`,
        type: "confirm",
        default: false,
        store: true
      },
      {
        when: ({ includeApi }) => !includeApi,
        name: "includeHelloWorld",
        message: `Include 'hello world' function and unit test?
🚨️ If 'no', CI testing step will fail due to empty tests`,
        type: "confirm",
        default: true,
        store: true
      },
      {
        when: ({ includeApi }) => includeApi,
        name: "includeAWSInfrastructureCodeForApi",
        message: `Include Terraform code to provision the API infrastructure on AWS?
💡 Stack main components: API Gateway, ASG, ECS, EC2.
💰 Cost: ~16$/month + price of the EC2 instances (~38$/month for one t2.medium instance).`,
        type: "confirm",
        default: false,
        store: true
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "terraformBackendBucketName",
        message: `Name of the S3 bucket that will be used to store Terraform state?
💡 You can create the bucket later, and update the backend configuration file (backend.tf) accordingly if needed.`,
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
        message:
          "AWS region in which you want to provision your infrastructure?",
        default: "eu-west-3",
        store: true
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "awsAccountId",
        message: `ID of your AWS account?
💡 Keep it blank if you don't have it yet: you can update the AWS_ACCOUNT_URL variable in the Makefile once you know it.`,
        default: this.config.get("awsAccountId") || "",
        filter: awsAccountId => awsAccountId || "*your-aws-account-id*"
      },
      {
        when: ({ includeAWSInfrastructureCodeForApi }) =>
          includeAWSInfrastructureCodeForApi,
        name: "includeNatGateway",
        message: `Include a NAT Gateway to allow the API instance to access internet?
💰 Extra cost: ~32$/month.`,
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
      "awsAccountId"
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
      {},
      { globOptions: { dot: true } }
    );

    this.fs.copy(
      this.templatePath("gitignore/gitignore"),
      this.destinationPath(".gitignore")
    );

    if (this.answers.ci !== null) {
      this.fs.copyTpl(
        this.templatePath(path.join("ci", this.answers.ci)),
        this.destinationPath(this.answers.ci),
        this.answers,
        {},
        { globOptions: { dot: true } }
      );
    }

    if (this.answers.includeApi) {
      this.fs.copyTpl(
        this.templatePath("api"),
        this.destinationPath(),
        this.answers,
        {},
        { globOptions: { dot: true } }
      );
      if (this.answers.includeAWSInfrastructureCodeForApi) {
        this.fs.copyTpl(
          this.templatePath("terraform"),
          this.destinationPath(),
          this.answers,
          {},
          { globOptions: { dot: true } }
        );
      }
    }

    if (this.answers.includeHelloWorld) {
      this.fs.copy(this.templatePath("hello_world"), this.destinationPath());
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
    // A ".yo-rc.json" file may have been created at the starting path during the prompting step instead of the inside of the generated project.
    if (this.fs.exists(this.destinationPath(path.join("..", ".yo-rc.json")))) {
      this.fs.move(
        this.destinationPath(path.join("..", ".yo-rc.json")),
        this.destinationPath(".yo-rc.json")
      );
    }
  }
};
