import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const DEFAULT_STAGING_DIR = '/tmp/data';

export interface SyncOptions {
  s3url: URL;
  vectorStoreId: string;
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  stagingDir?: string;
}

async function prepare(stagingDir = DEFAULT_STAGING_DIR) {
  const jobId = Math.random().toString(36).substring(7);
  const jobDir = join(stagingDir, jobId);
  if (!existsSync(jobDir)) {
    mkdirSync(jobDir, { recursive: true });
  }
  return jobDir;
}

async function cleanup(stagingDir: string) {
  console.log(`Cleaning up ${stagingDir}`);
  rmSync(stagingDir, { recursive: true, force: true });
}

export async function doSync(opts: SyncOptions) {
  const stagingDir = await prepare(opts.stagingDir);
  try {
    await cleanup(stagingDir);
  } catch (err) {
    await cleanup(stagingDir);
    throw err;
  }
}
