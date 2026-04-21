import { UIMessage, convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";


export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();
        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
            model: openai("gpt-4.1-nano"),
            messages: [
                {
                    role:"system",
                    content:"You are a helpful coding assistant. keep response under 3 sentences and focus on practical examples."
                },
                ...modelMessages,
            ]
        })

        result.usage.then((usage) => {
            console.log({
                messageCount:messages.length,
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                totalTokens: usage.totalTokens
            })
        })

        return result.toUIMessageStreamResponse()


    } catch (error) {
        console.log("Error streaming chat Completion", error);
        return new Response("Failed to stream chat completion", {status: 500})

    }

}