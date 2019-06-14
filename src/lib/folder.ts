import fs from 'fs';

export function ls(directory: string) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) return reject(err);

      resolve(files);
    });
  });
}
