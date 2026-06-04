/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNode } from '../node';
import { ClientNode } from '../node';

/**
 * ## InstanceParams
 * Interface to define the construction parameters for a Problem Instance of the
 * MDCCVRP.
 *
 * It needs an array with Client Nodes, another one for the Depots and
 * the capacity for all the vehicles of the instance.
 */
export interface InstanceParams {
  clientNodes: Array<ClientNode>;
  depotNodes: Array<DepotNode>;
  vehicleCapacity: number;
}

/**
 * ## ProblemInstance
 * The class defines a concrete instance for the Multi Depot Cumulative
 * Capacitated Problem.
 *
 * It defines the set of nodes corresponding to the clients of the problem, the
 * set of depots and the capacity of the fleet of vehicles.
 */
export class ProblemInstance {
  /**
   * Set of Client Nodes of the instance.
   */
  protected _clientNodes: Array<ClientNode>;
  /**
   * Set of Depot nodes of the instance.
   */
  protected _depotNodes: Array<DepotNode>;
  /**
   * Capacity of the fleet of vehicles.
   */
  protected _vehicleCapacity: number;

  /**
   * Constructor of the class. It initializes the set of nodes of the instance,
   * both the clients and the depots, and the capacity of the fleet.
   * @param params Parameters to construct the instance
   */
  constructor(params: InstanceParams) {
    this._clientNodes = params.clientNodes;
    this._depotNodes = params.depotNodes;
    this._vehicleCapacity = params.vehicleCapacity;
  }

  /**
   * Getter of the Client Nodes.
   * @return Client Nodes of the instance.
   */
  get clientNodes(): Array<ClientNode> {
    return this._clientNodes;
  }

  /**
   * Getter of the Depot Nodes.
   * @return Depot Nodes of the instance.
   */
  get depotNodes(): Array<DepotNode> {
    return this._depotNodes;
  }

  /**
   * Getter of the capacity of the fleet of vehicles.
   * @return Capacity of the vehicles.
   */
  get vehicleCapacity(): number {
    return this._vehicleCapacity;
  }

  /**
   * Transform the information of the instance to a string so it can be printed.
   * @return String representing the instance.
   */
  public toString(): string {
    let result = '[';
    if (this.clientNodes.length === 0) {
      result = '[]\n[';
    } else {
      for (const client of this.clientNodes) {
        result += client.toString() + ' ';
      }
      result = result.slice(0, -1) + ']\n[';
    }
    if (this.depotNodes.length === 0) {
      result += ']\n';
    } else {
      for (const depot of this.depotNodes) {
        result += depot.toString() + ' ';
      }
      result = result.slice(0, -1) + ']\n';
    }
    result += this.vehicleCapacity;
    return result;
  }
}
