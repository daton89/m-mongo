import chalk from 'chalk';

import * as inquirer from '../inquirer';
import * as mongo from '../mongo';
import Restore from './restore';
import * as ssh from '../ssh';
import spawn from '../spawn';

export default class RestoreContainer extends Restore {
  public async exec() {
    const { requiresSSH } = this.cluster;

    if (requiresSSH === 'Yes') await this.connect();

    const containerName = await this.getContainerName();

    const database = await this.getDatabaseFromContainer(containerName);

    const { command, args } = await this.getCommand(database, '');

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

  private async getContainerName() {
    const containers: string[] = await mongo.listContainersOverSSH();

    const { containerName } = await inquirer.selectContainer(containers);

    return containerName;
  }

  private async getDatabaseFromContainer(containerName: string) {
    const database = await mongo.getDatabase(this.cluster, containerName);

    return database;
  }

  private sshDocker(command: string) {
    return new Promise(resolve => {
      // using docker in remote
      ssh.exec(command).subscribe(
        data => {
          console.log(chalk.green(`STDOUT: ${data}`));
        },
        data => {
          console.log(chalk.red(`STDERR: ${data}`));
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
          console.log(chalk.green(`STDOUT: ${data}`));
        },
        data => {
          console.log(chalk.red(`STDERR: ${data}`));
        },
        async () => {
          resolve();
        }
      );
    });
  }
}
