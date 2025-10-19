"use client";

import { useEffect, useState } from "react";

export default function Textbox({id, initialValue} : {id: number, initialValue: string}) {
    // Store textbox state
    const [text, setText] = useState(initialValue);

    // Store textbox content to backend when changed
    const saveContent = async (id: number, content: string) => {
        await fetch('/api/textboxes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, content }),
        });
    };

    return (
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => saveContent(id, text)}
            placeholder="Enter some text here..."
            className="w-full border"
        />
    );
}
