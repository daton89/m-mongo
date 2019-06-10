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
const configstore_1 = __importDefault(require("configstore"));
const clui_1 = require("clui");
const chalk_1 = __importDefault(require("chalk"));
const mongodb_1 = require("mongodb");
// import fs from 'fs';
const child_process_1 = require("child_process");
const inquirer = __importStar(require("./inquirer"));
const conf = new configstore_1.default('m-mongo');
async function showMainMenu() {
    const choise = await inquirer.selectMainMenu();
    return choise;
}
exports.showMainMenu = showMainMenu;
function getClusters() {
    return conf.get('clusters');
}
exports.getClusters = getClusters;
async function setMongoCluster() {
    const cluster = await inquirer.askMongoCluster();
    const clusters = conf.get('clusters') || [];
    clusters.push(cluster);
    conf.set({ clusters });
    return cluster;
}
exports.setMongoCluster = setMongoCluster;
async function listDatabases(cluster) {
    return new Promise((resolve, reject) => {
        const uri = `mongodb://${cluster.username}:${cluster.password}@${cluster.host}/test`;
        // Connect using MongoClient
        const client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true });
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
        const status = new clui_1.Spinner('Dumping..., please wait...');
        status.start();
        var mongodump = child_process_1.spawn('mongodump', [
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
            chalk_1.default.underline.blue.bold(storagePath) +
            ' and check the ' +
            chalk_1.default.cyan.bold(`${database} folder.\n`));
        // const wstream = fs.createWriteStream(dumpFolder);
        // We need the mongodump bin into our path
        // TODO: check mongobump bin availability otherwise download it
        // https://www.mongodb.com/download-center/community
        mongodump.stdout
            // .pipe(wstream)
            .on('finish', () => {
            console.log(chalk_1.default.underline.green.bold('Successfully Completed!'));
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
async function execDump() {
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
exports.execDump = execDump;
async function setStoragePath() {
    const storagePath = await inquirer.setStoragePath();
    conf.set('defaultStoragePath', storagePath);
    return storagePath;
}
exports.setStoragePath = setStoragePath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21vbmdvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFzQztBQUN0QywrQkFBK0I7QUFDL0Isa0RBQTBCO0FBQzFCLHFDQUFzQztBQUN0Qyx1QkFBdUI7QUFDdkIsaURBQXNDO0FBSXRDLHFEQUF1QztBQUV2QyxNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFakMsS0FBSyxVQUFVLFlBQVk7SUFDaEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFL0MsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUpELG9DQUlDO0FBRUQsU0FBZ0IsV0FBVztJQUN6QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUZELGtDQUVDO0FBRU0sS0FBSyxVQUFVLGVBQWU7SUFDbkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7SUFFakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUV2QixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBVkQsMENBVUM7QUFFRCxLQUFLLFVBQVUsYUFBYSxDQUFDLE9BQWdCO0lBQzNDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsTUFBTSxHQUFHLEdBQUcsYUFBYSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLElB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