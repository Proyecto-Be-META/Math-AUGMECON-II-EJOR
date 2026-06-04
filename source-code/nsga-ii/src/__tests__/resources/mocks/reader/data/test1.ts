/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { InstanceReaderMock } from '../InstanceReaderMock';

export const test1: InstanceReaderMock = {
  testName: 'Reading test',
  file: './src/__tests__/resources/mocks/reader/data/instance1.txt',
  expected:
    '[((10, 30), 2) ((-4.5, 6.5), 3) ((35.5, 20), 4)]\n[(0, 0) (-5, 8.5)]\n10'
};
