import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request){
    try {
        const {prompt} = await req.json();
        const result = streamText({
          model: openai("gpt-4.1-nano"),
          prompt
        }) 
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.log("Error Generating Text", error);
        return Response.json({error: "Failed to generate Text"},{status: 500})
    }
}