import {Configuration, OpenAIApi} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge"

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export async function POST(req: Request, res: Response){
    try {
        const {messages} = await req.json()

        const respone =  await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            stream: true
        })

        const stream = OpenAIStream(respone);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log(error)
    }
}