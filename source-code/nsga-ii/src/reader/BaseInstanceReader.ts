/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstance } from '../instance';

/**
 * ## Base Instance Reader
 * Interface to define an instance reader. It must have a method read that
 * receives the path to the file and return an instance of the problem.
 */
export interface BaseInstanceReader {
  read: (fileRoute: string) => ProblemInstance;
}
