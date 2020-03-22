#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
// import github from "./lib/github";
// import repo from "./lib/repo";
// import files from "./lib/files";
import * as settings from './lib/settings';
import * as mongodump from './lib/mongodump';
import * as mongorestore from './lib/mongorestore';
import { ClusterManager } from './lib/cluster';
import { ADD_CLUSTER, SHOW_CLUSTERS, DUMP, SET_STORAGE_PATH, ADD_SSH_CONNECTION, RUN_SSH_COMMAND, EXIT, RESTORE } from './lib/actions';
clear();
console.log(chalk.yellow(figlet.textSync('m-mongo', { horizontalLayout: 'full' })));
// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }
// We need the mongodump bin into our path
// TODO: check mongobump bin availability otherwise download it
// https://www.mongodb.com/download-center/community
const run = async () => {
    try {
        const choise = await settings.showMainMenu();
        switch (choise.action) {
            case ADD_SSH_CONNECTION:
                await settings.setSshConnection();
                break;
            case RUN_SSH_COMMAND:
                await settings.runSshCommand();
                break;
            case SET_STORAGE_PATH:
                await settings.setStoragePath();
                break;
            case ADD_CLUSTER:
                await ClusterManager.create();
                break;
            case SHOW_CLUSTERS:
                ClusterManager.showClusters();
                break;
            case DUMP:
                await mongodump.start();
                break;
            case RESTORE:
                await mongorestore.start();
                break;
            case EXIT:
                console.log(chalk.cyan(`Bye bye! ${process.env.USERNAME}`));
                process.exit();
                break;
            default:
                console.log(chalk.yellow(`action ${choise.action} not found!`));
                await restart();
                break;
        }
        await restart();
    }
    catch (err) {
        console.error(err);
    }
};
async function restart() {
    const { action } = await settings.showRestartOrExit();
    if ('Restart' === action) {
        clear();
        run();
    }
    if ('Exit' === action)
        process.exit();
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBRTVCLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBRW5DLE9BQU8sS0FBSyxRQUFRLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxLQUFLLFNBQVMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEtBQUssWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUNMLFdBQVcsRUFDWCxhQUFhLEVBQ2IsSUFBSSxFQUNKLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsZUFBZSxFQUNmLElBQUksRUFDSixPQUFPLEVBQ1IsTUFBTSxlQUFlLENBQUM7QUFFdkIsS0FBSyxFQUFFLENBQUM7QUFDUixPQUFPLENBQUMsR0FBRyxDQUNULEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQ3ZFLENBQUM7QUFFRix1Q0FBdUM7QUFDdkMseURBQXlEO0FBQ3pELG9CQUFvQjtBQUNwQixJQUFJO0FBRUosMENBQTBDO0FBQzFDLCtEQUErRDtBQUMvRCxvREFBb0Q7QUFFcEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDckIsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTdDLFFBQVEsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNyQixLQUFLLGtCQUFrQjtnQkFDckIsTUFBTSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDbEMsTUFBTTtZQUNSLEtBQUssZUFBZTtnQkFDbEIsTUFBTSxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQy9CLE1BQU07WUFDUixLQUFLLGdCQUFnQjtnQkFDbkIsTUFBTSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ2hDLE1BQU07WUFDUixLQUFLLFdBQVc7Z0JBQ2QsTUFBTSxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzlCLE1BQU07WUFDUixLQUFLLGFBQWE7Z0JBQ2hCLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDOUIsTUFBTTtZQUNSLEtBQUssSUFBSTtnQkFDUCxNQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssT0FBTztnQkFDVixNQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0IsTUFBTTtZQUNSLEtBQUssSUFBSTtnQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUQsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLE1BQU07WUFDUjtnQkFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxNQUFNLENBQUMsTUFBTSxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLE9BQU8sRUFBRSxDQUFDO2dCQUNoQixNQUFNO1NBQ1Q7UUFDRCxNQUFNLE9BQU8sRUFBRSxDQUFDO0tBQ2pCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsS0FBSyxVQUFVLE9BQU87SUFDcEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFFdEQsSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsR0FBRyxFQUFFLENBQUM7S0FDUDtJQUVELElBQUksTUFBTSxLQUFLLE1BQU07UUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEMsQ0FBQztBQUVELEdBQUcsRUFBRSxDQUFDIn0=