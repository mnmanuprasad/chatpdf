import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

let pinecone: Pinecone | undefined = undefined;

export const getPineconeClient = async()=>{
    if (!pinecone){
         pinecone = new Pinecone({
            apiKey: process.env.PINECONE_ENVIORNMENT!,
            environment: process.env.PINECONE_API_KEY!
        }); 
    }

    return pinecone;
}

export const  loadS3IntoPinecone =  async(fileKey: string)=>{
    // 1. Obtain the pdf -> download and read from pdf

    console.log("Downloading s3 into file system");
    const filename = await downloadFromS3(fileKey);
}
