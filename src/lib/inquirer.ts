import { Cluster } from '../cluster';
import inquirer, { Question } from 'inquirer';
import { SET_STORAGE_PATH } from './actions';

export function selectMainMenu() {
  const questions: Question[] = [
    {
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: [
        SET_STORAGE_PATH,
        'Show clusters',
        'Add a cluster',
        'Remove a cluster',
        'Dump',
        'Restore',
        'Export',
        'Import'
      ],
      default: 'Add a cluster'
    }
  ];
  return inquirer.prompt(questions);
}

// export function askHowManyMongos() {
//   const questions: Question[] = [
//     {
//       type: 'number',
//       name: 'instances',
//       message:
//         'Enter how many MongoDB instances/clusters do you want to insert:',
//       default: 1
//     }
//   ];
//   return inquirer.prompt(questions);
// }

export function askMongoCluster() {
  const questions: Question[] = [
    {
      type: 'input',
      name: 'name',
      message: 'Give a name to this MongoDB instance/cluster:'
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
      message: 'Select a cluster:',
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
      message: 'Select a database:',
      choices: databases.map((c: Cluster) => c.name),
      default: databases[0].name
    }
  ];
  return inquirer.prompt(questions);
}

export function setStoragePath() {

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
