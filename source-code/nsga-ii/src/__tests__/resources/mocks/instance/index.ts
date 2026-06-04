/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ProblemInstanceMock } from './ProblemInstanceMock';
import * as InstanceMocks from './data';

interface Mock {
  [key: string]: ProblemInstanceMock;
}

const mocks: Mock = {
  ...InstanceMocks
};

export default mocks;
