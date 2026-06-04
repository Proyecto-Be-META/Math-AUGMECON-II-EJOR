/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstance } from '../../..';
import { RouteIndividual } from '../../../models/RouteIndevidual';

export type InitialIndividualGenerator = (
  instance: ProblemInstance,
  fleetSize: number
) => RouteIndividual;
