import chalk from 'chalk';
import debug from 'debug';

import { Cluster } from '../cluster';
import Restore from './restore';
import RestoreContainer from './restore_container';
import * as mongodump from '../mongodump';
import * as mongo from '../mongo';

const dd = debug('restore:start')

export async function start() {
  const dumps: string[] = mongodump.getDumps();

  dd('dumps :: %o', dumps);

  if (!dumps.length) {
    console.log(chalk.yellow(`You don't have any dump yet! Let's create one!`));
    await mongodump.exec();
    console.log(chalk.green(`Super! We have a dump!`));
    console.log(chalk.yellow(`Let's start back from where we left!`));
    console.log(chalk.cyan(`Going back to Restore...`));
  }

  const cluster: Cluster = await mongo.getCluster();

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