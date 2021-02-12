
import * as ReactHotLoader from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

const hot_loader = ReactHotLoader.hot(module);

class Text extends React.Component
{
    render()
    {
        return (<h1 className="main-text">text</h1>);
    }
}

class Main extends React.Component
{
    render()
    {
        return (<div><Text /></div>);
    }
}

export default hot_loader(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));
