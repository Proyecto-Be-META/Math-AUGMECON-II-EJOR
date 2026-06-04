/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { InstanceReaderMock } from '../InstanceReaderMock';

export const test2: InstanceReaderMock = {
  testName: 'Error in instance definition test',
  file: './src/__tests__/resources/mocks/reader/data/instance2.txt',
  expected: '',
  error: true
};
