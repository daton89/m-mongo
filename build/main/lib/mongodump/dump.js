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
exports.default = DumpMaker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29kdW1wL2R1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFHMUIsbURBQTJCO0FBQzNCLHFEQUE2QjtBQUM3Qix1Q0FBdUM7QUFDdkMsc0RBQXdDO0FBQ3hDLG9FQUE0QztBQUU1QyxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFRekIsTUFBcUIsU0FBUztJQW1CNUIsWUFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFsQmhDLE1BQU0sQ0FBQyxRQUFRO1FBQ3BCLE1BQU0sS0FBSyxHQUFXLGNBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTlDLE9BQU8sS0FBSyxDQUFDO1FBRWIsZ0NBQWdDO1FBRWhDLCtFQUErRTtRQUMvRSxlQUFlO1FBRWYsK0NBQStDO1FBRS9DLDJCQUEyQjtRQUUzQixvQkFBb0I7UUFDcEIsMkJBQTJCO0lBQzdCLENBQUM7SUFJTSxLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFNUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFcEQsTUFBTSxZQUFZLEdBQUcsTUFBTSxrQkFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVqRSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFOUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXBDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FDdkMsWUFBWSxFQUNaLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUNqQyxDQUFDO1FBRUYsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixzR0FBc0c7UUFDdEcsTUFBTTtRQUNOLEtBQUs7UUFFTCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLGVBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUM1QixJQUFJLENBQUMsRUFBRTtnQkFDTCxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsRUFDRCxHQUFHLENBQUMsRUFBRTtnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sRUFBRSxDQUFDO1lBQ1gsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxVQUFVLENBQUMsUUFBZ0IsRUFBRSxXQUFtQjtRQUNyRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFFNUIsTUFBTSxFQUNKLElBQUksRUFDSixHQUFHLEVBQ0gsUUFBUSxFQUNSLFFBQVEsRUFDUixzQkFBc0IsRUFDdkIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRWpCLE1BQU0sSUFBSSxHQUFHO1lBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QixRQUFRLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzdCLHNCQUFzQixDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN4RCxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pELFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM3QixnQ0FBZ0M7WUFDaEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUIsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQ3BDLENBQUM7UUFFRixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTSxPQUFPLENBQUMsV0FBbUIsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDakUsTUFBTSxLQUFLLEdBQVcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFOUMsTUFBTSxRQUFRLEdBQVM7WUFDckIsSUFBSTtZQUNKLElBQUksRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDO1lBQzdDLFNBQVM7U0FDVixDQUFDO1FBRUYsY0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxXQUFXO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQzNDLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO0lBQy9ELENBQUM7Q0FDRjtBQTdHRCw0QkE2R0MifQ==