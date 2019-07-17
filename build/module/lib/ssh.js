import fs from 'fs';
import { Spinner } from 'clui';
import { Client } from 'ssh2';
import { Observable } from 'rxjs';
import debug from 'debug';
const conn = new Client();
const dd = debug('ssh');
export function connect(connectionParams) {
    const status = new Spinner(`Connecting to: ${connectionParams.username}@${connectionParams.host}..., please wait...`);
    status.start();
    return new Promise((resolve, reject) => {
        conn.connect({
            ...connectionParams,
            privateKey: fs.readFileSync(connectionParams.privateKey)
        });
        conn
            .on('ready', () => {
            status.stop();
            dd('SSH Client :: ready');
            resolve();
        })
            .on('error', () => {
            status.stop();
            dd('SSH Connection :: failed');
            reject();
        });
    });
}
export function exec(command) {
    const status = new Spinner('Executings command..., please wait...');
    status.start();
    return new Observable(observer => {
        conn.exec(command, (err, stream) => {
            if (err) {
                status.stop();
                dd('error %o', err);
                return observer.error(err);
            }
            stream.stderr.on('data', (data) => {
                status.stop();
                dd('STDERR :: %o', data.toString());
                observer.next(data.toString());
            });
            stream.stdout.on('data', (data) => {
                status.stop();
                dd('STDOUT :: %o', data.toString());
                observer.next(data.toString());
            });
            stream.on('close', (code, signal) => {
                status.stop();
                if (code === 0) {
                    dd(`Command ${command} Completed!`);
                }
                else {
                    dd(`Command ${command} Failed!`);
                }
                dd(`Stream :: close :: code: ${code} signal: ${signal}`);
                observer.complete();
            });
        });
    });
}
export function end() {
    return new Promise(resolve => {
        conn.end();
        conn.on('end', () => {
            dd('SSH Client :: ended');
            resolve();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQzFCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQVN4QixNQUFNLFVBQVUsT0FBTyxDQUFDLGdCQUFrQztJQUN4RCxNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FDeEIsa0JBQWtCLGdCQUFnQixDQUFDLFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLHFCQUFxQixDQUMxRixDQUFDO0lBQ0YsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsR0FBRyxnQkFBZ0I7WUFDbkIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO1NBQ3pELENBQUMsQ0FBQztRQUVILElBQUk7YUFDRCxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNoQixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUMxQixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQzthQUNELEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ2hCLE1B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