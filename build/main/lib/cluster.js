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
const conf_1 = __importDefault(require("./conf"));
const inquirer = __importStar(require("./inquirer"));
const dd = debug_1.default('Cluster');
class ClusterManager {
    static showClusters() {
        this.getClusters().forEach((cluster, index) => {
            const { cyan, magenta } = chalk_1.default;
            console.log(`${chalk_1.default.bold.cyan(`Cluster #${index}`)}
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
                const sshConnections = conf_1.default.get('sshConnections') || [];
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
        const clusters = conf_1.default.get('clusters') || [];
        clusters.push(cluster);
        conf_1.default.set({ clusters });
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
        return conf_1.default.get('clusters') || [];
    }
}
exports.ClusterManager = ClusterManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsa0RBQTBCO0FBRzFCLGtEQUEwQjtBQUMxQixxREFBdUM7QUFFdkMsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBa0I1QixNQUFhLGNBQWM7SUFDbEIsTUFBTSxDQUFDLFlBQVk7UUFDeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWdCLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDN0QsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxlQUFLLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7VUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1VBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztVQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7VUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1VBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7VUFDcEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztVQUNwRCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxPQUFPLENBQzVDLE9BQU8s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