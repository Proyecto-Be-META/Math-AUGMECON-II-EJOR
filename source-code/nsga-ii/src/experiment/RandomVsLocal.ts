/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { readdirSync, writeFileSync } from 'fs';
import { RandomSearch } from '../algorithm';
import { getTime, getDistance } from '../algorithm/components/fitness/FitnessFunction';
import { getInfeasibilityDegree } from '../algorithm/components/fitness/InfeasibilityDegree';
import { constructiveInitialIndividualGenerator } from '../algorithm/components/initializer/ConstructiveInitializer';
import { arcExchange } from '../algorithm/components/localSearch/movements/ArcExchange';
import { arcNodeExchange } from '../algorithm/components/localSearch/movements/ArcNodeExchange';
import { crossExchange } from '../algorithm/components/localSearch/movements/CrossExchange';
import { exchange } from '../algorithm/components/localSearch/movements/Exchange';
import { orOpt } from '../algorithm/components/localSearch/movements/OrOpt';
import { relocation } from '../algorithm/components/localSearch/movements/Relocation';
import { MultiMovementLocalSearch } from '../algorithm/components/localSearch/MultiMovementLocalSearch';
import { ProblemInstance } from '../instance';
import { InstanceReader } from '../reader';

const numberOfVehicles: Record<string, number> = {
  '10x': 5,
  '25x': 10,
  '50x': 20,
  '100': 25
};

type SetOfInstances = {
  problemInstance: ProblemInstance;
  fleetSize: number;
};

type AlgorithmStatistics = {
  maxResult: string;
  minResult: string;
  meanOfResults: string;
};

type ExperimentStatistics = {
  randomSearch: AlgorithmStatistics[];
  localSearch: AlgorithmStatistics[];
};

export class RandomVsLocal {
  private instanceReader: InstanceReader;
  private randomSearchResults: number[][];
  private localSearchResults: number[][];
  private experimentStatistics: ExperimentStatistics;
  private instancesFilePaths: string[];

  constructor(
    private numberOfExecutions: number,
    private generations: number,
    private instancesPath: string,
    private outputPath: string,
    private obj: number,
  ) {
    this.instanceReader = new InstanceReader();
    this.randomSearchResults = [];
    this.localSearchResults = [];
    this.instancesFilePaths = [];
    this.experimentStatistics = {
      randomSearch: [],
      localSearch: []
    };
  }

  private setStatistics(): void {
    this.instancesFilePaths.map((_, index) => {
      const randomSearchStatistics = this.getAlgorithmStatistics(
        this.randomSearchResults,
        index
      );
      const localSearchStatistics = this.getAlgorithmStatistics(
        this.localSearchResults,
        index
      );
      this.experimentStatistics.randomSearch.push(randomSearchStatistics);
      this.experimentStatistics.localSearch.push(localSearchStatistics);
    });
  }

  private getAlgorithmStatistics(
    algorithmResults: number[][],

    index: number
  ): AlgorithmStatistics {
    let minResult = algorithmResults[0][index];
    let maxResult = algorithmResults[0][index];
    let meanOfResults = algorithmResults[0][index];
    for (let i = 1; i < this.numberOfExecutions; i++) {
      meanOfResults += algorithmResults[i][index];
      minResult =
        algorithmResults[i][index] < minResult
          ? algorithmResults[i][index]
          : minResult;

      maxResult =
        algorithmResults[i][index] > maxResult
          ? algorithmResults[i][index]
          : maxResult;
    }
    meanOfResults /= this.numberOfExecutions;
    return {
      minResult: minResult.toString().replace('.', ','),
      maxResult: maxResult.toString().replace('.', ','),
      meanOfResults: meanOfResults.toString().replace('.', ',')
    };
  }

  private exportStatistics(): void {
    let fileData =
      'Instance;Min (RS);Max (RS);Mean (RS);Min (LS);Max (LS);Mean (LS); Diff (LS - RS)\n';
    this.instancesFilePaths.map((filePath, index) => {
      fileData += `${filePath
        .replace('./instances/', '')
        .replace('.txt', '')};${
        this.experimentStatistics.randomSearch[index].minResult
      };${this.experimentStatistics.randomSearch[index].maxResult};${
        this.experimentStatistics.randomSearch[index].meanOfResults
      };${this.experimentStatistics.localSearch[index].minResult};${
        this.experimentStatistics.localSearch[index].maxResult
      };${this.experimentStatistics.localSearch[index].meanOfResults};${
        parseFloat(this.experimentStatistics.localSearch[index].meanOfResults) -
        parseFloat(this.experimentStatistics.randomSearch[index].meanOfResults)
      }\n`;
    });
    writeFileSync(this.outputPath, fileData);
  }

  public execute(): void {
    this.instancesFilePaths = readdirSync(this.instancesPath).sort((a, b) => {
      if (a.length < b.length) {
        return -1;
      } else {
        return parseInt(a.slice(0, 2)) < parseInt(b.slice(0, 2)) ? -1 : 1;
      }
    });

    const setOfInstances: SetOfInstances[] = [];

    this.instancesFilePaths.map((filePath) => {
      setOfInstances.push({
        problemInstance: this.instanceReader.read(
          `${this.instancesPath}${filePath}`
        ),
        fleetSize: numberOfVehicles[filePath.slice(0, 3)]
      });
    });

    for (let i = 0; i < this.numberOfExecutions; i++) {
      this.randomSearchResults.push([]);
      this.localSearchResults.push([]);

      setOfInstances.map(({ problemInstance, fleetSize }) => {
        const initialSolution = constructiveInitialIndividualGenerator(
          problemInstance,
          fleetSize
        );
        let initialSolutionObj = [getTime(initialSolution), getDistance(initialSolution)];
        let initialSolutionFitness = initialSolutionObj[0];
        let initialSolutionInfeasibilityDegree = getInfeasibilityDegree(initialSolution, problemInstance);

        const randomSearch = new RandomSearch(
          this.generations,
          initialSolution
        );
        const localSearch = new MultiMovementLocalSearch(
          [relocation, exchange, arcExchange, arcNodeExchange, orOpt, crossExchange],
          this.generations
        );

        const randomSearchSolution = randomSearch.solve(
          problemInstance,
          fleetSize
        );

        const localSearchSolution = localSearch.improve({
          individual: initialSolution,
          obj: initialSolutionObj,
          fitness: initialSolutionFitness,
          infeasibilityDegree: initialSolutionInfeasibilityDegree
        }, problemInstance, this.obj);

        this.randomSearchResults[i].push(
          getTime(randomSearchSolution[0], problemInstance)
        );

        this.localSearchResults[i].push(
          localSearchSolution.fitness
        );
      });
    }
    this.setStatistics();
    this.exportStatistics();
  }
}
