import { ConnectionParams } from './ssh';
export declare function showMainMenu(): Promise<Record<string, any>>;
export declare function getStoragePath(): any;
export declare function setStoragePath(): Promise<any>;
export declare function setSshConnection(): Promise<ConnectionParams>;
export declare function runSshCommand(): Promise<{
    connection: ConnectionParams;
    command: any;
}>;
export declare function showRestartOrExit(): Promise<Record<string, any>>;
