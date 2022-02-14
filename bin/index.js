#! /usr/bin/env node

const { Command } = require("commander");

const utils = require("./utils.js");

const program = new Command();

program
  .name("clip-git")
  .description(
    "Quick display for versions of CLIP STUDIO PAINT FIlES in Git LFS directory"
  );

program
  .command("init")
  .description("Initialize folder for png images of .clip files")
  .action(utils.createDir);

program
  .command("search")
 
  .option("-f, --file", "search for files with .clip in git log")
  .option("-c, --commits <filename>", "search for commits with file")
  .description("Searches git log for specific .clip file")
  .action(utils.searchDir);
//files and commits number them

program
  .command("clear")
  .description("Removes folder sqlite database and png images")
  .action(utils.clearDir);

program
  .command("show")
  .argument("<file>", "CLIP STUDIO PAINT file in that hash")
  .argument(
    "<commits...>",
    "Hash of commit you would like to get illustration from"
  )
  .description("Searches git log for specific .clip file")
  .action(utils.showIllustration);

program
  .command("update")
  .argument("<files>", "update files")
  .description("Adds commit for specific .clip file after save")
  .action(utils.update);

program
  .command("create")
  .argument("<remote_origin>", "remote origin to upload to github")
  .description("Initialize git directory")
  .action(utils.initialize);

program.parse();
