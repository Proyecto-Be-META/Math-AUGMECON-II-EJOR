/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import * as yargs from 'yargs';
import { RandomVsLocal } from './RandomVsLocal';

const argv = yargs
  .strict()
  .option('random-local', {
    alias: 'rl',
    description: 'Experiment: RandomSearch - LocalSearch',
    type: 'boolean'
  })
  .option('output', {
    alias: 'o',
    description: 'Output file for the experiment results',
    type: 'string'
  })
  .option('input', {
    alias: 'i',
    description: 'Directory where the instances for the experiment are located',
    type: 'string'
  })
  .option('generations', {
    alias: 'g',
    description: 'Number of generations for the random search',
    type: 'number',
    default: 20
  })
  .option('executions', {
    alias: 'e',
    description: 'Number of executions for the experiment',
    type: 'number',
    default: 1
  })
  .option('obj', {
    description: 'Objective to be optimised: Time (0) - Dist (1)',
    type: 'number',
    choices: [0, 1],
    default: 0
  })
  .check((argv) => {
    if (argv['random-local']) {
      return true;
    } else {
      throw new Error('Error: Select one of the posible experiments.');
    }
  })
  .demandOption(['output', 'input'])
  .help().argv;

if (argv['random-local']) {
  const experiment = new RandomVsLocal(
    argv.executions,
    argv.generations,
    argv.input,
    argv.output,
    argv.obj
  );

  experiment.execute();
}
