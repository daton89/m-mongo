#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

// import github from "./lib/github";
// import repo from "./lib/repo";
// import files from "./lib/files";

import * as settings from './lib/settings';
import * as mongodump from './lib/mongodump';
import * as mongorestore from './lib/mongorestore';
import { ClusterManager } from './lib/cluster';
import {
  ADD_CLUSTER,
  SHOW_CLUSTERS,
  DUMP,
  SET_STORAGE_PATH,
  ADD_SSH_CONNECTION,
  RUN_SSH_COMMAND,
  EXIT,
  RESTORE
} from './lib/actions';

clear();
console.log(
  chalk.yellow(figlet.textSync('m-mongo', { horizontalLayout: 'full' }))
);

// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }

// We need the mongodump bin into our path
// TODO: check mongobump bin availability otherwise download it
// https://www.mongodb.com/download-center/community

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
        await ClusterManager.create();
        break;
      case SHOW_CLUSTERS:
        ClusterManager.showClusters();
        break;
      case DUMP:
        await mongodump.start();
        break;
      case RESTORE:
        await mongorestore.start();
        break;
      case EXIT:
        console.log(chalk.cyan(`Bye bye! ${process.env.USERNAME}`));
        process.exit();
        break;
      default:
        console.log(chalk.yellow(`action ${choise.action} not found!`));
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
