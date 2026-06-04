/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import {
  FitnessProportionalSelectionParams,
  List,
  ListIndividual,
} from 'genetics-js';
import { ListMutationParams } from 'genetics-js/lib/mutation/list/UniformListMutation';
import * as yargs from 'yargs';
import { NSGAII, NSGAIIParams, SimpleMemetic, SimpleMemeticParams } from '../algorithm';
import { BaseNode } from '../node';
import { InstanceReader } from '../reader';
import { InstanceSolver } from '../solver';
import { nativeMath } from 'random-js';
import {
  BaseRouteCrossoverParams,
  OrderRouteCrossover,
  OnePointCrossover
} from '../algorithm/components';
import { MultiMovementLocalSearch } from '../algorithm/components/localSearch/MultiMovementLocalSearch';
import { MultiObjMultiMovementLocalSearch } from '../algorithm/components/localSearch/MultiObjMultiMovementLocalSearch';
import { relocation } from '../algorithm/components/localSearch/movements/Relocation';
import { exchange } from '../algorithm/components/localSearch/movements/Exchange';
import { arcExchange } from '../algorithm/components/localSearch/movements/ArcExchange';
import { arcNodeExchange } from '../algorithm/components/localSearch/movements/ArcNodeExchange';
import { orOpt } from '../algorithm/components/localSearch/movements/OrOpt';
import { crossExchange } from '../algorithm/components/localSearch/movements/CrossExchange';
import { randomInitialIndividualGenerator } from '../algorithm/components/initializer/RandomInitializer';
import { constructiveInitialIndividualGenerator } from '../algorithm/components/initializer/ConstructiveInitializer';
import { RouteIndividual } from '../models/RouteIndevidual';
import { MaxGenerations } from '../algorithm/components/termination-condition/MaxGenerations';
import { MaxTime } from '../algorithm/components/termination-condition/MaxTime';
import { MaxNumberEvaluations } from '../algorithm/components/termination-condition/MaxNumberEvaluations';
import { IteratedLocalSearch } from '../algorithm/components/localSearch/IteratedLocalSearch';
import { NoLocalSearch } from '../algorithm/components/localSearch/NoLocalSearch';
import { NoMultiObjLocalSearch } from '../algorithm/components/localSearch/NoMultiObjLocalSearch';

yargs.command({
  command: 'memetic',
  describe: 'Runs the memetic algorithm',
  builder: {
    instanceFile: {
      describe: 'Input file name with the instance to be solved',
      alias: 'f',
      demandOption: true,
      type: 'string'
    },
    fleetSize: {
      describe: 'Number of vehicles',
      alias: 'r',
      demandOption: true,
      type: 'number'
    },
    stoppingCriterion: {
      describe: 'Stopping criterion considered',
      alias: 'sc',
      type: 'string',
      choices: ['Gen', 'Time', 'Eval'],
      default: 'Gen',
    },
    generations: {
      describe: 'Max number of generations to be run',
      alias: 'g',
      type: 'number',
      default: 10
    },
    time: {
      describe: 'Max number of seconds to be run',
      alias: 't',
      type: 'number',
      default: 60 
    },
    evaluations: {
      describe: 'Max number of evaluations to be performed',
      alias: 'e',
      type: 'number',
      default: 1000 
    },
    populationSize: {
      describe: 'Population size',
      alias: 'p',
      type: 'number',
      default: 10
    },
    replacement: {
      describe: 'Population replacement strategy',
      alias: 'rs',
      type: 'string',
      choices: ['Gen-Elit', 'RW', 'DBI'],
      default: 'Gen-Elit' 
    },
    crossover: {
        describe: 'Crossover operator',
        alias: 'co',
        type: 'string',
        choices: ['OnePoint', 'OrderRoute'],
        default: 'OrderRoute'
    },
    crossoverRate: {
      describe: 'Crossover rate',
      alias: 'cr',
      type: 'number',
      default: 1.0
    },
    constructiveInit: {
      describe: 'Initialise population with a constructive approach',
      alias: 'ci',
      type: 'boolean',
      default: false 
    },
    localSearch: {
      describe: 'Local search to be applied',
      alias: 'ls',
      type: 'string',
      choices: ['NoLS', 'LS', 'ILS'],
      default: 'NoLS',
    },
    neighbourhoodSize: {
      describe: 'Neighbourhood size used by the local search procedure',
      alias: 'ns',
      type: 'number',
      default: 1
    },
    ilsIterations: {
      describe: 'Number of iterations performed by ILS',
      alias: 'i',
      type: 'number',
      default: 10
    },
    obj: {
      describe: 'Objective to be optimised: Time (0) - Dist (1)',
      type: 'number',
      choices: [0, 1],
      default: 0
    }
  },
  handler(argv) {
    const algorithmParams: SimpleMemeticParams<
      FitnessProportionalSelectionParams<RouteIndividual, List<BaseNode>>,
      BaseRouteCrossoverParams,
      ListMutationParams
    > = {
      populationSize: argv.populationSize as number,
      offspringSize: argv.populationSize as number,
      replacement: argv.replacement as 'Gen-Elit' | 'RW' | 'DBI',
      crossover: argv.crossover === 'OnePoint' ?
        new OnePointCrossover() :
        new OrderRouteCrossover(),
      crossoverParams: {
        engine: nativeMath,
        individualConstructor: ListIndividual,
      },
      crossoverRate: argv.crossoverRate as number,
      terminationCondition: argv.stoppingCriterion === 'Gen' ?
        new MaxGenerations(argv.generations as number) :
        argv.stoppingCriterion === 'Time' ?
          new MaxTime(argv.time as number) :
          new MaxNumberEvaluations(argv.evaluations as number),
      localSearch: argv.localSearch === 'LS' ?
        new MultiMovementLocalSearch(
          [relocation, exchange, arcExchange, arcNodeExchange, orOpt, crossExchange],
          argv.neighbourhoodSize as number
          ) : argv.localSearch === 'ILS'  ?
        new IteratedLocalSearch(
          argv.ilsIterations as number,
          new MultiMovementLocalSearch(
            [relocation, exchange, arcExchange, arcNodeExchange, orOpt, crossExchange],
            argv.neighbourhoodSize as number
          )
        ) : new NoLocalSearch(),
      individualGenerator: argv.constructiveInit
        ? constructiveInitialIndividualGenerator
        : randomInitialIndividualGenerator,
      obj: argv.obj as number
    };

    const algorithm = new SimpleMemetic(algorithmParams);
    const instanceReader = new InstanceReader();
    const solver = new InstanceSolver(
      algorithm,
      argv.instanceFile as string,
      argv.fleetSize as number,
      instanceReader
    );

    console.log(solver.solveInstance()!.toString());
  }
});

yargs.command({
  command: 'nsga',
  describe: 'Runs the NSGA-II',
  builder: {
    instanceFile: {
      describe: 'Input file name with the instance to be solved',
      alias: 'f',
      demandOption: true,
      type: 'string'
    },
    fleetSize: {
      describe: 'Number of vehicles',
      alias: 'r',
      demandOption: true,
      type: 'number'
    },
    stoppingCriterion: {
      describe: 'Stopping criterion considered',
      alias: 'sc',
      type: 'string',
      choices: ['Gen', 'Time', 'Eval'],
      default: 'Gen',
    },
    generations: {
      describe: 'Max number of generations to be run',
      alias: 'g',
      type: 'number',
      default: 10
    },
    time: {
      describe: 'Max number of seconds to be run',
      alias: 't',
      type: 'number',
      default: 60 
    },
    evaluations: {
      describe: 'Max number of evaluations to be performed',
      alias: 'e',
      type: 'number',
      default: 1000 
    },
    populationSize: {
      describe: 'Population size',
      alias: 'p',
      type: 'number',
      default: 10
    },
    crossover: {
        describe: 'Crossover operator',
        alias: 'co',
        type: 'string',
        choices: ['OnePoint', 'OrderRoute'],
        default: 'OrderRoute'
    },
    crossoverRate: {
      describe: 'Crossover rate',
      alias: 'cr',
      type: 'number',
      default: 1.0
    },
    constructiveInit: {
      describe: 'Initialise population with a constructive approach',
      alias: 'ci',
      type: 'boolean',
      default: false 
    },
    localSearch: {
      describe: 'Local search to be applied',
      alias: 'ls',
      type: 'string',
      choices: ['NoLS', 'LS'],
      default: 'NoLS',
    },
  },
  handler(argv) {
    const algorithmParams: NSGAIIParams<
      BaseRouteCrossoverParams
    > = {
      populationSize: argv.populationSize as number,
      offspringSize: argv.populationSize as number,
      crossover: argv.crossover === 'OnePoint' ?
        new OnePointCrossover() :
        new OrderRouteCrossover(),
      crossoverParams: {
        engine: nativeMath,
        individualConstructor: ListIndividual,
      },
      crossoverRate: argv.crossoverRate as number,
      terminationCondition: argv.stoppingCriterion === 'Gen' ?
        new MaxGenerations(argv.generations as number) :
        argv.stoppingCriterion === 'Time' ?
          new MaxTime(argv.time as number) :
          new MaxNumberEvaluations(argv.evaluations as number),
      localSearch: argv.localSearch === 'LS' ?
        new MultiObjMultiMovementLocalSearch(
          [relocation, exchange, arcExchange, arcNodeExchange, orOpt, crossExchange],
          ) : new NoMultiObjLocalSearch(),
      individualGenerator: argv.constructiveInit
        ? constructiveInitialIndividualGenerator
        : randomInitialIndividualGenerator
    };

    const algorithm = new NSGAII(algorithmParams);
    const instanceReader = new InstanceReader();
    const solver = new InstanceSolver(
      algorithm,
      argv.instanceFile as string,
      argv.fleetSize as number,
      instanceReader
    );

    const solutions = solver.solveInstance();
    solutions?.forEach((solution) => {
      console.log(solution.toString());
    });
  }
});

yargs.parse();

// if (argv.random) {
//   const algorithm = new RandomSearch(argv.generation);
//   const instanceReader = new InstanceReader();
//   const solver = new InstanceSolver(
//     algorithm,
//     argv.file,
//     argv.size,
//     instanceReader
//   );
//   console.log(solver.solveInstance()?.toString());