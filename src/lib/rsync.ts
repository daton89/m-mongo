import Rsync from 'rsync';
import debug from 'debug';
import os from 'os';

const dd = debug('rsync');

/**
 * rsync exec
 * @param src : string /path/to/source
 * @param dest : string server:/path/to/dest
 */
export function exec(
  src: string,
  dest: string,
  privateKey: string,
  flags?: string
) {
  return new Promise((resolve, reject) => {
    // Build the command
    const rsync = new Rsync()
      .executable(
        `rsync -e "ssh -i ${privateKey} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"`
      )
      .flags(flags || 'hvrPt')
      .source(src)
      .destination(
        os.platform() === 'win32' ? dest.replace('C:', '\\cygdrive\\c') : dest
      );

    dd('command %o', rsync.command());

    // Execute the command
    rsync.execute((err: Error, code: number, cmd: string) => {
      if (err) {
        dd('err %o', err);
        return reject(err);
      }
      dd(`Command ${cmd} exited with code ${code}`);
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}
