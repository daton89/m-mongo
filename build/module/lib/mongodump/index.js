import { ClusterManager } from '../cluster';
import Dump from './dump';
import SSHContainerDump from './ssh_container_dump';
export async function start() {
    const cluster = await ClusterManager.getCluster();
    if (cluster.runningOn === 'Docker Container' &&
        cluster.requiresSSH === 'Yes') {
        const dump = new SSHContainerDump(cluster);
        await dump.exec();
    }
    if (cluster.runningOn === 'Cloud Provider' ||
        cluster.runningOn === 'Localhost') {
        const restore = new Dump(cluster);
        await restore.exec();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvZHVtcC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVcsY0FBYyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JELE9BQU8sSUFBSSxNQUFNLFFBQVEsQ0FBQztBQUMxQixPQUFPLGdCQUFnQixNQUFNLHNCQUFzQixDQUFDO0FBRXBELE1BQU0sQ0FBQyxLQUFLLFVBQVUsS0FBSztJQUN6QixNQUFNLE9BQU8sR0FBWSxNQUFNLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUUzRCxJQUNFLE9BQU8sQ0FBQyxTQUFTLEtBQUssa0JBQWtCO1FBQ3hDLE9BQU8sQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUM3QjtRQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDbkI7SUFFRCxJQUNFLE9BQU8sQ0FBQyxTQUFTLEtBQUssZ0JBQWdCO1FBQ3RDLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBVyxFQUNqQztRQUNBLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQyJ9