
import * as electron from "electron";
import * as path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup"))
    electron.app.quit();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const icon_path = path.join(__dirname, "icon.png");
const icon_image = electron.nativeImage.createFromPath(icon_path);
icon_image.isMacTemplateImage = true;
electron.app.dock.setIcon(icon_image);

const react_devtools = path.join(__dirname, "../../extensions/react-devtools");

async function ready()
{
    try
    {
        create_window();
        await electron.session.defaultSession.loadExtension(react_devtools);
    }
    catch (error)
    {
        console.log(error);
    }
}

function create_window()
{
    const window_preferences =
    {
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        titleBarStyle: "hiddenInset" as const,
        webContents: { contextIsolation: true },
        icon: icon_image,
    };

    const main_window = new electron.BrowserWindow(window_preferences);
    main_window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

electron.app.on("ready", ready);

function window_all_closed(): void
{
    if (process.platform !== "darwin")
        electron.app.quit();
}
electron.app.on("window-all-closed", window_all_closed);

function activate(): void
{
    if (electron.BrowserWindow.getAllWindows().length === 0)
        create_window();
}
electron.app.on("activate", activate);
