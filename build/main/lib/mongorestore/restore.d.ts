import { Cluster } from '../cluster';
import { Dump } from '../mongodump/dump';
export default class Restore {
    cluster: Cluster;
    dumps: Dump[];
    constructor(cluster: Cluster, dumps: Dump[]);
    exec(): Promise<unknown>;
    getCommand(database: string, storagePath: string, collectionName: string | undefined, drop: boolean): {
        command: string;
        args: string[];
    };
}
