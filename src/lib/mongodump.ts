import chalk from 'chalk';
import os from 'os';

import { Cluster } from './cluster';
import * as ssh from './ssh';
import * as inquirer from './inquirer';
import conf from './conf';
import spawn from './spawn';
import * as mongo from './mongo';
import * as rsync from './rsync';
import * as folder from './folder';

import debug from 'debug';
const dd = debug('dump');

// copy dumped files from container to host
function dockerCp(containerName: string, folderOnTheHost: string) {
  return new Promise(resolve => {
    const command = `mkdir -p ${folderOnTheHost} ; docker cp ${containerName}:./dump ${folderOnTheHost}`;
    dd('dockerCp %o', command);
    ssh.exec(command).subscribe(
      data => {
        dd('dockerCp %o', chalk.green(`STDOUT: ${data}`));
      },
      data => {
        dd('dockerCp %o', chalk.red(`STDERR: ${data}`));
      },
      async () => {
        resolve();
      }
    );
  });
}

function dockerExec(command: string) {
  return new Promise(resolve => {
    dd('dockerExec %o', command);
    ssh.exec(command).subscribe(
      data => {
        dd('dockerExec %o', chalk.green(`STDOUT: ${data}`));
      },
      data => {
        dd('dockerExec %o', chalk.red(`STDERR: ${data}`));
      },
      async () => {
        resolve();
      }
    );
  });
}

export function getDumps() {
  const dumps = conf.get('dumps') || [];

  return dumps
    .map(async (storagePath: string) => {
      const folders = await folder.ls(storagePath);
      dd('getDumps storagePath %o', storagePath);
      dd('getDumps folders', folders);
      return folders;
    })
    .flat();
}

function setDump(storagePath: string) {
  const dumps = conf.get('dumps') || [];

  conf.set('dumps', [storagePath, ...dumps]);
}

async function dumpOverSsh(cluster: Cluster) {
  await ssh.connect(cluster.sshConnection);

  const containers: string[] = await mongo.listContainersOverSSH();

  const { containerName } = await inquirer.selectContainer(containers);

  const database = await mongo.getDatabase(cluster, containerName);

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

  if (cluster.runningOn === 'Docker Container') {
    return new Promise(async (resolve, reject) => {
      // using mongo with docker
      const dockerCommand = ['docker', 'exec', containerName, ...command];
      await dockerExec(dockerCommand.join(' '));

      // copy dumped files from container to host
      const folderOnTheHost = '~/data-db/mongodumps';
      await dockerCp(containerName, folderOnTheHost);

      // copy dumped files from host to localhost
      const { sshConnection } = cluster;
      const { storagePath } = await inquirer.askStoragePath();
      const src = `${sshConnection.username}@${sshConnection.host}:${folderOnTheHost}`;
      // tslint:disable-next-line: no-let
      let dest = storagePath;
      if (os.platform() === 'win32') {
        dest = storagePath.replace('C:', '\\cygdrive\\c');
        dd('detected win32 platform setting dest to %o', dest);
      }
      try {
        // rsync -hvrPt -e "ssh -i C:\Users\tonyd\.ssh\id_rsa -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" -r root@example.com:~/data-db/mongodumps ./
        await rsync.exec(src, dest, sshConnection.privateKey);
        setDump(storagePath);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

async function dump(cluster: Cluster) {
  const database = await mongo.getDatabase(cluster);

  const { storagePath } = await inquirer.askStoragePath();
  // We need the mongodump bin into our path
  // TODO: check mongobump bin availability otherwise download it
  // https://www.mongodb.com/download-center/community
  return new Promise(resolve => {
    const command = 'mongodump';

    const { host, ssl, username, password, authenticationDatabase } = cluster;

    const out = storagePath || conf.get('settings.defaultStoragePath');

    const args = [
      host ? `--host ${host}` : '',
      ssl === 'Yes' ? '--ssl' : '',
      username ? `--username ${username}` : '',
      password ? `--password ${password}` : '',
      authenticationDatabase
        ? `--authenticationDatabase ${authenticationDatabase}`
        : '',
      database ? `--db${database}` : '',
      out ? `--out ${out}` : ''
    ];

    console.log(
      chalk.yellow(
        `Watchout! I don't know why, but mongodump normal behavior is to stream output to the STDERR! `
      )
    );

    spawn(command, args).subscribe(
      data => {
        dd('spawn %o', data);
      },
      err => {
        dd('spawn err %o', err);
      },
      () => {
        setDump(out);
        resolve();
      }
    );
  });
}

export async function exec() {
  const cluster: Cluster = await mongo.getCluster();

  if (cluster.requiresSSH === 'Yes') {
    if (cluster.runningOn === 'Docker Container') {
      await dumpOverSsh(cluster);
    }
  } else {
    await dump(cluster);
  }
}
