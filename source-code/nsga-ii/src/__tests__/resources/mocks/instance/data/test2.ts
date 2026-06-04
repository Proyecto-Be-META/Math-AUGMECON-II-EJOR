/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstanceMock } from '../ProblemInstanceMock';
import { DepotNode } from '../../../../../index';
import { ClientNode } from '../../../../../index';

const depot1: DepotNode = new DepotNode(20.5, 5.0);
const depot2: DepotNode = new DepotNode(-6.5, 0.0);

const client1: ClientNode = new ClientNode(10.5, 5.0, 6);
const client2: ClientNode = new ClientNode(-2.5, 0.0, 8);

export const test2: ProblemInstanceMock = {
  testName: 'Creation and access test',
  creation: {
    client: [client1, client2],
    depot: [depot1, depot2],
    vehicle: 3
  },
  expected: {
    client: [client1, client2],
    depot: [depot1, depot2],
    vehicle: 3
  },
  string: '[((10.5, 5), 6) ((-2.5, 0), 8)]\n[(20.5, 5) (-6.5, 0)]\n3'
};
