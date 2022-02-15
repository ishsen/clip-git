#! /usr/bin/env node

const { Command } = require("commander");
const utils = require("./commands.js");

const program = new Command();


//general information for cli tool
program
  .name("studio")
  .description(
    "Quickly display versions of CLIP STUDIO PAINT files in Git LFS directory"
  );


//commands that can executed with the studio tool
program
  .command("init")
  .description("Initialize folder for png images of .clip files")
  .action(utils.initialize_studio);

program
  .command("scan")
  .option("-s <file>", "Get commits for single file")
  .option("-a, --all", "Get commits for each .clip file in directory")
  .description("Searches git log for commits with .clip files")
  .action(utils.scan_directory);


program
  .command("remove")
  .description("Removes folder sqlite database and png images")
  .action(utils.remove_directory);

program
  .command("display")
  .argument("<file>", "CLIP STUDIO PAINT file in that hash")
  .argument(
    "<commits...>",
    "Hash of commit you would like to get illustration from"
  )
  .option("-l, --layers", "Get layer info from commit(s)")
  .description("Searches git log for specific .clip file")
  .action(utils.generate_illustrations);

program
  .command("update")
  .argument("<file>", "File name that you want to update")
  .description("Adds commit for specific .clip file after saved")
  .action(utils.update_file);



program.parse();
