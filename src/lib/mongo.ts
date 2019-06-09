import Configstore from 'configstore';
import { Spinner } from 'clui';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
// import fs from 'fs';
import { spawn } from 'child_process';
// import path from 'path';

import { Cluster } from '../cluster';
import * as inquirer from './inquirer';

const conf = new Configstore('m-mongo');

export async function showMainMenu() {
  const choise = await inquirer.selectMainMenu();

  return choise;
}

export function getClusters() {
  return conf.get('clusters');
}

export async function setMongoCluster() {
  const cluster = await inquirer.askMongoCluster();

  const clusters = conf.get('clusters') || [];

  clusters.push(cluster);

  conf.set({ clusters });

  return cluster;
}

async function listDatabases(cluster: Cluster) {
  return new Promise((resolve, reject) => {
    const uri = `mongodb+srv://${cluster.username}:${cluster.password}@daton-development-nidnc.mongodb.net/test?retryWrites=true&w=majority`;
    // Connect using MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect((err: Error) => {
      if (err) return reject(err);
      // Use the admin database for the operation
      const adminDb = client.db('admin');

      // List all the available databases
      adminDb.executeDbAdminCommand(
        { listDatabases: 1 },
        (err: Error, result: any) => {
          if (err) return reject(err);
          client.close();
          return resolve(result.databases);
        }
      );
    });
  });
}

function dump(cluster: Cluster, database: string, storagePath: string) {
  return new Promise((resolve, reject) => {
    const status = new Spinner('Dumping..., please wait...');
    status.start();

    var mongodump = spawn('mongodump', [
      '--host',
      cluster.host,
      cluster.ssl === 'Yes' ? '--ssl' : '',
      '--username',
      cluster.username,
      '--password',
      cluster.password,
      '--authenticationDatabase',
      cluster.authenticationDatabase,
      database ? '--db' : '',
      database ? database : '',
      storagePath
    ]);

    console.log(
      'Please visit ' +
        chalk.underline.blue.bold(storagePath) +
        ' and check the ' +
        chalk.cyan.bold(`${database} folder.\n`)
    );

    // const wstream = fs.createWriteStream(dumpFolder);

    mongodump.stdout
      // .pipe(wstream)
      .on('finish', () => {
        console.log(chalk.underline.green.bold('Successfully Completed!'));
        resolve(database);
        status.stop();
      })
      .on('error', err => {
        console.log(err);
        reject(err);
        status.stop();
      });
  });
}

export async function execDump() {
  const clusters: Cluster[] = conf.get('clusters');

  const { clusterName } = await inquirer.selectCluster(clusters);

  const cluster = clusters.find(
    (cluster: Cluster) => cluster.name === clusterName
  );

  if (!cluster) throw new Error('Cluster not found');

  const databases = await listDatabases(cluster);

  const { database } = await inquirer.selectDatabase(databases);

  const { storagePath } = await inquirer.setStoragePath();

  const dumped = await dump(
    cluster,
    database,
    storagePath || conf.get('defaultStoragePath')
  );

  return dumped;
}

export async function setStoragePath() {
  const storagePath = await inquirer.setStoragePath();

  conf.set('defaultStoragePath', storagePath);

  return storagePath;
}
