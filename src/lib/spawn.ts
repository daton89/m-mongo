import { spawn } from 'child_process';
import { Observable } from 'rxjs';
import { Spinner } from 'clui';
import debug from 'debug';
import fs from 'fs';

const out = fs.openSync('./out.log', 'w');
const err = fs.openSync('./err.log', 'w');

const dd = debug('spawn');

export default function Spawn(
  command: string,
  args: string[]
): Observable<string> {
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
      } else {
        observer.error(`Command ${command} Failed!`);
      }
      observer.complete();
    });
    // .pipe(wstream)
  });
}
