import * as inquirer from './inquirer';
import conf from './conf';
import chalk from 'chalk';
import { connect, exec, ConnectionParams, end } from './ssh';

export async function showMainMenu() {
  const answer = await inquirer.selectMainMenu();

  return answer;
}

export async function setStoragePath() {
  const storagePath = await inquirer.askStoragePath();

  conf.set('settings.defaultStoragePath', storagePath);

  return storagePath;
}

export async function setSshConnection() {
  const answer = await inquirer.askSshConnection();

  const sshConnections: ConnectionParams[] = conf.get('sshConnections') || [];

  conf.set('sshConnections', [...sshConnections, answer]);

  console.log(`${chalk.bold.cyan('New connection saved:')}
    ${chalk.cyan('Host:')} ${chalk.magenta(answer.host)}
    ${chalk.cyan('Port:')} ${chalk.magenta(answer.port)}
    ${chalk.cyan('Username:')} ${chalk.magenta(answer.username)}
    ${chalk.cyan('PrivateKey:')} ${chalk.magenta(answer.privateKey)}
  `);

  return answer;
}

export async function runSshCommand() {
  const connections = conf.get('sshConnections') || [];

  if (!connections.length) {
    console.log(
      chalk.yellow(`Ooops, no ssh connections found, let's setup a new one!`)
    );
    const conn = await setSshConnection();
    connections.push(conn);
  }

  const { connectionHost, command } = await inquirer.askSshCommand(connections);

  const connection: ConnectionParams = connections.find(
    ({ host }: ConnectionParams) => host === connectionHost
  );

  await connect(connection);

  await exec(command);

  end();

  return { connection, command };
}

export async function showRestartOrExit() {
  const answer = await inquirer.askRestartOrExit();
  return answer;
}
