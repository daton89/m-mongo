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
        const uri = `mongodb://${cluster.username}:${cluster.password}@${cluster.host}/test`;
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
        // We need the mongodump bin into our path
        // TODO: check mongobump bin availability otherwise download it
        // https://www.mongodb.com/download-center/community
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