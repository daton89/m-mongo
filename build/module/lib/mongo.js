import Configstore from 'configstore';
import { Spinner } from 'clui';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
// import fs from 'fs';
import { spawn } from 'child_process';
import * as inquirer from './inquirer';
const conf = new Configstore('m-mongo');
export async function showMainMenu() {
    const choise = await inquirer.selectMainMenu();
    return choise;
}
export function getClusters() {
    return conf.get('clusters');
}
export async function setMongoCluster() {
    const cluster = await inquirer.askMongoCluster();
    const clusters = conf.get('clusters') || [];
    clusters.push(cluster);
    conf.set({ clusters });
    return cluster;
}
async function listDatabases(cluster) {
    return new Promise((resolve, reject) => {
        const uri = `mongodb+srv://${cluster.username}:${cluster.password}@daton-development-nidnc.mongodb.net/test?retryWrites=true&w=majority`;
        // Connect using MongoClient
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err) => {
            if (err)
                return reject(err);
            // Use the admin database for the operation
            const adminDb = client.db('admin');
            // List all the available databases
            adminDb.executeDbAdminCommand({ listDatabases: 1 }, (err, result) => {
                if (err)
                    return reject(err);
                client.close();
                return resolve(result.databases);
            });
        });
    });
}
function dump(cluster, database, storagePath) {
    return new Promise((resolve, reject) => {
        const status = new Spinner('Dumping..., please wait...');
        status.start();
        var mongodump = spawn('mongodump', [
            '--host',
            cluster.host,
            cluster.ssl === 'Yes' ? '--ssl' : '',
            '--username',
            cluster.username,
            '--password',
            cluster.password,
            '--authenticationDatabase',
            cluster.authenticationDatabase,
            database ? '--db' : '',
            database ? database : '',
            storagePath
        ]);
        console.log('Please visit ' +
            chalk.underline.blue.bold(storagePath) +
            ' and check the ' +
            chalk.cyan.bold(`${database} folder.\n`));
        // const wstream = fs.createWriteStream(dumpFolder);
        mongodump.stdout
            // .pipe(wstream)
            .on('finish', () => {
            console.log(chalk.underline.green.bold('Successfully Completed!'));
            resolve(database);
            status.stop();
        })
            .on('error', err => {
            console.log(err);
            reject(err);
            status.stop();
        });
    });
}
export async function execDump() {
    const clusters = conf.get('clusters');
    const { clusterName } = await inquirer.selectCluster(clusters);
    const cluster = clusters.find((cluster) => cluster.name === clusterName);
    if (!cluster)
        throw new Error('Cluster not found');
    const databases = await listDatabases(cluster);
    const { database } = await inquirer.selectDatabase(databases);
    const { storagePath } = await inquirer.setStoragePath();
    const dumped = await dump(cluster, database, storagePath || conf.get('defaultStoragePath'));
    return dumped;
}
export async function setStoragePath() {
    const storagePath = await inquirer.setStoragePath();
    conf.set('defaultStoragePath', storagePath);
    return storagePath;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21vbmdvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sV0FBVyxNQUFNLGFBQWEsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3RDLHVCQUF1QjtBQUN2QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXRDLE9BQU8sS0FBSyxRQUFRLE1BQU0sWUFBWSxDQUFDO0FBRXZDLE1BQU0sSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXhDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsWUFBWTtJQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUUvQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVc7SUFDekIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGVBQWU7SUFDbkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7SUFFakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUV2QixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWEsQ0FBQyxPQUFnQjtJQUMzQyxPQUFPLElB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