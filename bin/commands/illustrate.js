var fs = require("fs");
const { spawn, exec } = require("child_process");
const open = require("open");
const sqlite3 = require("sqlite3").verbose();
const chalk = require("chalk");

function generate_illustrations(file_name, commit_hashes) {
  // run illustration for each given commit
  for (const commit of commit_hashes) {
    //console.log(commit);
    illustrate_file(file_name, commit);
  }
}

function illustrate_file(file_name, commit_hash) {
  //retrieve the binary file from the commit hash and file name
  console.log(illustrate_file, commit_hash)
  var selected_file = commit_hash + ":" + file_name;
  var clip_arr = [];


  try {
    var pointer = spawn("git", ["cat-file", "blob", selected_file]);
    var smudge_data = spawn("git", ["lfs", "smudge"]);
    // obtain commit hash from pointer and pipe it into the git lfs smudge to get binary
    pointer.stdout.pipe(smudge_data.stdin);

    smudge_data.stdout.on("data", function (data) {
      clip_arr.push(data);
    });

    smudge_data.on("error", function (err) {
      console.log(err);
    });
    // on exit concat all buffers and locate index where sqlite database located
    smudge_data.on("exit", function (err) {
      var arr_buff = Buffer.concat(clip_arr);
      try {
        create_db(arr_buff, commit_hash);
      } catch (err) {
        console.log("exception: " + err);
      }
    });
  } catch (err) {
    console.log("exception: " + err);
  }
}

function create_db(arr_buff, commit_hash) {
  // retrieve the index of the database from the buffer and create the sqlite database
  const db_name = "sample.db";
  const index = arr_buff.indexOf("SQLite format 3");
  
  if (index !== -1) {
    let sqlite = arr_buff.slice(index);

    try {
      fs.writeFileSync(`./clip_files/${db_name}`, sqlite);

      query_db(db_name, commit_hash);
      
      get_layer_info(db_name, commit_hash);
    } catch (err) {
      console.log(err);
    }
  }
}

function query_db(db_name, commit_hash) {
  // query the database for the png image
  const db = new sqlite3.Database(`./clip_files/${db_name}`);
  if (db) {
    const sample_img = `${commit_hash}.png`;
    db.serialize(() => {
      db.all("select ImageData from CanvasPreview", (error, rows) => {
        fs.writeFileSync(`./clip_files/${sample_img}`, rows[0].ImageData);
      });
    });

    db.close();
  } else {
    console.log("Database could not be initialized");
  }

  try {
    //open the image in preview
    console.log(chalk.blue(`Opening png for commit : ${commit_hash}...`));
    open(`./clip_files/${commit_hash}.png`);
  } catch (err) {
    console.log(err);
  }
}

function get_layer_info(db_name, commit_hash) {

  // get information on layers in clip studio file
  const db = new sqlite3.Database(`./clip_files/${db_name}`);
  if (db) {
    db.serialize(() => {
      db.all(
        "SELECT LayerUuid, _PW_ID, LayerName, LayerOpacity, LayerVisibility, LayerFolder FROM Layer",
        (error, rows) => {
          console.log(chalk.yellow(`Displaying layer info for commit ${commit_hash}`))
          //console.log(chalk.green(rows));
          console.log(chalk.green(require('util').inspect(rows, {colors:true, depth:null})));
        }
      );
    });

    db.close();
  } else {
    console.log("Database could not be initialized");
  }
}



module.exports = {
  generate_illustrations: generate_illustrations,
};
