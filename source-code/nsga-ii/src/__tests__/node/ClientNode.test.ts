/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ClientNode } from '../../node';

import { ClientNodeMock } from '../resources/mocks/node/client/ClientNodeMock';

import { clientNodeTestSuite } from '../resources/suites/node/ClientNodeTestSuite';
import { baseNodeTestSuite } from '../resources/suites/node/BaseNodeTestSuite';

import ClientMocks from '../resources/mocks/node/client';

const creation = (params: ClientNodeMock) => {
  return new ClientNode(
    params.creation.x,
    params.creation.y,
    params.creation.demand
  );
};

Object.keys(ClientMocks).forEach((key) => {
  const test = ClientMocks[key];
  describe(`${test.testName} for ClientNode`, () => {
    clientNodeTestSuite(test);
    baseNodeTestSuite(test, creation);
  });
});
