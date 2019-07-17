import Rsync from 'rsync';
import os from 'os';
import { Spinner } from 'clui';
import debug from 'debug';
const dd = debug('rsync');
/**
 * rsync exec
 * @param src : string /path/to/source
 * @param dest : string server:/path/to/dest
 */
export function exec(src, dest, privateKey, flags) {
    return new Promise((resolve, reject) => {
        const status = new Spinner(`Syncing remote with local... please wait...`);
        status.start();
        // Build the command
        const rsync = new Rsync()
            .executable(`rsync -e "ssh -i ${privateKey} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"`)
            .flags(flags || 'hvrPt')
            .source(src)
            .destination(os.platform() === 'win32' ? dest.replace('C:', '\\cygdrive\\c') : dest);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDcEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFMUIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUNsQixHQUFXLEVBQ1gsSUFBWSxFQUNaLFVBQWtCLEVBQ2xCLEtBQWM7SUFFZCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2Ysb0JBQW9CO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFO2FBQ3RCLFVBQVUsQ0FDVCxvQkFBb0IsVUFBVSwrREFBK0QsQ0FDOUY7YUFDQSxLQUFLLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQzthQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsV0FBVyxDQUNWLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3ZFLENBQUM7UUFFSixFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWxDLHNCQUFzQjtRQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVSxFQUFFLElBQVksRUFBRSxHQUFXLEVBQUUsRUFBRTtZQUN0RCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQjtZQUNELEVBQUUsQ0FBQyxXQUFXLEdBQUcscUJBQXFCLElBQUksRUFBRSxDQUFDLENBQUM7WUFDOUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxDQUFDO2FBQ1g7aUJBQU07Z0JBQ0wsTUFBTSxFQUFFLENBQUM7YUFDVjtZQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9