/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNodeMock } from '../DepotNodeMock';

export const test2: DepotNodeMock = {
  testName: 'Creation Test and access',
  creation: {
    x: -10.65,
    y: 50.07
  },
  expected: {
    x: -10.65,
    y: 50.07
  },
  string: '(-10.65, 50.07)'
};
