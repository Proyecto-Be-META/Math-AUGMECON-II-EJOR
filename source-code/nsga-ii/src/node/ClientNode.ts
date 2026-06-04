/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseNode } from './BaseNode';

/**
 * ## ClientNode
 * The class represents a client in a graph of a Vehicle Routing Problem. It
 * inherits from the BaseNode class, so it has two coordinates and also has
 * the demand of the client.
 */
export class ClientNode extends BaseNode {
  /**
   * Demand of the client.
   */
  protected _demand: number;

  /**
   * Constructor of the class. It initializes the coordinates for the parent
   * class, and the client demand.
   * @param id ID of the client
   * @param xPos X coordinate of the client
   * @param yPos Y coordinate of the client
   * @param demand Demand of the client
   */
  constructor(id: number, xPos: number, yPos: number, demand: number) {
    super(id, xPos, yPos);
    this._demand = demand;
  }

  /**
   * Getter of the demand of the client.
   * @return Demand of the client.
   */
  get demand(): number {
    return this._demand;
  }

  /**
   * Converts the data of the client into a string so it can be printed.
   * @return String representing the client.
   */
  public toString(): string {
    //return '[' + this.id + ', (' + this.xPos + ', ' + this.yPos + '), ' + this.demand + ']';
    return `${this.id} `;
  }
}
