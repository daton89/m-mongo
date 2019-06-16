import fs from 'fs';
import { Spinner } from 'clui';
import { Client } from 'ssh2';
import { Observable } from 'rxjs';
import debug from 'debug';

const conn = new Client();
const dd = debug('ssh');

export interface ConnectionParams {
  host: string;
  port: number;
  username: string;
  privateKey: string;
}

export function connect(connectionParams: ConnectionParams) {
  const status = new Spinner(
    `Connecting to: ${connectionParams.username}@${connectionParams.host}..., please wait...`
  );
  status.start();
  return new Promise((resolve, reject) => {
    conn.connect({
      ...connectionParams,
      privateKey: fs.readFileSync(connectionParams.privateKey)
    });

    conn
      .on('ready', () => {
        status.stop();
        dd('SSH Client :: ready');
        resolve();
      })
      .on('error', () => {
        status.stop();
        dd('SSH Connection :: failed');
        reject();
      });
  });
}

export function exec(command: string): Observable<string> {
  const status = new Spinner('Executings command..., please wait...');
  status.start();
  return new Observable(observer => {
    conn.exec(command, (err: Error, stream: any) => {
      if (err) {
        status.stop();
        dd('error %o', err);
        return observer.error(err);
      }

      stream.stderr.on('data', (data: Buffer) => {
        status.stop();
        dd('STDERR :: %o', data.toString());
        observer.next(data.toString());
      });

      stream.stdout.on('data', (data: Buffer) => {
        status.stop();
        dd('STDOUT :: %o', data.toString());
        observer.next(data.toString());
      });

      stream.on('close', (code: any, signal: any) => {
        status.stop();
        if (code === 0) {
          dd(`Command ${command} Completed!`);
        } else {
          dd(`Command ${command} Failed!`);
        }
        dd(`Stream :: close :: code: ${code} signal: ${signal}`);
        observer.complete();
      });
    });
  });
}

export function end() {
  return new Promise(resolve => {
    conn.end();
    conn.on('end', () => {
      dd('SSH Client :: ended');
      resolve();
    });
  });
}
