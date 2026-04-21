"use client"

import { useChat } from "@ai-sdk/react";
import { useState, useRef } from "react";
import { DefaultChatTransport } from "ai";


export function normalizeData(data: any) {
    return {
      ...data,
      composition: Array.isArray(data.composition)
        ? data.composition
        : data.composition
        ? [data.composition]
        : [],
      uses: Array.isArray(data.uses)
        ? data.uses
        : data.uses
        ? [data.uses]
        : [],
    };
  }

export function tryParseJSON(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}
export function MedicineCard({ data }: { data: any }) {
    if (!data) return null;

const compositionArray = Array.isArray(data.composition)
  ? data.composition
  : data.composition
  ? [data.composition] // convert object → array
  : [];

    return (
        <div className="p-4 border rounded-xl shadow-md bg-white">
            <h2 className="text-xl font-bold">{data.medicine_name}</h2>

            <p className="text-sm text-gray-500">
                Confidence: {data.confidence}%
            </p>

            <div className="mt-2">
                <strong>💊 Composition:</strong>
                <ul>
                    {data.composition?.map((c: any, i: number) => (
                        <li key={i}>
                            {c.ingredient} - {c.mg}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-2">
                <strong>🩺 Uses:</strong>
                <ul>
                    {data.uses?.map((u: string, i: number) => (
                        <li key={i}>{u}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-2">
                <strong>⚠ Safety:</strong> {data.safety?.level}
            </div>

            <div className="mt-2 text-red-500">
                <strong>Warnings:</strong>
                <p>BP: {data.warnings?.bp}</p>
                <p>Pregnancy: {data.warnings?.pregnancy}</p>
            </div>

            <div className="mt-2">
                <strong>📅 Expiry:</strong> {data.expiry_date}
            </div>

            <div className="mt-2 text-xs text-gray-400">
                {data.disclaimer}
            </div>
        </div>
    );
}

export default function MultiModalChatPage() {
    const [input, setInput] = useState("")
    const [files, setFiles] = useState<FileList | undefined>(undefined)

   

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { messages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/multi-modal-chat'
        })
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: input, files: files })
        setInput("");
        setFiles(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    return (
        <div className="flex flex-col w-full max-w-md pt-12 pb-36 mx-auto stretch">
            {error && <div className="text-red-500 mb-4">{error.message}</div>}
            {messages.map((message) => (
                <div className="mb-4" key={message.id}>
                    <div className="font-semibold">
                        {message.role === "user" ? "You" : "AI"}
                    </div>

                    {message.parts.map((part, index) => {
                        if (part.type === "text") {
                            const parsed = tryParseJSON(part.text);

                            // ✅ If JSON → render card
                            if (parsed) {
                                const safeData = normalizeData(parsed);
                                return <MedicineCard key={index} data={safeData} />;
                              }

                            // ✅ Else → normal text
                            return (
                                <div key={index} className="whitespace-pre-wrap">
                                    {part.text}
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            ))}
            {(status === "submitted" || status === "streaming") && (
                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    </div>
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <label htmlFor="file-upload">
                            {files?.length ?
                                `${files.length} file(s) attached` : `files attached`}

                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={(event) => {
                                if (event.target.files) {
                                    setFiles(event.target.files)
                                }
                            }}
                            multiple
                            ref={fileInputRef}
                        />

                    </div>
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
                        />
                    </div>
                    {status === "submitted" || status === "streaming" ? (
                        <button
                            onClick={stop}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Stop
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={status !== "ready"}
                        >
                            Send
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}