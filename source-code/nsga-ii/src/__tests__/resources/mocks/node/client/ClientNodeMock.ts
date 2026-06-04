/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseNodeMock } from '../base/BaseNodeMock';

export interface ClientNodeMock extends BaseNodeMock {
  creation: {
    x: number;
    y: number;
    demand: number;
  };
  expected: {
    x: number;
    y: number;
  };
  demand: number;
}
