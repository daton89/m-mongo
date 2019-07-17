"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const clui_1 = require("clui");
const ssh2_1 = require("ssh2");
const rxjs_1 = require("rxjs");
const debug_1 = __importDefault(require("debug"));
const conn = new ssh2_1.Client();
const dd = debug_1.default('ssh');
function connect(connectionParams) {
    const status = new clui_1.Spinner(`Connecting to: ${connectionParams.username}@${connectionParams.host}..., please wait...`);
    status.start();
    return new Promise((resolve, reject) => {
        conn.connect(Object.assign({}, connectionParams, { privateKey: fs_1.default.readFileSync(connectionParams.privateKey) }));
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
exports.connect = connect;
function exec(command) {
    const status = new clui_1.Spinner('Executings command..., please wait...');
    status.start();
    return new rxjs_1.Observable(observer => {
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
exports.exec = exec;
function end() {
    return new Promise(resolve => {
        conn.end();
        conn.on('end', () => {
            dd('SSH Client :: ended');
            resolve();
        });
    });
}
exports.end = end;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsK0JBQStCO0FBQy9CLCtCQUE4QjtBQUM5QiwrQkFBa0M7QUFDbEMsa0RBQTBCO0FBRTFCLE1BQU0sSUFBSSxHQUFHLElBQUksYUFBTSxFQUFFLENBQUM7QUFDMUIsTUFBTSxFQUFFLEdBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBU3hCLFNBQWdCLE9BQU8sQ0FBQyxnQkFBa0M7SUFDeEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFPLENBQ3hCLGtCQUFrQixnQkFBZ0IsQ0FBQyxRQUFRLElBQUksZ0JBQWdCLENBQUMsSUFBSSxxQkFBcUIsQ0FDMUYsQ0FBQztJQUNGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsSUFBSSxDQUFDLE9BQU8sbUJBQ1AsZ0JBQWdCLElBQ25CLFVBQVUsRUFBRSxZQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUN4RCxDQUFDO1FBRUgsSUFBSTthQUNELEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDaEIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsRUFBRSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDL0IsTUFBTSxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXZCRCwwQkF1QkM7QUFFRCxTQUFnQixJQUFJLENBQUMsT0FBZTtJQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLE9BQU8sSUFBSSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBVSxFQUFFLE1BQVcsRUFBRSxFQUFFO1lBQzdDLElBQUksR0FBRyxFQUFFO2dCQUNQLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZCxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDNUI7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtnQkFDeEMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtnQkFDeEMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQVMsRUFBRSxNQUFXLEVBQUUsRUFBRTtnQkFDNUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNkLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtvQkFDZCxFQUFFLENBQUMsV0FBVyxPQUFPLGFBQWEsQ0FBQyxDQUFDO2lCQUNyQztxQkFBTTtvQkFDTCxFQUFFLENBQUMsV0FBVyxPQUFPLFVBQVUsQ0FBQyxDQUFDO2lCQUNsQztnQkFDRCxFQUFFLENBQUMsNEJBQTRCLElBQUksWUFBWSxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RCxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQW5DRCxvQkFtQ0M7QUFFRCxTQUFnQixHQUFHO0lBQ2pCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDM0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO1lBQ2xCLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFSRCxrQkFRQyJ9