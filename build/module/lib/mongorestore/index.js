import chalk from 'chalk';
import debug from 'debug';
import { ClusterManager } from '../cluster';
import Restore from './restore';
import RestoreContainer from './restore_container';
import DumpMaker from '../mongodump/dump';
import * as mainDump from '../mongodump';
const dd = debug('restore:start');
export async function start() {
    // TODO: getCluster inside the Restore constructor
    const cluster = await ClusterManager.getCluster();
    const dumps = DumpMaker.getDumps();
    dd('dumps :: %o', dumps);
    if (!dumps.length) {
        console.log(chalk.yellow(`You don't have any dump yet! Let's create one!`));
        await mainDump.start();
        console.log(chalk.green(`Super! We now have a dump!`));
        console.log(chalk.yellow(`Let's start back from where we left!`));
        console.log(chalk.cyan(`Going back to Restore...`));
    }
    if (cluster.runningOn === 'Docker Container') {
        const restore = new RestoreContainer(cluster, dumps);
        await restore.exec();
    }
    if (cluster.runningOn === 'Cloud Provider') {
        const restore = new Restore(cluster, dumps);
        await restore.exec();
    }
    if (cluster.runningOn === 'Localhost') {
        const restore = new Restore(cluster, dumps);
        await restore.exec();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sRUFBVyxjQUFjLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckQsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sZ0JBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxTQUFTLE1BQU0sbUJBQW1CLENBQUM7QUFHMUMsT0FBTyxLQUFLLFFBQVEsTUFBTSxjQUFjLENBQUM7QUFFekMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWxDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsS0FBSztJQUN6QixrREFBa0Q7SUFDbEQsTUFBTSxPQUFPLEdBQVksTUFBTSxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFM0QsTUFBTSxLQUFLLEdBQVcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTNDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUM7UUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztLQUNyRDtJQUVELElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxrQkFBa0IsRUFBRTtRQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0QjtJQUVELElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxnQkFBZ0IsRUFBRTtRQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUMsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdEI7SUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBVyxFQUFFO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0QjtBQUNILENBQUMifQ==