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
const database_1 = __importDefault(require("./database"));
const ssh = __importStar(require("../ssh"));
const debug_1 = __importDefault(require("debug"));
const dd = debug_1.default('SSHDatabase');
class SSHDatabase extends database_1.default {
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
exports.default = SSHDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoX2RhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9kYXRhYmFzZS9zc2hfZGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMERBQWtDO0FBQ2xDLDRDQUE4QjtBQUM5QixrREFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRWhDLE1BQXFCLFdBQVksU0FBUSxrQkFBUTtJQUN4QyxLQUFLLENBQUMsT0FBTztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDTSxLQUFLLENBQUMsYUFBYTtRQUN4QixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLDBCQUEwQjtZQUMxQixNQUFNLE9BQU8sR0FBRyx5REFBeUQsQ0FBQztZQUMxRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDekIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsRUFDRCxHQUFHLENBQUMsRUFBRTtnQkFDSixFQUFFLENBQUMsNEJBQTRCLEVBQUUsYUFBYSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFyQkQsOEJBcUJDIn0=