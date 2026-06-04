/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { RandomSearchMock } from './RandomSearchMock';
import * as RandomSearchMocks from './data';

interface Mock {
  [key: string]: RandomSearchMock;
}

const mocks: Mock = {
  ...RandomSearchMocks
};

export default mocks;
