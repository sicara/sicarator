"use strict";
const chalk = require("chalk");

function mainMessage(text) {
  return `${chalk.underline(text)}`;
}

function infoMessage(text) {
  return `\n💡 ${chalk.yellow(text)}`;
}

function warningMessage(text) {
  return `\n🚨️️ ${chalk.red(text)}`;
}

function costMessage(text) {
  return `\n💎 ${chalk.blue(text)}`;
}

module.exports = { mainMessage, infoMessage, warningMessage, costMessage };
