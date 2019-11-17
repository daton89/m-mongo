import debug from 'debug';
import chalk from 'chalk';

import * as inquirer from '../inquirer';
import Restore from './restore';
import * as ssh from '../ssh';
import * as rsync from '../rsync';
import spawn from '../spawn';
import SSHContainerDatabase from '../database/ssh_container_database';

const dd = debug('RestoreContainer');

export default class RestoreContainer extends Restore {
  public async exec() {
    const { dump } = await inquirer.selectDump(this.dumps);

    const dumpObject = this.dumps.find(el => el.path === dump) || { name: '' };

    const { requiresSSH } = this.cluster;

    if (requiresSSH === 'Yes') await this.connect();

    const database = new SSHContainerDatabase(this.cluster);

    const containerList = await database.listContainers();

    const { containerName } = await inquirer.selectContainer(containerList);

    const databaseList = await database.listDatabasesFromContainer(
      containerName
    );

    // const databaseName = await SSHContainerDatabase.selectDatabase(databaseList);

    // ask to restore into an existing db or you need to create a new one
    // ask to select database from list or ask the database name
    // ask to restore only a collection or all of them
    // ask collection name
    // ask if you want to drop existing records
    const {
      databaseName,
      collectionName,
      drop
    } = await inquirer.askRestoreOptions(databaseList);

    if (requiresSSH === 'Yes') {
      if (!this.cluster.sshConnection) throw new Error('SSH Tunnel not found!');

      // copy dumped files from localhost to remote machine with rsync
      const { username, host, privateKey } = this.cluster.sshConnection;

      const dest = `${username}@${host}:~/data-db/mongodumps/dump/`;

      await rsync.exec(dump, dest, privateKey);

      console.log(chalk.green(`Copied files from ${dump} to ${dest}`));

      // copy dump into container
      await this.sshDockerCp(
        `~/data-db/mongodumps/dump/${dumpObject.name}`,
        `${containerName}:/home/${dumpObject.name}`
      );

      console.log(chalk.green(`Copied files into container ${containerName}`));

      // build command and execute
      const { command, args } = this.getCommand(
        databaseName,
        `/home/${dumpObject.name}`,
        collectionName,
        drop
      );

      const dockerExec = ['docker', 'exec', containerName, command, ...args];

      return new Promise(resolve => {
        ssh.exec(dockerExec.join(' ')).subscribe(
          data => {
            dd(`STDOUT: ${data}`);
          },
          data => {
            dd(`STDERR: ${data}`);
          },
          async () => {
            resolve();
          }
        );
      });
    } else {
      const { command, args } = this.getCommand(
        databaseName,
        dump,
        collectionName,
        drop
      );

      const dockerArgs = ['exec', containerName, command, ...args];

      // using docker in local
      return new Promise(resolve => {
        spawn('docker', dockerArgs).subscribe(
          data => {
            dd(`STDOUT: ${data}`);
          },
          data => {
            dd(`STDERR: ${data}`);
          },
          async () => {
            resolve();
          }
        );
      });
    }
  }

  private async connect() {
    if (!this.cluster.sshConnection) throw new Error('SSH Tunnel not found!');
    await ssh.connect(this.cluster.sshConnection);
  }

  // copy dumped files from host to container
  private sshDockerCp(src: string, dest: string) {
    return new Promise(resolve => {
      const command = `docker cp ${src} ${dest}`;
      dd('sshDockerCp %o', command);
      ssh.exec(command).subscribe(
        data => {
          dd('dockerCp %s', `STDOUT: ${data}`);
        },
        data => {
          console.log(chalk.red(`dockerCp STDERR: ${data}`));
        },
        async () => {
          resolve();
        }
      );
    });
  }
}
