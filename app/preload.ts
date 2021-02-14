
import * as Electron from "electron";
const ElectronAPI: Record<string, unknown> =
{
    ipcRenderer:
    {
        send: function (channel: string, ...args: unknown[]): void
        {
            Electron.ipcRenderer.send(channel, ...args);
        },
        on: function (channel: string, callback: (...args: unknown[]) => void): Electron.IpcRenderer
        {
            function __callback(event: Electron.IpcRendererEvent, ...args: unknown[]): void
            {
                callback(...args);
            }
            return Electron.ipcRenderer.on(channel, __callback);
        },
        removeAllListeners: function (channel: string): Electron.IpcRenderer
        {
            return Electron.ipcRenderer.removeAllListeners(channel);
        }
    }
};
Electron.contextBridge.exposeInMainWorld("Electron", ElectronAPI);
