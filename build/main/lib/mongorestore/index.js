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
const debug_1 = __importDefault(require("debug"));
const cluster_1 = require("../cluster");
const restore_1 = __importDefault(require("./restore"));
const restore_container_1 = __importDefault(require("./restore_container"));
const dump_1 = __importDefault(require("../mongodump/dump"));
const mainDump = __importStar(require("../mongodump"));
const dd = debug_1.default('restore:start');
async function start() {
    // TODO: getCluster inside the Restore constructor
    const cluster = await cluster_1.ClusterManager.getCluster();
    const dumps = dump_1.default.getDumps();
    dd('dumps :: %o', dumps);
    if (!dumps.length) {
        console.log(chalk_1.default.yellow(`You don't have any dump yet! Let's create one!`));
        await mainDump.start();
        console.log(chalk_1.default.green(`Super! We now have a dump!`));
        console.log(chalk_1.default.yellow(`Let's start back from where we left!`));
        console.log(chalk_1.default.cyan(`Going back to Restore...`));
    }
    if (cluster.runningOn === 'Docker Container') {
        const restore = new restore_container_1.default(cluster, dumps);
        await restore.exec();
    }
    if (cluster.runningOn === 'Cloud Provider') {
        const restore = new restore_1.default(cluster, dumps);
        await restore.exec();
    }
    if (cluster.runningOn === 'Localhost') {
        const restore = new restore_1.default(cluster, dumps);
        await restore.exec();
    }
}
exports.start = start;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsa0RBQTBCO0FBRTFCLHdDQUFxRDtBQUNyRCx3REFBZ0M7QUFDaEMsNEVBQW1EO0FBQ25ELDZEQUEwQztBQUcxQyx1REFBeUM7QUFFekMsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTNCLEtBQUssVUFBVSxLQUFLO0lBQ3pCLGtEQUFrRDtJQUNsRCxNQUFNLE9BQU8sR0FBWSxNQUFNLHdCQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFM0QsTUFBTSxLQUFLLEdBQVcsY0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTNDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUM7UUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztLQUNyRDtJQUVELElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxrQkFBa0IsRUFBRTtRQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLDJCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0QjtJQUVELElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxnQkFBZ0IsRUFBRTtRQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3RCO0lBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQztBQTlCRCxzQkE4QkMifQ==