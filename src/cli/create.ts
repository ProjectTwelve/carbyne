import path from 'path';
import fsExtra from 'fs-extra';
import semver from 'semver';
import { execSync } from 'child_process';
import { getPackageRoot } from '../util/packageInfo';

interface CreateAppArgs {
  appTemplate: string;
  projectDir: string;
  installDeps: boolean;
  gitInit?: boolean;
}

export async function createApp({ appTemplate, projectDir, installDeps, gitInit }: CreateAppArgs) {
  // Check the node version
  const versions = process.versions;
  if (versions?.node && semver.major(versions.node) < 14) {
    throw new Error(`️🚨 Oops, Node v${versions.node} detected. A Node version greater than 14 is required.`);
  }

  // Create the app directory
  const relativeProjectDir = path.relative(process.cwd(), projectDir);
  const projectDirIsCurrentDir = relativeProjectDir === '';
  if (!projectDirIsCurrentDir) {
    if (fsExtra.existsSync(projectDir)) {
      throw new Error(`️🚨 Oops, "${relativeProjectDir}" already exists. Please try again with a different directory.`);
    }
  }

  const packageRoot = getPackageRoot();
  const srcPath = path.join(packageRoot, 'templates');
  await fsExtra.copy(path.join(srcPath, appTemplate), projectDir);

  // convert file
  fsExtra.moveSync(path.join(projectDir, '_.gitignore'), path.join(projectDir, '.gitignore'), {
    overwrite: true,
  });

  if (gitInit) {
    execSync('git init', { stdio: 'inherit', cwd: projectDir });
  }

  if (installDeps) {
    // TODO: use yarn/pnpm/npm
    execSync('npm install --include=dev', {
      stdio: 'inherit',
      cwd: projectDir,
    });
  }
}
