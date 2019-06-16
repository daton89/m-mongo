import { Cluster, ClusterManager } from '../cluster';
import Dump from './dump';
import SSHContainerDump from './ssh_container_dump';

export async function start() {
  const cluster: Cluster = await ClusterManager.getCluster();

  if (
    cluster.runningOn === 'Docker Container' &&
    cluster.requiresSSH === 'Yes'
  ) {
    const dump = new SSHContainerDump(cluster);
    await dump.exec();
  }

  if (cluster.runningOn === 'Cloud Provider') {
    const restore = new Dump(cluster);
    await restore.exec();
  }

  // if (cluster.runningOn === 'Localhost') {
  //   const restore = new Dump(cluster);
  //   await restore.exec();
  // }
}
