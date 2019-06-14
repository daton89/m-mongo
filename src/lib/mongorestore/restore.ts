// import chalk from 'chalk';

import { Cluster } from '../cluster';
// import * as ssh from '../ssh';
import * as inquirer from '../inquirer';
import spawn from '../spawn';
import * as mongo from '../mongo';
// import * as settings from '../settings';

export default class Restore {
  constructor(public cluster: Cluster, public dumps: string[]) {}

  public async exec() {
    const { dump } = await inquirer.selectDump(this.dumps);

    // TODO: ask to select an optional collection

    const database = await this.getDatabase();

    // const storagePath = settings.getStoragePath();

    const { command, args } = await this.getCommand(database, dump);
    return new Promise(resolve => {
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

  public async getCommand(database: string, storagePath: string) {
    const {
      host,
      ssl,
      username,
      password,
      authenticationDatabase
    } = this.cluster;

    const command = 'mongorestore';

    const args = [
      host ? `--host ${host}` : '',
      ssl === 'Yes' ? '--ssl' : '',
      '--username',
      username ? `--username ${username}` : '',
      password ? `--password ${password}` : '',
      authenticationDatabase
        ? `--authenticationDatabase ${authenticationDatabase}`
        : '',
      database ? `--db ${database}` : '',
      storagePath ? `--out ${storagePath}` : ''
    ];
    return { command, args };
  }

  private async getDatabase() {
    const database = await mongo.getDatabase(this.cluster);

    return database;
  }
}
