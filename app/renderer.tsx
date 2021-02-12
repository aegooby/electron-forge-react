
import * as ReactHotLoader from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

const hot_loader = ReactHotLoader.hot(module);

class Button extends React.Component
{
    constructor(props: unknown)
    {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(): void
    {
        window.Electron.ipcRenderer.send("button");
    }
    render(): JSX.Element
    {
        return (<button onClick={this.onClick}>run</button>);
    }
}

class TitleBar extends React.Component
{
    render(): JSX.Element
    {
        return (<div className="title-bar"></div>);
    }
}

class Main extends React.Component
{
    render(): JSX.Element
    {
        return (<><TitleBar /><Button /></>);
    }
}

export default hot_loader(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));
