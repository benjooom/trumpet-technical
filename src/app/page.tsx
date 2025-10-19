"use client";

import { useState } from "react";
import Header from "./components/Header";
import Textbox from "./components/Textbox";

export default function Home() {
  //State to hold text boxes
  const [textboxes, setTextboxes] = useState<number[]>([]);

  // Function to handle adding a new text box
  const handleAddTextbox = () => {
    console.log("Adding new textbox");
    // Add a new textbox with date as identifier
    setTextboxes([...textboxes, Date.now()]);
  };

  return (
    <div>
      <Header onAdd={handleAddTextbox}/>
      <div className="p-4">
        {textboxes.map((id) => (
          <Textbox key={id} />
        ))}
      </div>
    </div>
  );
}
