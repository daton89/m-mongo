import chalk from 'chalk';
import path from 'path';
import debug from 'debug';
import conf from '../conf';
import spawn from '../spawn';
// import * as folder from '../folder';
import * as settings from '../settings';
import Database from '../database/database';
const dd = debug('Dump');
export class DumpMaker {
    constructor(cluster) {
        this.cluster = cluster;
    }
    static getDumps() {
        const dumps = conf.get('dumps') || [];
        return dumps;
        // const folders: string[] = [];
        // return dumps.reduce(async (acc: Promise<string[]>, storagePath: string) => {
        //   await acc;
        //   const dirs = await folder.ls(storagePath);
        //   folders.push(...dirs);
        //   return folders;
        // }, Promise.resolve([]));
    }
    async exec() {
        const database = new Database(this.cluster);
        const databaseList = await database.listDatabases();
        const databaseName = await Database.selectDatabase(databaseList);
        const storagePath = settings.getStoragePath();
        const dumpDate = this.getDumpDate();
        const { command, args } = this.getCommand(databaseName, path.join(storagePath, dumpDate));
        // console.log(
        //   chalk.yellow(
        //     `Watchout! I don't know why, but mongodump normal behavior is to stream output to the STDERR! `
        //   )
        // );
        return new Promise((resolve, reject) => {
            spawn(command, args).subscribe(data => {
                dd('spawn %o', data);
            }, err => {
                console.log(chalk.red(`Error :: ${err}`));
                reject();
            }, () => {
                this.setDump(storagePath, databaseName, dumpDate);
                resolve();
            });
        });
    }
    getCommand(database, storagePath) {
        const command = 'mongodump';
        const { host, ssl, username, password, authenticationDatabase } = this.cluster;
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
    setDump(storagePath, name, createdOn) {
        const dumps = conf.get('dumps') || [];
        const lastDump = {
            name,
            path: path.join(storagePath, createdOn, name),
            createdOn
        };
        conf.set('dumps', [lastDump, ...dumps]);
    }
    getDumpDate() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() +
            1}-${now.getDate()}_${now.getHours()}.${now.getMinutes()}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29kdW1wL2R1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFHMUIsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQzNCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUM3Qix1Q0FBdUM7QUFDdkMsT0FBTyxLQUFLLFFBQVEsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxRQUFRLE1BQU0sc0JBQXNCLENBQUM7QUFFNUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBUXpCLE1BQU0sT0FBTyxTQUFTO0lBbUJwQixZQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQWxCaEMsTUFBTSxDQUFDLFFBQVE7UUFDcEIsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFOUMsT0FBTyxLQUFLLENBQUM7UUFFYixnQ0FBZ0M7UUFFaEMsK0VBQStFO1FBQy9FLGVBQWU7UUFFZiwrQ0FBK0M7UUFFL0MsMkJBQTJCO1FBRTNCLG9CQUFvQjtRQUNwQiwyQkFBMkI7SUFDN0IsQ0FBQztJQUlNLEtBQUssQ0FBQyxJQUFJO1FBQ2YsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVDLE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXBELE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVqRSxNQUFNLFdBQVcsR0FBRyxR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