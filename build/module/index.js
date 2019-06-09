#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
// import github from "./lib/github";
// import repo from "./lib/repo";
// import files from "./lib/files";
import { ADD_CLUSTER, SHOW_CLUSTERS, DUMP, SET_STORAGE_PATH } from "./lib/actions";
import * as mongo from "./lib/mongo";
clear();
console.log(chalk.yellow(figlet.textSync("m-mongo", { horizontalLayout: "full" })));
// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }
const run = async () => {
    try {
        const choise = await mongo.showMainMenu();
        switch (choise.action) {
            case SET_STORAGE_PATH:
                await mongo.setStoragePath();
                break;
            case ADD_CLUSTER:
                await mongo.setMongoCluster();
                break;
            case SHOW_CLUSTERS:
                console.log(mongo.getClusters());
                break;
            case DUMP:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLE9BQU8sRUFDTCxXQUFXLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFDbkQsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxLQUFLLEtBQUssTUFBTSxhQUFhLENBQUM7QUFFckMsS0FBSyxFQUFFLENBQUM7QUFDUixPQUFPLENBQUMsR0FBRyxDQUNULEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQ3ZFLENBQUM7QUFFRix1Q0FBdUM7QUFDdkMseURBQXlEO0FBQ3pELG9CQUFvQjtBQUNwQixJQUFJO0FBRUosTUFBTSxHQUFHLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDckIsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBRXpDLFFBQVEsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNyQixLQUFLLGdCQUFnQjtnQkFDakIsTUFBTSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7Z0JBQzlCLE1BQU07WUFDUixLQUFLLFdBQVc7Z0JBQ1osTUFBTSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7Z0JBQy9CLE1BQU07WUFDUixLQUFLLGFBQWE7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtnQkFDbEMsTUFBTTtZQUNSLEtBQUssSUFBSTtnQkFDTCxNQUFNLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTTtZQUVSO2dCQUNJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDaEIsTUFBTTtTQUNUO0tBRUY7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEI7QUFDSCxDQUFDLENBQUM7QUFHRixHQUFHLEVBQUUsQ0FBQyJ9