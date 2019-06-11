import { spawn } from 'child_process';
import chalk from 'chalk';
import { Observable } from 'rxjs';
import { Spinner } from 'clui';

export default function Spawn(
  command: string,
  args: string[]
): Observable<string> {
  const status = new Spinner('Dumping..., please wait...');
  status.start();

  return new Observable(observer => {
    const spawning = spawn(command, args);

    spawning.stdout.on('data', data => {
      status.stop();
      observer.next(chalk.green(`STDOUT :: ${data.toString()}`));
    });

    spawning.stderr.on('data', data => {
      status.stop();
      observer.next(chalk.red(`STDERR :: ${data.toString()}`));
    });

    spawning.on('close', code => {
      status.stop();
      if (code === 0) {
        observer.next(chalk.green(`Command ${chalk.cyan(command)} Completed!`));
      } else {
        observer.error(chalk.red(`Command ${chalk.cyan(command)} Failed!`));
      }
      observer.complete();
    });
    // .pipe(wstream)
  });
}
