import React from "react";
import HomePage from "./Pages/HomePage";
import NavBar from "./Components/NavBar";
import ExperimentPage from "./Pages/ExperimentPage";

function App() {
  return (
    <div className="App">
      <NavBar />
      <HomePage />
      {/* <ExperimentPage /> */}
    </div>
  );
}

export default App;
