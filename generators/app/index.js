"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");
const slugify = require("slugify");

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
        message: "What's the name of your project?",
        default: path.basename(process.cwd())
      },
      {
        name: "projectDescription",
        message: "Describe it in one line:",
        store: true
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
        message: `Which python version do yo want to use?
💡 If the chosen version is not installed on your machine, it will be automatically installed by PyEnv.
🚨️ Older versions are not recommended unless your project has some specific requirements.`,
        type: "list",
        default: "3.10.6",
        choices: [
          {
            name: "3.10.6",
            value: "3.10.6"
          },
          {
            name: "3.9.13 (not recommended)",
            value: "3.9.13"
          },
          {
            name: "3.8.13 (not recommended)",
            value: "3.8.13"
          },
          {
            name: "3.7.13 (not recommended)",
            value: "3.7.13"
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
        message:
          "Include an API? (it will be built with FastAPI and containerized with Docker)",
        type: "confirm",
        default: false,
        store: true
      }
    ]);
    if (this.answers.includeApi) {
      this.answers = {
        ...this.answers,
        includeHelloWorld: false,
        ...(await this.prompt([
          {
            name: "includeAWSTerraformCodeForApi",
            message:
              "Include Terraform code to deploy API on AWS (stack main components: ESG, ECS, EC2)?",
            type: "confirm",
            default: false,
            store: true
          }
        ]))
      };
    } else {
      this.answers = {
        ...this.answers,
        includeAWSTerraformCodeForApi: false,
        ...(await this.prompt([
          {
            name: "includeHelloWorld",
            message:
              "Include 'hello world' function and unit test? (warning: if 'no', CI testing step will fail due to empty tests)",
            type: "confirm",
            default: true,
            store: true
          }
        ]))
      };
    }

    if (this.answers.includeAWSTerraformCodeForApi) {
      this.answers = {
        ...this.answers,
        ...(await this.prompt([
          {
            name: "terraformBackendBucketName",
            message:
              "What is the name of the S3 bucket that will be used to store Terraform state? (you can create it later)",
            default: `${slugify(this.answers.projectName, {
              lower: true,
              strict: "_" // Removes "_"
            })}-terraform-state`
          },
          {
            name: "AwsRegion",
            message:
              "In which AWS region do you want to deploy your infrastructure?",
            store: true,
            default: "eu-west-3"
          },
          {
            name: "AwsAccountId",
            message: "What is the id of your AWS account?",
            store: true
          }
        ]))
      };
    }
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.answers.projectName) {
      this.log(`${chalk.green("create folder")} ${this.answers.projectName}`);
      mkdirp.sync(this.answers.projectName);
      this.destinationRoot(this.destinationPath(this.answers.projectName));
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
      if (this.answers.includeAWSTerraformCodeForApi) {
        this.fs.copyTpl(
          this.templatePath("terraform"),
          this.destinationPath("terraform"),
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

    this.spawnCommandSync("poetry", ["lock"]);
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
