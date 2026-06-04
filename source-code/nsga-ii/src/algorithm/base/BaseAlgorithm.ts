/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseIndividual } from 'genetics-js';
import { ProblemInstance } from '../../instance';

/**
 * ## Base Algorithm
 * Interface to define an algorithm to solve the MDCCVRP using the library
 * GeneticsJS.
 *
 * Algorithms will work with a fixed fleet sized and can solve any instance of
 * the problem, returning the resulting individual.
 *
 * @typeparam I type of individual
 * @typeparam T type of the genes of the individual
 */
export interface BaseAlgorithm<I extends BaseIndividual<T>, T> {
  /**
   * Solves the given instance of the problem.
   * @param instance Problem instance to solve
   * @param fleetSize Number of vehicles of the fleet
   * @return Obtained individual in the execution of the algorithm
   */
  solve: (instance: ProblemInstance, fleetSize: number) => I[];
}
