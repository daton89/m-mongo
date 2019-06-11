#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

// import github from "./lib/github";
// import repo from "./lib/repo";
// import files from "./lib/files";

import {
  ADD_CLUSTER,
  SHOW_CLUSTERS,
  DUMP,
  SET_STORAGE_PATH,
  ADD_SSH_CONNECTION,
  RUN_SSH_COMMAND,
  DUMP_OVER_SSH,
  EXIT
} from './lib/actions';
import * as mongo from './lib/mongo';
import * as settings from './lib/settings';

clear();
console.log(
  chalk.yellow(figlet.textSync('m-mongo', { horizontalLayout: 'full' }))
);

// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }

const run = async () => {
  try {
    const choise = await settings.showMainMenu();

    switch (choise.action) {
      case ADD_SSH_CONNECTION:
        await settings.setSshConnection();
        break;
      case RUN_SSH_COMMAND:
        await settings.runSshCommand();
        break;
      case SET_STORAGE_PATH:
        await settings.setStoragePath();
        break;
      case ADD_CLUSTER:
        await mongo.setMongoCluster();
        break;
      case SHOW_CLUSTERS:
        mongo.showClusters();
        break;
      case DUMP:
        await mongo.execDump();
        break;
      case DUMP_OVER_SSH:
        await mongo.dumpOverSsh();
        break;
      case EXIT:
        clear();
        console.log(chalk.cyan(`Bye bye!`));
        process.exit();
        break;
      default:
        await restart();
        break;
    }
    await restart();
  } catch (err) {
    console.error(err);
  }
};

async function restart() {
  const { action } = await settings.showRestartOrExit();

  if ('Restart' === action) {
    clear();
    run();
  }

  if ('Exit' === action) process.exit();
}

run();
