import { Cluster } from '../cluster';
import inquirer from 'inquirer';
export declare function selectMainMenu(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function askMongoCluster(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function selectCluster(clusters: Cluster[]): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function selectDatabase(databases: any): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
export declare function setStoragePath(): Promise<Record<string, any>> & {
    ui: inquirer.ui.PromptUI;
};
