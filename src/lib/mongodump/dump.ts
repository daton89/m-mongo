import chalk from 'chalk';
import debug from 'debug';

import { Cluster } from '../cluster';
import conf from '../conf';
import spawn from '../spawn';
import * as folder from '../folder';
import * as settings from '../settings';
import * as mongo from '../mongo';

const dd = debug('Dump');

export default class Dump {
  public static getDumps() {
    const dumps: string[] = conf.get('dumps') || [];
    const folders: string[] = [];
    return dumps.reduce(async (acc: Promise<string[]>, storagePath: string) => {
      await acc;
      const dirs = await folder.ls(storagePath);
      folders.push(...dirs);
      return folders;
    }, Promise.resolve([]));
  }

  constructor(public cluster: Cluster) {}

  public async exec() {
    const database = await this.getDatabase();

    const storagePath = settings.getStoragePath();

    const { command, args } = this.getCommand(database, storagePath);

    console.log(
      chalk.yellow(
        `Watchout! I don't know why, but mongodump normal behavior is to stream output to the STDERR! `
      )
    );
    return new Promise((resolve, reject) => {
      spawn(command, args).subscribe(
        data => {
          dd('spawn %o', data);
        },
        err => {
          console.log(chalk.red(`Error :: ${err}`));
          reject();
        },
        () => {
          this.setDump(storagePath);
          resolve();
        }
      );
    });
  }

  public getCommand(database: string, storagePath: string) {
    const command = 'mongodump';

    const {
      host,
      ssl,
      username,
      password,
      authenticationDatabase
    } = this.cluster;

    const args = [
      host ? `--host` : '',
      host ? `"${host}"` : '',
      ssl === 'Yes' ? '--ssl' : '',
      username ? `--username` : '',
      username ? `${username}` : '',
      password ? `--password` : '',
      password ? `${password}` : '',
      authenticationDatabase ? `--authenticationDatabase` : '',
      authenticationDatabase ? `${authenticationDatabase}` : '',
      database ? `--db` : '',
      database ? `${database}` : '',
      // TODO: add optional collection
      storagePath ? `--out` : '',
      storagePath ? `${storagePath}` : ''
    ];

    return { command, args };
  }

  public setDump(storagePath: string) {
    const dumps = conf.get('dumps') || [];

    conf.set('dumps', [storagePath, ...dumps]);
  }

  private async getDatabase() {
    const database = await mongo.getDatabase(this.cluster);

    return database;
  }
}
