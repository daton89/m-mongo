import { Spinner } from 'clui';
import { MongoClient } from 'mongodb';
import debug from 'debug';
const dd = debug('mongo');
import * as inquirer from '../inquirer';
export default class Database {
    constructor(cluster) {
        this.cluster = cluster;
    }
    static async selectDatabase(databases) {
        const { database } = await inquirer.selectDatabase(databases);
        dd('getDatabase %o', database);
        return database;
    }
    listDatabases() {
        const status = new Spinner('Connecting to the cluster..., please wait...');
        status.start();
        return new Promise((resolve, reject) => {
            const uri = this.buildUri();
            dd('mongoClient uri %s', uri);
            // Connect using MongoClient
            const client = new MongoClient(uri, { useNewUrlParser: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2RhdGFiYXNlL2RhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUN0QyxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFMUIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRzFCLE9BQU8sS0FBSyxRQUFRLE1BQU0sYUFBYSxDQUFDO0FBRXhDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sUUFBUTtJQVMzQixZQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQVJoQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFtQjtRQUNwRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvQixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBSU0sYUFBYTtRQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVmLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUU5Qiw0QkFBNEI7WUFDNUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFFL0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO2dCQUM1QixJQUFJLEdBQUcsRUFBRTtvQkFDUCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzNDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDZixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDcEI7Z0JBQ0QsMkNBQTJDO2dCQUMzQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVuQyxtQ0FBbUM7Z0JBQ25DLE9BQU8sQ0FBQyxxQkFBcUIsQ0FDM0IsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQ3BCLENBQUMsQ0FBUSxFQUFFLE1BQVcsRUFBRSxFQUFFO29CQUN4QixJQUFJLENBQUM7d0JBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRTFCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFFZixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRWQsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFFeEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQW9CLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLENBQUMsQ0FDRixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDTyxRQUFRO1FBQ2QsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXBFLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFFekUsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTNELE9BQU8sR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDO0lBQ3pDLENBQUM7Q0FDRiJ9