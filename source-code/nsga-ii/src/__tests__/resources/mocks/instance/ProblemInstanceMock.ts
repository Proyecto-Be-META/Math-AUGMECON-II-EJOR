/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ClientNode } from '../../../../index';
import { DepotNode } from '../../../../index';

export interface ProblemInstanceMock {
  testName: string;
  creation: {
    client: Array<ClientNode>;
    depot: Array<DepotNode>;
    vehicle: number;
  };
  expected: {
    client: Array<ClientNode>;
    depot: Array<DepotNode>;
    vehicle: number;
  };
  string: string;
}
