
import * as Electron from "electron";
const api: Record<string, unknown> =
{
    ipcRenderer:
    {
        send: Electron.ipcRenderer.send,
        on: Electron.ipcRenderer.on
    }
};
Electron.contextBridge.exposeInMainWorld("Electron", api);
