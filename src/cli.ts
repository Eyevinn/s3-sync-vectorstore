#! /usr/bin/env node

import { Command } from 'commander';

const cli = new Command();
cli
  .description('Sync the files on an S3 bucket with an OpenAI vector store')
  .argument('<source>', 'Source S3 URL')
  .argument('<vector-store-id>', 'OpenAI vector store ID')
  .option('--region <region>', 'AWS region (AWS_REGION)')
  .option('--endpoint <endpoint>', 'S3 endpoint (S3_ENDPOINT)')
  .option(
    '--access-key-id <access-key-id>',
    'AWS access key ID (AWS_ACCESS_KEY_ID)'
  )
  .option(
    '--secret-access-key <secret-access-key>, AWS secret access key (AWS_SECRET_ACCESS_KEY)'
  )
  .option(
    '--staging-dir <staging-dir>',
    'Staging directory (STAGING_DIR)',
    '/tmp/data'
  )
  .action(async (source, vectorStoreId, options) => {
    try {
      await doSync({
        s3url: new URL(source),
        vectorStoreId,
        region: process.env.AWS_REGION || options.region,
        endpoint: process.env.S3_ENDPOINT || options.endpoint,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || options.accessKeyId,
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY || options.secretAccessKey,
        stagingDir: process.env.STAGING_DIR || options.stagingDir
      });
    } catch (err) {
      console.log((err as Error).message);
    }
  });

cli.parseAsync(process.argv);
