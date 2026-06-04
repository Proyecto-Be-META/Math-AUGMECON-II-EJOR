/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNode } from '../../../../index';
import { DepotNodeMock } from '../../mocks/node/depot/DepotNodeMock';

export const depotNodeTestSuite = (depotNodeTest: DepotNodeMock) => {
  describe('DepotNode Test Suite.', () => {
    const expected = depotNodeTest.expected;
    const { x, y } = depotNodeTest.creation;
    const node: DepotNode = new DepotNode(x, y);

    test('Access Test', () => {
      expect(node.xPos).toEqual(expected.x);
      expect(node.yPos).toEqual(expected.y);
    });

    test('toString Test', () => {
      expect(node.toString()).toEqual(depotNodeTest.string);
    });
  });
};
