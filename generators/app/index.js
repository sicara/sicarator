"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Hi, I'm ${chalk.red(
          "Sicarator"
        )}! I'm going to help you to set up your new project!`
      )
    );

    const prompts = [
      {
        name: "projectName",
        message: "What's the name of your project?",
        default: path.basename(process.cwd())
      },
      {
        name: "projectDescription",
        message: "Describe it in one line:"
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(`${chalk.green("create folder")} ${this.props.projectName}.`);
      mkdirp.sync(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription
      },
      {},
      { globOptions: { dot: true } }
    );
  }
};
