import { run } from '../src/cli';

run(['create', ...process.argv.slice(2)]).then(
  () => {
    process.exit(0);
  },
  (error: Error) => {
    console.error(error);
    process.exit(1);
  },
);

export default {};
