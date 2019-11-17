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
const ssh = __importStar(require("../ssh"));
const inquirer = __importStar(require("../inquirer"));
const rsync = __importStar(require("../rsync"));
const settings = __importStar(require("../settings"));
const dump_1 = require("./dump");
const database_1 = __importDefault(require("../database/database"));
const ssh_container_database_1 = __importDefault(require("../database/ssh_container_database"));
const dd = debug_1.default('SSHContainerDump');
class SSHContainerDump extends dump_1.DumpMaker {
    async exec() {
        // const { sshConnection } = this.cluster;
        const storagePath = settings.getStoragePath();
        // await ssh.connect(sshConnection);
        const database = new ssh_container_database_1.default(this.cluster);
        await database.connect();
        const containers = await database.listContainers();
        const { containerName } = await inquirer.selectContainer(containers);
        const databaseList = await database.listDatabasesFromContainer(containerName);
        const databaseName = await database_1.default.selectDatabase(databaseList);
        const { command, args } = this.getCommand(databaseName, '');
        return new Promise(async (resolve, reject) => {
            // using mongo with docker
            const dockerCommand = ['docker', 'exec', containerName, command, ...args];
            await this.dockerExec(dockerCommand.join(' '));
            // copy dumped files from container to host
            const folderOnTheHost = '~/data-db/mongodumps';
            await this.dockerCp(containerName, folderOnTheHost);
            if (!this.cluster.sshConnection)
                throw new Error('SSH Tunnel not found!');
            // copy dumped files from host to localhost
            const { username, host, privateKey } = this.cluster.sshConnection;
            const src = `${username}@${host}:${folderOnTheHost}/dump/*`;
            const dumpDate = this.getDumpDate();
            const dest = path_1.default.join(storagePath, dumpDate);
            try {
                // TODO: avoid that on local we find mongodump/dump folder
                await rsync.exec(src, dest, privateKey);
                this.setDump(storagePath, databaseName, dumpDate);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    // copy dumped files from container to host
    dockerCp(containerName, folderOnTheHost) {
        return new Promise(resolve => {
            const command = `rm -rf ${folderOnTheHost} && mkdir -p ${folderOnTheHost} && docker cp ${containerName}:./dump/ ${folderOnTheHost}`;
            dd('dockerCp %o', command);
            ssh.exec(command).subscribe(data => {
                dd('dockerCp %s', `STDOUT: ${data}`);
            }, data => {
                console.log(chalk_1.default.red(`dockerCp STDERR: ${data}`));
            }, async () => {
                resolve();
            });
        });
    }
    dockerExec(command) {
        return new Promise(resolve => {
            dd('dockerExec %o', command);
            ssh.exec(command).subscribe(data => {
                dd('dockerExec %o', `STDOUT: ${data}`);
            }, data => {
                console.log(chalk_1.default.red(`dockerExec STDERR: ${data}`));
            }, async () => {
                resolve();
            });
        });
    }
}
exports.default = SSHContainerDump;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2NvbnRhaW5lcl9kdW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tb25nb2R1bXAvc3NoX2NvbnRhaW5lcl9kdW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUMxQixrREFBMEI7QUFDMUIsZ0RBQXdCO0FBRXhCLDRDQUE4QjtBQUM5QixzREFBd0M7QUFDeEMsZ0RBQWtDO0FBQ2xDLHNEQUF3QztBQUN4QyxpQ0FBbUM7QUFDbkMsb0VBQTRDO0FBQzVDLGdHQUFzRTtBQUV0RSxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVyQyxNQUFxQixnQkFBaUIsU0FBUSxnQkFBUztJQUM5QyxLQUFLLENBQUMsSUFBSTtRQUNmLDBDQUEwQztRQUUxQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFOUMsb0NBQW9DO1FBRXBDLE1BQU0sUUFBUSxHQUFHLElBQUksZ0NBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELE1BQU0sUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXpCLE1BQU0sVUFBVSxHQUFhLE1BQU0sUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRTdELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckUsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsMEJBQTBCLENBQzVELGFBQWEsQ0FDZCxDQUFDO1FBRUYsTUFBTSxZQUFZLEdBQUcsTUFBTSxrQkFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVqRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTVELE9B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