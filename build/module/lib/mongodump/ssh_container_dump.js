import chalk from 'chalk';
import debug from 'debug';
import path from 'path';
import * as ssh from '../ssh';
import * as inquirer from '../inquirer';
import * as rsync from '../rsync';
import * as settings from '../settings';
import Dump from './dump';
import Database from '../database/database';
import SSHContainerDatabase from '../database/ssh_container_database';
const dd = debug('SSHContainerDump');
export default class SSHContainerDump extends Dump {
    async exec() {
        // const { sshConnection } = this.cluster;
        const storagePath = settings.getStoragePath();
        // await ssh.connect(sshConnection);
        const database = new SSHContainerDatabase(this.cluster);
        await database.connect();
        const containers = await database.listContainers();
        const { containerName } = await inquirer.selectContainer(containers);
        const databaseList = await database.listDatabasesFromContainer(containerName);
        const databaseName = await Database.selectDatabase(databaseList);
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
            const dest = path.join(storagePath, dumpDate);
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
                console.log(chalk.red(`dockerCp STDERR: ${data}`));
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
                console.log(chalk.red(`dockerExec STDERR: ${data}`));
            }, async () => {
                resolve();
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2NvbnRhaW5lcl9kdW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tb25nb2R1bXAvc3NoX2NvbnRhaW5lcl9kdW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBRXhCLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sS0FBSyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sS0FBSyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sS0FBSyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sSUFBSSxNQUFNLFFBQVEsQ0FBQztBQUMxQixPQUFPLFFBQVEsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLG9CQUFvQixNQUFNLG9DQUFvQyxDQUFDO0FBRXRFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRXJDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sZ0JBQWlCLFNBQVEsSUFBSTtJQUN6QyxLQUFLLENBQUMsSUFBSTtRQUNmLDBDQUEwQztRQUUxQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFOUMsb0NBQW9DO1FBRXBDLE1BQU0sUUFBUSxHQUFHLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELE1BQU0sUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXpCLE1BQU0sVUFBVSxHQUFhLE1BQU0sUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRTdELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckUsTUFBTSxZ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