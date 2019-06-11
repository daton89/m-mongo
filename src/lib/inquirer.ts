import inquirer, { Question } from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import os from 'os';

import { Cluster } from './cluster';
import {
  ADD_SSH_CONNECTION,
  RUN_SSH_COMMAND,
  SET_STORAGE_PATH,
  SHOW_CLUSTERS,
  ADD_CLUSTER,
  REMOVE_CLUSTER,
  DUMP,
  DUMP_OVER_SSH,
  RESTORE,
  EXPORT,
  IMPORT,
  EXIT
} from './actions';
import { ConnectionParams } from './ssh';

export function selectMainMenu() {
  const { username } = process.env;
  const user = username ? chalk.underline.green(username) : 'there';
  const questions: Question[] = [
    {
      type: 'list',
      name: 'action',
      message: `Hi ${user}! What do you want to do?`,
      choices: [
        ADD_SSH_CONNECTION,
        RUN_SSH_COMMAND,
        SET_STORAGE_PATH,
        new inquirer.Separator(),
        SHOW_CLUSTERS,
        ADD_CLUSTER,
        REMOVE_CLUSTER,
        new inquirer.Separator(),
        DUMP,
        DUMP_OVER_SSH,
        RESTORE,
        EXPORT,
        IMPORT,
        new inquirer.Separator(),
        EXIT,
        new inquirer.Separator()
      ],
      default: 'Add a cluster'
    }
  ];
  return inquirer.prompt(questions);
}

export function askMongoCluster() {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'name',
      message: 'Give a name to this MongoDB instance/cluster:'
    },
    {
      type: 'list',
      name: 'runningOn',
      message: 'Where is this MongoDB running on?',
      choices: ['Virtual Machine', 'Docker Container', 'Cloud Provider']
    },
    {
      type: 'list',
      name: 'type',
      message: 'How is this MongoDB running?',
      choices: ['Standalone', 'ReplicaSet']
    },
    {
      type: 'list',
      name: 'accessMethod',
      message: 'How can we access to get databases list?',
      choices: ['MongoClient', 'MongoShell']
    },
    {
      type: 'input',
      name: 'uri',
      message: 'Enter MongoDB uri:'
    },
    {
      type: 'input',
      name: 'host',
      message: 'Enter MongoDB host:'
    },
    {
      type: 'list',
      name: 'ssl',
      message: 'Does it use ssl:',
      choices: ['Yes', 'No'],
      default: 'Yes'
    },
    {
      type: 'input',
      name: 'username',
      message: 'Enter MongoDB username:'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter MongoDB user password:'
    },
    {
      type: 'input',
      name: 'authenticationDatabase',
      message: 'Enter MongoDB authenticationDatabase name:',
      default: 'admin'
    }
  ];
  return inquirer.prompt(questions);
}

export function selectCluster(clusters: Cluster[]) {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'clusterName',
      message: 'Which cluster?',
      choices: clusters.map((c: Cluster) => c.name),
      default: clusters[0].name
    }
  ];
  return inquirer.prompt(questions);
}

export function selectDatabase(databases: any) {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'database',
      message: 'Which database?',
      choices: databases.map((c: Cluster) => c.name),
      default: databases[0].name
    }
  ];
  return inquirer.prompt(questions);
}

export function askStoragePath() {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'storagePath',
      message: 'Where do we save files?',
      default: process.cwd()
    }
  ];
  return inquirer.prompt(questions);
}

export function askSshConnection() {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'host',
      message: 'The host:',
      default: 'example.com | 10.0.10.0'
    },
    {
      type: 'number',
      name: 'port',
      message: 'The port:',
      default: 22
    },
    {
      type: 'input',
      name: 'username',
      message: 'The Username:',
      default: 'root'
    },
    {
      type: 'input',
      name: 'privateKey',
      message: 'The privateKey:',
      default: `${path.resolve(os.homedir(), '.ssh', '/')}id_rsa`
    }
  ];
  return inquirer.prompt(questions);
}

export function selectSshConnection(connections: ConnectionParams[]) {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'connectionHost',
      message: 'Select the connection:',
      choices: connections.map((conn: ConnectionParams) => conn.host),
      default: connections[0].host
    }
  ];
  return inquirer.prompt(questions);
}

export function askSshCommand(connections: ConnectionParams[]) {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'connectionHost',
      message: 'Select the connection:',
      choices: connections.map((conn: ConnectionParams) => conn.host),
      default: connections[0].host
    },
    {
      type: 'input',
      name: 'command',
      message: 'Which command do you want to run?',
      default: 'uptime'
    }
  ];
  return inquirer.prompt(questions);
}

export function askContainerName() {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'containerName',
      message: 'In which container do you want to run the command?',
      default: 'container_name'
    }
  ];
  return inquirer.prompt(questions);
}

export function askDatabase() {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'database',
      message: 'Tell me a database name:',
      default: 'application-development'
    }
  ];
  return inquirer.prompt(questions);
}

export function askRestartOrExit() {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'action',
      message: 'Restart cli or exit?',
      default: 'Restart',
      choices: ['Restart', 'Exit']
    }
  ];
  return inquirer.prompt(questions);
}

export function selectContainer(containers: string[]) {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'containerName',
      message: 'From which container?',
      default: containers[0],
      choices: containers
    }
  ];
  return inquirer.prompt(questions);
}
