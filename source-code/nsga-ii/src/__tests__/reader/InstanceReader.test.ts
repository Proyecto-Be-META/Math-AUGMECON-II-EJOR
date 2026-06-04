/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { instanceReaderTestSuite } from '../resources/suites/reader/InstanceReaderTestSuite';

import InstanceMocks from '../resources/mocks/reader';

Object.keys(InstanceMocks).forEach((key) => {
  const test = InstanceMocks[key];
  describe(`${test.testName} for InstanceReader`, () => {
    instanceReaderTestSuite(test);
  });
});
