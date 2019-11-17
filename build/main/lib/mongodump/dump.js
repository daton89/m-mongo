"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const conf_1 = __importDefault(require("../conf"));
const spawn_1 = __importDefault(require("../spawn"));
// import * as folder from '../folder';
const settings = __importStar(require("../settings"));
const database_1 = __importDefault(require("../database/database"));
const dd = debug_1.default('Dump');
class DumpMaker {
    constructor(cluster) {
        this.cluster = cluster;
    }
    static getDumps() {
        const dumps = conf_1.default.get('dumps') || [];
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
        const database = new database_1.default(this.cluster);
        const databaseList = await database.listDatabases();
        const databaseName = await database_1.default.selectDatabase(databaseList);
        const storagePath = settings.getStoragePath();
        const dumpDate = this.getDumpDate();
        const { command, args } = this.getCommand(databaseName, path_1.default.join(storagePath, dumpDate));
        // console.log(
        //   chalk.yellow(
        //     `Watchout! I don't know why, but mongodump normal behavior is to stream output to the STDERR! `
        //   )
        // );
        return new Promise((resolve, reject) => {
            spawn_1.default(command, args).subscribe(data => {
                dd('spawn %o', data);
            }, err => {
                console.log(chalk_1.default.red(`Error :: ${err}`));
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
        const dumps = conf_1.default.get('dumps') || [];
        const lastDump = {
            name,
            path: path_1.default.join(storagePath, createdOn, name),
            createdOn
        };
        conf_1.default.set('dumps', [lastDump, ...dumps]);
    }
    getDumpDate() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() +
            1}-${now.getDate()}_${now.getHours()}.${now.getMinutes()}`;
    }
}
exports.DumpMaker = DumpMaker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29kdW1wL2R1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFHMUIsbURBQTJCO0FBQzNCLHFEQUE2QjtBQUM3Qix1Q0FBdUM7QUFDdkMsc0RBQXdDO0FBQ3hDLG9FQUE0QztBQUU1QyxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFRekIsTUFBYSxTQUFTO0lBbUJwQixZQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQWxCaEMsTUFBTSxDQUFDLFFBQVE7UUFDcEIsTUFBTSxLQUFLLEdBQVcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFOUMsT0FBTyxLQUFLLENBQUM7UUFFYixnQ0FBZ0M7UUFFaEMsK0VBQStFO1FBQy9FLGVBQWU7UUFFZiwrQ0FBK0M7UUFFL0MsMkJBQTJCO1FBRTNCLG9CQUFvQjtRQUNwQiwyQkFBMkI7SUFDN0IsQ0FBQztJQUlNLEtBQUssQ0FBQyxJQUFJO1FBQ2YsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1QyxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVwRCxNQUFNLFlBQVksR0FBRyxNQUFNLGtCQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWpFLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU5QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFcEMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFB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