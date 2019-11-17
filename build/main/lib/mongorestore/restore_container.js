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
const debug_1 = __importDefault(require("debug"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer = __importStar(require("../inquirer"));
const restore_1 = __importDefault(require("./restore"));
const ssh = __importStar(require("../ssh"));
const rsync = __importStar(require("../rsync"));
const spawn_1 = __importDefault(require("../spawn"));
const ssh_container_database_1 = __importDefault(require("../database/ssh_container_database"));
const dd = debug_1.default('RestoreContainer');
class RestoreContainer extends restore_1.default {
    async exec() {
        const { dump } = await inquirer.selectDump(this.dumps);
        const dumpObject = this.dumps.find(el => el.path === dump) || { name: '' };
        const { requiresSSH } = this.cluster;
        if (requiresSSH === 'Yes')
            await this.connect();
        const database = new ssh_container_database_1.default(this.cluster);
        const containerList = await database.listContainers();
        const { containerName } = await inquirer.selectContainer(containerList);
        const databaseList = await database.listDatabasesFromContainer(containerName);
        // const databaseName = await SSHContainerDatabase.selectDatabase(databaseList);
        // ask to restore into an existing db or you need to create a new one
        // ask to select database from list or ask the database name
        // ask to restore only a collection or all of them
        // ask collection name
        // ask if you want to drop existing records
        const { databaseName, collectionName, drop } = await inquirer.askRestoreOptions(databaseList);
        if (requiresSSH === 'Yes') {
            if (!this.cluster.sshConnection)
                throw new Error('SSH Tunnel not found!');
            // copy dumped files from localhost to remote machine with rsync
            const { username, host, privateKey } = this.cluster.sshConnection;
            const dest = `${username}@${host}:~/data-db/mongodumps/dump/`;
            await rsync.exec(dump, dest, privateKey);
            console.log(chalk_1.default.green(`Copied files from ${dump} to ${dest}`));
            // copy dump into container
            await this.sshDockerCp(`~/data-db/mongodumps/dump/${dumpObject.name}`, `${containerName}:/home/${dumpObject.name}`);
            console.log(chalk_1.default.green(`Copied files into container ${containerName}`));
            // build command and execute
            const { command, args } = this.getCommand(databaseName, `/home/${dumpObject.name}`, collectionName, drop);
            const dockerExec = ['docker', 'exec', containerName, command, ...args];
            return new Promise(resolve => {
                ssh.exec(dockerExec.join(' ')).subscribe(data => {
                    dd(`STDOUT: ${data}`);
                }, data => {
                    dd(`STDERR: ${data}`);
                }, async () => {
                    resolve();
                });
            });
        }
        else {
            const { command, args } = this.getCommand(databaseName, dump, collectionName, drop);
            const dockerArgs = ['exec', containerName, command, ...args];
            // using docker in local
            return new Promise(resolve => {
                spawn_1.default('docker', dockerArgs).subscribe(data => {
                    dd(`STDOUT: ${data}`);
                }, data => {
                    dd(`STDERR: ${data}`);
                }, async () => {
                    resolve();
                });
            });
        }
    }
    async connect() {
        if (!this.cluster.sshConnection)
            throw new Error('SSH Tunnel not found!');
        await ssh.connect(this.cluster.sshConnection);
    }
    // copy dumped files from host to container
    sshDockerCp(src, dest) {
        return new Promise(resolve => {
            const command = `docker cp ${src} ${dest}`;
            dd('sshDockerCp %o', command);
            ssh.exec(command).subscribe(data => {
                dd('dockerCp %s', `STDOUT: ${data}`);
            }, data => {
                console.log(chalk_1.default.red(`dockerCp STDERR: ${data}`));
            }, async () => {
                resolve();
            });
        });
    }
}
exports.default = RestoreContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZV9jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9yZXN0b3JlX2NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsa0RBQTBCO0FBRTFCLHNEQUF3QztBQUN4Qyx3REFBZ0M7QUFDaEMsNENBQThCO0FBQzlCLGdEQUFrQztBQUNsQyxxREFBNkI7QUFDN0IsZ0dBQXNFO0FBRXRFLE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRXJDLE1BQXFCLGdCQUFpQixTQUFRLGlCQUFPO0lBQzVDLEtBQUssQ0FBQyxJQUFJO1FBQ2YsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBRTNFLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXJDLElBQUksV0FBVyxLQUFLLEtBQUs7WUFBRSxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGdDQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0RCxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhFLE1BQU0sWUFBWSxHQUFHLE1B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