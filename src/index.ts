
import * as electron from "electron";
import * as path from "path";

import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

if (require("electron-squirrel-startup")) // eslint-disable-line global-require
    electron.app.quit();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const icon_path = path.join(__dirname, "icon.png");
const icon_image = electron.nativeImage.createFromPath(icon_path);
icon_image.isMacTemplateImage = true;
electron.app.dock.setIcon(icon_image);

async function ready() {
    try {
        await installExtension(REACT_DEVELOPER_TOOLS);
        create_window();
    }
    catch (error) {
        console.log(error);
    }
}

function create_window() {
    const window_preferences =
    {
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        titleBarStyle: "hiddenInset" as const,
        webContents: { contextIsolation: false },
        icon: icon_image,
    };

    const main_window = new electron.BrowserWindow(window_preferences);
    main_window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

electron.app.on("ready", ready);

function window_all_closed(): void {
    if (process.platform !== "darwin")
        electron.app.quit();
}
electron.app.on("window-all-closed", window_all_closed);

function activate(): void {
    if (electron.BrowserWindow.getAllWindows().length === 0)
        create_window();
}
electron.app.on("activate", activate);
