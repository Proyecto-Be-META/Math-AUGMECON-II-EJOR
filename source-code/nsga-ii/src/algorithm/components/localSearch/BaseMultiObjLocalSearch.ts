/*
 * @license
 * Copyright (c) 2022 Eduardo Segredo.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstance } from '../../../instance';
import { PopulationItem } from '../population/Population';

export interface BaseMultiObjLocalSearch {
  improve: (
    individual: PopulationItem,
    instance: ProblemInstance,
  ) => PopulationItem[];
}
