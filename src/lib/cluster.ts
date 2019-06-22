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
  authEnabled: boolean;
  username?: string;
  password?: string;
  authenticationDatabase?: string;
  sshConnection?: ConnectionParams;
}

export class ClusterManager {
  public static showClusters() {
    this.getClusters().forEach((cluster: Cluster, index: number) => {
      const { cyan, magenta } = chalk;
      console.log(`${chalk.bold.cyan(`Cluster #${index}`)}
        ${cyan('Name:')} ${magenta(cluster.name)}
        ${cyan('Uri:')} ${magenta(cluster.uri)}
        ${cyan('Host:')} ${magenta(cluster.host)}
        ${cyan('SSL:')} ${magenta(cluster.ssl)}
        ${cyan('Username:')} ${magenta(cluster.username || '')}
        ${cyan('Password:')} ${magenta(cluster.password || '')}
        ${cyan('authenticationDatabase:')} ${magenta(
        cluster.authenticationDatabase || ''
      )}
      `);
    });
  }
  public static async create() {
    const cluster = await inquirer.askMongoCluster();

    if (cluster.requiresSSH === 'Yes') {
      const {
        useExistingSshConnection
      } = await inquirer.useExistingSshConnection();

      if (useExistingSshConnection) {
        const sshConnections: ConnectionParams[] =
          conf.get('sshConnections') || [];

        const { connectionHost } = await inquirer.selectSshConnection(
          sshConnections
        );

        const sshConnection = sshConnections.find(
          conn => conn.host === connectionHost
        );

        // tslint:disable-next-line: no-object-mutation
        if (sshConnection) cluster.sshConnection = sshConnection;
      } else {
        const sshConnection = await inquirer.askSshConnection();

        // tslint:disable-next-line: no-object-mutation
        cluster.sshConnection = sshConnection;
      }
    }

    const clusters = conf.get('clusters') || [];

    clusters.push(cluster);

    conf.set({ clusters });

    return cluster;
  }
  public static async getCluster() {
    const clusters = this.getClusters();

    if (!clusters.length) {
      const newCluster = this.create();

      dd('getCluster create %o', newCluster);

      return newCluster;
    }

    const { clusterName } = await inquirer.selectCluster(clusters);

    const cluster = clusters.find(({ name }) => name === clusterName);

    dd('getCluster %o', cluster);

    if (!cluster) throw new Error('Cluster not found');

    return cluster;
  }
  private static getClusters(): Cluster[] {
    return conf.get('clusters') || [];
  }
}
