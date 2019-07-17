import chalk from 'chalk';
import debug from 'debug';
import conf from './conf';
import * as inquirer from './inquirer';
const dd = debug('Cluster');
export class ClusterManager {
    static showClusters() {
        this.getClusters().forEach((cluster, index) => {
            const { cyan, magenta } = chalk;
            console.log(`${chalk.bold.cyan(`Cluster #${index}`)}
        ${cyan('Name:')} ${magenta(cluster.name)}
        ${cyan('Uri:')} ${magenta(cluster.uri)}
        ${cyan('Host:')} ${magenta(cluster.host)}
        ${cyan('SSL:')} ${magenta(cluster.ssl)}
        ${cyan('Username:')} ${magenta(cluster.username || '')}
        ${cyan('Password:')} ${magenta(cluster.password || '')}
        ${cyan('authenticationDatabase:')} ${magenta(cluster.authenticationDatabase || '')}
      `);
        });
    }
    static async create() {
        const cluster = await inquirer.askMongoCluster();
        if (cluster.requiresSSH === 'Yes') {
            const { useExistingSshConnection } = await inquirer.useExistingSshConnection();
            if (useExistingSshConnection) {
                const sshConnections = conf.get('sshConnections') || [];
                const { connectionHost } = await inquirer.selectSshConnection(sshConnections);
                const sshConnection = sshConnections.find(conn => conn.host === connectionHost);
                // tslint:disable-next-line: no-object-mutation
                if (sshConnection)
                    cluster.sshConnection = sshConnection;
            }
            else {
                const sshConnection = await inquirer.askSshConnection();
                // tslint:disable-next-line: no-object-mutation
                cluster.sshConnection = sshConnection;
            }
        }
        const clusters = conf.get('clusters') || [];
        clusters.push(cluster);
        conf.set({ clusters });
        return cluster;
    }
    static async getCluster() {
        const clusters = this.getClusters();
        if (!clusters.length) {
            const newCluster = this.create();
            dd('getCluster create %o', newCluster);
            return newCluster;
        }
        const { clusterName } = await inquirer.selectCluster(clusters);
        const cluster = clusters.find(({ name }) => name === clusterName);
        dd('getCluster %o', cluster);
        if (!cluster)
            throw new Error('Cluster not found');
        return cluster;
    }
    static getClusters() {
        return conf.get('clusters') || [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRzFCLE9BQU8sSUFBSSxNQUFNLFFBQVEsQ0FBQztBQUMxQixPQUFPLEtBQUssUUFBUSxNQUFNLFlBQVksQ0FBQztBQUV2QyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFrQjVCLE1BQU0sT0FBTyxjQUFjO0lBQ2xCLE1BQU0sQ0FBQyxZQUFZO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFnQixFQUFFLEtBQWEsRUFBRSxFQUFFO1lBQzdELE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssRUFBRSxDQUFDO1VBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztVQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7VUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1VBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztVQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1VBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFD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