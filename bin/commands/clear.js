var fs = require("fs");
const { dir } = require("./utils");

function remove_directory() {

  //clears directory with png files and databases
  
  try {
    fs.rmdirSync(dir, { recursive: true });

    console.log(`${dir} is deleted!`);
  } catch (err) {
    console.error(`Error while deleting ${dir}.`);
  }
}

module.exports = {
  remove_directory: remove_directory,
};
