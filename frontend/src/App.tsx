import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  async function getData() {
    const res = await fetch("http://localhost:7400/flask/hello");
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>To get message: </p>
        <button onClick={getData}>Click me</button>
        <div>Message: {message}</div>
      </header>
    </div>
  );
}

export default App;
