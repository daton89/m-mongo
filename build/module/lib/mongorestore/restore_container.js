import debug from 'debug';
import * as inquirer from '../inquirer';
import Restore from './restore';
import * as ssh from '../ssh';
import spawn from '../spawn';
import SSHContainerDatabase from '../database/ssh_container_database';
const dd = debug('RestoreContainer');
export default class RestoreContainer extends Restore {
    async exec() {
        const { dump } = await inquirer.selectDump(this.dumps);
        const { requiresSSH } = this.cluster;
        if (requiresSSH === 'Yes')
            await this.connect();
        const database = new SSHContainerDatabase(this.cluster);
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
            spawn(command, args).subscribe(data => {
                dd(`STDOUT: ${data}`);
            }, data => {
                dd(`STDERR: ${data}`);
            }, async () => {
                resolve();
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZV9jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9yZXN0b3JlX2NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFMUIsT0FBTyxLQUFLLFFBQVEsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUM3QixPQUFPLG9CQUFvQixNQUFNLG9DQUFvQyxDQUFDO0FBRXRFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRXJDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sZ0JBQWlCLFNBQVEsT0FBTztJQUM1QyxLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZELE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXJDLElBQUksV0FBVyxLQUFLLEtBQUs7WUFBRSxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoRCxNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0RCxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhFLE1BQU0sWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLDBCQUEwQixDQUM1RCxhQUFhLENBQ2QsQ0FB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