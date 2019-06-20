import Database from './database';
import * as ssh from '../ssh';
import debug from 'debug';

const dd = debug('SSHDatabase');

export default class SSHDatabase extends Database {
  public async connect() {
    if (!this.cluster.sshConnection) throw new Error('SSH Tunnel not found!')
    await ssh.connect(this.cluster.sshConnection);
  }
  public async listDatabases(): Promise<string[]> {
    return new Promise(resolve => {
      // using mongo with docker
      const command = `mongo --quiet --eval "db.adminCommand('listDatabases')"`;
      ssh.exec(command).subscribe(
        data => {
          const { databases } = JSON.parse(data);
          dd('listDatabasesInVMViaSSH %o', databases);
          resolve(databases);
        },
        err => {
          dd('listDatabasesInVMViaSSH %o', `STDERR :: ${err}`);
        }
      );
    });
  }
}
