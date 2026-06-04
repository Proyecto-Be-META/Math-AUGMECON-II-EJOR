/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { readFileSync } from 'fs';
import { ProblemInstance } from '../instance';
import { ClientNode, DepotNode } from '../node';
import { BaseInstanceReader } from './BaseInstanceReader';

/**
 * ## InstanceReader
 * The class implements a tool to read a definition of an instance of the
 * MDCCVRP and creates the corresponding Problem Instance.
 */
export class InstanceReader implements BaseInstanceReader {
  /**
   * Reads the corresponding file and generates a problem instance, checking
   * if there is an error in the definition.
   * @param fileRoute Route to the file
   * @return ProblemInstance corresponding to the definition.
   */
  public read(fileRoute: string): ProblemInstance {
    const file = readFileSync(fileRoute, 'utf-8').split('\n');
    const numberOfClients: number = Number.parseInt(file[0]);
    if (isNaN(numberOfClients) || numberOfClients <= 0) {
      throw new Error(`${numberOfClients} isn't a valid number of clients.`);
    }
    const numberOfDepots: number = Number.parseInt(file[1]);
    if (isNaN(numberOfDepots) || numberOfDepots <= 0) {
      throw new Error(`${numberOfDepots} isn't a valid number of depots.`);
    }
    const vechicleCapacity: number = Number.parseInt(file[2]);
    if (isNaN(vechicleCapacity) || vechicleCapacity <= 0) {
      throw new Error(`${vechicleCapacity} isn't a valid vehicle capacity.`);
    }
    const demandDistance: number = numberOfClients + numberOfDepots + 1;
    return new ProblemInstance({
      clientNodes: this.getClientNodes(file, numberOfClients, demandDistance),
      depotNodes: this.getDepotNodes(file, numberOfDepots, numberOfClients),
      vehicleCapacity: vechicleCapacity
    });
  }

  /**
   * Takes the lines of the file corresponding to the definition of the client
   * nodes in the problem and creates an array with the corresponding nodes.
   * It also checks if there is any error in the definition.
   * @param file Array with every line read in the file
   * @param numberOfClients Number of client nodes
   * @param demandDistance Number of lines between a node and it's demand
   * @return Array with the client nodes.
   */
  private getClientNodes(
    file: string[],
    numberOfClients: number,
    demandDistance: number
  ): Array<ClientNode> {
    const clientNodes: Array<ClientNode> = [];
    const initialPosition = 4;
    var clientID = 0;
    for (let i = initialPosition; i < initialPosition + numberOfClients; i++) {
      const clientInfo: string[] = file[i].split(' ');
      const clientPosX: number = Number.parseFloat(clientInfo[0]);
      if (isNaN(clientPosX)) {
        throw new Error(`${clientPosX} isn't a valid position.`);
      }
      const clientPosY: number = Number.parseFloat(clientInfo[1]);
      if (isNaN(clientPosY)) {
        throw new Error(`${clientPosY} isn't a valid position.`);
      }
      const clientDemand: number = Number.parseFloat(file[i + demandDistance]);
      if (isNaN(clientDemand) || clientDemand <= 0) {
        throw new Error(`${clientDemand} isn't a valid demand for a client.`);
      }
      clientNodes.push(new ClientNode(clientID, clientPosX, clientPosY, clientDemand));
      clientID++;
    }
    return clientNodes;
  }

  /**
   * Takes the lines of the file corresponding to the definition of the depot
   * nodes in the problem and creates an array with the corresponding nodes.
   * It also checks if there is any error in the definition.
   * @param file Array with every line read in the file
   * @param numberOfDepots Number of depot nodes
   * @param numberOfClients Number of client nodes
   * @return Array with the depot nodes.
   */
  private getDepotNodes(
    file: string[],
    numberOfDepots: number,
    numberOfClients: number
  ): Array<DepotNode> {
    const depotNodes: Array<DepotNode> = [];
    const initialPosition: number = 4 + numberOfClients;
    var depotID = -1;
    for (let i = initialPosition; i < initialPosition + numberOfDepots; i++) {
      const depotInfo: string[] = file[i].split(' ');
      const depotPosX: number = Number.parseFloat(depotInfo[0]);
      if (isNaN(depotPosX)) {
        throw new Error(`${depotPosX} isn't a valid position.`);
      }
      const depotPosY: number = Number.parseFloat(depotInfo[1]);
      if (isNaN(depotPosY)) {
        throw new Error(`${depotPosY} isn't a valid position.`);
      }
      depotNodes.push(new DepotNode(depotID, depotPosX, depotPosY));
      depotID--;
    }
    return depotNodes;
  }
}
