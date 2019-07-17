import { Dump } from './mongodump/dump';
import inquirer from 'inquirer';
import { Cluster } from './cluster';
import { ConnectionParams } from './ssh';
export declare function selectMainMenu(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askMongoCluster(): Promise<Cluster>;
export declare function selectCluster(clusters: Cluster[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function selectDatabase(databases: string[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askStoragePath(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askSshConnection(): Promise<ConnectionParams>;
export declare function useExistingSshConnection(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function selectSshConnection(connections: ConnectionParams[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askSshCommand(connections: ConnectionParams[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askContainerName(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askDatabase(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askRestartOrExit(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function selectContainer(containers: string[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function selectDump(dumps: Dump[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askRestoreOptions(databases: string[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
