import inquirer from 'inquirer';
import { SET_STORAGE_PATH } from './actions';
export function selectMainMenu() {
    const questions = [
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
    return inquirer.prompt(questions);
}
export function selectCluster(clusters) {
    const questions = [
        {
            type: 'list',
            name: 'clusterName',
            message: 'Select a cluster:',
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
            message: 'Select a database:',
            choices: databases.map((c) => c.name),
            default: databases[0].name
        }
    ];
    return inquirer.prompt(questions);
}
export function setStoragePath() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2lucXVpcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sUUFBc0IsTUFBTSxVQUFVLENBQUM7QUFDOUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRTdDLE1BQU0sVUFBVSxjQUFjO0lBQzVCLE1BQU0sU0FBUyxHQUFlO1FBQzVCO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsT0FBTyxFQUFFO2dCQUNQLGdCQUFnQjtnQkFDaEIsZUFBZTtnQkFDZixlQUFlO2dCQUNmLGtCQUFrQjtnQkFDbEIsTUFBTTtnQkFDTixTQUFTO2dCQUNULFFBQVE7Z0JBQ1IsUUFBUTthQUNUO1lBQ0QsT0FBTyxFQUFFLGVBQWU7U0FDekI7S0FDRixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCx1Q0FBdUM7QUFDdkMsb0NBQW9DO0FBQ3BDLFFBQVE7QUFDUix3QkFBd0I7QUFDeEIsMkJBQTJCO0FBQzNCLGlCQUFpQjtBQUNqQiw4RUFBOEU7QUFDOUUsbUJBQW1CO0FBQ25CLFFBQVE7QUFDUixPQUFPO0FBQ1AsdUNBQXVDO0FBQ3ZDLElBQUk7QUFFSixNQUFNLFVBQVUsZUFBZTtJQUM3QixNQUFNLFNBQVMsR0FBZTtRQUM1QjtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsK0NBQStDO1NBQ3pEO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHFCQUFxQjtTQUMvQjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztZQUN0QixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQU8sRUFBRSx5QkFBeUI7U0FDbkM7UUFDRDtZQUNFLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQU8sRUFBRSw4QkFBOEI7U0FDeEM7UUFDRDtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLHdCQUF3QjtZQUM5QixPQUFPLEVBQUUsNENBQTRDO1lBQ3JELE9BQU8sRUFBRSxPQUFPO1NBQ2pCO0tBQ0YsQ0FBQztJQUNGLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxRQUFtQjtJQUUvQyxNQUFNLFNBQVMsR0FBZTtRQUM1QjtZQUNFLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLGFBQWE7WUFDbkIsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixPQUFPLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM3QyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDMUI7S0FDRixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLFNBQWM7SUFFM0MsTUFBTSxTQUFTLEdBQWU7UUFDNUI7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsT0FBTyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQzNCO0tBQ0YsQ0FBQztJQUNGLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGNBQWM7SUFFNUIsTUFBTSxTQUFTLEdBQWU7UUFDNUI7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxhQUFhO1lBQ25CLE9BQU8sRUFBRSx5QkFBeUI7WUFDbEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7U0FDdkI7S0FDRixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUMifQ==