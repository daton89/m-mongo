#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const clear_1 = __importDefault(require("clear"));
const figlet_1 = __importDefault(require("figlet"));
// import github from "./lib/github";
// import repo from "./lib/repo";
// import files from "./lib/files";
const settings = __importStar(require("./lib/settings"));
const mongodump = __importStar(require("./lib/mongodump"));
const mongorestore = __importStar(require("./lib/mongorestore"));
const cluster_1 = require("./lib/cluster");
const actions_1 = require("./lib/actions");
clear_1.default();
console.log(chalk_1.default.yellow(figlet_1.default.textSync('m-mongo', { horizontalLayout: 'full' })));
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
            case actions_1.ADD_SSH_CONNECTION:
                await settings.setSshConnection();
                break;
            case actions_1.RUN_SSH_COMMAND:
                await settings.runSshCommand();
                break;
            case actions_1.SET_STORAGE_PATH:
                await settings.setStoragePath();
                break;
            case actions_1.ADD_CLUSTER:
                await cluster_1.ClusterManager.create();
                break;
            case actions_1.SHOW_CLUSTERS:
                cluster_1.ClusterManager.showClusters();
                break;
            case actions_1.DUMP:
                await mongodump.start();
                break;
            case actions_1.RESTORE:
                await mongorestore.start();
                break;
            case actions_1.EXIT:
                console.log(chalk_1.default.cyan(`Bye bye! ${process.env.USERNAME}`));
                process.exit();
                break;
            default:
                console.log(chalk_1.default.yellow(`action ${choise.action} not found!`));
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
        clear_1.default();
        run();
    }
    if ('Exit' === action)
        process.exit();
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixrREFBMEI7QUFDMUIsb0RBQTRCO0FBRTVCLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBRW5DLHlEQUEyQztBQUMzQywyREFBNkM7QUFDN0MsaUVBQW1EO0FBQ25ELDJDQUErQztBQUMvQywyQ0FTdUI7QUFFdkIsZUFBSyxFQUFFLENBQUM7QUFDUixPQUFPLENBQUMsR0FBRyxDQUNULGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUN2RSxDQUFDO0FBRUYsdUNBQXVDO0FBQ3ZDLHlEQUF5RDtBQUN6RCxvQkFBb0I7QUFDcEIsSUFBSTtBQUVKLDBDQUEwQztBQUMxQywrREFBK0Q7QUFDL0Qsb0RBQW9EO0FBRXBELE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ3JCLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUU3QyxRQUFRLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckIsS0FBSyw0QkFBa0I7Z0JBQ3JCLE1BQU0sUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ2xDLE1BQU07WUFDUixLQUFLLHlCQUFlO2dCQUNsQixNQUFNLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDL0IsTUFBTTtZQUNSLEtBQUssMEJBQWdCO2dCQUNuQixNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDaEMsTUFBTTtZQUNSLEtBQUsscUJBQVc7Z0JBQ2QsTUFBTSx3QkFBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUM5QixNQUFNO1lBQ1IsS0FBSyx1QkFBYTtnQkFDaEIsd0JBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDOUIsTUFBTTtZQUNSLEtBQUssY0FBSTtnQkFDUCxNQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssaUJBQU87Z0JBQ1YsTUFBTSxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzNCLE1BQU07WUFDUixLQUFLLGNBQUk7Z0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixNQUFNO1lBQ1I7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsTUFBTSxDQUFDLE1BQU0sYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEUsTUFBTSxPQUFPLEVBQUUsQ0FBQztnQkFDaEIsTUFBTTtTQUNUO1FBQ0QsTUFBTSxPQUFPLEVBQUUsQ0FBQztLQUNqQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNwQjtBQUNILENBQUMsQ0FBQztBQUVGLEtBQUssVUFBVSxPQUFPO0lBQ3BCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBRXRELElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtRQUN4QixlQUFLLEVBQUUsQ0FBQztRQUNSLEdBQUcsRUFBRSxDQUFDO0tBQ1A7SUFFRCxJQUFJLE1BQU0sS0FBSyxNQUFNO1FBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hDLENBQUM7QUFFRCxHQUFHLEVBQUUsQ0FBQyJ9