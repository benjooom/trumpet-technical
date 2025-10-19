// In memory storage for text boxes
let textboxes: {[key: string]: string} = {};

// Handle POST requests to save textbox content
export async function POST(request: Request) {
    const { id, content } = await request.json();
    textboxes[id] = content;
    return Response.json({ success : true });
}

// Handle GET requests to retrieve all textboxes
export async function GET() {
    const returnTextboxes = Object.entries(textboxes).map(([id, content]) => ({ id, content }));
    return Response.json(returnTextboxes);
}

// Handle DELETE requests to remove a textbox
export async function DELETE(request: Request) {
    const { id } = await request.json();
    delete textboxes[id];
    return Response.json({ success : true });
}