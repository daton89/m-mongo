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
const debug_1 = __importDefault(require("debug"));
const path_1 = __importDefault(require("path"));
const inquirer = __importStar(require("../inquirer"));
const spawn_1 = __importDefault(require("../spawn"));
const database_1 = __importDefault(require("../database/database"));
const dd = debug_1.default('Restore');
class Restore {
    constructor(cluster, dumps) {
        this.cluster = cluster;
        this.dumps = dumps;
    }
    async exec() {
        const { dump } = await inquirer.selectDump(this.dumps);
        const database = new database_1.default(this.cluster);
        const databaseList = await database.listDatabases();
        // ask to restore into an existing db or you need to create a new one
        // ask to select database from list or ask the database name
        // ask to restore only a collection or all of them
        // ask collection name
        // ask if you want to drop existing records
        const { databaseName, collectionName, drop } = await inquirer.askRestoreOptions(databaseList);
        // const databaseName = await Database.selectDatabase(databaseList);
        const { command, args } = await this.getCommand(databaseName, dump, collectionName, drop);
        return new Promise(resolve => {
            spawn_1.default(command, args).subscribe(data => {
                dd(`spawn %o`, data);
            }, err => {
                console.log(chalk_1.default.red(`spawn err ${err}`));
            }, () => {
                resolve();
            });
        });
    }
    getCommand(database, storagePath, collectionName, drop) {
        const { host, ssl, username, password, authenticationDatabase } = this.cluster;
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
                    ? `"${path_1.default.join(storagePath, `${collectionName}.bson`)}"`
                    : storagePath
                : ''
        ];
        return { command, args };
    }
}
exports.default = Restore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29yZXN0b3JlL3Jlc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQixnREFBd0I7QUFHeEIsc0RBQXdDO0FBQ3hDLHFEQUE2QjtBQUM3QixvRUFBNEM7QUFHNUMsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTVCLE1BQXFCLE9BQU87SUFDMUIsWUFBbUIsT0FBZ0IsRUFBUyxLQUFhO1FBQXRDLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO0lBQUcsQ0FBQztJQUV0RCxLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZELE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFNUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFcEQscUVBQXFFO1FBQ3JFLDREQUE0RDtRQUM1RCxrREFBa0Q7UUFDbEQsc0JBQXNCO1FBQ3RCLDJDQUEyQztRQUMzQyxNQUFNLEVBQ0osWUFBWSxFQUNaLGNBQWMsRUFDZCxJQUFJLEVBQ0wsR0FBRyxNQUFNLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVuRCxvRUFBb0U7UUFFcEUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQzdDLFlBQVksRUFDWixJQUFJLEVBQ0osY0FBYyxFQUNkLElBQUksQ0FDTCxDQUFDO1FBQ0YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENB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