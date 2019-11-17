"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = require("../cluster");
const dump_1 = require("./dump");
const ssh_container_dump_1 = __importDefault(require("./ssh_container_dump"));
async function start() {
    const cluster = await cluster_1.ClusterManager.getCluster();
    if (cluster.runningOn === 'Docker Container' &&
        cluster.requiresSSH === 'Yes') {
        const dump = new ssh_container_dump_1.default(cluster);
        await dump.exec();
    }
    if (cluster.runningOn === 'Cloud Provider' ||
        cluster.runningOn === 'Localhost') {
        const restore = new dump_1.DumpMaker(cluster);
        await restore.exec();
    }
}
exports.start = start;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvZHVtcC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdDQUFxRDtBQUNyRCxpQ0FBbUM7QUFDbkMsOEVBQW9EO0FBRTdDLEtBQUssVUFBVSxLQUFLO0lBQ3pCLE1BQU0sT0FBTyxHQUFZLE1BQU0sd0JBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUUzRCxJQUNFLE9BQU8sQ0FBQyxTQUFTLEtBQUssa0JBQWtCO1FBQ3hDLE9BQU8sQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUM3QjtRQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksNEJBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDbkI7SUFFRCxJQUNFLE9BQU8sQ0FBQyxTQUFTLEtBQUssZ0JBQWdCO1FBQ3RDLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBVyxFQUNqQztRQUNBLE1BQU0sT0FBTyxHQUFHLElBQUksZ0JBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0QjtBQUNILENBQUM7QUFsQkQsc0JBa0JDIn0=