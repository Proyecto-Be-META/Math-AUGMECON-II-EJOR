/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

/**
 * ## BaseNode
 * This abstract class represents a node in a graph from a Vehicle Routing
 * Problem. It has two coordinates and depending of the type, it can have
 * different extra properties.
 */
export abstract class BaseNode {
  /**
   * ID of the node
   */
  protected _id: number;
  /**
   * X coordinate of the node
   */
  protected _xPos: number;
  /**
   * Y coordinate of the node
   */
  protected _yPos: number;

  /**
   * Constructor of the class. It assigns the corresponding values to the
   * coordinates of the node.
   * @param xPos X coordinate
   * @param yPos Y coordinate
   */
  constructor(id: number, xPos: number, yPos: number) {
    this._id = id;
    this._xPos = xPos;
    this._yPos = yPos;
  }

  /**
   * Getter of the id of the node
   * @return ID of the node
   */
  get id(): number {
    return this._id;
  }

  /**
   * Getter of the X coordinate.
   * @return X coordinate of the node.
   */
  get xPos(): number {
    return this._xPos;
  }

  /**
   * Getter of the Y coordinate.
   * @return Y coordinate of the node.
   */
  get yPos(): number {
    return this._yPos;
  }

  public isEqual(node: BaseNode): boolean {
    return this.id === node.id;
  }

  /**
   * Abstract method to represent the node as a string so it can be printed.
   * @return String representing the node.
   */
  public abstract toString(): string;
}
