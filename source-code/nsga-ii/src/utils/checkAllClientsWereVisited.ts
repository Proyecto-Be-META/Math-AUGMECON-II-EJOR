import { ProblemInstance } from '../instance';
import { RouteIndividual } from '../models/RouteIndevidual';

export const checkAllClientsWereVisited = (
  instance: ProblemInstance,
  solution: RouteIndividual
): number => {
  const clients = instance.clientNodes;
  let clientsNotVisited = 0;

  for (let i = 0; i < clients.length; i++) {
    let clientVisited = false;
    for (let j = 0; j < solution.length(); j++) {
      if (solution.get(j).includes(clients[i])) {
        clientVisited = true;
        break;
      }
    }
    if (!clientVisited) {
      clientsNotVisited++;
    }
  }
  return clientsNotVisited;
};
