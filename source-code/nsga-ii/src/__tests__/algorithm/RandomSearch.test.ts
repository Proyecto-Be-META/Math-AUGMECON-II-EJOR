/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { randomSearchTestSuite } from '../resources/suites/algorithm/RandomSearchTestSuite';

import RandomSearchMocks from '../resources/mocks/algorithm/randomSearch';

Object.keys(RandomSearchMocks).forEach((key) => {
  const test = RandomSearchMocks[key];
  describe(`${test.testName} for RandomSearch`, () => {
    randomSearchTestSuite(test);
  });
});
