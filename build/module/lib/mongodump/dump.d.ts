import { Cluster } from '../cluster';
export interface Dump {
    name: string;
    path: string;
    createdOn: string;
}
export declare class DumpMaker {
    cluster: Cluster;
    static getDumps(): Dump[];
    constructor(cluster: Cluster);
    exec(): Promise<unknown>;
    getCommand(database: string, storagePath: string): {
        command: string;
        args: string[];
    };
    setDump(storagePath: string, name: string, createdOn: string): void;
    getDumpDate(): string;
}
