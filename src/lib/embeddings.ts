import {Configuration, OpenAIApi } from "openai-edge";
import { HfInference } from "@huggingface/inference";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export const getEmbeddings = async(text: string)=>{
    const resposne =  await hf.featureExtraction({
        inputs: text,
        model: "BAAI/bge-large-en-v1.5"
    })

    return resposne as number []
    
}

// export const getEmbeddings = async(text: string)=>{
//     try {
     
//         const response  = await openai.createEmbedding({
//             model: "text-embedding-ada-002",
//             input: text
//         })

//         const result = await response.json()
       
//         return result.data[0].embedding as number []
//     } catch (error) {
//         console.log("error while calling open ai api: ", error)

//         throw error;
//     }
// }