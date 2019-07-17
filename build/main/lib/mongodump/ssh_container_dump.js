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
const dump_1 = __importDefault(require("./dump"));
const database_1 = __importDefault(require("../database/database"));
const ssh_container_database_1 = __importDefault(require("../database/ssh_container_database"));
const dd = debug_1.default('SSHContainerDump');
class SSHContainerDump extends dump_1.default {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2NvbnRhaW5lcl9kdW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tb25nb2R1bXAvc3NoX2NvbnRhaW5lcl9kdW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUMxQixrREFBMEI7QUFDMUIsZ0RBQXdCO0FBRXhCLDRDQUE4QjtBQUM5QixzREFBd0M7QUFDeEMsZ0RBQWtDO0FBQ2xDLHNEQUF3QztBQUN4QyxrREFBMEI7QUFDMUIsb0VBQTRDO0FBQzVDLGdHQUFzRTtBQUV0RSxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVyQyxNQUFxQixnQkFBaUIsU0FBUSxjQUFJO0lBQ3pDLEtBQUssQ0FBQyxJQUFJO1FBQ2YsMENBQTBDO1FBRTFDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU5QyxvQ0FBb0M7UUFFcEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxnQ0FBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEQsTUFBTSxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFekIsTUFBTSxVQUFVLEdBQWEsTUFBTSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFN0QsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyRSxNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQywwQkFBMEIsQ0FDNUQsYUFBYSxDQUNkLENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxNQUFNLGtCQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWpFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFNUQsT0FB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