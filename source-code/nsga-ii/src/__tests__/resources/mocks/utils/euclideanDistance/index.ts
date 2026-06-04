/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { EuclideanDistanceMock } from './EuclideanDistanceMock';
import * as EuclideanDistanceMocks from './data';

interface Mock {
  [key: string]: EuclideanDistanceMock;
}

const mocks: Mock = {
  ...EuclideanDistanceMocks
};

export default mocks;
