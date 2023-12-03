import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIORNMENT!,
  });

  const index = pinecone.Index("chatpdf");

  try {
    const namespaceName = convertToAscii(fileKey);

    let queryResponse;

    // Projects in the gcp-starter environment do not currently support namespaces.
    if (process.env.PINCECONE_NAMESPACE_AVAILABLE=="true") {
       queryResponse = await index.namespace(fileKey).query({
        topK: 10,
        vector: embeddings,
        includeMetadata: true,
      });
    } else {
       queryResponse = await index.query({
        topK: 10,
        vector: embeddings,
        includeMetadata: true,
      });
    }

    return queryResponse.matches || [];
  } catch (error) {
    console.log("Error Querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.4
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors per page
  return docs.join("\n").substring(0, 3000);
}
