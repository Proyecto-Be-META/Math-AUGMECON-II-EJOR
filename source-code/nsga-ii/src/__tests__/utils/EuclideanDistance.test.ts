/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { euclideanDistanceTestSuite } from '../resources/suites/utils/EuclideanDistanceTestSuite';

import EuclideanDistanceMocks from '../resources/mocks/utils/euclideanDistance';

Object.keys(EuclideanDistanceMocks).forEach((key) => {
  const test = EuclideanDistanceMocks[key];
  describe(`Calculation test for euclideanDistance`, () => {
    euclideanDistanceTestSuite(test);
  });
});
