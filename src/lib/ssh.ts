import chalk from 'chalk';
import fs from 'fs';
import { Spinner } from 'clui';
import { Client } from 'ssh2';

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

export function exec(command: string) {
  const status = new Spinner('Executings command..., please wait...');
  status.start();
  return new Promise((resolve, reject) => {
    conn.exec(command, (err: Error, stream: any) => {
      if (err) {
        status.stop();
        return reject(err);
      }
      stream
        .on('close', (code: any, signal: any) => {
          console.log(
            chalk.cyan(`Stream :: close :: code: ${code} signal: ${signal}`)
          );
        })
        .on('data', (data: any) => {
          status.stop();
          console.log(chalk.green(`STDOUT: ${data}`));
          resolve(data);
        })
        .stderr.on('data', (data: any) => {
          status.stop();
          console.log(chalk.red(`STDERR: ${data}`));
          reject();
        });
    });
  });
}

export function end() {
  return new Promise(resolve => {
    conn.end();
    conn.on('end', () => {
      resolve()
    })
  })
}
