import chalk from 'chalk';
import debug from 'debug';

import { ConnectionParams } from './ssh';
import conf from './conf';
import * as inquirer from './inquirer';
const dd = debug('Cluster');

export interface Cluster {
  name: string;
  type: string;
  runningOn: string;
  requiresSSH: string;
  accessMethod: string;
  uri: string;
  host: string;
  ssl: string;
  username: string;
  password: string;
  authenticationDatabase: string;
  sshConnection: ConnectionParams;
}

export class ClusterManager {
  public static showClusters() {
    this.getClusters().forEach((cluster: Cluster, index: number) => {
      console.log(`${chalk.bold.cyan(`Cluster #${index}`)}
        ${chalk.cyan('Name:')} ${chalk.magenta(cluster.name)}
        ${chalk.cyan('Uri:')} ${chalk.magenta(cluster.uri)}
        ${chalk.cyan('Host:')} ${chalk.magenta(cluster.host)}
        ${chalk.cyan('SSL:')} ${chalk.magenta(cluster.ssl)}
        ${chalk.cyan('Username:')} ${chalk.magenta(cluster.username)}
        ${chalk.cyan('Password:')} ${chalk.magenta(cluster.password)}
        ${chalk.cyan('authenticationDatabase:')} ${chalk.magenta(
        cluster.authenticationDatabase
      )}
      `);
    });
  }
  public static async create() {
    const cluster = await inquirer.askMongoCluster();

    const clusters = conf.get('clusters') || [];

    clusters.push(cluster);

    conf.set({ clusters });

    return cluster;
  }
  public static async getCluster() {
    const clusters = conf.get('clusters') || [];

    if (!clusters.length) {
      const newCluster = this.create();

      dd('getCluster create %o', newCluster);

      return newCluster;
    }

    const { clusterName } = await inquirer.selectCluster(clusters);

    const cluster = clusters.find((c: Cluster) => c.name === clusterName);

    dd('getCluster %o', cluster);

    return cluster;
  }
  private static getClusters() {
    return conf.get('clusters') || [];
  }
}
