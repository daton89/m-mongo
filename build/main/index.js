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
const actions_1 = require("./lib/actions");
const mongo = __importStar(require("./lib/mongo"));
clear_1.default();
console.log(chalk_1.default.yellow(figlet_1.default.textSync("m-mongo", { horizontalLayout: "full" })));
// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }
const run = async () => {
    try {
        const choise = await mongo.showMainMenu();
        switch (choise.action) {
            case actions_1.SET_STORAGE_PATH:
                await mongo.setStoragePath();
                break;
            case actions_1.ADD_CLUSTER:
                await mongo.setMongoCluster();
                break;
            case actions_1.SHOW_CLUSTERS:
                console.log(mongo.getClusters());
                break;
            case actions_1.DUMP:
                await mongo.execDump();
                break;
            default:
                process.exit();
                break;
        }
    }
    catch (err) {
        console.error(err);
    }
};
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBLGtEQUEwQjtBQUMxQixrREFBMEI7QUFDMUIsb0RBQTRCO0FBQzVCLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDJDQUVzQjtBQUN0QixtREFBcUM7QUFFckMsZUFBSyxFQUFFLENBQUM7QUFDUixPQUFPLENBQUMsR0FBRyxDQUNULGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUN2RSxDQUFDO0FBRUYsdUNBQXVDO0FBQ3ZDLHlEQUF5RDtBQUN6RCxvQkFBb0I7QUFDcEIsSUFBSTtBQUVKLE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ3JCLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUV6QyxRQUFRLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckIsS0FBSywwQkFBZ0I7Z0JBQ2pCLE1BQU0sS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO2dCQUM5QixNQUFNO1lBQ1IsS0FBSyxxQkFBVztnQkFDWixNQUFNLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDL0IsTUFBTTtZQUNSLEtBQUssdUJBQWE7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtnQkFDbEMsTUFBTTtZQUNSLEtBQUssY0FBSTtnQkFDTCxNQUFNLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTTtZQUVSO2dCQUNJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDaEIsTUFBTTtTQUNUO0tBRUY7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEI7QUFDSCxDQUFDLENBQUM7QUFHRixHQUFHLEVBQUUsQ0FBQyJ9