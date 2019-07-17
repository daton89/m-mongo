import SSHDatabase from './ssh_database';
import * as ssh from '../ssh';
import debug from 'debug';
import * as inquirer from '../inquirer';
const dd = debug('SSHDatabase');
export default class SSHContainerDatabase extends SSHDatabase {
    async listContainers() {
        return new Promise(resolve => {
            // get list of running containers
            const command = `docker ps --format '"{{.Names}}"',`;
            ssh.exec(command).subscribe(data => {
                const containers = JSON.parse(`[${data.slice(0, -2)}]`);
                dd('listContainersOverSSH %o', containers);
                resolve(containers);
            }, async (err) => {
                dd('listContainersOverSSH %o', `STDERR :: ${err}`);
                const { containerName } = await inquirer.askContainerName();
                resolve([containerName]);
            });
        });
    }
    async listDatabasesFromContainer(containerName) {
        return new Promise(resolve => {
            // using mongo with docker
            const command = `docker exec ${containerName} mongo --quiet --eval "db.adminCommand('listDatabases')"`;
            ssh.exec(command).subscribe(data => {
                const { databases } = JSON.parse(data);
                dd('listDatabasesFromContainer %o', databases);
                resolve(databases.map(({ name }) => name));
            }, err => {
                dd('listDatabasesFromContainer %o', `STDERR :: ${err}`);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2NvbnRhaW5lcl9kYXRhYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvZGF0YWJhc2Uvc3NoX2NvbnRhaW5lcl9kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFdBQVcsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFMUIsT0FBTyxLQUFLLFFBQVEsTUFBTSxhQUFhLENBQUM7QUFFeEMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRWhDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sb0JBQXFCLFNBQVEsV0FBVztJQUNwRCxLQUFLLENBQUMsY0FBYztRQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLGlDQUFpQztZQUNqQyxNQUFNLE9BQU8sR0FBRyxvQ0FBb0MsQ0FBQztZQUNyRCxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDekIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsTUFBTSxVQUFVLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRSxFQUFFLENBQUMsMEJBQTBCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0QixDQUFDLEVBQ0QsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO2dCQUNWLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxhQUFhLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUM1RCxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ00sS0FBSyxDQUFDLDBCQUEwQixDQUNyQyxhQUFxQjtRQUVyQixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLDBCQUEwQjtZQUMxQixNQUFNLE9BQU8sR0FBRyxlQUFlLGFBQWEsMERBQTBELENBQUM7WUFDdkcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQ3pCLElBQUksQ0FBQyxFQUFFO2dCQUNMLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxFQUFFLENBQUMsK0JBQStCLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQW9CLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0QsQ0FBQyxFQUNELEdBQUcsQ0FBQyxFQUFFO2dCQUNKLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxhQUFhLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiJ9