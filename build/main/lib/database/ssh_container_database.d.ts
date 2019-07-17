import SSHDatabase from './ssh_database';
export default class SSHContainerDatabase extends SSHDatabase {
    listContainers(): Promise<string[]>;
    listDatabasesFromContainer(containerName: string): Promise<string[]>;
}
