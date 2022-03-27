import * as path from 'path';
// import { formatRoutes, RoutesFormat, isRoutesFormat } from "../config/format";
import { createApp } from './create';

export async function create({
  appTemplate,
  projectDir,
  installDeps,
  gitInit,
}: {
  appTemplate: string;
  projectDir: string;
  installDeps: boolean;
  gitInit?: boolean;
}) {
  await createApp({
    appTemplate,
    projectDir,
    installDeps,
    gitInit,
  });

  const relProjectDir = path.relative(process.cwd(), projectDir);
  const projectDirIsCurrentDir = relProjectDir === '';

  if (projectDirIsCurrentDir) {
    console.log(`💿 That's it! Check the README for development and deploy instructions!`);
  } else {
    console.log(
      `💿 That's it! \`cd\` into "${path.resolve(
        process.cwd(),
        projectDir,
      )}" and check the README for development and deploy instructions!`,
    );
  }
}
