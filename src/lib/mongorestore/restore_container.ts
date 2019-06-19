import debug from 'debug';

import * as inquirer from '../inquirer';
import Restore from './restore';
import * as ssh from '../ssh';
import spawn from '../spawn';
import SSHContainerDatabase from '../database/ssh_container_database';

const dd = debug('RestoreContainer');

export default class RestoreContainer extends Restore {
  public async exec() {
    const { dump } = await inquirer.selectDump(this.dumps);

    const { requiresSSH } = this.cluster;

    if (requiresSSH === 'Yes') await this.connect();

    const database = new SSHContainerDatabase(this.cluster);

    const containerList = await database.listContainers();

    const { containerName } = await inquirer.selectContainer(containerList);

    const databaseList = await database.listDatabasesFromContainer(containerName);

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

    const { command, args } = await this.getCommand(databaseName, dump, collectionName, drop);

    const dockerExec = ['docker', 'exec', containerName, command, ...args];

    if (requiresSSH === 'Yes') {
      await this.sshDocker(dockerExec.join(' '));
    } else {
      const [dockerCommand, ...dockerArgs] = dockerExec;
      await this.spawnDocker(dockerCommand, dockerArgs);
    }
  }

  private async connect() {
    await ssh.connect(this.cluster.sshConnection);
  }

  private sshDocker(command: string) {
    return new Promise(resolve => {
      // using docker in remote
      ssh.exec(command).subscribe(
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

  private spawnDocker(command: string, args: string[]) {
    return new Promise(resolve => {
      // using docker in local
      spawn(command, args).subscribe(
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
