import chalk from 'chalk';
import fs from 'fs';
import { Spinner } from 'clui';
import { Client } from 'ssh2';
import { Observable } from 'rxjs';

const conn = new Client();

export interface ConnectionParams {
  host: string;
  port: number;
  username: string;
  privateKey: string | Buffer;
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
        console.log(chalk.cyan('SSH Client :: ready'));
        resolve();
      })
      .on('error', () => {
        status.stop();
        console.log(chalk.red('SSH Connection :: failed'));
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
        return observer.error(err);
      }

      stream.stderr.on('data', (data: Buffer) => {
        status.stop();
        observer.next(data.toString());
      });

      stream.stdout.on('data', (data: Buffer) => {
        status.stop();
        observer.next(data.toString());
      });

      stream.on('close', (code: any, signal: any) => {
        status.stop();
        if (code === 0) {
          console.log(chalk.green(`Command ${chalk.cyan(command)} Completed!`));
        } else {
          console.log(chalk.red(`Command ${chalk.cyan(command)} Failed!`));
        }
        console.log(
          chalk.cyan(`Stream :: close :: code: ${code} signal: ${signal}`)
        );
        observer.complete();
      });
    });
  });
}

export function end() {
  return new Promise(resolve => {
    conn.end();
    conn.on('end', () => {
      console.log(chalk.cyan('SSH Client :: ended'));
      resolve();
    });
  });
}
