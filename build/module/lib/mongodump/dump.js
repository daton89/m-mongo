import chalk from 'chalk';
import path from 'path';
import debug from 'debug';
import conf from '../conf';
import spawn from '../spawn';
// import * as folder from '../folder';
import * as settings from '../settings';
import Database from '../database/database';
const dd = debug('Dump');
export default class DumpMaker {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29kdW1wL2R1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFHMUIsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQzNCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUM3Qix1Q0FBdUM7QUFDdkMsT0FBTyxLQUFLLFFBQVEsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxRQUFRLE1BQU0sc0JBQXNCLENBQUM7QUFFNUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBUXpCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sU0FBUztJQW1CNUIsWUFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFsQmhDLE1BQU0sQ0FBQyxRQUFRO1FBQ3BCLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTlDLE9BQU8sS0FBSyxDQUFDO1FBRWIsZ0NBQWdDO1FBRWhDLCtFQUErRTtRQUMvRSxlQUFlO1FBRWYsK0NBQStDO1FBRS9DLDJCQUEyQjtRQUUzQixvQkFBb0I7UUFDcEIsMkJBQTJCO0lBQzdCLENBQUM7SUFJTSxLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1QyxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVwRCxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFakUsTUFBTSxX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