var fs = require("fs");
const dir = "clip_files";
const chalk = require("chalk");

function directory_exists() {
  return fs.existsSync(dir);
}

function create_directory() {
  fs.mkdirSync(dir);
  console.log(
    chalk.green("Initialized directory for png files and sqlite database")
  );
}

function generate_output(stdout, stderr) {
  if (stderr) {
    console.log(stderr);
  } else {
    split_lines(stdout).map((line) => {
      if (contains(line, "commit ")) {
        console.log(chalk.green(line));
      } else {
        console.log(chalk.yellow(line));
      }
    });
  }
}

function is_empty(obj) {
  return Object.keys(obj).length === 0;
}

const split_lines = (str) => str.split(/\r?\n/);

const contains = (str, wrd) => str.includes(wrd);

module.exports = {
  create_directory: create_directory,
  directory_exists: directory_exists,
  generate_output: generate_output,
  split_lines: split_lines,
  contains: contains,
  is_empty: is_empty,
  dir: dir,
};
