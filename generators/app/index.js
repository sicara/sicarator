"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");

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
        message: `Which python version do yo want to use?\n${chalk.yellow(
          "/!\\"
        )} Older versions are not recommended unless your project has some specific requirements.`,
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
        name: "includeHelloWorld",
        message:
          "Include 'hello world' function and unit test? (warning: if 'no', CI testing step will fail due to empty tests)",
        type: "confirm",
        default: true
      }
    ]);
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.answers.projectName) {
      this.log(`${chalk.green("create folder")} ${this.answers.projectName}`);
      mkdirp.sync(this.answers.projectName);
      this.destinationRoot(this.destinationPath(this.answers.projectName));
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("common"),
      this.destinationPath(),
      this.answers,
      {},
      { globOptions: { dot: true } }
    );

    this.fs.copy(
      this.templatePath("gitignore/gitignore"),
      this.destinationPath(".gitignore")
    );

    this.fs.copyTpl(
      this.templatePath("python_version/" + this.answers.pythonVersion),
      this.destinationPath(),
      this.answers,
      {},
      { globOptions: { dot: true } }
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

    if (this.answers.includeHelloWorld) {
      this.fs.copy(this.templatePath("hello_world"), this.destinationPath());
    }
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
