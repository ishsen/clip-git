const { exec } = require("child_process");
const chalk = require("chalk");
const { split_lines, generate_output, is_empty } = require("./utils");

function scan_directory(options) {
  // Scans directory for commits with specific file if not given --all flag
  // Follows all files if given all flag
  console.log(options);
  if (is_empty(options)) {
    exec(`git log`, function (stdin, stdout, stderr) {
      generate_output(stdout, stderr);
    });
  } else if (options.s) {
    exec(`git log --follow -- ${options.s}`, function (stdin, stdout, stderr) {
      console.log(chalk["blue"]("Commits for " + options.s));
      generate_output(stdout, stderr);
    });
  } else {
    if (options.all) {
      exec(`git ls-files *.clip`, function (stdin, stdout, stderr) {
        if (stderr) {
          console.log(stderr);
        } else {
          const files = split_lines(stdout).filter((n) => n);

          files.map((file) => {
            console.log(chalk["blue"]("Commits for " + file));

            exec(
              `git log --follow -- ${file}`,
              function (stdin, stdout, stderr) {
                generate_output(stdout, stderr);

                //get all commits for a specific file
              }
            );
          });
        }
      });
    }
  }


}

module.exports = {
  scan_directory: scan_directory,
};
