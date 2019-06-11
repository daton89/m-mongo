import { ConnectionParams } from './ssh';
export interface Cluster {
  name: string,
  runningOn: string,
  type: string,
  accessMethod: string,
  requiresSSH: string,
  uri: string,
  host: string,
  ssl: string,
  username: string,
  password: string,
  authenticationDatabase: string,
  sshConnection: ConnectionParams
}
