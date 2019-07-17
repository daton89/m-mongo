import { spawn } from 'child_process';
import { Observable } from 'rxjs';
import { Spinner } from 'clui';
import debug from 'debug';
import fs from 'fs';
const out = fs.openSync('./out.log', 'w');
const err = fs.openSync('./err.log', 'w');
const dd = debug('spawn');
export default function Spawn(command, args) {
    const status = new Spinner('Dumping..., please wait...');
    status.start();
    dd('full command %o', `${command} ${args.join(' ')}`);
    return new Observable(observer => {
        // dd('process.env.ComSpec', process.env.ComSpec);
        // write on files https://github.com/nodejs/node-v0.x-archive/issues/8795#issuecomment-65132516
        // more info abount spawn https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/
        const spawning = spawn(command, args, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3NwYXduLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFcEIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDMUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFMUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRTFCLE1BQU0sQ0FBQyxPQUFPLFVBQVUsS0FBSyxDQUMzQixPQUFlLEVBQ2YsSUFBYztJQUVkLE1BQU0sTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDekQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRWYsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXRELE9BQU8sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDL0Isa0RBQWtEO1FBRWxELCtGQUErRjtRQUMvRiw2SEFBNkg7UUFDN0gsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7WUFDcEMsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUM1QixDQUFDLENBQUM7UUFFSCx1Q0FBdUM7UUFDdkMsbUJBQW1CO1FBQ25CLG1EQUFtRDtRQUNuRCxNQUFNO1FBRU4sdUNBQXVDO1FBQ3ZDLG1CQUFtQjtRQUNuQixtREFBbUQ7UUFDbkQsTUFBTTtRQUVOLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtnQkFDZCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsT0FBTyxhQUFhLENBQUMsQ0FBQzthQUNoRDtpQkFBTTtnQkFDTCxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsT0FBTyxVQUFVLENBQUMsQ0FBQzthQUM5QztZQUNELFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUNILGlCQUFpQjtJQUNuQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMifQ==