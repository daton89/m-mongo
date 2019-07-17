import { Cluster } from '../cluster';
export default class Database {
    cluster: Cluster;
    static selectDatabase(databases: string[]): Promise<any>;
    constructor(cluster: Cluster);
    listDatabases(): Promise<string[]>;
    private buildUri;
}
