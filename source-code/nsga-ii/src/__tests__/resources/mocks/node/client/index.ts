/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ClientNodeMock } from './ClientNodeMock';
import * as ClientMocks from './data';

interface Mock {
  [key: string]: ClientNodeMock;
}

const mocks: Mock = {
  ...ClientMocks
};

export default mocks;
