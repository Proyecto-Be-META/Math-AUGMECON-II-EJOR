/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseIndividual } from 'genetics-js';
import { BaseAlgorithm } from '../algorithm';
import { ProblemInstance } from '../instance';
import { BaseInstanceReader } from '../reader';

/**
 * ## Instance Solver
 * Class that implements a solver for the MDCCVRP following the strategy
 * pattern.
 *
 * Given an instance, a fleet size and an algorithm, it solves the instance
 * by executing the selected algorithm. All these parameters can be changed
 * in the solver.
 *
 * @typeparam I type of individual
 * @typeparam T type of the genes of the individual
 */
export class InstanceSolver<I extends BaseIndividual<T>, T> {
  /**
   * Algorithm to solve the problem
   */
  private _algorithm: BaseAlgorithm<I, T>;

  /**
   * Reader to create problem instances from a file
   */
  private _instanceReader: BaseInstanceReader;

  /**
   * Instance to solve
   */
  private _instance: ProblemInstance;

  /**
   * Size of the fleet of vehicles.
   */
  private _fleetSize: number;

  /**
   * Constructor of the class. Initializes the parameters of the solver,
   * checking if the given fleet size is correct and reading the instance file.
   * @param algorithm Algorithm used to solve the problem
   * @param instanceRoute Route to the file that contains the instance
   * @param fleetSize Number of vehicles for the fleet
   */
  constructor(
    algorithm: BaseAlgorithm<I, T>,
    instanceRoute: string,
    fleetSize: number,
    instanceReader: BaseInstanceReader
  ) {
    this._algorithm = algorithm;
    this._instanceReader = instanceReader;
    this._instance = this._instanceReader.read(instanceRoute);
    InstanceSolver.checkFleetSize(fleetSize);
    this._fleetSize = fleetSize;
  }

  /**
   * Checks if the fleet size is a non-zero positive number.
   * @param fleetSize Number of vehicles for the fleet
   */
  private static checkFleetSize(fleetSize: number): void {
    if (fleetSize <= 0) {
      throw new Error('Fleet size must be a positive non-zero number.');
    }
  }

  /**
   * Sets a new fleet size for the solver.
   * @param newFleetSize Number of vehicles for the fleet
   */
  set fleetSize(newFleetSize: number) {
    InstanceSolver.checkFleetSize(newFleetSize);
    this._fleetSize = newFleetSize;
  }

  /**
   * Sets a new algorithm for the solver.
   * @param newAlgorithm Algortihm to solve the problem
   */
  set algorithm(newAlgorithm: BaseAlgorithm<I, T>) {
    this._algorithm = newAlgorithm;
  }

  /**
   * Sets a new instance for the solver by reading it from the specified file.
   * @param instanceRoute Route to the file that contains the instance
   */
  set instance(instanceRoute: string) {
    this._instance = this._instanceReader.read(instanceRoute);
  }

  /**
   * Solves the problem instance with the specified algorithm and fleet size.
   * @return Individual obtained from the execution of the algorithm.
   */
  public solveInstance(): I[] | undefined {
    const solution = this._algorithm.solve(this._instance, this._fleetSize);
    return solution;
  }
}
