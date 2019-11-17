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
const clui_1 = require("clui");
const mongodb_1 = require("mongodb");
const debug_1 = __importDefault(require("debug"));
const dd = debug_1.default('mongo');
const inquirer = __importStar(require("../inquirer"));
class Database {
    constructor(cluster) {
        this.cluster = cluster;
    }
    static async selectDatabase(databases) {
        const { database } = await inquirer.selectDatabase(databases);
        dd('getDatabase %o', database);
        return database;
    }
    listDatabases() {
        const status = new clui_1.Spinner('Connecting to the cluster..., please wait...');
        status.start();
        return new Promise((resolve, reject) => {
            const uri = this.buildUri();
            dd('mongoClient uri %s', uri);
            // Connect using MongoClient
            const client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true });
            client.connect((err) => {
                if (err) {
                    dd('listDatabasesWithMongoClient %o', err);
                    client.close();
                    return reject(err);
                }
                // Use the admin database for the operation
                const adminDb = client.db('admin');
                // List all the available databases
                adminDb.executeDbAdminCommand({ listDatabases: 1 }, (e, result) => {
                    if (e)
                        return reject(err);
                    client.close();
                    status.stop();
                    dd('listDatabasesWithMongoClient %o', result.databases);
                    resolve(result.databases.map(({ name }) => name));
                });
            });
        });
    }
    buildUri() {
        const { type, authEnabled, username, password, uri } = this.cluster;
        const protocol = type === 'ReplicaSet' ? 'mongodb+srv://' : 'mongodb://';
        const auth = authEnabled ? `${username}:${password}@` : '';
        return `${protocol}${auth}${uri}/test`;
    }
}
exports.default = Database;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2RhdGFiYXNlL2RhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUMvQixxQ0FBc0M7QUFDdEMsa0RBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUcxQixzREFBd0M7QUFFeEMsTUFBcUIsUUFBUTtJQVMzQixZQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQVJoQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFtQjtRQUNwRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvQixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBSU0sYUFBYTtRQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVmLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUU5Qiw0QkFBNEI7WUFDNUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRS9ELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2YsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3BCO2dCQUNELDJDQUEyQztnQkFDM0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFbkMsbUNBQW1DO2dCQUNuQyxPQUFPLENBQUMscUJBQXFCLENBQzNCLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUNwQixDQUFDLENBQVEsRUFBRSxNQUFXLEVBQUUsRUFBRTtvQkFDeEIsSUFBSSxDQUFDO3dCQUFFLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUUxQixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRWYsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUVkLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBRXhELE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDLENBQ0YsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ08sUUFBUTtRQUNkLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVwRSxNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO1FBRXpFLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUUzRCxPQUFPLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUEzREQsMkJBMkRDIn0=