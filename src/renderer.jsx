import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { hot } from "react-hot-loader";

class App extends Component
{
    render()
    {
        return(<h1 className="main-text">this works</h1>);
    }
}

export default hot(module)(App);

ReactDOM.render(<App />, document.querySelector("#root"));
