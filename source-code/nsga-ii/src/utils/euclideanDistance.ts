/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseNode } from '../node';

/**
 * Calculates the euclidean distance from the first point to the second point.
 * @param point1 First point
 * @param point2 Second point
 * @return Euclidean distance between the points
 */
export function euclideanDistance(point1: BaseNode, point2: BaseNode): number {
  return Math.sqrt(
    Math.pow(point1.xPos - point2.xPos, 2) +
      Math.pow(point1.yPos - point2.yPos, 2)
  );
}
