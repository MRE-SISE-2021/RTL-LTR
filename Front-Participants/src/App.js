import React from "react";
import HomePage from "./Pages/HomePage";
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <HomePage hosted_link={this.props.match.params.hosted_link} />
      </div>
    );
  }
}

export default App;
