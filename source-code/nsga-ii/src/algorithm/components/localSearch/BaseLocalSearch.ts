/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstance } from '../../../instance';
import { PopulationItem } from '../population/Population';

export interface BaseLocalSearch {
  improve: (
    individual: PopulationItem,
    instance: ProblemInstance,
    obj: number
  ) => PopulationItem;
}
