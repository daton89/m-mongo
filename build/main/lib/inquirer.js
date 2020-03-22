"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const actions_1 = require("./actions");
function selectMainMenu() {
    const { username } = process.env;
    const user = username ? chalk_1.default.underline.green(username) : 'there';
    const questions = [
        {
            type: 'list',
            name: 'action',
            message: `Hi ${user}! What do you want to do?`,
            choices: [
                actions_1.ADD_SSH_CONNECTION,
                actions_1.RUN_SSH_COMMAND,
                actions_1.SET_STORAGE_PATH,
                new inquirer_1.default.Separator(),
                actions_1.SHOW_CLUSTERS,
                actions_1.ADD_CLUSTER,
                actions_1.REMOVE_CLUSTER,
                new inquirer_1.default.Separator(),
                actions_1.DUMP,
                actions_1.RESTORE,
                actions_1.EXPORT,
                actions_1.IMPORT,
                new inquirer_1.default.Separator(),
                actions_1.EXIT,
                new inquirer_1.default.Separator()
            ],
            default: 'Add a cluster'
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.selectMainMenu = selectMainMenu;
function askMongoCluster() {
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
    return inquirer_1.default.prompt(questions).then(answers => answers);
}
exports.askMongoCluster = askMongoCluster;
function selectCluster(clusters) {
    const questions = [
        {
            type: 'list',
            name: 'clusterName',
            message: 'Which cluster?',
            choices: clusters.map((c) => c.name),
            default: clusters[0].name
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.selectCluster = selectCluster;
function selectDatabase(databases) {
    const questions = [
        {
            type: 'list',
            name: 'database',
            message: 'Which database?',
            choices: databases,
            default: databases[0]
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.selectDatabase = selectDatabase;
function askStoragePath() {
    const questions = [
        {
            type: 'input',
            name: 'storagePath',
            message: 'Where do we save files?',
            default: process.cwd()
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.askStoragePath = askStoragePath;
function askSshConnection() {
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
            default: `${path_1.default.resolve(os_1.default.homedir(), '.ssh', '/')}id_rsa`
        }
    ];
    return inquirer_1.default
        .prompt(questions)
        .then(answers => answers);
}
exports.askSshConnection = askSshConnection;
function useExistingSshConnection() {
    const questions = [
        {
            type: 'confirm',
            name: 'useExistingSshConnection',
            message: 'Do you want to use an existing SSH tunnel?',
            default: true
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.useExistingSshConnection = useExistingSshConnection;
function selectSshConnection(connections) {
    const questions = [
        {
            type: 'list',
            name: 'connectionHost',
            message: 'Select the connection:',
            choices: connections.map((conn) => conn.host),
            default: connections[0].host
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.selectSshConnection = selectSshConnection;
function askSshCommand(connections) {
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
    return inquirer_1.default.prompt(questions);
}
exports.askSshCommand = askSshCommand;
function askContainerName() {
    const questions = [
        {
            type: 'input',
            name: 'containerName',
            message: 'In which container do you want to run the command?',
            default: 'container_name'
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.askContainerName = askContainerName;
function askDatabase() {
    const questions = [
        {
            type: 'input',
            name: 'database',
            message: 'Tell me a database name:',
            default: 'application-development'
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.askDatabase = askDatabase;
function askCollectionNameToDump() {
    const questions = [
        {
            type: 'input',
            name: 'collectionName',
            message: 'Do you want to dump a specific collection? leave empty for dump all collections'
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.askCollectionNameToDump = askCollectionNameToDump;
function askRestartOrExit() {
    const questions = [
        {
            type: 'list',
            name: 'action',
            message: 'Restart cli or exit?',
            default: 'Restart',
            choices: ['Restart', 'Exit']
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.askRestartOrExit = askRestartOrExit;
function selectContainer(containers) {
    const questions = [
        {
            type: 'list',
            name: 'containerName',
            message: 'From which container?',
            default: containers[0],
            choices: containers
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.selectContainer = selectContainer;
function selectDump(dumps) {
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
    return inquirer_1.default.prompt(questions);
}
exports.selectDump = selectDump;
function askRestoreOptions(databases) {
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
    return inquirer_1.default.prompt(questions);
}
exports.askRestoreOptions = askRestoreOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esd0RBQThDO0FBQzlDLGtEQUEwQjtBQUMxQixnREFBd0I7QUFDeEIsNENBQW9CO0FBR3BCLHVDQVltQjtBQUduQixTQUFnQixjQUFjO0lBQzVCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsZUFBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNsRSxNQUFNLFNBQVMsR0FBZTtRQUM1QjtZQUNFLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsTUFBTSxJQUFJLDJCQUEyQjtZQUM5QyxPQUFPLEVBQUU7Z0JBQ1AsNEJBQWtCO2dCQUNsQix5QkFBZTtnQkFDZiwwQkFBZ0I7Z0JBQ2hCLElBQUksa0JBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLHVCQUFhO2dCQUNiLHFCQUFXO2dCQUNYLHdCQUFjO2dCQUNkLElBQUksa0JBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLGNBQUk7Z0JBQ0osaUJBQU87Z0JBQ1AsZ0JBQU07Z0JBQ04sZ0JBQU07Z0JBQ04sSUFBSSxrQkFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDeEIsY0FBSTtnQkFDSixJQUFJLGtCQUFRLENBQUMsU0FBUyxFQUFFO2FBQ3pCO1lBQ0QsT0FBTyxFQUFFLGVBQWU7U0FDekI7S0FDRixDQUFDO0lBQ0YsT0FBTyxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBN0JELHdDQTZCQztBQUVELFNBQWdCLGVBQWU7SUFDN0IsTUFBTSxTQUFTLEdBQWU7UUFDNUI7WUFDRSxJ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