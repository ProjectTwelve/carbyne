import * as path from 'path';
import meow from 'meow';
import inquirer from 'inquirer';

import * as colors from './colors';
import * as commands from './commands';

const helpText = `
${colors.logoBlue('C')} ${colors.logoGreen('A')} ${colors.logoYellow('R')} ${colors.logoPink('B')} ${colors.logoRed(
  'Y',
)} ${colors.logoCyan('N')} ${colors.logoWhite('E')}

${colors.heading('Usage')}:
  $ carbyne create

${colors.heading('Options')}:
  --help, -h          Print this help message and exit
  --version, -v       Print the CLI version and exit
  --no-color          Disable ANSI colors in console output

${colors.heading('Values')}:
  - ${colors.arg('projectDir')}        The project directory
`;

/**
 * Programmatic interface for running the carbyne CLI with the given command line
 * arguments.
 */
export async function run(argv: string[] = process.argv.slice(2)) {
  const { flags, input, showHelp, showVersion } = meow(helpText, {
    argv: argv,
    description: false,
    booleanDefault: undefined,
    flags: {
      debug: { type: 'boolean' },
      help: { type: 'boolean', alias: 'h' },
      install: { type: 'boolean' },
      json: { type: 'boolean' },
      hardhatVersion: { type: 'string' },
      sourcemap: { type: 'boolean' },
      template: { type: 'string' },
      typescript: { type: 'boolean' },
      git: { type: 'boolean' },
      version: { type: 'boolean', alias: 'v' },
    },
  });

  if (flags.help) showHelp();
  if (flags.version) showVersion();

  // Note: Keep each case in this switch statement small.
  switch (input[0]) {
    case 'create':
    // `carbyne new` is an alias for `carbyne create`
    /* falls through */
    case 'new': {
      const projectPath =
        input.length > 1
          ? input[1]
          : (
              await inquirer
                .prompt<{ dir: string }>([
                  {
                    type: 'input',
                    name: 'dir',
                    message: 'Where would you like to create your project?',
                    default: './my-solidity-project',
                  },
                ])
                .catch((error) => {
                  if (error.isTtyError) {
                    showHelp();
                    return;
                  }
                  throw error;
                })
            )?.dir;

      if (!projectPath) {
        showHelp();
        return;
      }

      const projectDir = path.resolve(process.cwd(), projectPath);

      const answers = await inquirer
        .prompt<{
          appTemplate: string;
          git: boolean;
          install: boolean;
        }>([
          {
            name: 'appTemplate',
            type: 'list',
            message: `Which kind of template do you want to use?`,
            loop: false,
            choices: [{ name: 'General', value: 'general' }],
          },
          {
            name: 'git',
            type: 'confirm',
            message: 'Do you want to run `git init`?',
            default: true,
          },
          {
            name: 'install',
            type: 'confirm',
            message: 'Do you want me to run `npm install`?',
            when() {
              return flags.install === undefined;
            },
            default: true,
          },
        ])
        .catch((error) => {
          if (error.isTtyError) {
            console.warn(
              colors.warning(
                "🚨 Your terminal doesn't support interactivity; using default configuration.\n\n" +
                  "If you'd like to use different settings, try passing them as arguments. Run " +
                  '`npx @p12/carbyne@latest --help` to see available options.',
              ),
            );
            return {
              appTemplate: 'General',
              git: true,
              install: true,
            };
          }
          throw error;
        });

      await commands.create({
        appTemplate: flags.template ?? answers.appTemplate,
        projectDir,
        installDeps: flags.install ?? answers.install,
        gitInit: flags.git ?? answers.git,
      });
      break;
    }

    default:
  }
}
