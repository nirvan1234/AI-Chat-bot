import { Output, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { recipeSchema } from "./schema";


export async function POST(req: Request){
  try {
    const {dish} = await req.json();

    const result = streamText({
     model:openai("gpt-4.1-nano"),
     output: Output.object({schema:recipeSchema}),
     prompt:`Generate a recipe for ${dish}`
    })
 
    return result.toTextStreamResponse()
    
  } catch (error) {
    console.log("Failed to generate Response", error);
    return new Response("Failed to generate recipe", {status : 500})
  }

}