import debug from 'debug';
import chalk from 'chalk';
import * as inquirer from '../inquirer';
import Restore from './restore';
import * as ssh from '../ssh';
import * as rsync from '../rsync';
import spawn from '../spawn';
import SSHContainerDatabase from '../database/ssh_container_database';
const dd = debug('RestoreContainer');
export default class RestoreContainer extends Restore {
    async exec() {
        const { dump } = await inquirer.selectDump(this.dumps);
        const dumpObject = this.dumps.find(el => el.path === dump) || { name: '' };
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
        if (requiresSSH === 'Yes') {
            if (!this.cluster.sshConnection)
                throw new Error('SSH Tunnel not found!');
            // copy dumped files from localhost to remote machine with rsync
            const { username, host, privateKey } = this.cluster.sshConnection;
            const dest = `${username}@${host}:~/data-db/mongodumps/dump/`;
            await rsync.exec(dump, dest, privateKey);
            console.log(chalk.green(`Copied files from ${dump} to ${dest}`));
            // copy dump into container
            await this.sshDockerCp(`~/data-db/mongodumps/dump/${dumpObject.name}`, `${containerName}:/home/${dumpObject.name}`);
            console.log(chalk.green(`Copied files into container ${containerName}`));
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
                spawn('docker', dockerArgs).subscribe(data => {
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
                console.log(chalk.red(`dockerCp STDERR: ${data}`));
            }, async () => {
                resolve();
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZV9jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9yZXN0b3JlX2NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sS0FBSyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNoQyxPQUFPLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDN0IsT0FBTyxvQkFBb0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUV0RSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVyQyxNQUFNLENBQUMsT0FBTyxPQUFPLGdCQUFpQixTQUFRLE9BQU87SUFDNUMsS0FBSyxDQUFDLElBQUk7UUFDZixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFFM0UsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFckMsSUFBSSxXQUFXLEtBQUssS0FBSztZQUFFLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhELE1BQU0sUUFBUSxHQUFHLElBQUksb0JBQW9CLENBQUMsSUFBSSxD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