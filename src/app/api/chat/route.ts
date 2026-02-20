import { UIMessage, convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";


export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();
        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
            model: openai("gpt-4.1-nano"),
            messages: modelMessages
        })

        return result.toUIMessageStreamResponse()

    } catch (error) {
        console.log("Error streaming chat Completion", error);
        return new Response("Failed to stream chat completion", {status: 500})

    }

}