import chalk from 'chalk';
import debug from 'debug';

import { Cluster, ClusterManager } from '../cluster';
import Restore from './restore';
import RestoreContainer from './restore_container';
import Dump from '../mongodump/dump';
import * as mainDump from '../mongodump';

const dd = debug('restore:start');

export async function start() {
  const cluster: Cluster = await ClusterManager.getCluster();

  const dumps: string[] = await Dump.getDumps();

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

// export async function exec() {
//   const cluster: Cluster = await mongo.getCluster();

//   if (cluster.runningOn === 'Docker Container') {
//     if (cluster.requiresSSH === 'Yes') {
//       await restoreInContainerOverSsh(cluster);
//     } else {
//       await restoreInContainer(cluster);
//     }
//   }
//   if (cluster.runningOn === 'Cloud Platform') {
//     await restore(cluster);
//   }
// }
