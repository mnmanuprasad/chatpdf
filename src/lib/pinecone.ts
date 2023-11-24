import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import {PDFLoader} from "langchain/document_loaders/fs/pdf"

let pinecone: Pinecone | undefined = undefined;

type PDFPage = {
    pageContent: string;
    metaData: {
        loc: {pageNumber: number}
    }
}

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

    if(!filename){
        throw new Error("Could not download from s3")
    }

    const loader = new PDFLoader(filename);
    const pages = (await loader.load()) as unknown as PDFPage[]

    return pages; 
}


