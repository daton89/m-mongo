"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const rxjs_1 = require("rxjs");
const clui_1 = require("clui");
const debug_1 = __importDefault(require("debug"));
const fs_1 = __importDefault(require("fs"));
const out = fs_1.default.openSync('./out.log', 'w');
const err = fs_1.default.openSync('./err.log', 'w');
const dd = debug_1.default('spawn');
function Spawn(command, args) {
    const status = new clui_1.Spinner('Dumping..., please wait...');
    status.start();
    dd('full command %o', `${command} ${args.join(' ')}`);
    return new rxjs_1.Observable(observer => {
        // dd('process.env.ComSpec', process.env.ComSpec);
        // write on files https://github.com/nodejs/node-v0.x-archive/issues/8795#issuecomment-65132516
        // more info abount spawn https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/
        const spawning = child_process_1.spawn(command, args, {
            shell: true,
            stdio: ['ignore', out, err]
        });
        // spawning.stdout.on('data', data => {
        //   status.stop();
        //   observer.next(`STDOUT :: ${data.toString()}`);
        // });
        // spawning.stderr.on('data', data => {
        //   status.stop();
        //   observer.next(`STDERR :: ${data.toString()}`);
        // });
        spawning.on('close', code => {
            status.stop();
            if (code === 0) {
                observer.next(`Command ${command} Completed!`);
            }
            else {
                observer.error(`Command ${command} Failed!`);
            }
            observer.complete();
        });
        // .pipe(wstream)
    });
}
exports.default = Spawn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NwYXduLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaURBQXNDO0FBQ3RDLCtCQUFrQztBQUNsQywrQkFBK0I7QUFDL0Isa0RBQTBCO0FBQzFCLDRDQUFvQjtBQUVwQixNQUFNLEdBQUcsR0FBRyxZQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxQyxNQUFNLEdBQUcsR0FBRyxZQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUUxQyxNQUFNLEVBQUUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFMUIsU0FBd0IsS0FBSyxDQUMzQixPQUFlLEVBQ2YsSUFBYztJQUVkLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDekQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRWYsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXRELE9BQU8sSUFBSSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQy9CLGtEQUFrRDtRQUVsRCwrRkFBK0Y7UUFDL0YsNkhBQTZIO1FBQzdILE1BQU0sUUFBUSxHQUFHLHFCQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtZQUNwQyxLQUFLLEVBQUUsSUFBSTtZQUNYLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1NBQzVCLENBQUMsQ0FBQztRQUVILHVDQUF1QztRQUN2QyxtQkFBbUI7UUFDbkIsbURBQW1EO1FBQ25ELE1BQU07UUFFTix1Q0FBdUM7UUFDdkMsbUJBQW1CO1FBQ25CLG1EQUFtRDtRQUNuRCxNQUFNO1FBRU4sUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxPQUFPLGFBQWEsQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNO2dCQUNMLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxPQUFPLFVBQVUsQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsaUJBQWlCO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXhDRCx3QkF3Q0MifQ==