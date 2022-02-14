var fs = require("fs");
const { spawn, exec, execSync } = require("child_process");
const open = require("open");
const sqlite3 = require("sqlite3").verbose();

function initialize(remote_origin) {
  console.log(remote_origin);
  execSync('git init', { stdio: 'ignore' });
  execSync('git lfs track "*.clip"', { stdio: 'ignore' });
  execSync('git add .gitattributes', { stdio: 'ignore' });
  execSync('git add .', { stdio: 'ignore' });
  execSync(`git commit -m "first commit"`, { stdio: 'ignore' });
  execSync('git branch -M main', { stdio: 'ignore' });
  execSync(`git remote add origin ${remote_origin}`, { stdio: 'ignore' });
  execSync(`git push -u origin main`, { stdio: 'ignore' });
  
//https://github.com/ishsen/clip-git.git


}
function update(options) {
  console.log(options);
  //updates files when saved
}



function create_dir() {
  //check to see if git file exists
  var log = exec(
    `git rev-parse --is-inside-work-tree`,
    function (err, stdout, stderr) {
      if (stderr) {
        console.log("Can't find a Git repository in the directory");
      } else {
        if (stdout) {
          const dir = "clip";
          if (!dirExists()) {
            fs.mkdirSync(dir);
            console.log("Initialized directory for png files");
          }
        }
      }
    }
  );
}

function search_dir(options) {
  console.log(options)

  if (!options.file && !options.commits) {
      console.log('No arguments inputted')
  }

  if (options.file && options.commits) {

    var log = exec(`git rev-parse ${options.file}:${options.commits}`, function (err, stdout, stderr) {
        if (stderr) {
          console.log("Can't find a Git repository in the directory");
        } else {
          console.log(stdout);
        }
      });
  } else if (!options.file) {

    var log = exec(`git log -- ${options.commits}`, function (err, stdout, stderr) {
        if (stderr) {
          console.log("Can't find a Git repository in the directory");
        } else {
          console.log(stdout);
        }
      });
  } else {
    var log = exec(
      `git ls-files *.clip`,
      function (err, stdout, stderr) {
        if (stderr) {
          console.log("Can't find a Git repository in the directory");
        } else {
          console.log(stdout);
        }
      }
    );
  }

  
 
}

function show_illustration(file_name, commit_hash) {
  // if commit hash  = head do something
  var selected_file = commit_hash[0] + ":" + file_name;
  var clip_arr = [];
  var pointer = spawn("git", ["cat-file", "blob", selected_file]);
  var smudge_data = spawn("git", ["lfs", "smudge"]);

  pointer.stdout.pipe(smudge_data.stdin);

  smudge_data.stdout.on("data", function (data) {
    clip_arr.push(data);
  });

  smudge_data.on("exit", function (err) {
    var arr_buff = Buffer.concat(clip_arr);
    createDB(arr_buff, commit_hash[0]);
  });
}

function createDB(arr_buff, commit_hash) {
  const db_name = "sample.db";
  const index = arr_buff.indexOf("SQLite format 3");
  console.log(index);
  if (index !== -1) {
    let sqlite = arr_buff.slice(index);

    fs.writeFileSync(`./clip/${db_name}`, sqlite);

    queryDB(db_name, commit_hash);
  }
}

function queryDB(db_name, commit_hash) {
  const db = new sqlite3.Database(`./clip/${db_name}`);
  if (db) {
    const sample_img = `${commit_hash}.png`;
    db.serialize(() => {
      db.all("select ImageData from CanvasPreview", (error, rows) => {
        fs.writeFileSync(`./clip/${sample_img}`, rows[0].ImageData);
      });
    });

    db.close();
  }

  open(`./clip/${commit_hash}.png`, { wait: false });
}

function dirExists(dir_name) {
  return fs.existsSync(dir_name);
}

function clear_dir() {
  const dir = "./clip";
  try {
    fs.rmdirSync(dir, { recursive: true });

    console.log(`${dir} is deleted!`);
  } catch (err) {
    console.error(`Error while deleting ${dir}.`);
  }
}

//errors for database and options and args
//test to get index of file

module.exports = {
  createDir: create_dir,
  searchDir: search_dir,
  clearDir: clear_dir,
  showIllustration: show_illustration,
  update: update,
  initialize, initialize
};
