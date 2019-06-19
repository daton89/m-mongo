import chalk from 'chalk';
import debug from 'debug';
import path from 'path';

import { Cluster } from '../cluster';
import * as inquirer from '../inquirer';
import spawn from '../spawn';
import Database from '../database/database';

const dd = debug('Restore');

export default class Restore {
  constructor(public cluster: Cluster, public dumps: string[]) {}

  public async exec() {
    const { dump } = await inquirer.selectDump(this.dumps);

    const database = new Database(this.cluster);

    const databaseList = await database.listDatabases();

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

    // const databaseName = await Database.selectDatabase(databaseList);

    const { command, args } = await this.getCommand(
      databaseName,
      dump,
      collectionName,
      drop
    );
    return new Promise(resolve => {
      spawn(command, args).subscribe(
        data => {
          dd(`spawn %o`, data);
        },
        err => {
          console.log(chalk.red(`spawn err ${err}`));
        },
        () => {
          resolve();
        }
      );
    });
  }

  public getCommand(
    database: string,
    storagePath: string,
    collectionName: string | undefined,
    drop: boolean
  ) {
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
      host ? `"${host}"` : '',
      ssl === 'Yes' ? '--ssl' : '',
      username ? '--username' : '',
      username ? username : '',
      password ? '--password' : '',
      password ? password : '',
      authenticationDatabase ? '--authenticationDatabase' : '',
      authenticationDatabase ? authenticationDatabase : '',
      // database && collectionName ? '--nsInclude' : '',
      // database && collectionName ? `${database}.${collectionName}` : '',
      database ? '--db' : '',
      database ? database : '',
      collectionName ? '--collection' : '',
      collectionName ? collectionName : '',
      drop ? '--drop' : '',
      storagePath
        ? storagePath && collectionName
          ? `"${path.join(storagePath, `${collectionName}.bson`)}"`
          : storagePath
        : ''
    ];
    return { command, args };
  }
}
