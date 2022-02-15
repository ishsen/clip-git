const { generate_illustrations } = require("./commands/illustrate");
const { initialize_studio } = require("./commands/initialize");
const { update_file } = require("./commands/update");
const { remove_directory } = require("./commands/clear");
const { scan_directory } = require("./commands/scan");

//errors for database and options and args
//test to get index of file

module.exports = {
  scan_directory: scan_directory,
  remove_directory: remove_directory,
  generate_illustrations: generate_illustrations,
  update_file: update_file,
  initialize_studio: initialize_studio,
};
