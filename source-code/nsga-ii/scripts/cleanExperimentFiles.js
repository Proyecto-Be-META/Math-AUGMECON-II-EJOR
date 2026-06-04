const fs = require('fs');
const path = require('path');

const basePath = './experiment_results/';
const entries = fs.readdirSync(basePath);

const directories = entries.filter((entry) =>
  fs.lstatSync(path.resolve(basePath, entry)).isDirectory()
);

directories.forEach((directory) => {
  const files = fs.readdirSync(basePath.concat(directory));
  files
    .filter((file) => file.match(/^ls/))
    .forEach((file) => {
      const data = fs
        .readFileSync(`${basePath}${directory}/${file}`, {
          encoding: 'utf-8'
        })
        .split('\n')
        .filter((line) => line.match(/^\d/));
      fs.writeFileSync(`${basePath}${directory}/${file}`, data.join('\n'));
    });
});
