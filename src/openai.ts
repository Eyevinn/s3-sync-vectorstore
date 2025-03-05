import OpenAI from 'openai';

export async function fetchAllVectorStoreFiles(
  openAi: OpenAI,
  vectorStoreId: string
): Promise<Map<string, OpenAI.Beta.VectorStores.Files.VectorStoreFile>> {
  const allFiles: OpenAI.Beta.VectorStores.Files.VectorStoreFile[] = [];
  let hasMore = true;
  let after: string | undefined = undefined;
  let pageCount = 0;

  console.log(`Fetching all files for vector store ${vectorStoreId}`);

  while (hasMore) {
    pageCount++;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await openAi.beta.vectorStores.files.list(
        vectorStoreId,
        {
          after
        }
      );

      // Check if there are more files to fetch
      hasMore = response.body.has_more;

      console.log(
        `Received ${response.data.length} files in page ${pageCount} (${hasMore})`
      );
      allFiles.push(...response.data);

      // Update the 'after' parameter for the next request if there are more files
      if (hasMore && response.data.length > 0) {
        after = response.data[response.data.length - 1].id;
        console.log(`More files exist, next page will start after ${after}`);
      }
    } catch (error) {
      console.log(
        `Error fetching vector store files page ${pageCount}:`,
        error
      );
      throw error;
    }
  }

  console.log(`Fetched ${allFiles.length} total vector store files`);
  const vectorStoreFileMap = new Map<
    string,
    OpenAI.Beta.VectorStores.Files.VectorStoreFile
  >();
  for (const vectorStoreFile of allFiles) {
    vectorStoreFileMap.set(vectorStoreFile.id, vectorStoreFile);
  }
  return vectorStoreFileMap;
}

export async function fetchAllFiles(
  openAi: OpenAI,
  vectorStoreFileMap: Map<
    string,
    OpenAI.Beta.VectorStores.Files.VectorStoreFile
  >
) {
  const files = await openAi.files.list();
  const filesMap = new Map<string, OpenAI.Files.FileObject>();
  for (const file of files.data) {
    if (vectorStoreFileMap.get(file.id)) {
      filesMap.set(file.filename, file);
    }
  }
  return filesMap;
}
