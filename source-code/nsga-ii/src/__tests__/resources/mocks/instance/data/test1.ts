/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstanceMock } from '../ProblemInstanceMock';

export const test1: ProblemInstanceMock = {
  testName: 'Creation and access test with empty arrays',
  creation: {
    client: [],
    depot: [],
    vehicle: 0
  },
  expected: {
    client: [],
    depot: [],
    vehicle: 0
  },
  string: '[]\n[]\n0'
};
