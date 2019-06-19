import fs from 'fs';
import path from 'path';
import debug from 'debug';

const dd = debug('folder');

export function ls(directory: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        dd('err %o', err);
        return reject(err);
      }
      const folders = files.filter(file => fs.lstatSync(file).isDirectory());
      const foldersWithAbsolutePath = folders.map(folder =>
        path.join(directory, folder)
      );
      dd('folders %o', foldersWithAbsolutePath);
      resolve(foldersWithAbsolutePath);
    });
  });
}
