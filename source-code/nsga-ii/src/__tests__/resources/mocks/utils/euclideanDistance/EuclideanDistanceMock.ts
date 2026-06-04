/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseNode } from '../../../../../node';

export interface EuclideanDistanceMock {
  firstNode: BaseNode;
  secondNode: BaseNode;
  expected: number;
}
