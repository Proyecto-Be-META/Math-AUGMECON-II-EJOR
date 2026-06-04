/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { RandomSearch } from '../../../../algorithm';
import { InstanceReader } from '../../../../reader';
import { checkAllClientsWereVisited } from '../../../../utils';
import { checkFeasibility } from '../../../../utils/checkFeasibility';
import { RandomSearchMock } from '../../mocks/algorithm/randomSearch/RandomSearchMock';

export const simpleMemeticTestSuite = (randomSearchTest: RandomSearchMock) => {
  describe('Random Search Test Suite.', () => {
    randomSearchTest.instances.forEach((instance) => {
      test('Feasible solution test', () => {
        const { fleet } = randomSearchTest;
        const reader = new InstanceReader();
        const algorithm = new RandomSearch(
          randomSearchTest.creation.generations
        );
        const problemInstance = reader.read(instance);
        const solution = algorithm.solve(problemInstance, fleet);
        expect(
          checkFeasibility(
            solution,
            problemInstance.vehicleCapacity,
            problemInstance
          )
        ).toBeTruthy();
        expect(
          checkAllClientsWereVisited(problemInstance, solution)
        ).toBeTruthy();
      });
    });
  });
};
