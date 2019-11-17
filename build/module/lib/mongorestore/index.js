import chalk from 'chalk';
import debug from 'debug';
import { ClusterManager } from '../cluster';
import Restore from './restore';
import RestoreContainer from './restore_container';
import { DumpMaker } from '../mongodump/dump';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvcmVzdG9yZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sRUFBVyxjQUFjLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckQsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sZ0JBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUFFLFNBQVMsRUFBUSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sS0FBSyxRQUFRLE1BQU0sY0FBYyxDQUFDO0FBRXpDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVsQyxNQUFNLENBQUMsS0FBSyxVQUFVLEtBQUs7SUFDekIsa0RBQWtEO0lBQ2xELE1BQU0sT0FBTyxHQUFZLE1BQU0sY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRTNELE1BQU0sS0FBSyxHQUFXLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUUzQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXpCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLENBQUM7UUFDNUUsTUFBTSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7S0FDckQ7SUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssa0JBQWtCLEVBQUU7UUFDNUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdEI7SUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssZ0JBQWdCLEVBQUU7UUFDMUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3RCO0lBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtRQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUMsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDdEI7QUFDSCxDQUFDIn0=