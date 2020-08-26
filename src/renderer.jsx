
import { hot } from "react-hot-loader";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const hotLoader = hot(module);

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

export default hotLoader(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));
