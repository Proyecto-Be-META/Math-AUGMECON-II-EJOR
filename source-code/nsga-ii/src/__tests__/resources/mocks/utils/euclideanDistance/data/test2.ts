/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNode } from '../../../../../../node';
import { EuclideanDistanceMock } from '../EuclideanDistanceMock';

export const test2: EuclideanDistanceMock = {
  firstNode: new DepotNode(0, 0),
  secondNode: new DepotNode(0, 0),
  expected: 0
};
