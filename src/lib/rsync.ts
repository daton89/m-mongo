import Rsync from 'rsync';
import chalk from 'chalk';

/**
 * rsync exec
 * @param src : string /path/to/source
 * @param dest : string server:/path/to/dest
 */
export function exec(src: string, dest: string, flags?: string) {
  return new Promise((resolve, reject) => {
    // Build the command
    const rsync = new Rsync()
      // .shell('ssh')
      .flags(flags || 'hvrPt')
      .source(src)
      .destination(dest);

    // Execute the command
    rsync.execute((err: Error, code: number, cmd: string) => {
      if (err) {
        console.log(chalk.red(cmd));
        console.log(chalk.red(err.toString()));
        console.log(chalk.red(`${code}`));
        return reject(chalk.red(err.toString()));
      }
      resolve(
        chalk.green(
          `Command ${chalk.cyan(cmd)} exited with code ${chalk.cyan(
            code.toString()
          )}`
        )
      );
    });
  });
}
