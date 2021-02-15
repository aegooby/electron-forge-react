
import * as ReactHotLoader from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

const hotLoader = ReactHotLoader.hot(module);

declare global
{
    interface Window
    {
        ElectronAPI:
        {
            ipcRenderer:
            {
                send: (channel: string, ...args: unknown[]) => void;
                on: (channel: string, callback: (...args: unknown[]) => void) => Electron.IpcRenderer;
                removeAllListeners: (channel: string) => Electron.IpcRenderer;
            };
        };
    }
}

class TitleBar extends React.Component<{ visible: boolean; }, unknown>
{
    constructor(props: { visible: boolean; })
    {
        super(props);
    }
    render(): React.ReactElement
    {
        if (this.props.visible)
            return <div className="title-bar"></div>;
        else
            return <div className="title-bar hidden"></div>;
    }
}

class Main extends React.Component<unknown, { fullScreen: boolean; }>
{
    constructor(props: unknown)
    {
        super(props);
        this.state = { fullScreen: false };

        this.onFullScreen = this.onFullScreen.bind(this);

        window.ElectronAPI.ipcRenderer.removeAllListeners("full-screen");
        window.ElectronAPI.ipcRenderer.on("full-screen", this.onFullScreen);
    }
    onFullScreen(): void
    {
        this.setState({ fullScreen: !this.state.fullScreen });
    }

    render(): React.ReactElement
    {
        const element = <NetworkInterface />;
        return element;
    }
}

export default hotLoader(Main);
ReactDOM.render(<Main />, document.querySelector("#root"));
