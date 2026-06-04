/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseNode } from '../../../../index';
import { BaseNodeMock } from '../../mocks/node/base/BaseNodeMock';

type CreationCallback<T extends BaseNode> = (...params: any[]) => T;

export const baseNodeTestSuite = <T extends BaseNode>(
  baseNodeTest: BaseNodeMock,
  creation: CreationCallback<T>
) => {
  describe('BaseNode Test Suite.', () => {
    const expected = baseNodeTest.expected;
    const node: BaseNode = creation(baseNodeTest);

    test('Access Test', () => {
      expect(node.xPos).toEqual(expected.x);
      expect(node.yPos).toEqual(expected.y);
    });

    test('toString Test', () => {
      expect(node.toString()).toEqual(baseNodeTest.string);
    });
  });
};
