/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ClientNodeMock } from '../ClientNodeMock';

export const test2: ClientNodeMock = {
  testName: 'Creation Test and access',
  creation: {
    x: -10.65,
    y: 50.07,
    demand: 5
  },
  expected: {
    x: -10.65,
    y: 50.07
  },
  demand: 5,
  string: '((-10.65, 50.07), 5)'
};
