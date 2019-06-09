#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
// import github from "./lib/github";
// import repo from "./lib/repo";
// import files from "./lib/files";
import {
  ADD_CLUSTER, SHOW_CLUSTERS, DUMP, SET_STORAGE_PATH
} from "./lib/actions"
import * as mongo from "./lib/mongo";

clear();
console.log(
  chalk.yellow(figlet.textSync("m-mongo", { horizontalLayout: "full" }))
);

// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }

const run = async () => {
  try {
    const choise = await mongo.showMainMenu()

    switch (choise.action) {
      case SET_STORAGE_PATH:
          await mongo.setStoragePath()
        break;
      case ADD_CLUSTER:
          await mongo.setMongoCluster()
        break;
      case SHOW_CLUSTERS:
          console.log(mongo.getClusters())
        break;
      case DUMP:
          await mongo.execDump()
        break;

      default:
          process.exit()
        break;
    }

  } catch (err) {
    console.error(err);
  }
};


run();
