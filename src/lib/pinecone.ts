import { Pinecone, PineconeRecord} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter"
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

let pinecone: Pinecone | null = null;

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber: number}
    }
}

export const getPineconeClient = async()=>{
    if (!pinecone){
         pinecone = new Pinecone({
            apiKey:  process.env.PINECONE_API_KEY! ,
            environment: process.env.PINECONE_ENVIORNMENT!
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

    // 3. vectorise and embed individual documents

    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // const vectors: PineconeRecord[] = [];

    // for(let i=0;i<documents.length;i++){
    //     for(let j=0; j<documents[i].length; j++){
    //         vectors.push(await embedDocument(documents[i][j]))
    //     }
    // }
    
    console.log("Created embeddings for all the documents");

    // 4. upload to pinecone

    const client = await getPineconeClient()

    const pineconeIndex = client.Index("chatpdf")

    console.log("Inserting vectors into pineconde");

    const namespaceName = convertToAscii(fileKey)

    // Projects in the gcp-starter environment do not currently support namespaces.
    if (process.env.PINCECONE_NAMESPACE_AVAILABLE){
          pineconeIndex.namespace(namespaceName)
    }
  
    pineconeIndex.upsert(vectors)

    return pages; 
}

export const truncateStringByByte = (str: string, bytes: number)=>{
    const enc = new TextEncoder()
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes))
}

const prepareDocument = async(page: PDFPage) =>{
    let {pageContent, metadata} = page;

    pageContent=pageContent.replace(/\n/g,"");

    // split the docs

    const splitter = new RecursiveCharacterTextSplitter()

    //  splitter will split the document (page) into small document 
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata:{
                pageNumber: metadata.loc.pageNumber,
                text:  truncateStringByByte(pageContent, 36000)
            }
        })
    ]
    )
    return docs
}

const embedDocument= async (doc: Document)=>{
    try {

        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent)

        return{
            id: hash,
            values: embeddings,
            metadata:{
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as unknown as PineconeRecord

    } catch (error) {
        console.log("Error while embedding document", error);
        throw error;
    }
}