import debug from 'debug';

import { Cluster } from '../cluster';
import * as inquirer from '../inquirer';
import spawn from '../spawn';
import Database from '../database/database';

const dd = debug('Restore');

export default class Restore {
  constructor(public cluster: Cluster, public dumps: string[]) {}

  public async exec() {
    const { dump } = await inquirer.selectDump(this.dumps);

    // TODO: ask to select an optional collection

    const database = new Database(this.cluster);

    const databaseList = await database.listDatabases();

    const databaseName = await Database.selectDatabase(databaseList);

    const { command, args } = await this.getCommand(databaseName, dump);
    return new Promise(resolve => {
      spawn(command, args).subscribe(
        data => {
          dd(`spawn %o`, data);
        },
        err => {
          dd(`spawn err %o`, err);
        },
        () => {
          resolve();
        }
      );
    });
  }

  public getCommand(database: string, storagePath: string) {
    const {
      host,
      ssl,
      username,
      password,
      authenticationDatabase
    } = this.cluster;

    const command = 'mongorestore';

    const args = [
      host ? '--host' : '',
      host ? host : '',
      ssl === 'Yes' ? '--ssl' : '',
      username ? '--username' : '',
      username ? username : '',
      password ? '--password' : '',
      password ? password : '',
      authenticationDatabase ? '--authenticationDatabase' : '',
      authenticationDatabase ? authenticationDatabase : '',
      database ? '--db' : '',
      database ? database : '',
      '--drop',
      storagePath ? storagePath : ''
    ];
    return { command, args };
  }

}
