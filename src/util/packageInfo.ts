import findup from 'find-up';
import path from 'path';

export function findClosestPackageJson(file: string): string | null {
  return findup.sync('package.json', { cwd: path.dirname(file) });
}

export function getPackageJsonPath(): string {
  return findClosestPackageJson(__dirname)!;
}

export function getPackageRoot(): string {
  const packageJsonPath = getPackageJsonPath();

  return path.dirname(packageJsonPath);
}
