import { Spinner } from 'clui';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
// import fs from 'fs';
// import path from 'path';

import { Cluster } from './cluster';
import * as inquirer from './inquirer';
import conf from './conf';
import * as ssh from './ssh';
import spawn from './spawn';
// tslint:disable-next-line: no-duplicate-imports
import { ConnectionParams } from './ssh';

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

async function listContainersOverSSH(): Promise<string[]> {
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

async function listDatabasesFromContainer(containerName: string) {
  return new Promise(resolve => {
    // using mongo with docker
    const dockerExec = `docker exec ${containerName} mongo --quiet --eval "db.adminCommand('listDatabases')"`;
    ssh.exec(dockerExec).subscribe(
      data => {
        const { databases } = JSON.parse(data);
        resolve(databases);
      },
      err => {
        console.log(chalk.red(`STDERR :: ${err}`));
      },
      async () => {
        await ssh.end();
      }
    );
  });
}

async function listDatabasesWithMongoShellOverSSH(
  cluster: Cluster,
  connection: ConnectionParams
) {
  await ssh.connect(connection);

  const containers: string[] = await listContainersOverSSH();

  const { containerName } = await inquirer.selectContainer(containers);

  if (cluster.runningOn === 'Docker Container') {
    const databases = await listDatabasesFromContainer(containerName)
  }
}

function listDatabasesWithMongoClient(cluster: Cluster) {
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

async function listDatabases(cluster: Cluster, connection?: ConnectionParams) {
  if (cluster.accessMethod === 'MongoClient') {
    const databases = await listDatabasesWithMongoClient(cluster);
    return databases;
  }

  if (cluster.accessMethod === 'MongoShell') {
    if (cluster.requiresSSH === 'Yes' && connection) {
      const databases = await listDatabasesWithMongoShellOverSSH(
        cluster,
        connection
      );
      return databases;
    }
  }
}

async function getCluster() {
  const clusters = conf.get('clusters');

  if (!clusters.length) {
    const newCluster = setMongoCluster();

    clusters.push(newCluster);
  }

  const { clusterName } = await inquirer.selectCluster(clusters);

  return clusters.find((c: Cluster) => c.name === clusterName);
}

async function getDatabase(connection?: ConnectionParams) {
  const cluster: Cluster = await getCluster();

  if (!cluster) throw new Error('Cluster not found');

  const databases = await listDatabases(cluster, connection);

  const { database } = await inquirer.selectDatabase(databases);

  const { storagePath } = await inquirer.askStoragePath();

  return { cluster, database, storagePath };
}

export async function dumpOverSsh() {
  const connections = conf.get('sshConnections') || [];

  const { connectionHost } = await inquirer.selectSshConnection(connections);

  const connection = connections.find(
    (conn: ssh.ConnectionParams) => conn.host === connectionHost
  );

  const { cluster, database /* , storagePath */ } = await getDatabase(
    connection
  );

  // const cluster: Cluster = await getCluster();

  // const { database } = await inquirer.askDatabase();

  const { host, ssl, username, password, authenticationDatabase } = cluster;

  const command = [
    'mongodump',
    host ? `--host ${host}` : '',
    ssl === 'Yes' ? '--ssl' : '',
    username ? `--username ${username}` : '',
    password ? `--password ${password}` : '',
    authenticationDatabase
      ? `--authenticationDatabase ${authenticationDatabase}`
      : '',
    database ? `--db ${database}` : ''
    // storagePath
  ];

  if (cluster.requiresSSH === 'Yes') {
    if (cluster.runningOn === 'Docker Container') {
      await ssh.connect(connection);

      // const { containerName } = await inquirer.askContainerName();
      return new Promise(resolve => {
        // using mongo with docker
        const dockerExec = ['docker', 'exec', containerName, ...command];
        ssh.exec(dockerExec.join(' ')).subscribe(
          data => {
            console.log(chalk.green(`STDOUT: ${data}`));
          },
          data => {
            console.log(chalk.red(`STDERR: ${data}`));
            console.log(chalk.red(`I'm sorry... something went wrong...`));
          },
          async () => {
            await ssh.end();
            resolve();
          }
        );
      });
      // TODO: copy dumped files from remote
    }
  }
}

function dump(cluster: Cluster, database: string, storagePath: string) {
  // We need the mongodump bin into our path
  // TODO: check mongobump bin availability otherwise download it
  // https://www.mongodb.com/download-center/community
  return new Promise(resolve => {
    const command = 'mongodump';

    const args = [
      '--host',
      cluster.host,
      cluster.ssl === 'Yes' ? '--ssl' : '',
      '--username',
      cluster.username,
      '--password',
      cluster.password,
      '--authenticationDatabase',
      cluster.authenticationDatabase,
      '--db',
      database,
      '--out',
      storagePath
    ];

    console.log(
      chalk.yellow(
        `Watchout! I don't know why, but mongodump normal behavior is to stream output to the STDERR! `
      )
    );

    spawn(command, args).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      },
      () => {
        resolve();
      }
    );
  });
}

export async function execDump() {
  const { cluster, database, storagePath } = await getDatabase();

  const dumped = await dump(
    cluster,
    database,
    storagePath || conf.get('defaultStoragePath')
  );

  return dumped;
}
