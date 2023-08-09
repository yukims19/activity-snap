import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  function changeHandler(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setImages(target.files);
  }

  async function handleSubmission() {
    const formData = new FormData();
    if (!images) {
      setMessage("No images uploaded");
      return;
    }

    for (let i = 0; i < images.length; ++i) {
      formData.append("images", images[i], images[i].name);
    }
    const res = await fetch("http://localhost:7400/process-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(JSON.stringify(data));
    //TODO: store data in localstorage
  }

  return (
    <div className="App">
      <div>
        <div>Message: {message}</div>
      </div>

      <input type="file" name="file" onChange={changeHandler} multiple />
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
}

export default App;
