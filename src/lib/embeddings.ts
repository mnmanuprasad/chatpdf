
import {Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

export const getEmbeddings = async(text: string)=>{
    try {
        const response  = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: text
        })

        const result = await response.json()
        console.log(result)
        return result.data[0].embedding as number
    } catch (error) {
        console.log("error while calling open ai api: ", error)

        throw error;
    }
}