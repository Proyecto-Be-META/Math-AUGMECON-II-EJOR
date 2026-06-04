/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { InstanceReader } from '../../../../index';
import { InstanceReaderMock } from '../../mocks/reader/InstanceReaderMock';

export const instanceReaderTestSuite = (instanceTest: InstanceReaderMock) => {
  describe('DepotNode Test Suite.', () => {
    const fileName: string = instanceTest.file;
    const expected: string = instanceTest.expected;
    const reader: InstanceReader = new InstanceReader();

    test('Read Test', () => {
      if (instanceTest.error) {
        expect(() => reader.read(fileName)).toThrow(Error);
      } else {
        expect(reader.read(fileName).toString()).toEqual(expected);
      }
    });
  });
};
