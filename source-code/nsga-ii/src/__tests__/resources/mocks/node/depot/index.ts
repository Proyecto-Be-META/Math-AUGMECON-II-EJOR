/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { DepotNodeMock } from './DepotNodeMock';
import * as DepotMocks from './data';

interface Mock {
  [key: string]: DepotNodeMock;
}

const mocks: Mock = {
  ...DepotMocks
};

export default mocks;
