import { RouteIndividual } from '../../../models/RouteIndevidual';

export type PopulationItem = {
  id?: number;
  individual: RouteIndividual;
  obj: number[];
  fitness: number;
  infeasibilityDegree: number;
  distanceMetric?: number;
};

const isFirstPopulationItemBetter = (
  first: PopulationItem,
  second: PopulationItem
) => {
  if (first.infeasibilityDegree < second.infeasibilityDegree) {
    return true;
  } else if (first.infeasibilityDegree === second.infeasibilityDegree) {
    return first.fitness <= second.fitness;
  } else {
    return false;
  }
};

export class Population {
  private items: PopulationItem[];
  private bestIndividualIndex: number;

  constructor() {
    this.items = [];
    this.bestIndividualIndex = -1;
  }

  private isNewIndividualBetter(newItem: PopulationItem): boolean {
    const currentBestIndividual = this.items[this.bestIndividualIndex];
    if (
      newItem.infeasibilityDegree < currentBestIndividual.infeasibilityDegree
    ) {
      return true;
    } else if (
      newItem.infeasibilityDegree === currentBestIndividual.infeasibilityDegree
    ) {
      return newItem.fitness < currentBestIndividual.fitness;
    }
    return false;
  }

  public pushIndividual(populationItem: PopulationItem): void {
    this.items.push(populationItem);
    const lastItem = this.items[this.items.length - 1];
    if (this.bestIndividualIndex === -1) {
      this.bestIndividualIndex = this.items.length - 1;
    } else {
      if (this.isNewIndividualBetter(lastItem)) {
        this.bestIndividualIndex = this.items.length - 1;
      }
    }
  }

  public getPopulationItem(index: number): PopulationItem {
    return this.items[index];
  }

  public getPopulationItems(): PopulationItem[] {
    return this.items;
  }

  public getPopulationSize(): number {
    return this.items.length;
  }

  public getFittestPopulationItem(): PopulationItem {
    return this.items[this.bestIndividualIndex];
  }

  public replaceGenWithElit(offspring: Population): void {
    const currentBest = this.getFittestPopulationItem();
    const offspringBest = offspring.getFittestPopulationItem();

    if (isFirstPopulationItemBetter(offspringBest, currentBest)) {
      this.items = Array.from(offspring.getPopulationItems());
      this.bestIndividualIndex = offspring.bestIndividualIndex;
    } else {
      const sortedOffspring = offspring
        .getPopulationItems()
        .sort((first, second) => {
          if (first.infeasibilityDegree < second.infeasibilityDegree) {
            return -1;
          } else if (first.infeasibilityDegree === second.infeasibilityDegree) {
            if (first.fitness === second.fitness) {
              return 0;
            } else {
              return first.fitness < second.fitness ? -1 : 1;
            }
          } else {
            return 1;
          }
        });
      this.items = new Array<PopulationItem>();
      sortedOffspring.forEach((item, index) => {
        if (index !== sortedOffspring.length - 1) {
          this.items.push(item);
        }
      });
      this.items.push(currentBest);
      this.bestIndividualIndex = this.items.length - 1;
    }
  }
  
  public replaceWorst(offspring: Population): void {
    offspring.getPopulationItems().forEach((offspring) => {
      this.pushIndividual(offspring);
    });
    
    // console.log('Parent + Offspring before sorting');
    // this.getPopulationItems().forEach((individual, index) => {
    //   console.log(`Ind. ${index} fitness, infeasibility: ${individual.fitness}, ${individual.infeasibilityDegree}`);
    // });

    // console.log('Best individual fitness:', this.getFittestPopulationItem().fitness);
    // console.log('Best individual infeasibility:', this.getFittestPopulationItem().infeasibilityDegree);

    this.items = this.items.sort((first, second) => {
      if (first.infeasibilityDegree < second.infeasibilityDegree) {
        return -1;
      } else if (first.infeasibilityDegree === second.infeasibilityDegree) {
        if (first.fitness === second.fitness) {
          return 0;
        } else {
          return first.fitness < second.fitness ? -1 : 1;
        }
      } else {
        return 1;
      }
    });
    
    // console.log('Parent + Offspring after sorting');
    // this.getPopulationItems().forEach((individual, index) => {
    //   console.log(`Ind. ${index} fitness, infeasibility: ${individual.fitness}, ${individual.infeasibilityDegree}`);
    // });

    this.items.splice(this.items.length / 2, this.items.length / 2);
    this.bestIndividualIndex = 0;

    // console.log('surviving population');
    // this.getPopulationItems().forEach((individual, index) => {
    //   console.log(`ind. ${index} fitness, infeasibility: ${individual.fitness}, ${individual.infeasibilityDegree}`);
    // });

    // console.log('best individual fitness:', this.getFittestPopulationItem().fitness);
    // console.log('best individual infeasibility:', this.getFittestPopulationItem().infeasibilityDegree);
  }

  public replaceDBI(offspring: Population): void {
    offspring.getPopulationItems().forEach((offspring) => {
      this.pushIndividual(offspring);
    });
    this.calculateDBI();

    const bestIndividual = this.getFittestPopulationItem();

    // console.log('Parent + Offspring before sorting');
    // this.getPopulationItems().forEach((individual, index) => {
    //   console.log(`Ind. ${index} fitness, infeasibility, DBI: ${individual.fitness}, ${individual.infeasibilityDegree}, ${individual.distanceMetric}`);
    // });

    // console.log('Best individual fitness:', bestIndividual.fitness);
    // console.log('Best individual DBI:', bestIndividual.distanceMetric!);

    this.items = this.getPopulationItems().sort((first, second) => {
      if (first.distanceMetric! < second.distanceMetric!) {
        return 1;
      }
      if (first.distanceMetric! > second.distanceMetric!) {
        return -1;
      }
      if (first.infeasibilityDegree < second.infeasibilityDegree) {
        return -1;
      }
      if (first.infeasibilityDegree > second.infeasibilityDegree) {
        return 1;
      }
      if (first.fitness === second.fitness) {
        return 0;
      }
      return first.fitness < second.fitness ? -1 : 1;
    });
    
    // console.log('Parent + Offspring after sorting');
    // this.getPopulationItems().forEach((individual, index) => {
    //   console.log(`Ind. ${index} fitness, infeasibility, DBI: ${individual.fitness}, ${individual.infeasibilityDegree}, ${individual.distanceMetric}`);
    // });

    const newPop = new Array<PopulationItem>();
    
    var index = 0;
    while (newPop.length < (this.getPopulationSize() / 2) - 1) {
      newPop.push(this.getPopulationItem(index));
      index++;
    }
    newPop.push(bestIndividual);

    this.items = newPop;
    this.bestIndividualIndex = this.getPopulationSize() - 1;

    // console.log('Surviving population');
    // this.getPopulationItems().forEach((individual, index) => {
    //   console.log(`Ind. ${index} fitness, infeasibility, DBI: ${individual.fitness}, ${individual.infeasibilityDegree}, ${individual.distanceMetric}`);
    // });

    // console.log('Best individual fitness:', this.getFittestPopulationItem().fitness);
    // console.log('Best individual DBI:', this.getFittestPopulationItem().distanceMetric!);
  }

  public calculateDCN(): void {
    for (let i = 0; i < this.items.length; i++) {
      var dcn = Number.MAX_SAFE_INTEGER;
      for (let j = 0; j < this.items.length; j++) {
        if (i !== j) {
          const distance = RouteIndividual.getDistance(this.items[i].individual, this.items[j].individual);
          if (distance < dcn) {
            dcn = distance;
          }
        }
      }
      this.items[i].distanceMetric = dcn;
    }
  }

  public calculateDBI(): void {
    const bestIndividual = this.getFittestPopulationItem().individual;
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].distanceMetric = RouteIndividual.getDistance(this.items[i].individual, bestIndividual);
    }
  }
}
