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
        const uri = `mongodb+srv://${cluster.username}:${cluster.password}@daton-development-nidnc.mongodb.net/test?retryWrites=true&w=majority`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21vbmdvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFzQztBQUN0QywrQkFBK0I7QUFDL0Isa0RBQTBCO0FBQzFCLHFDQUFzQztBQUN0Qyx1QkFBdUI7QUFDdkIsaURBQXNDO0FBSXRDLHFEQUF1QztBQUV2QyxNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFakMsS0FBSyxVQUFVLFlBQVk7SUFDaEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFL0MsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUpELG9DQUlDO0FBRUQsU0FBZ0IsV0FBVztJQUN6QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUZELGtDQUVDO0FBRU0sS0FBSyxVQUFVLGVBQWU7SUFDbkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7SUFFakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUV2QixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBVkQsMENBVUM7QUFFRCxLQUFLLFVBQVUsYUFBYSxDQUFDLE9BQWdCO0lBQzNDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsdUVBQXVFLENBQUM7UUFD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