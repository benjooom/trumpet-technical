// In memory storage for text boxes
export let textboxes: {[key: string]: string} = {};

// Handle POST requests to save textbox content
export async function POST(request: Request) {
    try {
        const { id, content } = await request.json();
        textboxes[id] = content;
        return Response.json({ success : true });
    } catch (error) {
        return Response.json({ success: false, error: "Failed to save textbox." }, { status: 500 });
    }
}

// Handle GET requests to retrieve all textboxes
export async function GET() {
    try {
        const returnTextboxes = Object.entries(textboxes).map(([id, content]) => ({ id: Number(id), content }));
        return Response.json(returnTextboxes);
    } catch (error) {
        return Response.json({ success: false, error: "Failed to fetch textboxes." }, { status: 500 });
    }

}

// Handle DELETE requests to remove a textbox
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        // Check if textbox exists
        if (!(id in textboxes)) {
            return Response.json({ success: false, error: "Textbox not found." }, { status: 404 });
        }

        delete textboxes[id];
        return Response.json({ success : true });
    } catch (error) {
        return Response.json({ success: false, error: "Failed to delete textbox." }, { status: 500 });
    }
}