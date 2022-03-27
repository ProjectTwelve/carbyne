#! /usr/bin/env node
// eslint-disable-next-line node/shebang
import { run } from './run';

run().then(
  () => {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  },
  (error: Error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  },
);
