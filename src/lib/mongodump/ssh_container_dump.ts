import chalk from 'chalk';
import os from 'os';
import debug from 'debug';

import * as ssh from '../ssh';
import * as inquirer from '../inquirer';
import * as rsync from '../rsync';
import * as settings from '../settings';
import * as mongo from '../mongo';
import Dump from './dump';

const dd = debug('SSHContainerDump');

export default class SSHContainerDump extends Dump {
  public async exec() {
    const { sshConnection } = this.cluster;

    const storagePath = settings.getStoragePath();

    await ssh.connect(sshConnection);

    const containers: string[] = await mongo.listContainersOverSSH();

    const { containerName } = await inquirer.selectContainer(containers);

    const database = await mongo.getDatabase(this.cluster, containerName);

    const { command, args } = this.getCommand(database, storagePath);

    return new Promise(async (resolve, reject) => {
      // using mongo with docker
      const dockerCommand = ['docker', 'exec', containerName, command, ...args];
      await this.dockerExec(dockerCommand.join(' '));

      // copy dumped files from container to host
      const folderOnTheHost = '~/data-db/mongodumps';
      await this.dockerCp(containerName, folderOnTheHost);

      // copy dumped files from host to localhost
      const { username, host, privateKey } = sshConnection;

      const src = `${username}@${host}:${folderOnTheHost}`;

      try {
        // TODO: avoid that on local we find mongodump/dump folder
        await rsync.exec(src, storagePath, privateKey);
        this.setDump(storagePath);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  // copy dumped files from container to host
  private dockerCp(containerName: string, folderOnTheHost: string) {
    return new Promise(resolve => {
      const command = `mkdir -p ${folderOnTheHost} ; docker cp ${containerName}:./dump ${folderOnTheHost}`;
      dd('dockerCp %o', command);
      ssh.exec(command).subscribe(
        data => {
          dd('dockerCp %o', `STDOUT: ${data}`);
        },
        data => {
          dd('dockerCp %o', `STDERR: ${data}`);
        },
        async () => {
          resolve();
        }
      );
    });
  }

  private dockerExec(command: string) {
    return new Promise(resolve => {
      dd('dockerExec %o', command);
      ssh.exec(command).subscribe(
        data => {
          dd('dockerExec %o', `STDOUT: ${data}`);
        },
        data => {
          dd('dockerExec %o', `STDERR: ${data}`);
        },
        async () => {
          resolve();
        }
      );
    });
  }
}
