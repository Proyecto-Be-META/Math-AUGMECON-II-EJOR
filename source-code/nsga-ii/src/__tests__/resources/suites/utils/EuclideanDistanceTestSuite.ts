/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { euclideanDistance } from '../../../../utils';
import { EuclideanDistanceMock } from '../../mocks/utils/euclideanDistance/EuclideanDistanceMock';

export const euclideanDistanceTestSuite = (
  EuclideanDistanceTest: EuclideanDistanceMock
) => {
  describe('Euclidean Disatnce Test Suite.', () => {
    test('Euclidean distance calculation test', () => {
      const { firstNode, secondNode, expected } = EuclideanDistanceTest;
      const result = euclideanDistance(firstNode, secondNode);
      expect(result).toBeCloseTo(expected, 2);
    });
  });
};
