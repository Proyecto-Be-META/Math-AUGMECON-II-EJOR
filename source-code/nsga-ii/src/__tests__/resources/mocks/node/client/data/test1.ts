/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ClientNodeMock } from '../ClientNodeMock';

export const test1: ClientNodeMock = {
  testName: 'Creation Test and access',
  creation: {
    x: 10,
    y: 0,
    demand: 10
  },
  expected: {
    x: 10,
    y: 0
  },
  demand: 10,
  string: '((10, 0), 10)'
};
