"use client";

export default function NewTextButton({onAdd}: {onAdd: () => void}) {
    return (
        <button onClick={onAdd} className="px-1 py-1 border cursor-pointer">
            + Text Box
        </button>
    );
}