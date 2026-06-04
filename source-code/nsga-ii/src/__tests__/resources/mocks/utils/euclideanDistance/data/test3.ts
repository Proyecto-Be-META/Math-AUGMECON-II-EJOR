/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNode } from '../../../../../../node';
import { EuclideanDistanceMock } from '../EuclideanDistanceMock';

export const test3: EuclideanDistanceMock = {
  firstNode: new DepotNode(-32.4, -40.8),
  secondNode: new DepotNode(10, -24.7),
  expected: 45.35
};
