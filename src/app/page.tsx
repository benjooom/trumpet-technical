"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Textbox from "./components/Textbox";

export default function Home() {
  //State to hold text boxes and initial content
  const [textboxes, setTextboxes] = useState<{id: number, content: string}[]>([]);

  // Function to handle adding a new text box
  const handleAddTextbox = () => {

    // Add a new textbox with date as identifier
    setTextboxes([...textboxes, {id: Date.now(), content: ""}]);

    // Save empty textbox to store
    fetch('/api/textboxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: Date.now(), content: "" }),
    });
  };

  // Handle pg refresh, retrieve textboxes in store
  const fetchTextboxes = async () => {
    const response = await fetch('/api/textboxes');
    const data = await response.json();
    setTextboxes(data);
  };

  useEffect(() => {
    fetchTextboxes();
  }, []);


  return (
    <div>
      <Header onAdd={handleAddTextbox}/>
      <div className="p-4">
        {textboxes.map((id) => (
          <Textbox key={id.id} id={id.id} initialValue={id.content} />
        ))}
      </div>
    </div>
  );
}
