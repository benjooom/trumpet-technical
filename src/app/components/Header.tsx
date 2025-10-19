import NewTextButton from "./NewTextButton";

export default function Header({onAdd}: {onAdd: () => void}) {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <NewTextButton onAdd={onAdd}/>
        </header>
    );
}