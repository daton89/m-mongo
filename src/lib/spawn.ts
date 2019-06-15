import { spawn } from 'child_process';
import { Observable } from 'rxjs';
import { Spinner } from 'clui';
import debug from 'debug';

const dd = debug('spawn');

export default function Spawn(
  command: string,
  args: string[]
): Observable<string> {
  const status = new Spinner('Dumping..., please wait...');
  status.start();

  dd('full command %o', `${command} ${args.join(' ')}`);

  return new Observable(observer => {
    const spawning = spawn(command, args);

    spawning.stdout.on('data', data => {
      status.stop();
      observer.next(`STDOUT :: ${data.toString()}`);
    });

    spawning.stderr.on('data', data => {
      status.stop();
      observer.next(`STDERR :: ${data.toString()}`);
    });

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
