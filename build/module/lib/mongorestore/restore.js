import chalk from 'chalk';
import debug from 'debug';
import path from 'path';
import * as inquirer from '../inquirer';
import spawn from '../spawn';
import Database from '../database/database';
const dd = debug('Restore');
export default class Restore {
    constructor(cluster, dumps) {
        this.cluster = cluster;
        this.dumps = dumps;
    }
    async exec() {
        const { dump } = await inquirer.selectDump(this.dumps);
        const database = new Database(this.cluster);
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
            spawn(command, args).subscribe(data => {
                dd(`spawn %o`, data);
            }, err => {
                console.log(chalk.red(`spawn err ${err}`));
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
                    ? `"${path.join(storagePath, `${collectionName}.bson`)}"`
                    : storagePath
                : ''
        ];
        return { command, args };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvbW9uZ29yZXN0b3JlL3Jlc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFHeEIsT0FBTyxLQUFLLFFBQVEsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBQzdCLE9BQU8sUUFBUSxNQUFNLHNCQUFzQixDQUFDO0FBRzVDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUU1QixNQUFNLENBQUMsT0FBTyxPQUFPLE9BQU87SUFDMUIsWUFBbUIsT0FBZ0IsRUFBUyxLQUFhO1FBQXRDLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO0lBQUcsQ0FBQztJQUV0RCxLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZELE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1QyxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVwRCxxRUFBcUU7UUFDckUsNERBQTREO1FBQzVELGtEQUFrRDtRQUNsRCxzQkFBc0I7UUFDdEIsMkNBQTJDO1FBQzNDLE1BQU0sRUFDSixZQUFZLEVBQ1osY0FBYyxFQUNkLElBQUksRUFDTCxHQUFHLE1BQU0sUUFBUSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELG9FQUFvRTtRQUVwRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElB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