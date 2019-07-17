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
const ssh_database_1 = __importDefault(require("./ssh_database"));
const ssh = __importStar(require("../ssh"));
const debug_1 = __importDefault(require("debug"));
const inquirer = __importStar(require("../inquirer"));
const dd = debug_1.default('SSHDatabase');
class SSHContainerDatabase extends ssh_database_1.default {
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
exports.default = SSHContainerDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2NvbnRhaW5lcl9kYXRhYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvZGF0YWJhc2Uvc3NoX2NvbnRhaW5lcl9kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrRUFBeUM7QUFDekMsNENBQThCO0FBQzlCLGtEQUEwQjtBQUUxQixzREFBd0M7QUFFeEMsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRWhDLE1BQXFCLG9CQUFxQixTQUFRLHNCQUFXO0lBQ3BELEtBQUssQ0FBQyxjQUFjO1FBQ3pCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsaUNBQWlDO1lBQ2pDLE1BQU0sT0FBTyxHQUFHLG9DQUFvQyxDQUFDO1lBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUN6QixJQUFJLENBQUMsRUFBRTtnQkFDTCxNQUFNLFVBQVUsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xFLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDM0MsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsRUFDRCxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7Z0JBQ1YsRUFBRSxDQUFDLDBCQUEwQixFQUFFLGFBQWEsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQzVELE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDTSxLQUFLLENBQUMsMEJBQTBCLENBQ3JDLGFBQXFCO1FBRXJCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsMEJBQTBCO1lBQzFCLE1BQU0sT0FBTyxHQUFHLGVBQWUsYUFBYSwwREFBMEQsQ0FBQztZQUN2RyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDekIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBb0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDLEVBQ0QsR0FBRyxDQUFDLEVBQUU7Z0JBQ0osRUFBRSxDQUFDLCtCQUErQixFQUFFLGFBQWEsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBckNELHVDQXFDQyJ9