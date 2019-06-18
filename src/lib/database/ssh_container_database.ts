import SSHDatabase from './ssh_database';
import * as ssh from '../ssh';
import debug from 'debug';

import * as inquirer from '../inquirer';

const dd = debug('SSHDatabase');

export default class SSHContainerDatabase extends SSHDatabase {
  public async listContainers(): Promise<string[]> {
    return new Promise(resolve => {
      // get list of running containers
      const command = `docker ps --format '"{{.Names}}"',`;
      ssh.exec(command).subscribe(
        data => {
          const containers: string[] = JSON.parse(`[${data.slice(0, -2)}]`);
          dd('listContainersOverSSH %o', containers);
          resolve(containers);
        },
        async err => {
          dd('listContainersOverSSH %o', `STDERR :: ${err}`);
          const { containerName } = await inquirer.askContainerName();
          resolve([containerName]);
        }
      );
    });
  }
  public async listDatabasesFromContainer(
    containerName: string
  ): Promise<string[]> {
    return new Promise(resolve => {
      // using mongo with docker
      const command = `docker exec ${containerName} mongo --quiet --eval "db.adminCommand('listDatabases')"`;
      ssh.exec(command).subscribe(
        data => {
          const { databases } = JSON.parse(data);
          dd('listDatabasesFromContainer %o', databases);
          resolve(databases.map(({ name }: { name: string }) => name));
        },
        err => {
          dd('listDatabasesFromContainer %o', `STDERR :: ${err}`);
        }
      );
    });
  }
}
