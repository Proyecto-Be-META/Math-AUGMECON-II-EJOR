const fs = require('fs');
const { plot, stack } = require('nodeplotlib');
const path = require('path');

const basePath = './experiment_results/';
const entries = fs.readdirSync(basePath);

const xAxisData = [];
for (let i = 0; i < 25; i++) {
  xAxisData.push(i * 10);
}

const directories = entries.filter((entry) =>
  fs.lstatSync(path.resolve(basePath, entry)).isDirectory()
);

directories
  .filter((d) => d.match('10x4'))
  .forEach((directory) => {
    const generationsData = [];
    for (let i = 0; i < 25; i++) {
      generationsData.push({
        total1: 0,
        total2: 0,
        elements1: 0,
        elements2: 0
      });
    }
    const files = fs.readdirSync(basePath.concat(directory));
    files
      .filter((file) => file.match(/^ls-10/))
      .forEach((file) => {
        const data = fs
          .readFileSync(`${basePath}${directory}/${file}`, {
            encoding: 'utf-8'
          })
          .split('\n');
        const parsedData = data.map((line) =>
          line.split(' - ').map((value) => parseFloat(value))
        );

        let dataPerGeneration = [];

        for (let i = 0; i < 25; i++) {
          dataPerGeneration.push([]);
          for (let j = i * 100; j < i * 100 + 100; j++) {
            dataPerGeneration[i].push(parsedData[j]);
          }
        }

        dataPerGeneration = dataPerGeneration.map((generation) =>
          generation.sort((a, b) => a[0] - b[0])
        );

        dataPerGeneration.forEach((generation, index) => {
          generationsData[index].total1 += generation[0][0];
          generationsData[index].elements1++;
        });
      });

    const generationsMeans1 = generationsData.map(
      (data) => data.total1 / data.elements1
    );

    files
      .filter((file) => file.match(/^ls-50/))
      .forEach((file) => {
        const data = fs
          .readFileSync(`${basePath}${directory}/${file}`, {
            encoding: 'utf-8'
          })
          .split('\n');
        const parsedData = data.map((line) =>
          line.split(' - ').map((value) => parseFloat(value))
        );

        let dataPerGeneration = [];

        for (let i = 0; i < 25; i++) {
          dataPerGeneration.push([]);
          for (let j = i * 100; j < i * 100 + 100; j++) {
            dataPerGeneration[i].push(parsedData[j]);
          }
        }

        dataPerGeneration = dataPerGeneration.map((generation) =>
          generation.sort((a, b) => a[0] - b[0])
        );

        dataPerGeneration.forEach((generation, index) => {
          generationsData[index].total2 += generation[0][0];
          generationsData[index].elements2++;
        });
      });
    const generationsMeans2 = generationsData.map(
      (data) => data.total2 / data.elements2
    );

    const graphData1 = {
      x: xAxisData,
      y: generationsMeans1,
      type: 'scatter',
      name: 'Neigborhood size: 10'
    };
    const graphData2 = {
      x: xAxisData,
      y: generationsMeans2,
      type: 'scatter',
      name: 'Neigborhood size: 50'
    };
    stack([graphData1, graphData2], {
      title: `Instance ${directory}`,
      xaxis: { title: 'Number of generations' },
      yaxis: { title: 'Fitness value' }
    });
  });
plot();
