
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

class Main extends React.Component
{
    render()
    {
        return (<div><Button /></div>);
    }
}

export default hot_loader(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));
