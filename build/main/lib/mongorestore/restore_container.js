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
const inquirer = __importStar(require("../inquirer"));
const restore_1 = __importDefault(require("./restore"));
const ssh = __importStar(require("../ssh"));
const spawn_1 = __importDefault(require("../spawn"));
const ssh_container_database_1 = __importDefault(require("../database/ssh_container_database"));
const dd = debug_1.default('RestoreContainer');
class RestoreContainer extends restore_1.default {
    async exec() {
        const { dump } = await inquirer.selectDump(this.dumps);
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
        const { command, args } = await this.getCommand(databaseName, dump, collectionName, drop);
        const dockerExec = ['docker', 'exec', containerName, command, ...args];
        if (requiresSSH === 'Yes') {
            await this.sshDocker(dockerExec.join(' '));
        }
        else {
            const [dockerCommand, ...dockerArgs] = dockerExec;
            await this.spawnDocker(dockerCommand, dockerArgs);
        }
    }
    async connect() {
        if (!this.cluster.sshConnection)
            throw new Error('SSH Tunnel not found!');
        await ssh.connect(this.cluster.sshConnection);
    }
    sshDocker(command) {
        return new Promise(resolve => {
            // using docker in remote
            ssh.exec(command).subscribe(data => {
                dd(`STDOUT: ${data}`);
            }, data => {
                dd(`STDERR: ${data}`);
            }, async () => {
                resolve();
            });
        });
    }
    spawnDocker(command, args) {
        return new Promise(resolve => {
            // using docker in local
            spawn_1.default(command, args).subscribe(data => {
                dd(`STDOUT: ${data}`);
            }, data => {
                dd(`STDERR: ${data}`);
            }, async () => {
                resolve();
            });
        });
    }
}
exports.default = RestoreContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZV9jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9yZXN0b3JlX2NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsc0RBQXdDO0FBQ3hDLHdEQUFnQztBQUNoQyw0Q0FBOEI7QUFDOUIscURBQTZCO0FBQzdCLGdHQUFzRTtBQUV0RSxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVyQyxNQUFxQixnQkFBaUIsU0FBUSxpQkFBTztJQUM1QyxLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZELE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXJDLElBQUksV0FBVyxLQUFLLEtBQUs7WUFBRSxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGdDQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0RCxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhFLE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLDBCQUEwQixDQUM1RCxhQUFhLENBQ2QsQ0FBQztRQUVGLGdGQUFnRjtRQUVoRixxRUFBcUU7UUFDckUsNERBQTREO1FBQzVELGtEQUFrRDtRQUNsRCxzQkFBc0I7UUFDdEIsMkNBQTJDO1FBQzNDLE1BQU0sRUFDSixZQUFZLEVBQ1osY0FBYyxFQUNkLElBQUksRUFDTCxHQUFHLE1BQU0sUUFBUSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUM3QyxZQUFZLEVBQ1osSUFBSSxFQUNKLGNBQWMsRUFDZCxJQUFJLENBQ0wsQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFdkUsSUFBSSxXQUFXLEtBQUssS0FBSyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDbEQsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFFTyxLQUFLLENBQUMsT0FBTztRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTyxTQUFTLENBQUMsT0FBZTtRQUMvQixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLHlCQUF5QjtZQUN6QixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDekIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4QixDQUFDLEVBQ0QsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4QixDQUFDLEVBQ0QsS0FBSyxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFdBQVcsQ0FBQyxPQUFlLEVBQUUsSUFBYztRQUNqRCxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLHdCQUF3QjtZQUN4QixlQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FDNUIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4QixDQUFDLEVBQ0QsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4QixDQUFDLEVBQ0QsS0FBSyxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdEZELG1DQXNGQyJ9