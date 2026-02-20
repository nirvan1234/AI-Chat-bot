"use client"

import { useState } from "react"

export default function CompletionPage(){
    const [prompt, setPromt] = useState('')
    const [completion, setCompletion] = useState("")
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState<string| null>(null)

    const complete = async (e:React.FormEvent<HTMLFormElement>) =>{
     e.preventDefault();
     setIsLoading(true);
     setPromt('');
     try {
        const response = await fetch("/api/completion",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({prompt})
        })

        const data = await response.json()
        if(!response.ok){
            throw new Error(data.error || "something went wrong")
        }
        setCompletion(data.text)
        
     } catch(error) {
       setError(error instanceof Error? error.message: "Something went wrong try again")
     }
     finally{
       setIsLoading(false)
     }
    }

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {isloading ? 
            <div>Loading....</div>
            : completion ?<div className="whitespace-pre-wrap">{completion}</div>:null}
            <form
            onSubmit={complete}
             className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
                <div>
                    <input
                    className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
                     placeholder="How can I help you"
                     value={prompt}
                     onChange={(e) => setPromt(e.target.value)}
                     />
                    <button 
                    disabled={isloading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit">Send</button>
                </div>
            </form>
        </div>
    )
}