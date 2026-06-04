/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { BaseNode } from './BaseNode';

/**
 * ## DepotNode
 * The class represents a depot in a graph of a Vehicle Routing Problem. It
 * inherits from the BaseNode class, so it has two coordinates but it doesn't
 * have a demand as the clients.
 */
export class DepotNode extends BaseNode {
  /**
   * Constructor of the class. It initializes the coordinates for the parent
   * class.
   * @param id ID of the depot
   * @param xPos X coordinate of the depot
   * @param yPos Y coordinate of the depot
   */
  constructor(id: number, xPos: number, yPos: number) {
    super(id, xPos, yPos);
  }

  /**
   * Converts the data of the depot into a string so it can be printed.
   * @return String representing the depot.
   */
  public toString(): string {
    //return '[' + this.id + ', (' + this.xPos + ', ' + this.yPos + ')]';
    return `${this.id} `;
  }
}
