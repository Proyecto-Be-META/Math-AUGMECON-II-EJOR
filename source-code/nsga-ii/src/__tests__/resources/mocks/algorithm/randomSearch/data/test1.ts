/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { RandomSearchMock } from '../RandomSearchMock';

export const test1: RandomSearchMock = {
  testName: 'Feasibility test',
  creation: {
    generations: 25
  },
  instances: [
    './instances/10x4-1.txt',
    './instances/10x4-3.txt',
    './instances/25x4-1.txt',
    './instances/25x4-3.txt',
    './instances/50x4-1.txt',
    './instances/50x4-3.txt'
  ],
  fleet: 5
};
