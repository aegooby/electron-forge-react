import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { hot } from "react-hot-loader";

class Text extends Component
{
    render()
    {
        return(<h1 className="main-text">this works</h1>);
    }
}

class Main extends Component
{
    render()
    {
        return(<div><Text /></div>);
    }
}

export default hot(module)(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));
