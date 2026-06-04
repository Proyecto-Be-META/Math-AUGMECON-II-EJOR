/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ClientNode } from '../../../../index';
import { ClientNodeMock } from '../../mocks/node/client/ClientNodeMock';

export const clientNodeTestSuite = (clientNodeTest: ClientNodeMock) => {
  describe('ClientNode Test Suite.', () => {
    const demandExpected: number = clientNodeTest.demand;
    const { x, y, demand } = clientNodeTest.creation;
    const node: ClientNode = new ClientNode(x, y, demand);

    test('Demand Access Test', () => {
      expect(node.demand).toEqual(demandExpected);
    });

    test('toString Test', () => {
      expect(node.toString()).toEqual(clientNodeTest.string);
    });
  });
};
