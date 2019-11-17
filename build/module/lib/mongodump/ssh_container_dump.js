import chalk from 'chalk';
import debug from 'debug';
import path from 'path';
import * as ssh from '../ssh';
import * as inquirer from '../inquirer';
import * as rsync from '../rsync';
import * as settings from '../settings';
import { DumpMaker } from './dump';
import Database from '../database/database';
import SSHContainerDatabase from '../database/ssh_container_database';
const dd = debug('SSHContainerDump');
export default class SSHContainerDump extends DumpMaker {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2NvbnRhaW5lcl9kdW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tb25nb2R1bXAvc3NoX2NvbnRhaW5lcl9kdW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBRXhCLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sS0FBSyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sS0FBSyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sS0FBSyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDbkMsT0FBTyxRQUFRLE1BQU0sc0JBQXNCLENBQUM7QUFDNUMsT0FBTyxvQkFBb0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUV0RSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVyQyxNQUFNLENBQUMsT0FBTyxPQUFPLGdCQUFpQixTQUFRLFNBQVM7SUFDOUMsS0FBSyxDQUFDLElBQUk7UUFDZiwwQ0FBMEM7UUFFMUMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRTlDLG9DQUFvQztRQUVwQyxNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxNQUFNLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV6QixNQUFNLFVBQVUsR0FBYSxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU3RCxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FB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