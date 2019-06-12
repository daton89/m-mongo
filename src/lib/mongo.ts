import { Spinner } from 'clui';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
// import fs from 'fs';
// import path from 'path';

import { Cluster } from './cluster';
import * as inquirer from './inquirer';
import conf from './conf';
import * as ssh from './ssh';
// import spawn from './spawn';
// tslint:disable-next-line: no-duplicate-imports
// import { ConnectionParams } from './ssh';

export function showClusters() {
  const clusters: Cluster[] = conf.get('clusters');
  clusters.forEach((cluster: Cluster, index: number) => {
    console.log(`${chalk.bold.cyan(`Cluster #${index}`)}
      ${chalk.cyan('Name:')} ${chalk.bold.magenta(cluster.name)}
      ${chalk.cyan('Uri:')} ${chalk.bold.magenta(cluster.uri)}
      ${chalk.cyan('Host:')} ${chalk.bold.magenta(cluster.host)}
      ${chalk.cyan('SSL:')} ${chalk.bold.magenta(cluster.ssl)}
      ${chalk.cyan('Username:')} ${chalk.bold.magenta(cluster.username)}
      ${chalk.cyan('Password:')} ${chalk.bold.magenta(cluster.password)}
      ${chalk.cyan('authenticationDatabase:')} ${chalk.bold.magenta(
      cluster.authenticationDatabase
    )}
    `);
  });
}

export async function setMongoCluster() {
  const cluster = await inquirer.askMongoCluster();

  const clusters = conf.get('clusters') || [];

  clusters.push(cluster);

  conf.set({ clusters });

  return cluster;
}

export async function listContainersOverSSH(): Promise<string[]> {
  return new Promise(resolve => {
    // get list of running containers
    const command = `docker ps --format '"{{.Names}}"',`;
    ssh.exec(command).subscribe(
      data => {
        const containers: string[] = JSON.parse(`[${data.slice(0, -2)}]`);
        resolve(containers);
      },
      async err => {
        console.log(chalk.red(`STDERR :: ${err}`));
        const { containerName } = await inquirer.askContainerName();
        resolve([containerName]);
      }
    );
  });
}

async function listDatabasesFromContainer(
  containerName: string
): Promise<string[]> {
  return new Promise(resolve => {
    // using mongo with docker
    const command = `docker exec ${containerName} mongo --quiet --eval "db.adminCommand('listDatabases')"`;
    ssh.exec(command).subscribe(
      data => {
        const { databases } = JSON.parse(data);
        resolve(databases);
      },
      err => {
        console.log(chalk.red(`STDERR :: ${err}`));
      }
      // async () => {
      //   await ssh.end();
      // }
    );
  });
}

async function listDatabasesInVMViaSSH(): Promise<object[]> {
  return new Promise(resolve => {
    // using mongo with docker
    const command = `mongo --quiet --eval "db.adminCommand('listDatabases')"`;
    ssh.exec(command).subscribe(
      data => {
        const { databases } = JSON.parse(data);
        resolve(databases);
      },
      err => {
        console.log(chalk.red(`STDERR :: ${err}`));
      }
      // async () => {
      //   await ssh.end();
      // }
    );
  });
}

function listDatabasesWithMongoClient(cluster: Cluster): Promise<object[]> {
  const status = new Spinner('Connecting to the cluster..., please wait...');
  status.start();
  return new Promise((resolve, reject) => {
    const uri = `mongodb+srv://${cluster.username}:${cluster.password}@${cluster.uri}/test`;
    // Connect using MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect((err: Error) => {
      if (err) return reject(err);
      // Use the admin database for the operation
      const adminDb = client.db('admin');

      // List all the available databases
      adminDb.executeDbAdminCommand(
        { listDatabases: 1 },
        (e: Error, result: any) => {
          if (e) return reject(err);
          client.close();
          status.stop();
          resolve(result.databases);
        }
      );
    });
  });
}

async function listDatabases(
  cluster: Cluster,
  containerName?: string
): Promise<object[]> {
  if (cluster.accessMethod === 'MongoClient') {
    const databases = await listDatabasesWithMongoClient(cluster);
    return databases;
  }

  if (cluster.accessMethod === 'MongoShell') {
    if (cluster.requiresSSH === 'Yes') {
      await ssh.connect(cluster.sshConnection);

      if (cluster.runningOn === 'Docker Container' && containerName) {
        const databases = await listDatabasesFromContainer(containerName);
        return databases.map(name => ({
          name
        }));
      }

      if (cluster.runningOn === 'Virtual Machine') {
        const databases = await listDatabasesInVMViaSSH();
        return databases;
      }
    }
  }
  return Promise.resolve([]);
}

export async function getCluster() {
  const clusters = conf.get('clusters');

  if (!clusters.length) {
    const newCluster = setMongoCluster();

    clusters.push(newCluster);
  }

  const { clusterName } = await inquirer.selectCluster(clusters);

  return clusters.find((c: Cluster) => c.name === clusterName);
}

export async function getDatabase(cluster: Cluster, containerName?: string) {
  const databases: object[] = await listDatabases(cluster, containerName);

  const { database } = await inquirer.selectDatabase(databases);

  return database;
}
