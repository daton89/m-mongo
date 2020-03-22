import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import os from 'os';
import { ADD_SSH_CONNECTION, RUN_SSH_COMMAND, SET_STORAGE_PATH, SHOW_CLUSTERS, ADD_CLUSTER, REMOVE_CLUSTER, DUMP, RESTORE, EXPORT, IMPORT, EXIT } from './actions';
export function selectMainMenu() {
    const { username } = process.env;
    const user = username ? chalk.underline.green(username) : 'there';
    const questions = [
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
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Give a name to this MongoDB instance/cluster:'
        },
        {
            type: 'list',
            name: 'type',
            message: 'How is this MongoDB running?',
            choices: ['Standalone', 'ReplicaSet']
        },
        {
            type: 'list',
            name: 'runningOn',
            message: 'Where is this MongoDB running on?',
            choices: [
                'Localhost',
                'Virtual Machine',
                'Docker Container',
                'Cloud Provider'
            ]
        },
        {
            type: 'list',
            name: 'requiresSSH',
            message: 'Do you need to use an SSH tunnel?',
            default: 'No',
            choices: ['Yes', 'No']
        },
        {
            type: 'list',
            name: 'accessMethod',
            message: 'How can we access to get databases list?',
            default: 'MongoClient',
            choices: [
                {
                    value: 'MongoClient',
                    name: 'Mongo Client (the cluster is reachable from your network)'
                },
                {
                    value: 'MongoShell',
                    name: 'Mongo Shell (the cluster requires an SSH tunnel or is in a container and we have not access from our network)'
                }
            ]
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
            type: 'confirm',
            name: 'authEnabled',
            message: 'Is the authentication enabled?',
            default: 'y'
        },
        {
            type: 'input',
            name: 'username',
            message: 'Enter MongoDB username:',
            when(answers) {
                return answers.authEnabled;
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter MongoDB user password:',
            when(answers) {
                return answers.authEnabled;
            }
        },
        {
            type: 'input',
            name: 'authenticationDatabase',
            message: 'Enter MongoDB authenticationDatabase name:',
            default: 'admin',
            when(answers) {
                return answers.authEnabled;
            }
        }
    ];
    return inquirer.prompt(questions).then(answers => answers);
}
export function selectCluster(clusters) {
    const questions = [
        {
            type: 'list',
            name: 'clusterName',
            message: 'Which cluster?',
            choices: clusters.map((c) => c.name),
            default: clusters[0].name
        }
    ];
    return inquirer.prompt(questions);
}
export function selectDatabase(databases) {
    const questions = [
        {
            type: 'list',
            name: 'database',
            message: 'Which database?',
            choices: databases,
            default: databases[0]
        }
    ];
    return inquirer.prompt(questions);
}
export function askStoragePath() {
    const questions = [
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
    const questions = [
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
    return inquirer
        .prompt(questions)
        .then(answers => answers);
}
export function useExistingSshConnection() {
    const questions = [
        {
            type: 'confirm',
            name: 'useExistingSshConnection',
            message: 'Do you want to use an existing SSH tunnel?',
            default: true
        }
    ];
    return inquirer.prompt(questions);
}
export function selectSshConnection(connections) {
    const questions = [
        {
            type: 'list',
            name: 'connectionHost',
            message: 'Select the connection:',
            choices: connections.map((conn) => conn.host),
            default: connections[0].host
        }
    ];
    return inquirer.prompt(questions);
}
export function askSshCommand(connections) {
    const questions = [
        {
            type: 'list',
            name: 'connectionHost',
            message: 'Select the connection:',
            choices: connections.map((conn) => conn.host),
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
    const questions = [
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
    const questions = [
        {
            type: 'input',
            name: 'database',
            message: 'Tell me a database name:',
            default: 'application-development'
        }
    ];
    return inquirer.prompt(questions);
}
export function askCollectionNameToDump() {
    const questions = [
        {
            type: 'input',
            name: 'collectionName',
            message: 'Do you want to dump a specific collection? leave empty for dump all collections'
        }
    ];
    return inquirer.prompt(questions);
}
export function askRestartOrExit() {
    const questions = [
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
export function selectContainer(containers) {
    const questions = [
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
export function selectDump(dumps) {
    const questions = [
        {
            type: 'list',
            name: 'dump',
            message: 'From which dump?',
            default: dumps[0].path,
            choices: dumps.map(dump => ({
                name: `${dump.name} ${dump.createdOn}`,
                value: dump.path
            }))
        }
    ];
    return inquirer.prompt(questions);
}
export function askRestoreOptions(databases) {
    const questions = [
        {
            type: 'list',
            name: 'choosedDatabase',
            message: 'Do you want to restore into an existing db or you need to create a new one?',
            default: 'Use one from list',
            choices: [
                {
                    name: 'Use one from list',
                    value: 'list'
                },
                { name: 'Insert a database name', value: 'insert' }
            ]
        },
        {
            type: 'list',
            name: 'databaseName',
            message: 'Which database?',
            choices: databases,
            default: databases[0],
            when(answers) {
                return answers.choosedDatabase === 'list';
            }
        },
        {
            type: 'input',
            name: 'databaseName',
            message: 'Insert database name:',
            default: 'new-database',
            when(answers) {
                return answers.choosedDatabase === 'insert';
            }
        },
        {
            type: 'list',
            name: 'choosedCollection',
            message: 'Do you want to restore only a collection or all of them?',
            default: 'all',
            choices: [
                {
                    name: 'All of them',
                    value: 'all'
                },
                { name: 'Only one', value: 'only one' }
            ]
        },
        {
            type: 'input',
            name: 'collectionName',
            message: 'Insert collection name:',
            default: 'collection-name',
            when(answers) {
                return answers.choosedCollection === 'only one';
            }
        },
        {
            type: 'confirm',
            name: 'drop',
            message: 'Do you want to drop existing records?',
            default: 'y'
        }
    ];
    return inquirer.prompt(questions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sUUFBc0IsTUFBTSxVQUFVLENBQUM7QUFDOUMsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFHcEIsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixXQUFXLEVBQ1gsY0FBYyxFQUNkLElBQUksRUFDSixPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixJQUFJLEVBQ0wsTUFBTSxXQUFXLENBQUM7QUFHbkIsTUFBTSxVQUFVLGNBQWM7SUFDNUIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ2xFLE1BQU0sU0FBUyxHQUFlO1FBQzVCO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxNQUFNLElBQUksMkJBQTJCO1lBQzlDLE9BQU8sRUFBRTtnQkFDUCxrQkFBa0I7Z0JBQ2xCLGVBQWU7Z0JBQ2YsZ0JBQWdCO2dCQUNoQixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLGFBQWE7Z0JBQ2IsV0FBVztnQkFDWCxjQUFjO2dCQUNkLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDeEIsSUFBSTtnQkFDSixPQUFPO2dCQUNQLE1BQU07Z0JBQ04sTUFBTTtnQkFDTixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLElB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