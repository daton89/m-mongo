// import { Spinner } from 'clui';
// import chalk from 'chalk';
// import { MongoClient } from 'mongodb';
// import debug from 'debug';
// // import fs from 'fs';
// // import path from 'path';

// const dd = debug('mongo');

// import { Cluster } from './cluster';
// import * as inquirer from './inquirer';
// import * as ssh from './ssh';
// import conf from './conf';
// import spawn from './spawn';
// tslint:disable-next-line: no-duplicate-imports
// import { ConnectionParams } from './ssh';

// export async function listContainersOverSSH(): Promise<string[]> {
//   return new Promise(resolve => {
//     // get list of running containers
//     const command = `docker ps --format '"{{.Names}}"',`;
//     ssh.exec(command).subscribe(
//       data => {
//         const containers: string[] = JSON.parse(`[${data.slice(0, -2)}]`);
//         dd('listContainersOverSSH %o', containers);
//         resolve(containers);
//       },
//       async err => {
//         dd('listContainersOverSSH %o', chalk.red(`STDERR :: ${err}`));
//         const { containerName } = await inquirer.askContainerName();
//         resolve([containerName]);
//       }
//     );
//   });
// }

// async function listDatabasesFromContainer(
//   containerName: string
// ): Promise<string[]> {
//   return new Promise(resolve => {
//     // using mongo with docker
//     const command = `docker exec ${containerName} mongo --quiet --eval "db.adminCommand('listDatabases')"`;
//     ssh.exec(command).subscribe(
//       data => {
//         const { databases } = JSON.parse(data);
//         dd('listDatabasesFromContainer %o', databases);
//         resolve(databases);
//       },
//       err => {
//         dd('listDatabasesFromContainer %o', chalk.red(`STDERR :: ${err}`));
//       }
//       // async () => {
//       //   await ssh.end();
//       // }
//     );
//   });
// }

// async function listDatabasesInVMViaSSH(): Promise<object[]> {
//   return new Promise(resolve => {
//     // using mongo with docker
//     const command = `mongo --quiet --eval "db.adminCommand('listDatabases')"`;
//     ssh.exec(command).subscribe(
//       data => {
//         const { databases } = JSON.parse(data);
//         dd('listDatabasesInVMViaSSH %o', databases);
//         resolve(databases);
//       },
//       err => {
//         dd('listDatabasesInVMViaSSH %o', chalk.red(`STDERR :: ${err}`));
//       }
//     );
//   });
// }

// function listDatabasesWithMongoClient(cluster: Cluster): Promise<object[]> {
//   const status = new Spinner('Connecting to the cluster..., please wait...');
//   status.start();
//   return new Promise((resolve, reject) => {
//     const uri = `mongodb+srv://${cluster.username}:${cluster.password}@${cluster.uri}/test`;
//     // Connect using MongoClient
//     const client = new MongoClient(uri, { useNewUrlParser: true });
//     client.connect((err: Error) => {
//       if (err) {
//         dd('listDatabasesWithMongoClient %o', err);
//         return reject(err);
//       }
//       // Use the admin database for the operation
//       const adminDb = client.db('admin');

//       // List all the available databases
//       adminDb.executeDbAdminCommand(
//         { listDatabases: 1 },
//         (e: Error, result: any) => {
//           if (e) return reject(err);
//           client.close();
//           status.stop();
//           dd('listDatabasesWithMongoClient %o', result.databases);
//           resolve(result.databases);
//         }
//       );
//     });
//   });
// }

// async function listDatabases(
//   cluster: Cluster,
//   containerName?: string
// ): Promise<object[]> {
//   if (cluster.accessMethod === 'MongoClient') {
//     const databases = await listDatabasesWithMongoClient(cluster);
//     return databases;
//   }

//   if (cluster.accessMethod === 'MongoShell') {
//     if (cluster.requiresSSH === 'Yes') {
//       await ssh.connect(cluster.sshConnection);

//       if (cluster.runningOn === 'Docker Container' && containerName) {
//         const databases = await listDatabasesFromContainer(containerName);
//         return databases.map(name => ({
//           name
//         }));
//       }

//       if (cluster.runningOn === 'Virtual Machine') {
//         const databases = await listDatabasesInVMViaSSH();
//         return databases;
//       }
//     }
//   }
//   return Promise.resolve([]);
// }


// export async function getDatabase(cluster: Cluster, containerName?: string) {
//   const databases: object[] = await listDatabases(cluster, containerName);

//   const { database } = await inquirer.selectDatabase(databases);

//   dd('getDatabase %o', database);

//   return database;
// }
