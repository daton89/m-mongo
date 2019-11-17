import { ClusterManager } from '../cluster';
import { DumpMaker } from './dump';
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
        const restore = new DumpMaker(cluster);
        await restore.exec();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvZHVtcC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVcsY0FBYyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDbkMsT0FBTyxnQkFBZ0IsTUFBTSxzQkFBc0IsQ0FBQztBQUVwRCxNQUFNLENBQUMsS0FBSyxVQUFVLEtBQUs7SUFDekIsTUFBTSxPQUFPLEdBQVksTUFBTSxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFM0QsSUFDRSxPQUFPLENBQUMsU0FBUyxLQUFLLGtCQUFrQjtRQUN4QyxPQUFPLENBQUMsV0FBVyxLQUFLLEtBQUssRUFDN0I7UUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ25CO0lBRUQsSUFDRSxPQUFPLENBQUMsU0FBUyxLQUFLLGdCQUFnQjtRQUN0QyxPQUFPLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFDakM7UUFDQSxNQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0QjtBQUNILENBQUMifQ==