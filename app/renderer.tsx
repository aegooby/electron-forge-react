
/** @todo Replace with react-refresh-webpack-plugin */
import * as ReactHotLoader from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

import { TitleBar } from "./components/TitleBar";

class Main extends React.Component<unknown, { fullScreen: boolean; }>
{
    constructor(props: unknown)
    {
        super(props);
        this.state = { fullScreen: false };

        this.onFullScreen = this.onFullScreen.bind(this);
        window.Electron.ipcRenderer.removeAllListeners("full-screen");
        window.Electron.ipcRenderer.on("full-screen", this.onFullScreen);
    }
    onFullScreen(): void
    {
        this.setState({ fullScreen: !this.state.fullScreen });
    }
    render(): React.ReactElement
    {
        const element =
            <>
                <TitleBar visible={!this.state.fullScreen} />
            </>;
        return element;
    }
}

const hotLoader = ReactHotLoader.hot(module);
export default hotLoader(Main);

ReactDOM.render(<Main />, document.querySelector("#root"));
