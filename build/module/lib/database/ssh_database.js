import Database from './database';
import * as ssh from '../ssh';
import debug from 'debug';
const dd = debug('SSHDatabase');
export default class SSHDatabase extends Database {
    async connect() {
        if (!this.cluster.sshConnection)
            throw new Error('SSH Tunnel not found!');
        await ssh.connect(this.cluster.sshConnection);
    }
    async listDatabases() {
        return new Promise(resolve => {
            // using mongo with docker
            const command = `mongo --quiet --eval "db.adminCommand('listDatabases')"`;
            ssh.exec(command).subscribe(data => {
                const { databases } = JSON.parse(data);
                dd('listDatabasesInVMViaSSH %o', databases);
                resolve(databases);
            }, err => {
                dd('listDatabasesInVMViaSSH %o', `STDERR :: ${err}`);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2RhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9kYXRhYmFzZS9zc2hfZGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUFRLE1BQU0sWUFBWSxDQUFDO0FBQ2xDLE9BQU8sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFaEMsTUFBTSxDQUFDLE9BQU8sT0FBTyxXQUFZLFNBQVEsUUFBUTtJQUN4QyxLQUFLLENBQUMsT0FBTztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDTSxLQUFLLENBQUMsYUFBYTtRQUN4QixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLDBCQUEwQjtZQUMxQixNQUFNLE9BQU8sR0FBRyx5REFBeUQsQ0FBQztZQUMxRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDekIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsRUFDRCxHQUFHLENBQUMsRUFBRTtnQkFDSixFQUFFLENBQUMsNEJBQTRCLEVBQUUsYUFBYSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YifQ==