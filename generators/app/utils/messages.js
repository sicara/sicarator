"use strict";
const chalk = require("chalk");

function message(text, lineBreak = false, indentation = 0, icon = "") {
  const lineBreakString = lineBreak ? "\n" : "";
  const indentationString = " ".repeat(indentation);
  const iconString = icon ? `${icon} ` : "";
  return `${lineBreakString}${indentationString}${iconString}${chalk.reset(
    text
  )}`;
}

function mainMessage(text, lineBreak = false, indentation = 0) {
  return message(chalk.bold.underline(text), lineBreak, indentation);
}

function infoMessage(text, lineBreak = true, indentation = 0) {
  return message(chalk.yellowBright(text), lineBreak, indentation, "💡");
}

function warningMessage(text, lineBreak = true, indentation = 0) {
  return message(chalk.redBright(text), lineBreak, indentation, "🚨️️");
}

function costMessage(text, lineBreak = true, indentation = 0) {
  return message(chalk.blueBright(text), lineBreak, indentation, "💎");
}

module.exports = { mainMessage, infoMessage, warningMessage, costMessage };
