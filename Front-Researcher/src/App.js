import React from "react";
import HomePage from "./Pages/HomePage";
import NavBar from "./Components/NavBars/NavBar";

function App() {
  return (
    <div
      className="App"
      style={{ fontFamily: "Tahoma, Verdana, Segoe, sans-serif" }}
    >
      <NavBar />
      <HomePage />
    </div>
  );
}

export default App;
