/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

export interface InstanceReaderMock {
  testName: string;
  file: string;
  expected: string;
  error?: boolean;
}
