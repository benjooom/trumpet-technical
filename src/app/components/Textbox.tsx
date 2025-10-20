"use client";

import { useEffect, useState } from "react";

export default function Textbox({id, initialValue, onDelete} : {id: number, initialValue: string, onDelete: (id: number) => void}) {
    // Store textbox state
    const [text, setText] = useState(initialValue);

    // Store textbox content to store when changed
    const saveContent = async (content: string) => {
        await fetch('/api/textboxes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, content }),
        });
    };

    useEffect(() => {
        if (text === initialValue) return;

        const timeoutId = setTimeout(() => {
            saveContent(text);
        }, 1000)

        return () => clearTimeout(timeoutId);
    }, [text]);

    // Delete textbox from store
    const deleteTextbox = async () => {
        onDelete(id);
        await fetch('/api/textboxes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
    }

    return (
        <div className="flex gap-2 w-full p-2">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter some text here..."
                className="flex-1 border border-black"
            />
            <button
                className="px-1 cursor-pointer"
                onClick={deleteTextbox}>
                X
            </button>
        </div>
    );
}
