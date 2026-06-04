/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

export interface BaseNodeMock {
  testName: string;
  creation: {
    x: number;
    y: number;
  };
  expected: {
    x: number;
    y: number;
  };
  string: string;
}
