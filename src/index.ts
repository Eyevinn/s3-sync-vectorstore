import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync
} from 'fs';
import { join } from 'path';
import {
  createS3cmdArgs,
  isSupportedFile,
  printChangeSet,
  removeBasePath
} from './util';
import { spawnSync } from 'child_process';
import OpenAI from 'openai';
import { fetchAllFiles, fetchAllVectorStoreFiles } from './openai';
import { chdir } from 'process';
import { FilePurpose } from 'openai/resources';

const DEFAULT_STAGING_DIR = '/tmp/data';
const AWS_EXEC = process.env.AWS_EXEC || 'aws';

export interface BucketConfig {
  s3url: URL[];
  s3region?: string;
  s3endpoint?: string;
  s3accessKey?: string;
  s3secretKey?: string;
}

export interface SyncOptions {
  source: BucketConfig;
  vectorStoreId: string;
  openaiApiKey: string;
  stagingDir?: string;
  dryRun?: boolean;
  purpose?: FilePurpose;
}

interface ChangeSetFile {
  vectorStoreId: string;
  filename: string;
  fileId?: string;
}

export interface ChangeSet {
  filesToAdd: Map<string, ChangeSetFile>;
  filesToRemove: Map<string, ChangeSetFile>;
  filesToUpdate: Map<string, ChangeSetFile>;
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

async function syncToLocal(source: BucketConfig, stagingDir: string) {
  for (const url of source.s3url) {
    console.log(`Syncing from ${url} to ${stagingDir}`);
    const args = createS3cmdArgs(
      ['sync', url.toString(), stagingDir],
      source.s3endpoint
    );
    const { status, stderr } = spawnSync(AWS_EXEC, args, {
      env: {
        AWS_ACCESS_KEY_ID: source.s3accessKey,
        AWS_SECRET_ACCESS_KEY: source.s3secretKey,
        AWS_REGION: source.s3region
      },
      shell: true
    });
    if (status !== 0) {
      if (stderr) {
        console.log(stderr.toString());
      }
      throw new Error('Sync to staging dir failed');
    }
    console.log(`Synced ${url.toString()} to ${stagingDir}`);
  }
}

async function createChangeSet(
  stagingDir: string,
  vectorStoreId: string,
  openaiApiKey: string
): Promise<ChangeSet> {
  console.log(`Creating change set for ${stagingDir} and ${vectorStoreId}`);
  const openAi = new OpenAI({ apiKey: openaiApiKey });
  const filesToAdd = new Map<string, ChangeSetFile>();
  const filesToRemove = new Map<string, ChangeSetFile>();
  const filesToUpdate = new Map<string, ChangeSetFile>();

  const vectorStoreFileMap = await fetchAllVectorStoreFiles(
    openAi,
    vectorStoreId
  );
  const filesMap = await fetchAllFiles(openAi, vectorStoreFileMap);
  const localFiles = readdirSync(stagingDir, {
    recursive: true,
    encoding: 'utf8'
  });
  const filteredLocalFiles = localFiles.filter(
    (file) =>
      !statSync(join(stagingDir, file)).isDirectory() && isSupportedFile(file)
  );
  const renamedFiles = filteredLocalFiles.map((file) => {
    console.log(`Renaming file to make it unique filename`);
    const newFilename = removeBasePath(file, stagingDir).replace(/\//g, '-');
    console.log(`${file} => ${newFilename}`);
    renameSync(join(stagingDir, file), join(stagingDir, newFilename));
    return newFilename;
  });
  for (const localFile of renamedFiles) {
    console.log(`Local file: ${localFile}`);
    const fileInVectorStore = filesMap.get(localFile);
    if (!fileInVectorStore) {
      console.log(`File ${localFile} not in vector store`);
      filesToAdd.set(localFile, { vectorStoreId, filename: localFile });
    } else {
      console.log(`File ${localFile} in vector store`);
      filesToUpdate.set(localFile, {
        vectorStoreId,
        filename: localFile,
        fileId: fileInVectorStore.id
      });
    }
  }
  for (const vectorStoreFile of filesMap.values()) {
    const fileInLocal = localFiles.find(
      (file) => file === vectorStoreFile.filename
    );
    if (!fileInLocal) {
      console.log(`File ${vectorStoreFile.filename} not in local`);
      filesToRemove.set(vectorStoreFile.filename, {
        vectorStoreId,
        filename: vectorStoreFile.filename,
        fileId: vectorStoreFile.id
      });
    }
  }
  return {
    filesToAdd,
    filesToRemove,
    filesToUpdate
  };
}

async function applyChangeSet(
  changeSet: ChangeSet,
  stagingDir: string,
  openaiApiKey: string,
  dryRun: boolean,
  purpose: FilePurpose
) {
  console.log(`Applying change set for ${stagingDir}`);
  chdir(stagingDir);

  const openAi = new OpenAI({ apiKey: openaiApiKey });
  for (const changeSetFile of changeSet.filesToAdd.values()) {
    try {
      console.log(
        `Adding file ${changeSetFile.filename} to ${changeSetFile.vectorStoreId}`
      );
      if (!dryRun) {
        const newFile = await openAi.files.create({
          file: createReadStream(changeSetFile.filename),
          purpose
        });
        console.log(`Added file ${newFile.filename} (${newFile.id})`);
        await openAi.beta.vectorStores.files.create(
          changeSetFile.vectorStoreId,
          {
            file_id: newFile.id
          }
        );
        console.log(
          `Added file ${newFile.filename} to vector store ${changeSetFile.vectorStoreId}`
        );
      }
    } catch (error) {
      console.log(`Error adding file ${changeSetFile.filename}: ${error}`);
    }
  }
  for (const changeSetFile of changeSet.filesToUpdate.values()) {
    try {
      console.log(
        `Updating file ${changeSetFile.filename} in ${changeSetFile.vectorStoreId}`
      );
      if (!dryRun && changeSetFile.fileId) {
        await openAi.beta.vectorStores.files.del(
          changeSetFile.vectorStoreId,
          changeSetFile.fileId
        );
        await openAi.files.del(changeSetFile.fileId);
        console.log(
          `Deleted file ${changeSetFile.filename} (${changeSetFile.fileId})`
        );
        const newFile = await openAi.files.create({
          file: createReadStream(changeSetFile.filename),
          purpose
        });
        await openAi.beta.vectorStores.files.create(
          changeSetFile.vectorStoreId,
          {
            file_id: newFile.id
          }
        );
        console.log(
          `Replaced file ${changeSetFile.filename} (${changeSetFile.fileId} => ${newFile.id})`
        );
      }
    } catch (error) {
      console.log(`Error updating file ${changeSetFile.filename}: ${error}`);
    }
  }
  for (const changeSetFile of changeSet.filesToRemove.values()) {
    console.log(
      `Removing file ${changeSetFile.filename} in ${changeSetFile.vectorStoreId}`
    );
    if (!dryRun && changeSetFile.fileId) {
      try {
        await openAi.beta.vectorStores.files.del(
          changeSetFile.vectorStoreId,
          changeSetFile.fileId
        );
        await openAi.files.del(changeSetFile.fileId);
      } catch (err) {
        console.log(`Error removing file ${changeSetFile.filename}: ${err}`);
      }
    }
  }
}

export async function doSync(opts: SyncOptions) {
  const stagingDir = await prepare(opts.stagingDir);
  try {
    await syncToLocal(opts.source, stagingDir);
    const changeSet = await createChangeSet(
      stagingDir,
      opts.vectorStoreId,
      opts.openaiApiKey
    );
    printChangeSet(changeSet);
    await applyChangeSet(
      changeSet,
      stagingDir,
      opts.openaiApiKey,
      opts.dryRun !== undefined ? opts.dryRun : false,
      opts.purpose || 'assistants'
    );
    await cleanup(stagingDir);
  } catch (err) {
    await cleanup(stagingDir);
    throw err;
  }
}
