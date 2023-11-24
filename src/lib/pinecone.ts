import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter"

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
    
    // 2. split and segment the pdf

    const documents = await Promise.all(
        pages.map(prepareDocument)
    )
    return pages; 
}

export const truncateStringByByte = (str: string, bytes: number)=>{
    const enc = new TextEncoder()
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes))
}

const prepareDocument = async(page: PDFPage) =>{
    let {pageContent, metaData} = page;

    pageContent=pageContent.replace(/\n/g,"");

    // split the docs

    const splitter = new RecursiveCharacterTextSplitter()

    //  splitter will split the document (page) into small document 
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata:{
                pageNumber: metaData.loc.pageNumber,
                text:  truncateStringByByte(pageContent, 36000)
            }
        })
    ]
    )

    return docs
}