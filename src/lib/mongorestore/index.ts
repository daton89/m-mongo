import chalk from 'chalk';
import debug from 'debug';

import { Cluster, ClusterManager } from '../cluster';
import Restore from './restore';
import RestoreContainer from './restore_container';

import { DumpMaker, Dump } from '../mongodump/dump';
import * as mainDump from '../mongodump';

const dd = debug('restore:start');

export async function start() {
  // TODO: getCluster inside the Restore constructor
  const cluster: Cluster = await ClusterManager.getCluster();

  const dumps: Dump[] = DumpMaker.getDumps();

  dd('dumps :: %o', dumps);

  if (!dumps.length) {
    console.log(chalk.yellow(`You don't have any dump yet! Let's create one!`));
    await mainDump.start();
    console.log(chalk.green(`Super! We now have a dump!`));
    console.log(chalk.yellow(`Let's start back from where we left!`));
    console.log(chalk.cyan(`Going back to Restore...`));
  }

  if (cluster.runningOn === 'Docker Container') {
    const restore = new RestoreContainer(cluster, dumps);
    await restore.exec();
  }

  if (cluster.runningOn === 'Cloud Provider') {
    const restore = new Restore(cluster, dumps);
    await restore.exec();
  }

  if (cluster.runningOn === 'Localhost') {
    const restore = new Restore(cluster, dumps);
    await restore.exec();
  }
}
