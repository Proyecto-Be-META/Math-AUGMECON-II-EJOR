/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstance } from '../../../../index';
import { ProblemInstanceMock } from '../../mocks/instance/ProblemInstanceMock';

export const problemInstanceTestSuite = (
  problemInstanceTest: ProblemInstanceMock
) => {
  describe('Problem Instance Test Suite.', () => {
    const expected = problemInstanceTest.expected;
    const { client, depot, vehicle } = problemInstanceTest.creation;
    const problem: ProblemInstance = new ProblemInstance({
      clientNodes: client,
      depotNodes: depot,
      vehicleCapacity: vehicle
    });

    test('Access Test', () => {
      expect(problem.clientNodes).toEqual(expected.client);
      expect(problem.depotNodes).toEqual(expected.depot);
      expect(problem.vehicleCapacity).toEqual(expected.vehicle);
    });

    test('toString Test', () => {
      expect(problem.toString()).toEqual(problemInstanceTest.string);
    });
  });
};
