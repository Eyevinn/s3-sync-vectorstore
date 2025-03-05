import { ChangeSet } from '.';

export function createS3cmdArgs(
  cmdArgs: string[],
  s3EndpointUrl?: string
): string[] {
  const args = ['s3'];
  if (s3EndpointUrl) {
    args.push(`--endpoint-url=${s3EndpointUrl}`);
  }
  return args.concat(cmdArgs);
}

export function printChangeSet(changeSet: ChangeSet) {
  console.log('Change set:');
  for (const [key, value] of changeSet.filesToAdd) {
    console.log(`  Add: ${key}`);
  }
  for (const [key, value] of changeSet.filesToRemove) {
    console.log(`  Remove: ${key}`);
  }
  for (const [key, value] of changeSet.filesToUpdate) {
    console.log(`  Update: ${key}`);
  }
}

export function isSupportedFile(filename: string): boolean {
  return (
    filename.endsWith('.c') ||
    filename.endsWith('.cpp') ||
    filename.endsWith('.css') ||
    filename.endsWith('.csv') ||
    filename.endsWith('.go') ||
    filename.endsWith('.html') ||
    filename.endsWith('.java') ||
    filename.endsWith('.js') ||
    filename.endsWith('.ts') ||
    filename.endsWith('.json') ||
    filename.endsWith('.md') ||
    filename.endsWith('.py') ||
    filename.endsWith('.rb') ||
    filename.endsWith('.rs') ||
    filename.endsWith('.sh') ||
    filename.endsWith('.ts') ||
    filename.endsWith('.txt') ||
    filename.endsWith('.yaml') ||
    filename.endsWith('.yml') ||
    filename.endsWith('.pdf') ||
    filename.endsWith('.tar') ||
    filename.endsWith('.zip')
  );
}

export function removeBasePath(fullPath: string, basePath: string): string {
  // Ensure paths end with separator to prevent partial directory name matches
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

  if (fullPath.startsWith(normalizedBasePath)) {
    return fullPath.substring(normalizedBasePath.length);
  }

  // If the path doesn't start with basePath, return original
  return fullPath;
}
