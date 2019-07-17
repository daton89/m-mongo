import Database from './database';
export default class SSHDatabase extends Database {
    connect(): Promise<void>;
    listDatabases(): Promise<string[]>;
}
