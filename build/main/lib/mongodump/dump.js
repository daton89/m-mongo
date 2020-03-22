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
const inquirer = __importStar(require("../inquirer"));
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
        const { collectionName } = await inquirer.askCollectionNameToDump();
        const { command, args } = this.getCommand(databaseName, path_1.default.join(storagePath, dumpDate), collectionName);
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
    getCommand(database, storagePath, collectionName) {
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
            collectionName ? `-c` : '',
            collectionName ? `${collectionName}` : '',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29kdW1wL2R1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFHMUIsbURBQTJCO0FBQzNCLHFEQUE2QjtBQUM3QixzREFBd0M7QUFDeEMsc0RBQXdDO0FBQ3hDLG9FQUE0QztBQUU1QyxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFRekIsTUFBYSxTQUFTO0lBbUJwQixZQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQWxCaEMsTUFBTSxDQUFDLFFBQVE7UUFDcEIsTUFBTSxLQUFLLEdBQVcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFOUMsT0FBTyxLQUFLLENBQUM7UUFFYixnQ0FBZ0M7UUFFaEMsK0VBQStFO1FBQy9FLGVBQWU7UUFFZiwrQ0FBK0M7UUFFL0MsMkJBQTJCO1FBRTNCLG9CQUFvQjtRQUNwQiwyQkFBMkI7SUFDN0IsQ0FBQztJQUlNLEtBQUssQ0FBQyxJQUFJO1FBQ2YsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1QyxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVwRCxNQUFNLFlBQVksR0FBRyxNQUFNLGtCQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWpFLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU5QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFcEMsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLHVCQUF1QixF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