const { execSync } = require("child_process");
const chalk = require("chalk");
function update_file(file_name) {
  console.log(file_name)
  //updates files after a saved in clip studio
  try {
    console.log(chalk.green(`Uploading update version of ${file_name}...`));
    //execSync('git lfs track "*.clip"', { stdio: "ignore" });
    //execSync('git add .gitattributes', { stdio: 'ignore' });
    execSync(`git add ${file_name}`, { stdio: "ignore" });
    execSync(`git commit -m "updated commit"`, { stdio: "ignore" });
    execSync(`git push -u origin main`, { stdio: "ignore" });
    console.log(chalk.green(`Finished update`));
  } catch (err) {
    console.log(chalk.red("A problem occurred during upload"));
    console.log(err)
  }
}

module.exports = {
  update_file: update_file,
};
