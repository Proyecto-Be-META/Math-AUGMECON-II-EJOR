/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNode } from '../../../../../../node';
import { EuclideanDistanceMock } from '../EuclideanDistanceMock';

export const test1: EuclideanDistanceMock = {
  firstNode: new DepotNode(10.5, 20.5),
  secondNode: new DepotNode(0, 60),
  expected: 40.87
};
