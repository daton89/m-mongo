import { Spinner } from 'clui';
import { MongoClient } from 'mongodb';
import debug from 'debug';

const dd = debug('mongo');

import { Cluster } from '../cluster';
import * as inquirer from '../inquirer';

export default class Database {
  public static async selectDatabase(databases: string[]) {
    const { database } = await inquirer.selectDatabase(databases);

    dd('getDatabase %o', database);

    return database;
  }
  constructor(public cluster: Cluster) {}
  public listDatabases(): Promise<string[]> {
    const status = new Spinner('Connecting to the cluster..., please wait...');
    status.start();

    return new Promise((resolve, reject) => {
      const uri = this.buildUri();

      dd('mongoClient uri %s', uri);

      // Connect using MongoClient
      const client = new MongoClient(uri, { useNewUrlParser: true });

      client.connect((err: Error) => {
        if (err) {
          dd('listDatabasesWithMongoClient %o', err);
          client.close();
          return reject(err);
        }
        // Use the admin database for the operation
        const adminDb = client.db('admin');

        // List all the available databases
        adminDb.executeDbAdminCommand(
          { listDatabases: 1 },
          (e: Error, result: any) => {
            if (e) return reject(err);

            client.close();

            status.stop();

            dd('listDatabasesWithMongoClient %o', result.databases);

            resolve(result.databases.map(({ name }: { name: string }) => name));
          }
        );
      });
    });
  }
  private buildUri() {
    const { type, authEnabled, username, password, uri } = this.cluster;

    const protocol = type === 'ReplicaSet' ? 'mongodb+srv://' : 'mongodb://';

    const auth = authEnabled ? `${username}:${password}@` : '';

    return `${protocol}${auth}${uri}/test`;
  }
}
