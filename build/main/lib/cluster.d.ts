import { ConnectionParams } from './ssh';
export interface Cluster {
    name: string;
    type: string;
    runningOn: string;
    requiresSSH: string;
    accessMethod: string;
    uri: string;
    host: string;
    ssl: string;
    authEnabled: boolean;
    username?: string;
    password?: string;
    authenticationDatabase?: string;
    sshConnection?: ConnectionParams;
}
export declare class ClusterManager {
    static showClusters(): void;
    static create(): Promise<Cluster>;
    static getCluster(): Promise<Cluster>;
    private static getClusters;
}
