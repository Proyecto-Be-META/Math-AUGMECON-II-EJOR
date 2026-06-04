/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNode } from '../../node';

import { DepotNodeMock } from '../resources/mocks/node/depot/DepotNodeMock';

import { depotNodeTestSuite } from '../resources/suites/node/DepotNodeTestSuite';
import { baseNodeTestSuite } from '../resources/suites/node/BaseNodeTestSuite';

import DepotMocks from '../resources/mocks/node/depot';

const creation = (params: DepotNodeMock) => {
  return new DepotNode(params.creation.x, params.creation.y);
};

Object.keys(DepotMocks).forEach((key) => {
  const test = DepotMocks[key];
  describe(`${test.testName} for DepotNode`, () => {
    depotNodeTestSuite(test);
    baseNodeTestSuite(test, creation);
  });
});
