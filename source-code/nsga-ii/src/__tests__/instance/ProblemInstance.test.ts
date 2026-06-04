/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { problemInstanceTestSuite } from '../resources/suites/instance/ProblemInstanceTestSuite';

import InstanceMocks from '../resources/mocks/instance';

Object.keys(InstanceMocks).forEach((key) => {
  const test = InstanceMocks[key];
  describe(`${test.testName} for ProblemInstance`, () => {
    problemInstanceTestSuite(test);
  });
});
