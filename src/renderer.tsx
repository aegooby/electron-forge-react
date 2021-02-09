
import * as ReactHotLoader from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";

const hotLoader = ReactHotLoader.hot(module);

class Text extends React.Component {
    render() {
        return (<h1 className="main-text">P'enises in my A'nuses</h1>);
    }
}

class Main extends React.Component {
    render() {
        return (<div><Text /></div>);
    }
}

export default hotLoader(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));