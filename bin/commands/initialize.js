var fs = require("fs");
const { directory_exists, create_directory } = require("./utils");
const { exec } = require("child_process");
const chalk = require("chalk");

function initialize_studio() {
  // check to see if inside a git directory
  // initialize a folder to store png files if inside a directory

  exec(`git rev-parse --is-inside-work-tree`, function (stdin, stdout, stderr) {
    if (stderr) {
      console.log(chalk.red("Can't find a Git repository in the directory"));
    } else {
      if (stdout) {
        if (!directory_exists()) {
            create_directory()
        }
        else {
            console.log(chalk.green('Directory for files already created'))
        }
      }
    }
  });
}

module.exports = {
   initialize_studio: initialize_studio
}
