import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request){
    try {
        const {prompt} = await req.json();
        const {text} = await generateText({
            model:openai("gpt-4.1-nano"),
            prompt
        })
    
        return Response.json({text});
        
    } catch (error) {
        console.log("Error Generating Text", error)
        return Response.json({error: "Failed to Generate Text"},{status:500})
    }
}