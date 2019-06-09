"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const actions_1 = require("./actions");
function selectMainMenu() {
    const questions = [
        {
            type: 'list',
            name: 'action',
            message: 'Select an action:',
            choices: [
                actions_1.SET_STORAGE_PATH,
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
    return inquirer_1.default.prompt(questions);
}
exports.selectMainMenu = selectMainMenu;
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
function askMongoCluster() {
    const questions = [
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
    return inquirer_1.default.prompt(questions);
}
exports.askMongoCluster = askMongoCluster;
function selectCluster(clusters) {
    const questions = [
        {
            type: 'list',
            name: 'clusterName',
            message: 'Select a cluster:',
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
            message: 'Select a database:',
            choices: databases.map((c) => c.name),
            default: databases[0].name
        }
    ];
    return inquirer_1.default.prompt(questions);
}
exports.selectDatabase = selectDatabase;
function setStoragePath() {
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
exports.setStoragePath = setStoragePath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esd0RBQThDO0FBQzlDLHVDQUE2QztBQUU3QyxTQUFnQixjQUFjO0lBQzVCLE1BQU0sU0FBUyxHQUFlO1FBQzVCO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsT0FBTyxFQUFFO2dCQUNQLDBCQUFnQjtnQkFDaEIsZUFBZTtnQkFDZixlQUFlO2dCQUNmLGtCQUFrQjtnQkFDbEIsTUFBTTtnQkFDTixTQUFTO2dCQUNULFFBQVE7Z0JBQ1IsUUFBUTthQUNUO1lBQ0QsT0FBTyxFQUFFLGVBQWU7U0FDekI7S0FDRixDQUFDO0lBQ0YsT0FBTyxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBcEJELHdDQW9CQztBQUVELHVDQUF1QztBQUN2QyxvQ0FBb0M7QUFDcEMsUUFBUTtBQUNSLHdCQUF3QjtBQUN4QiwyQkFBMkI7QUFDM0IsaUJBQWlCO0FBQ2pCLDhFQUE4RTtBQUM5RSxtQkFBbUI7QUFDbkIsUUFBUTtBQUNSLE9BQU87QUFDUCx1Q0FBdUM7QUFDdkMsSUFBSTtBQUVKLFNBQWdCLGVBQWU7SUFDN0IsTUFBTSxTQUFTLEdBQWU7UUFDNUI7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLCtDQUErQztTQUN6RDtRQUNEO1lBQ0UsSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxxQkFBcUI7U0FDL0I7UUFDRDtZQUNFLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7WUFDdEIsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsVUFBVTtZQUNoQixPQUFPLEVBQUUseUJBQXlCO1NBQ25DO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUUsVUFBVTtZQUNoQixPQUFPLEVBQUUsOEJBQThCO1NBQ3hDO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsT0FBTyxFQUFFLDRDQUE0QztZQUNyRCxPQUFPLEVBQUUsT0FBTztTQUNqQjtLQUNGLENBQUM7SUFDRixPQUFPLGtCQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFyQ0QsMENBcUNDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLFFBQW1CO0lBRS9DLE1BQU0sU0FBUyxHQUFlO1FBQzVCO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsYUFBYTtZQUNuQixPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLE9BQU8sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzdDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUMxQjtLQUNGLENBQUM7SUFDRixPQUFPLGtCQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFaRCxzQ0FZQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxTQUFjO0lBRTNDLE1BQU0sU0FBUyxHQUFlO1FBQzVCO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsVUFBVTtZQUNoQixPQUFPLEVBQUUsb0JBQW9CO1lBQzdCLE9BQU8sRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUMzQjtLQUNGLENBQUM7SUFDRixPQUFPLGtCQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFaRCx3Q0FZQztBQUVELFNBQWdCLGNBQWM7SUFFNUIsTUFBTSxTQUFTLEdBQWU7UUFDNUI7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxhQUFhO1lBQ25CLE9BQU8sRUFBRSx5QkFBeUI7WUFDbEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7U0FDdkI7S0FDRixDQUFDO0lBQ0YsT0FBTyxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBWEQsd0NBV0MifQ==