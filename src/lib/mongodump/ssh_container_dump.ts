import debug from 'debug';

import * as ssh from '../ssh';
import * as inquirer from '../inquirer';
import * as rsync from '../rsync';
import * as settings from '../settings';
import Dump from './dump';
import Database from '../database/database';
import SSHContainerDatabase from '../database/ssh_container_database';

const dd = debug('SSHContainerDump');

export default class SSHContainerDump extends Dump {
  public async exec(): Promise<void> {
    // const { sshConnection } = this.cluster;

    const storagePath = settings.getStoragePath();

    // await ssh.connect(sshConnection);

    const database = new SSHContainerDatabase(this.cluster);

    await database.connect();

    const containers: string[] = await database.listContainers();

    const { containerName } = await inquirer.selectContainer(containers);

    const databaseName = await Database.selectDatabase(containerName);

    const { command, args } = this.getCommand(databaseName, storagePath);

    return new Promise(async (resolve, reject) => {
      // using mongo with docker
      const dockerCommand = ['docker', 'exec', containerName, command, ...args];
      await this.dockerExec(dockerCommand.join(' '));

      // copy dumped files from container to host
      const folderOnTheHost = '~/data-db/mongodumps';
      await this.dockerCp(containerName, folderOnTheHost);

      // copy dumped files from host to localhost
      const { username, host, privateKey } = this.cluster.sshConnection;

      const src = `${username}@${host}:${folderOnTheHost}/dump/*`;

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
      const command = `rm -rf ${folderOnTheHost} && mkdir -p ${folderOnTheHost} && docker cp ${containerName}:./dump/ ${folderOnTheHost}`;
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
