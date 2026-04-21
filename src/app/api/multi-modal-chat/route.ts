import { UIMessage, convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const SYSTEM_PROMPT = `
You are a medical assistant AI that analyzes medicine strip images and extracts structured, safe, and useful information.

STRICT RULES:
- DO NOT give prescriptions
- DO NOT diagnose diseases
- ALWAYS include a disclaimer
- If unsure, return low confidence

YOUR TASK:
From the provided image or text, extract and return ONLY valid JSON in the given schema.

WHAT TO IDENTIFY:
1. Medicine name
2. Composition (active ingredients + mg)
3. Uses (what condition it treats)
4. Safety level:
   - safe_otc
   - caution
   - doctor_required
5. Warnings:
   - BP impact
   - pregnancy warning
   - overdose risk
6. Typical dosage range (general info only, not prescription)
7. Expiry date (if visible)
8. Alternatives (same composition medicines)
9. Confidence score (0–100)

IMPORTANT:
- If image is unclear → set confidence low
- If any field missing → return null
- Keep answers short and structured
- Output ONLY JSON (no text outside JSON)

DISCLAIMER MUST ALWAYS BE INCLUDED.
`;

export async function POST(req: Request) {
    try {
      const { messages } = await req.json();
  
      // ✅ Convert UI → Model format
      const modelMessages = await convertToModelMessages(messages);
  
      const result = streamText({
        model: openai("gpt-4.1-nano"),
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...modelMessages, // ✅ USE THIS
        ],
        temperature: 0.2,
      });
  
      return result.toUIMessageStreamResponse();
    } catch (error) {
      console.log(error);
      return new Response("Error", { status: 500 });
    }
  }

// export async function POST(req: Request) {
//     try {
//       const { messages } = await req.json();
  
//       const result = streamText({
//         model: openai("gpt-4.1-nano"),
//         messages: [
//           {
//             role: "system",
//             content: SYSTEM_PROMPT,
//           },
//           ...messages,
//         ],
//         temperature: 0.2, // more factual
//       });
  
//       return result.toUIMessageStreamResponse();
//     } catch (error) {
//       console.log(error);
//       return new Response("Error", { status: 500 });
//     }
//   }


// export async function POST(req: Request) {
//     try {
//         const { messages }: { messages: UIMessage[] } = await req.json();
//         const modelMessages = await convertToModelMessages(messages);
//         const result = streamText({
//             model: openai("gpt-4.1-nano"),
//             messages: modelMessages
//         })

//         return result.toUIMessageStreamResponse()


//     } catch (error) {
//         console.log("Error streaming chat Completion", error);
//         return new Response("Failed to stream chat completion", {status: 500})

//     }

// }