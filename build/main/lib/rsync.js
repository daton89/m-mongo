"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rsync_1 = __importDefault(require("rsync"));
const os_1 = __importDefault(require("os"));
const clui_1 = require("clui");
const debug_1 = __importDefault(require("debug"));
const dd = debug_1.default('rsync');
/**
 * rsync exec
 * @param src : string /path/to/source
 * @param dest : string server:/path/to/dest
 */
function exec(src, dest, privateKey, flags) {
    return new Promise((resolve, reject) => {
        const status = new clui_1.Spinner(`Syncing remote with local... please wait...`);
        status.start();
        // Build the command
        const rsync = new rsync_1.default()
            .executable(`rsync -e "ssh -i ${privateKey} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"`)
            .flags(flags || 'hvrPt')
            .source(src)
            .destination(os_1.default.platform() === 'win32' ? dest.replace('C:', '\\cygdrive\\c') : dest);
        dd('command %s', rsync.command());
        // Execute the command
        rsync.execute((err, code, cmd) => {
            if (err) {
                dd('err %o', err);
                return reject(err);
            }
            dd(`Command ${cmd} exited with code ${code}`);
            if (code === 0) {
                resolve();
            }
            else {
                reject();
            }
            status.stop();
        });
    });
}
exports.exec = exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDRDQUFvQjtBQUNwQiwrQkFBK0I7QUFDL0Isa0RBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUUxQjs7OztHQUlHO0FBQ0gsU0FBZ0IsSUFBSSxDQUNsQixHQUFXLEVBQ1gsSUFBWSxFQUNaLFVBQWtCLEVBQ2xCLEtBQWM7SUFFZCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2Ysb0JBQW9CO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFO2FBQ3RCLFVBQVUsQ0FDVCxvQkFBb0IsVUFBVSwrREFBK0QsQ0FDOUY7YUFDQSxLQUFLLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQzthQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsV0FBVyxDQUNWLFlBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3ZFLENBQUM7UUFFSixFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWxDLHNCQUFzQjtRQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVSxFQUFFLElBQVksRUFBRSxHQUFXLEVBQUUsRUFBRTtZQUN0RCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQjtZQUNELEVBQUUsQ0FBQyxXQUFXLEdBQUcscUJBQXFCLElBQUksRUFBRSxDQUFDLENBQUM7WUFDOUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2FBQ1g7aUJBQU07Z0JBQ0wsTUFBTSxFQUFFLENBQUM7YUFDVjtZQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXJDRCxvQkFxQ0MifQ==